"""
Student routes — all endpoints require an authenticated student.
"""

import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from middleware.auth import get_current_user
from supabase_client import supabase
from utils.logger import logger

router = APIRouter(prefix="/v1/student", tags=["student"])


# ── Pydantic models ──────────────────────────────────────────────────────────


class AnswerItem(BaseModel):
    question_id: str
    selected_option: str = Field(..., pattern="^[abcd]$")


class AssessmentSubmission(BaseModel):
    answers: List[AnswerItem]


# ── Helpers ───────────────────────────────────────────────────────────────────


def _ok(data: dict) -> dict:
    return {"success": True, "data": data}


def _err(message: str, code: int = 400):
    raise HTTPException(
        status_code=code,
        detail={"success": False, "error": message},
    )


def _is_valid_uuid(value: str) -> bool:
    try:
        uuid.UUID(value)
        return True
    except ValueError:
        return False


# ── 1. Dashboard ──────────────────────────────────────────────────────────────


@router.get("/dashboard")
async def student_dashboard(user: dict = Depends(get_current_user)):
    try:
        uid = user["user_id"]
        now_iso = datetime.now(timezone.utc).isoformat()

        # Profile
        profile = (
            supabase.table("profiles").select("*").eq("id", uid).single().execute()
        ).data

        # Enrollment
        enrollment = (
            supabase.table("enrollments")
            .select("*")
            .eq("student_id", uid)
            .maybe_single()
            .execute()
        ).data

        current_week_number = enrollment["current_week"] if enrollment else 1

        # Current week details
        week = (
            supabase.table("weeks")
            .select("*")
            .eq("week_number", current_week_number)
            .maybe_single()
            .execute()
        ).data

        # Today's task — calculate day offset from enrollment start
        today_task = None
        if enrollment and week:
            week_id = week["id"]
            enrolled_date = datetime.fromisoformat(enrollment["enrolled_at"].replace("Z", "+00:00")).date()
            today_date = datetime.now(timezone.utc).date()
            days_since = (today_date - enrolled_date).days
            day_in_week = min((days_since % 7) + 2, 7)
            today_task_resp = (
                supabase.table("tasks")
                .select("*")
                .eq("week_id", week_id)
                .eq("day_number", day_in_week)
                .maybe_single()
                .execute()
            )
            today_task = today_task_resp.data

        # Completed tasks this week
        week_obj = supabase.table("weeks").select("id").eq("week_number", current_week_number).maybe_single().execute().data
        week_tasks = []
        if week_obj:
            week_tasks = (
                supabase.table("tasks")
                .select("id")
                .eq("week_id", week_obj["id"])
                .execute()
            ).data or []

        week_task_ids = [t["id"] for t in week_tasks]

        completed_count = 0
        if week_task_ids:
            completions = (
                supabase.table("task_completions")
                .select("id", count="exact")
                .eq("student_id", uid)
                .in_("task_id", week_task_ids)
                .execute()
            )
            completed_count = completions.count or 0

        # Next upcoming webinar
        next_webinar = (
            supabase.table("webinars")
            .select("*")
            .gt("scheduled_at", now_iso)
            .order("scheduled_at")
            .limit(1)
            .maybe_single()
            .execute()
        ).data

        # Unread notifications
        unread = (
            supabase.table("notifications")
            .select("id", count="exact")
            .eq("student_id", uid)
            .eq("is_read", False)
            .execute()
        )
        unread_count = unread.count or 0

        return _ok(
            {
                "profile": profile,
                "enrollment": enrollment,
                "current_week": week,
                "today_task": today_task,
                "completed_tasks_this_week": completed_count,
                "next_webinar": next_webinar,
                "unread_notifications": unread_count,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("student_dashboard error: %s", exc, exc_info=True)
        _err("Failed to load dashboard", 500)


# ── 2. Week details ──────────────────────────────────────────────────────────


@router.get("/weeks/{week_number}")
async def get_week(week_number: int, user: dict = Depends(get_current_user)):
    try:
        uid = user["user_id"]

        if week_number < 1 or week_number > 24:
            _err("week_number must be between 1 and 24")

        week = (
            supabase.table("weeks")
            .select("*")
            .eq("week_number", week_number)
            .maybe_single()
            .execute()
        ).data

        if not week:
            _err("Week not found", 404)

        tasks = (
            supabase.table("tasks")
            .select("*")
            .eq("week_id", week["id"])
            .order("day_number")
            .execute()
        ).data or []

        # Check completions for each task
        task_ids = [t["id"] for t in tasks]
        completed_ids: set = set()
        if task_ids:
            completions = (
                supabase.table("task_completions")
                .select("task_id")
                .eq("student_id", uid)
                .in_("task_id", task_ids)
                .execute()
            ).data or []
            completed_ids = {c["task_id"] for c in completions}

        enriched_tasks = []
        for task in tasks:
            enriched_tasks.append(
                {**task, "is_completed": task["id"] in completed_ids}
            )

        return _ok({"week": week, "tasks": enriched_tasks})

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("get_week error: %s", exc, exc_info=True)
        _err("Failed to load week details", 500)


# ── 3. Complete a task ────────────────────────────────────────────────────────


@router.post("/tasks/{task_id}/complete")
async def complete_task(task_id: str, user: dict = Depends(get_current_user)):
    try:
        uid = user["user_id"]

        if not _is_valid_uuid(task_id):
            _err("Invalid task ID format")

        # Verify task exists
        task = (
            supabase.table("tasks")
            .select("*")
            .eq("id", task_id)
            .maybe_single()
            .execute()
        ).data

        if not task:
            _err("Task not found", 404)

        # Verify the task belongs to the student's current week
        enrollment = (
            supabase.table("enrollments")
            .select("*")
            .eq("student_id", uid)
            .maybe_single()
            .execute()
        ).data

        if not enrollment:
            _err("Enrollment not found", 404)

        current_week_obj = supabase.table("weeks").select("id").eq("week_number", enrollment["current_week"]).maybe_single().execute().data
        if not current_week_obj or task["week_id"] != current_week_obj["id"]:
            _err("This task does not belong to your current week")

        # Idempotent insert
        supabase.table("task_completions").upsert(
            {
                "student_id": uid,
                "task_id": task_id,
                "completed_at": datetime.now(timezone.utc).isoformat(),
            },
            on_conflict="student_id,task_id",
        ).execute()

        # Count completions for this week
        week_tasks = (
            supabase.table("tasks")
            .select("id")
            .eq("week_id", current_week_obj["id"])
            .execute()
        ).data or []

        week_task_ids = [t["id"] for t in week_tasks]

        completions = (
            supabase.table("task_completions")
            .select("id", count="exact")
            .eq("student_id", uid)
            .in_("task_id", week_task_ids)
            .execute()
        )
        total_completed = completions.count or 0

        # If all 6 tasks are done, advance to next week
        if total_completed >= 6 and enrollment["current_week"] < 24:
            supabase.table("enrollments").update(
                {"current_week": enrollment["current_week"] + 1}
            ).eq("student_id", uid).execute()

        return _ok(
            {
                "task_id": task_id,
                "completed_this_week": total_completed,
                "week_advanced": total_completed >= 6,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("complete_task error: %s", exc, exc_info=True)
        _err("Failed to complete task", 500)


# ── 4. Progress ──────────────────────────────────────────────────────────────


@router.get("/progress")
async def get_progress(user: dict = Depends(get_current_user)):
    try:
        uid = user["user_id"]

        enrollment = (
            supabase.table("enrollments")
            .select("*")
            .eq("student_id", uid)
            .maybe_single()
            .execute()
        ).data

        if not enrollment:
            _err("Enrollment not found", 404)

        # All completions for this student joined with tasks to get week info
        completions = (
            supabase.table("task_completions")
            .select("task_id, tasks(week_number)")
            .eq("student_id", uid)
            .execute()
        ).data or []

        total_completed = len(completions)

        # Group by week
        week_map: dict[int, int] = {}
        for c in completions:
            wn = c.get("tasks", {}).get("week_number") if c.get("tasks") else None
            if wn is not None:
                week_map[wn] = week_map.get(wn, 0) + 1

        week_breakdown = [
            {"week_number": wn, "completed_tasks": count}
            for wn, count in sorted(week_map.items())
        ]

        return _ok(
            {
                "current_week": enrollment["current_week"],
                "total_tasks_completed": total_completed,
                "week_by_week": week_breakdown,
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("get_progress error: %s", exc, exc_info=True)
        _err("Failed to load progress", 500)


# ── 5. Assessment questions ──────────────────────────────────────────────────


@router.get("/assessment/questions")
async def get_assessment_questions(user: dict = Depends(get_current_user)):
    try:
        questions = (
            supabase.table("assessments")
            .select("id, question_text, option_a, option_b, option_c, option_d")
            .order("sort_order")
            .execute()
        ).data or []

        return _ok({"questions": questions})

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("get_assessment_questions error: %s", exc, exc_info=True)
        _err("Failed to load assessment questions", 500)


# ── 6. Submit assessment ─────────────────────────────────────────────────────


@router.post("/assessment/submit")
async def submit_assessment(
    body: AssessmentSubmission, user: dict = Depends(get_current_user)
):
    try:
        uid = user["user_id"]

        if not body.answers:
            _err("Answers list cannot be empty")

        question_ids = [a.question_id for a in body.answers]

        # Validate all question IDs exist and fetch correct answers + traits
        questions_resp = (
            supabase.table("assessments")
            .select("id, correct_option, trait_mapped")
            .in_("id", question_ids)
            .execute()
        ).data or []

        if len(questions_resp) != len(question_ids):
            _err("One or more question IDs are invalid")

        question_map = {q["id"]: q for q in questions_resp}

        # Score by trait
        scores_by_trait: dict[str, int] = {}
        for answer in body.answers:
            q = question_map[answer.question_id]
            trait = q["trait_mapped"]
            if trait not in scores_by_trait:
                scores_by_trait[trait] = 0
            if answer.selected_option == q["correct_option"]:
                scores_by_trait[trait] += 1

        # Store attempt
        answers_json = [a.model_dump() for a in body.answers]

        supabase.table("assessment_attempts").insert(
            {
                "student_id": uid,
                "answers": answers_json,
                "scores_by_trait": scores_by_trait,
                "completed_at": datetime.now(timezone.utc).isoformat(),
            }
        ).execute()

        # Decide response based on premium status
        is_premium = user.get("is_premium", False)

        if is_premium:
            result_traits = scores_by_trait
            is_partial = False
        else:
            # Return only first 3 traits as a preview
            preview_keys = list(scores_by_trait.keys())[:3]
            result_traits = {k: scores_by_trait[k] for k in preview_keys}
            is_partial = True

        return _ok(
            {
                "scores": result_traits,
                "is_partial": is_partial,
                "total_questions": len(body.answers),
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("submit_assessment error: %s", exc, exc_info=True)
        _err("Failed to submit assessment", 500)


# ── 7. Webinars list ─────────────────────────────────────────────────────────


@router.get("/webinars")
async def list_webinars(user: dict = Depends(get_current_user)):
    try:
        uid = user["user_id"]
        now_iso = datetime.now(timezone.utc).isoformat()

        webinars = (
            supabase.table("webinars")
            .select("*")
            .gt("scheduled_at", now_iso)
            .order("scheduled_at")
            .execute()
        ).data or []

        # Fetch registrations for this student
        webinar_ids = [w["id"] for w in webinars]
        registered_ids: set = set()
        if webinar_ids:
            regs = (
                supabase.table("webinar_registrations")
                .select("webinar_id")
                .eq("student_id", uid)
                .in_("webinar_id", webinar_ids)
                .execute()
            ).data or []
            registered_ids = {r["webinar_id"] for r in regs}

        enriched = []
        for w in webinars:
            enriched.append({**w, "is_registered": w["id"] in registered_ids})

        return _ok({"webinars": enriched})

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("list_webinars error: %s", exc, exc_info=True)
        _err("Failed to load webinars", 500)


# ── 8. Register for a webinar ────────────────────────────────────────────────


@router.post("/webinars/{webinar_id}/register")
async def register_webinar(webinar_id: str, user: dict = Depends(get_current_user)):
    try:
        uid = user["user_id"]
        now_iso = datetime.now(timezone.utc).isoformat()

        if not _is_valid_uuid(webinar_id):
            _err("Invalid webinar ID format")

        # Validate webinar exists and is in the future
        webinar = (
            supabase.table("webinars")
            .select("*")
            .eq("id", webinar_id)
            .gt("scheduled_at", now_iso)
            .maybe_single()
            .execute()
        ).data

        if not webinar:
            _err("Webinar not found or already past", 404)

        # Idempotent registration
        supabase.table("webinar_registrations").upsert(
            {
                "student_id": uid,
                "webinar_id": webinar_id,
                "registered_at": datetime.now(timezone.utc).isoformat(),
            },
            on_conflict="student_id,webinar_id",
        ).execute()

        # Notification
        supabase.table("notifications").insert(
            {
                "student_id": uid,
                "title": "Webinar Registration Confirmed",
                "body": f"You have been registered for: {webinar['title']}",
                "type": "webinar_registration",
                "is_read": False,
            }
        ).execute()

        return _ok({"webinar_id": webinar_id, "registered": True})

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("register_webinar error: %s", exc, exc_info=True)
        _err("Failed to register for webinar", 500)
