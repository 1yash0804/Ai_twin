import os
import glob
import sqlite3
import time
from pypdf import PdfReader
from datetime import datetime

# --- LangChain & Pinecone Imports ---
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

# ==========================================
# ⚙️ CONFIGURATION
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_FOLDER = os.path.join(BASE_DIR, "raw_data")
SQL_DB_PATH = os.path.join(BASE_DIR, "../backend/test.db")

# --- PINECONE SETUP ---
# Ideally, put these in a .env file, but for the script:
PINECONE_API_KEY = "YOUR_PINECONE_API_KEY_HERE"  # <--- PASTE KEY HERE
PINECONE_INDEX_NAME = "yash-brain"               # <--- YOUR INDEX NAME

# --- CHAT PARSING SETUP ---
YOUR_NAME_TAGS = ["yash:", "me:", "yash sharma:"] 
AI_NAME_TAGS = ["assistant:", "ai:", "gpt:"] 

# --- EMBEDDING MODEL ---
# Using local embeddings to save costs, but storing them in Pinecone Cloud
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# ==========================================

def init_pinecone():
    """Ensures the index exists."""
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Check if index exists, if not, create it
    existing_indexes = [i.name for i in pc.list_indexes()]
    if PINECONE_INDEX_NAME not in existing_indexes:
        print(f"🌲 Creating new Pinecone Index: {PINECONE_INDEX_NAME}...")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=384, # Matches 'all-MiniLM-L6-v2' dimension
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        time.sleep(2) # Wait for initialization
    return pc

def extract_text_from_pdf(file_path):
    """Reads PDF and returns raw text."""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t: text += t + "\n"
        return text
    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return ""

def process_for_fine_tuning(raw_text):
    """
    Branch A: Extracts Dialogue for SQLite (Personality).
    """
    messages = []
    lines = raw_text.split('\n')
    current_role = None
    buffer = []

    for line in lines:
        line = line.strip()
        if not line: continue
        line_lower = line.lower()

        # Check for User
        if any(line_lower.startswith(tag) for tag in YOUR_NAME_TAGS):
            if current_role and buffer: messages.append((current_role, " ".join(buffer)))
            current_role = "user"
            buffer = [line.split(":", 1)[1].strip() if ":" in line else line]

        # Check for AI/Other
        elif any(line_lower.startswith(tag) for tag in AI_NAME_TAGS):
            if current_role and buffer: messages.append((current_role, " ".join(buffer)))
            current_role = "assistant"
            buffer = [line.split(":", 1)[1].strip() if ":" in line else line]

        else:
            if buffer: buffer.append(line)

    if current_role and buffer: messages.append((current_role, " ".join(buffer)))
    return messages

def save_to_sqlite(messages):
    """Saves dialogue pairs to SQLite."""
    conn = sqlite3.connect(SQL_DB_PATH)
    cursor = conn.cursor()
    count = 0
    now = datetime.utcnow().isoformat()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT, role TEXT, content TEXT, timestamp DATETIME
        )
    """)

    for role, content in messages:
        cursor.execute(
            "INSERT INTO memory (user_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
            ("yash", role, content, now)
        )
        count += 1
    
    conn.commit()
    conn.close()
    return count

def process_for_rag(raw_text, filename):
    """
    Branch B: Chunks Text for Pinecone (Facts).
    """
    # 1. Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.create_documents([raw_text], metadatas=[{"source": filename}])
    
    if not chunks: return 0

    # 2. Upload to Pinecone
    # LangChain handles the embedding + upload automatically here
    PineconeVectorStore.from_documents(
        documents=chunks,
        embedding=embedding_model,
        index_name=PINECONE_INDEX_NAME,
        pinecone_api_key=PINECONE_API_KEY
    )
    return len(chunks)

def main():
    print("🚀 Starting MASTER Ingestion (Pinecone + SQLite)...")
    
    # Initialize Pinecone connection
    init_pinecone()
    
    pdf_files = glob.glob(os.path.join(RAW_DATA_FOLDER, "*.pdf"))
    if not pdf_files:
        print(f"❌ No PDFs found in '{RAW_DATA_FOLDER}'")
        return

    total_style_msgs = 0
    total_fact_chunks = 0

    for pdf in pdf_files:
        filename = os.path.basename(pdf)
        print(f"\n📄 Processing: {filename}")
        
        # 1. Read Text
        raw_text = extract_text_from_pdf(pdf)
        if not raw_text: continue

        # 2. Branch A: Fine-Tuning (SQLite)
        dialogue_msgs = process_for_fine_tuning(raw_text)
        saved_count = save_to_sqlite(dialogue_msgs)
        total_style_msgs += saved_count
        print(f"   └── 🧠 Learned {saved_count} speaking patterns (SQLite)")

        # 3. Branch B: RAG (Pinecone)
        chunk_count = process_for_rag(raw_text, filename)
        total_fact_chunks += chunk_count
        print(f"   └── 🌲 Uploaded {chunk_count} memory chunks to Pinecone")

    print("\n" + "="*50)
    print(f"🎉 INGESTION COMPLETE!")
    print(f"1. Personality DB (SQLite): Added {total_style_msgs} lines.")
    print(f"2. Knowledge DB (Pinecone): Added {total_fact_chunks} facts.")
    print("="*50)

if __name__ == "__main__":
    if not os.path.exists("../backend"):
        print("❌ Error: Cannot find backend folder.")
    else:
        main()