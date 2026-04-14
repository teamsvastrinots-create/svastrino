"""
Admin routes — all endpoints require an authenticated admin user.
"""

from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from middleware.auth import require_admin
from supabase_client import supabase
from utils.logger import logger

router = APIRouter(prefix="/v1/admin", tags=["admin"])


# ── Pydantic models ──────────────────────────────────────────────────────────


class PremiumUpdate(BaseModel):
    is_premium: bool
    reason: str


class WebinarCreate(BaseModel):
    title: str
    scheduled_at: str  # ISO 8601 datetime string
    meeting_link: str
    week_number: int


# ── Helpers ───────────────────────────────────────────────────────────────────


def _ok(data: dict) -> dict:
    return {"success": True, "data": data}


def _err(message: str, code: int = 400):
    raise HTTPException(
        status_code=code,
        detail={"success": False, "error": message},
    )


# ── 1. Admin Dashboard ───────────────────────────────────────────────────────


@router.get("/dashboard")
async def admin_dashboard(admin: dict = Depends(require_admin)):
    try:
        # Total students
        total_students_resp = (
            supabase.table("profiles")
            .select("id", count="exact")
            .eq("role", "student")
            .execute()
        )
        total_students = total_students_resp.count or 0

        # Premium students
        premium_resp = (
            supabase.table("profiles")
            .select("id", count="exact")
            .eq("role", "student")
            .eq("is_premium", True)
            .execute()
        )
        premium_students = premium_resp.count or 0

        # Active this week (students with at least one task_completion in last 7 days)
        seven_days_ago = (
            datetime.now(timezone.utc) - timedelta(days=7)
        ).isoformat()

        active_resp = (
            supabase.table("task_completions")
            .select("student_id")
            .gte("completed_at", seven_days_ago)
            .execute()
        ).data or []

        active_student_ids = set(r["student_id"] for r in active_resp)
        active_this_week = len(active_student_ids)

        # Upcoming webinars
        now_iso = datetime.now(timezone.utc).isoformat()
        upcoming_webinars = (
            supabase.table("webinars")
            .select("*")
            .gt("scheduled_at", now_iso)
            .order("scheduled_at")
            .execute()
        ).data or []

        # Revenue
        payments_resp = (
            supabase.table("payments")
            .select("id, amount", count="exact")
            .eq("status", "success")
            .execute()
        )
        total_payments = payments_resp.count or 0
        total_revenue = sum(p.get("amount", 0) for p in (payments_resp.data or []))

        return _ok(
            {
                "total_students": total_students,
                "premium_students": premium_students,
                "active_this_week": active_this_week,
                "upcoming_webinars": upcoming_webinars,
                "total_payments": total_payments,
                "total_revenue": total_revenue,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("admin_dashboard error: %s", exc, exc_info=True)
        _err("Failed to load admin dashboard", 500)


# ── 2. List students ─────────────────────────────────────────────────────────


@router.get("/students")
async def list_students(
    search: Optional[str] = Query(None),
    is_premium: Optional[bool] = Query(None),
    class_number: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin: dict = Depends(require_admin),
):
    try:
        offset = (page - 1) * limit

        # Build query — join profiles with student_details and enrollments
        query = (
            supabase.table("profiles")
            .select(
                "*, student_details(*), enrollments(*)",
                count="exact",
            )
            .eq("role", "student")
        )

        if is_premium is not None:
            query = query.eq("is_premium", is_premium)

        if search:
            query = query.or_(
                f"full_name.ilike.%{search}%,phone.ilike.%{search}%"
            )

        # We can't directly filter on a joined table in one chained call,
        # so we fetch and post-filter for class_number if needed.
        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)

        resp = query.execute()
        students = resp.data or []
        total = resp.count or 0

        # Post-filter by class_number from student_details if provided
        if class_number is not None:
            students = [
                s
                for s in students
                if s.get("student_details")
                and s["student_details"].get("class_number") == class_number
            ]

        return _ok(
            {
                "students": students,
                "total": total,
                "page": page,
                "limit": limit,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("list_students error: %s", exc, exc_info=True)
        _err("Failed to load students list", 500)


# ── 3. Student detail ────────────────────────────────────────────────────────


@router.get("/students/{student_id}")
async def get_student(student_id: str, admin: dict = Depends(require_admin)):
    try:
        # Profile + details + enrollment
        profile = (
            supabase.table("profiles")
            .select("*, student_details(*), enrollments(*)")
            .eq("id", student_id)
            .maybe_single()
            .execute()
        ).data

        if not profile:
            _err("Student not found", 404)

        # Task completions
        completions = (
            supabase.table("task_completions")
            .select("*, tasks(title, week_number, day_number)")
            .eq("student_id", student_id)
            .order("completed_at", desc=True)
            .execute()
        ).data or []

        # Assessment result (latest)
        assessment = (
            supabase.table("assessment_attempts")
            .select("*")
            .eq("student_id", student_id)
            .order("attempted_at", desc=True)
            .limit(1)
            .maybe_single()
            .execute()
        ).data

        # Payment history
        payments = (
            supabase.table("payments")
            .select("*")
            .eq("student_id", student_id)
            .order("created_at", desc=True)
            .execute()
        ).data or []

        # Webinar registrations
        registrations = (
            supabase.table("webinar_registrations")
            .select("*, webinars(title, scheduled_at)")
            .eq("student_id", student_id)
            .execute()
        ).data or []

        return _ok(
            {
                "profile": profile,
                "task_completions": completions,
                "assessment": assessment,
                "payments": payments,
                "webinar_registrations": registrations,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("get_student error: %s", exc, exc_info=True)
        _err("Failed to load student details", 500)


# ── 4. Toggle premium ────────────────────────────────────────────────────────


@router.patch("/students/{student_id}/premium")
async def update_premium(
    student_id: str,
    body: PremiumUpdate,
    admin: dict = Depends(require_admin),
):
    try:
        # Update premium status
        resp = (
            supabase.table("profiles")
            .update({"is_premium": body.is_premium})
            .eq("id", student_id)
            .execute()
        )

        if not resp.data:
            _err("Student not found", 404)

        # Notify the student
        status_label = "upgraded to Premium" if body.is_premium else "set to Free"
        supabase.table("notifications").insert(
            {
                "student_id": student_id,
                "message": f"Your account has been {status_label}.",
                "is_read": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ).execute()

        # Log admin action
        logger.info(
            "ADMIN_ACTION | admin=%s | target=%s | action=premium_%s | reason=%s",
            admin["user_id"],
            student_id,
            "grant" if body.is_premium else "revoke",
            body.reason,
        )

        return _ok(
            {
                "student_id": student_id,
                "is_premium": body.is_premium,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("update_premium error: %s", exc, exc_info=True)
        _err("Failed to update premium status", 500)


# ── 5. List webinars ─────────────────────────────────────────────────────────


@router.get("/webinars")
async def list_webinars(admin: dict = Depends(require_admin)):
    try:
        webinars = (
            supabase.table("webinars")
            .select("*")
            .order("scheduled_at", desc=True)
            .execute()
        ).data or []

        # Fetch registration counts per webinar
        enriched = []
        for w in webinars:
            reg_count = (
                supabase.table("webinar_registrations")
                .select("id", count="exact")
                .eq("webinar_id", w["id"])
                .execute()
            ).count or 0
            enriched.append({**w, "registration_count": reg_count})

        return _ok({"webinars": enriched})

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("admin list_webinars error: %s", exc, exc_info=True)
        _err("Failed to load webinars", 500)


# ── 6. Create webinar ────────────────────────────────────────────────────────


@router.post("/webinars")
async def create_webinar(
    body: WebinarCreate,
    admin: dict = Depends(require_admin),
):
    try:
        now = datetime.now(timezone.utc)

        # Parse and validate scheduled_at
        try:
            scheduled = datetime.fromisoformat(body.scheduled_at)
        except ValueError:
            _err("Invalid scheduled_at format. Use ISO 8601.")

        if scheduled <= now:
            _err("scheduled_at must be in the future")

        if body.week_number < 1 or body.week_number > 24:
            _err("week_number must be between 1 and 24")

        # Insert webinar
        webinar = (
            supabase.table("webinars")
            .insert(
                {
                    "title": body.title,
                    "scheduled_at": body.scheduled_at,
                    "meeting_link": body.meeting_link,
                    "week_number": body.week_number,
                    "created_by": admin["user_id"],
                }
            )
            .execute()
        ).data

        if not webinar:
            _err("Failed to create webinar", 500)

        # Notify all enrolled students
        enrolled = (
            supabase.table("enrollments")
            .select("student_id")
            .execute()
        ).data or []

        if enrolled:
            notifications = [
                {
                    "student_id": e["student_id"],
                    "message": f"New webinar scheduled: {body.title}",
                    "is_read": False,
                    "created_at": now.isoformat(),
                }
                for e in enrolled
            ]
            supabase.table("notifications").insert(notifications).execute()

        return _ok({"webinar": webinar[0] if webinar else None})

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("create_webinar error: %s", exc, exc_info=True)
        _err("Failed to create webinar", 500)


# ── 7. List payments ─────────────────────────────────────────────────────────


@router.get("/payments")
async def list_payments(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin: dict = Depends(require_admin),
):
    try:
        offset = (page - 1) * limit

        query = (
            supabase.table("payments")
            .select("*, profiles(full_name, phone)", count="exact")
        )

        if status:
            query = query.eq("status", status)

        query = query.order("created_at", desc=True).range(
            offset, offset + limit - 1
        )

        resp = query.execute()
        payments = resp.data or []
        total = resp.count or 0

        return _ok(
            {
                "payments": payments,
                "total": total,
                "page": page,
                "limit": limit,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("list_payments error: %s", exc, exc_info=True)
        _err("Failed to load payments", 500)
