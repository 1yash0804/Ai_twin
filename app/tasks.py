import os
from app.core.celery_app import celery_app
from app.core.ingestion import process_file

@celery_app.task(name="process_document_task")
def process_document_task(file_path: str, filename: str, user_id: int):
    """
    Background Task: Reads a file from disk -> Embeds it -> Saves to Pinecone.
    """
    print(f"Starting processing for {filename}...")
    
    try:
        # 1. Read the file bytes from disk
        with open(file_path, "rb") as f:
            file_bytes = f.read()
            
        # 2. Call your existing ingestion logic
        # We reuse the logic you already wrote in ingestion.py
        result = process_file(file_bytes, filename, user_id)
        
        # 3. Cleanup: Delete the temp file after processing
        if os.path.exists(file_path):
            os.remove(file_path)
            
        print(f"Finished {filename}. Result: {result}")
        return result
        
    except Exception as e:
        print(f"Failed: {e}")
        return {"status": "error", "message": str(e)}