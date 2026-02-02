import os
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings 

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "aitwin"

def get_vector_store():
    # 1. Safety Check for API Key
    if not PINECONE_API_KEY:
        print("❌ Missing PINECONE_API_KEY in .env")
        return None

    # 2. Initialize Pinecone Client
    try:
        pc = Pinecone(api_key=PINECONE_API_KEY)
    except Exception as e:
        print(f"❌ Failed to connect to Pinecone: {e}")
        return None

    # 3. Verify Index Exists
    existing_indexes = [i.name for i in pc.list_indexes()]
    if INDEX_NAME not in existing_indexes:
        print(f"❌ Pinecone index '{INDEX_NAME}' does not exist. Please create it with 384 dimensions.")
        return None

    index = pc.Index(INDEX_NAME)

    # 4. Initialize FREE Embeddings (Runs locally on your CPU)
    # This replaces OpenAI. It outputs 384 dimensions.
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 5. Connect Vector Store
    return PineconeVectorStore(
        index=index,
        embedding=embeddings,
        text_key="text", # This tells Pinecone which field contains the actual content
    )

def search_memories(query_text: str, user_id: int, k: int = 3):
    vector_store = get_vector_store()
    if not vector_store:
        return []

    try:
        # Perform Similarity Search
        # k=3 means "Give me the top 3 best matches"
        # filter={"user_id": ...} ensures multi-tenancy security
        results = vector_store.similarity_search_with_score(
            query=query_text,
            k=k,
            filter={"user_id": user_id} 
        )
        
        # Format the results nicely
        formatted_results = []
        for doc, score in results:
            formatted_results.append({
                "text": doc.page_content,
                "score": round(score, 4), # Confidence score (0 to 1)
                "metadata": doc.metadata
            })
            
        return formatted_results
        
    except Exception as e:
        print(f"❌ Error searching Pinecone: {e}")
        return []