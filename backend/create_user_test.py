from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv()

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

res = supabase.auth.admin.create_user({
    'email': 'teststudent@svastrino.com',
    'password': 'Test@12345',
    'email_confirm': True
})
print('User ID:', res.user.id)
print('Email:', res.user.email)
