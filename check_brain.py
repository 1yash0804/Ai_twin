import os
from dotenv import load_dotenv
from pinecone import Pinecone

# 1. Setup
load_dotenv()
KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "aitwin"

# 2. Connect
pc = Pinecone(api_key=KEY)
index = pc.Index(INDEX_NAME)

# 3. Check Stats
stats = index.describe_index_stats()
print("\n--------------------------------")
print(f"🧠 BRAIN STATUS: {INDEX_NAME}")
print(f"📊 Total Memories: {stats['total_vector_count']}")
print("--------------------------------\n")