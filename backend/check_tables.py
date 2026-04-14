import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

s = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

# Tables our backend expects
expected = [
    "profiles", "student_details", "enrollments", "weeks", "tasks",
    "task_completions", "assessments", "assessment_attempts",
    "webinars", "webinar_registrations", "notifications", "payments",
]

print("Checking tables in public schema...\n")
for t in expected:
    try:
        r = s.table(t).select("*", count="exact").limit(0).execute()
        print(f"  YES  {t}  (rows: {r.count})")
    except Exception as e:
        err = str(e)
        if "does not exist" in err or "404" in err or "relation" in err:
            print(f"  NO   {t}")
        else:
            print(f"  ??   {t}  ({err[:80]})")
