import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from pypdf import PdfReader
from app.core.vector_store import get_vector_store

def process_file(file_bytes: bytes, filename: str, user_id: int):
    """
    1. Reads the file (PDF or TXT).
    2. Splits it into chunks.
    3. Saves chunks to Pinecone.
    """
    
    # 1. EXTRACT TEXT
    text_content = ""
    # Check if it's a PDF based on extension
    if filename.lower().endswith(".pdf"):
        import io
        try:
            # Create a temporary PDF reader object from bytes
            pdf_stream = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_stream)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_content += extracted + "\n"
        except Exception as e:
            return {"status": "error", "message": f"PDF Error: {str(e)}"}
    else:
        # Assume text file
        try:
            text_content = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
             return {"status": "error", "message": "File encoding not supported. Use UTF-8."}

    if not text_content.strip():
        return {"status": "error", "message": "File is empty or unreadable."}

    # 2. CHUNK THE TEXT
    # We split big text into smaller pieces (1000 characters) so the AI can digest it.
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )
    chunks = text_splitter.split_text(text_content)

    # 3. CONVERT TO DOCUMENTS
    # We format them as LangChain Documents with metadata
    documents = []
    for chunk in chunks:
        doc = Document(
            page_content=chunk,
            metadata={
                "source": filename,
                "user_id": user_id,
                "type": "upload"
            }
        )
        documents.append(doc)

    # 4. SAVE TO PINECONE
    vector_store = get_vector_store()
    if vector_store:
        vector_store.add_documents(documents)
        return {"status": "success", "chunks_added": len(documents)}
    
    return {"status": "error", "message": "Vector store unavailable."}