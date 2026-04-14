import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(supabase_url, supabase_key)

email = "testadmin@svastrino.com"
password = "Admin@12345"

print("Creating admin user...")
try:
    auth_res = supabase.auth.admin.create_user({
        "email": email,
        "password": password,
        "email_confirm": True
    })
    
    user_id = auth_res.user.id
    print(f"Created Auth User: {user_id}")
    
    # Wait / assume profile trigger is done or we update directly
    print("Updating profile role to 'admin'...")
    res = supabase.table("profiles").update({"role": "admin"}).eq("id", user_id).execute()
    print(f"Update Result: {res.data}")
    
    print("\nAdmin Account Ready:")
    print(f"Email: {email}")
    print(f"Password: {password}")
    
except Exception as e:
    print(f"Error: {e}")
