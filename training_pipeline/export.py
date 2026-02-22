import sqlite3
import json
import os

# Point to the same DB
DB_PATH = os.path.join(os.path.dirname(__file__), "../backend/test.db")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "training_data.jsonl")

def export_to_sharegpt():
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get all messages sorted by time (or ID if time is missing)
    # Ensure we only get messages for the user we are training on
    cursor.execute("SELECT role, content FROM memory WHERE user_id='yash' ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    print(f"🔍 Found {len(rows)} messages in history.")

    conversations = []
    current_convo = []
    
    # Simple Grouping Logic: 
    # Collect messages until the conversation "resets" or just group strictly by User->AI pairs
    
    for role, content in rows:
        # Map DB roles to ShareGPT roles
        gpt_role = "human" if role == "user" else "gpt"
        
        current_convo.append({"from": gpt_role, "value": content})
        
        # If we have a pair (Human + GPT), we can treat it as a training sample
        # Note: You can make this logic smarter (e.g. group by time gaps) later.
        if gpt_role == "gpt" and len(current_convo) >= 2:
             conversations.append({"conversations": current_convo})
             current_convo = [] # Reset for next pair

    # Save to JSONL
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for convo in conversations:
            f.write(json.dumps(convo) + "\n")

    print(f"✅ Export Complete! Created {OUTPUT_FILE} with {len(conversations)} conversation samples.")
    print("🚀 Next Step: Upload this file to Google Colab/Kaggle for training.")

if __name__ == "__main__":
    export_to_sharegpt()