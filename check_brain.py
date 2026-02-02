import os
from dotenv import load_dotenv
from pinecone import Pinecone

# 1. Setup
load_dotenv()
KEY = os.getenv("pcsk_2AK51t_FpYmgopqWQLA3MY948e4Kro3bTePkQz29Up2iGixiVwavVaBYid3oV2AVvPAnJh")
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