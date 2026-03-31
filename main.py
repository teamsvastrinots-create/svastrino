from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid

from supabase_client import supabase

app = FastAPI(title="Svastrino Authentication API")

# Setup Pydantic Schemas matching the new Tables
class TestResultPayload(BaseModel):
    user_id: str
    phone: str
    answers: Dict[str, Any]
    score: int

# --- API Endpoints ---

@app.post("/api/test-results")
def save_test_results(payload: TestResultPayload):
    # CRITICAL FIX: Skipping profile upsert entirely.
    # Supabase Auth or internal triggers should handle the 'profiles' table.
    # This prevents the "Database error saving new user" conflict.
    
    print(f"Received results for {payload.phone}: {payload.score}%")

    # Insert Free Test Attempt
    attempt_data = {
        "id": str(uuid.uuid4()),
        "phone": payload.phone,
        "answers": payload.answers,
        "score": payload.score
    }
    
    try:
        # NOTE: This requires RLS policy to allow inserts (Check the SQL snippet I gave you).
        result = supabase.table("free_test_attempts").insert(attempt_data).execute()
        
        if not result.data:
            print("Warning: Supabase returned no data on insert.")
            raise Exception("No data returned from insert (Check RLS Policies)")
            
        print(f"✅ SUCCESSFULLY SAVED: {payload.phone} -> {payload.score}%")
        return {"message": "Results saved successfully", "attempt_id": result.data[0]['id']}
        
    except Exception as e:
        print(f"❌ DATABASE REJECTION: {e}")
        # If we hit an RLS violation, the error message will be caught here.
        raise HTTPException(status_code=500, detail=f"Database rejection: {str(e)}")

# --- Static File Serving ---
app.mount("/", StaticFiles(directory=".", html=True), name="static")
