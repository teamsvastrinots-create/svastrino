"""
Svastrino API — FastAPI application entry point.
"""

import os
from dotenv import load_dotenv

# Load .env before anything else
load_dotenv()

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from routes.student import router as student_router
from routes.admin import router as admin_router
from utils.logger import logger

# ── Rate limiter ──────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address)

# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Svastrino API",
    version="1.0.0",
    description="Backend for Svastrino edtech platform",
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
allowed_origins = [o.strip() for o in allowed_origins if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global exception handlers ────────────────────────────────────────────────


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail
    # If detail is already our structured dict, use it directly
    if isinstance(detail, dict) and "success" in detail:
        return JSONResponse(status_code=exc.status_code, content=detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": str(detail)},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Invalid request data",
            "details": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"},
    )


# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(student_router)
app.include_router(admin_router)

# ── Root endpoints ────────────────────────────────────────────────────────────


@app.get("/")
async def root():
    return {"message": "Svastrino API is running"}


@app.get("/health")
@limiter.limit("60/minute")
async def health(request: Request):
    return {"status": "ok", "version": "1.0.0"}


# ── Entrypoint ────────────────────────────────────────────────────────────────

@app.get("/test-token")
async def get_test_token():
    from supabase import create_client
    import os
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    )
    res = supabase.auth.admin.get_user("eee47ba0-02ec-489c-9f9f-7f0bf2b7a50a")
    return {"user_id": res.user.id, "phone": res.user.phone}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
