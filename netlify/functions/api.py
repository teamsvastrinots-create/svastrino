from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid
from datetime import datetime
from mangum import Mangum
import os

# Import supabase client logic
from supabase import create_client

# We define these here since environment variables will be in Netlify
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    supabase = None
else:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Svastrino API")

# Add CORS middleware for Netlify Functions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestResultPayload(BaseModel):
    user_id: str
    phone: str
    answers: Dict[str, Any]
    score: int

class ProfilePayload(BaseModel):
    phone: str
    name: str
    class_name: str
    city: str

@app.post("/api/test-results")
def save_test_results(payload: TestResultPayload):
    print(f"--- FUNCTION API: /api/test-results ---")
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured on Netlify. Check Env Vars.")

    attempt_data = {
        "id": str(uuid.uuid4()),
        "phone": payload.phone,
        "answers": payload.answers,
        "score": payload.score,
        "created_at": datetime.now().isoformat()
    }
    
    try:
        result = supabase.table("free_test_attempts").insert(attempt_data).execute()
        if not result.data:
            raise Exception("Supabase insertion returned no records. Check RLS policies.")
        return {"message": "Results saved successfully", "attempt_id": result.data[0]['id']}
    except Exception as e:
        print(f"❌ DB ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/upsert-profile")
def upsert_profile(payload: ProfilePayload):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured on Netlify.")

    user_data = {
        "name": payload.name,
        "phone": payload.phone,
        "class": payload.class_name,
        "city": payload.city
    }
    
    try:
        result = supabase.table("users").upsert(user_data, on_conflict="phone").execute()
        if not result.data:
            raise Exception("User profile upsert failed.")
        return {"message": "Profile updated successfully"}
    except Exception as e:
        print(f"❌ DB ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

handler = Mangum(app)
