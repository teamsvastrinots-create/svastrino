import requests
import json

# Dashboard testing script for teststudent@svastrino.com

token = "eyJhbGciOiJFUzI1NiIsImtpZCI6ImJjNDY3ZDM0LTRjN2MtNDE5ZS05NzRjLWI3MTVlMDY1Y2IzMSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3lyd3B2ZWtwYWZ6a3Fvd3J0bG9pLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlOWMwNmM0Mi04MzU4LTQ0MzctOTBmMS1lN2FmYzkxNmRkMmIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc2MTAzOTIxLCJpYXQiOjE3NzYxMDAzMjEsImVtYWlsIjoidGVzdHN0dWRlbnRAc3Zhc3RyaW5vLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzc2MTAwMzIxfV0sInNlc3Npb25faWQiOiJiNmE1YmUxZi0zOWJhLTQ3M2MtYjE3My00MDUyYzY4NjIwMjgiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.N_KlveDWq_mBPW4aeI8enDZFSx-o3wOTqth3sHLnRUOYYPqwh31srFv3hc0l4AShdkN5A1IgEFYEFqt6KSi70g"

url = "http://localhost:8001/v1/student/dashboard"
headers = {"Authorization": f"Bearer {token}"}

response = requests.get(url, headers=headers)

print(f"Status Code: {response.status_code}")
try:
    print(json.dumps(response.json(), indent=2))
    
    # Optionally save to a JSON file
    with open("dashboard_response.json", "w") as f:
        json.dump(response.json(), f, indent=2)
    print("\n[ Saved response to dashboard_response.json ]")
except Exception as e:
    print(f"Error parsing JSON: {e}")
    print(response.text)
