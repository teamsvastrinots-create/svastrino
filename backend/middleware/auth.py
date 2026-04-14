"""
Auth middleware — FastAPI dependencies for token verification and role checks.
"""

from fastapi import Depends, HTTPException, Request
from supabase_client import supabase
from utils.logger import logger


async def get_current_user(request: Request) -> dict:
    """
    Extract and verify the Bearer token, then return the user's profile.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization token missing")

    token = auth_header.split("Bearer ")[1].strip()

    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if user is None:
            raise ValueError("No user returned")
    except Exception as exc:
        logger.warning("Token verification failed: %s", exc)
        raise HTTPException(
            status_code=401, detail="Invalid or expired token"
        ) from exc

    # Fetch profile from the profiles table
    profile_resp = (
        supabase.table("profiles")
        .select("*")
        .eq("id", user.id)
        .maybe_single()
        .execute()
    )

    if profile_resp.data is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile = profile_resp.data
    return {
        "user_id": profile["id"],
        "phone": profile.get("phone"),
        "role": profile.get("role", "student"),
        "is_premium": profile.get("is_premium", False),
    }


async def require_admin(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Ensures the current user has the 'admin' role.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
