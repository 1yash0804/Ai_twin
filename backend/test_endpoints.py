import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8000"
USERNAME = "test_verifier"
PASSWORD = "password123"

async def verify():
    async with httpx.AsyncClient() as client:
        # 1. Register (ignore if exists)
        try:
            print(f"Registering {USERNAME}...")
            await client.post(f"{BASE_URL}/users/", json={
                "username": USERNAME,
                "email": "test@example.com",
                "password": PASSWORD
            })
        except Exception:
            pass # User might already exist

        # 2. Login
        print(f"Logging in...")
        response = await client.post(f"{BASE_URL}/token", data={
            "username": USERNAME,
            "password": PASSWORD
        })
        
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return

        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Logged in via JWT.")

        # 3. Test Memories
        print("\nTesting /me/memories...")
        res = await client.get(f"{BASE_URL}/me/memories", headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Data: {res.json()}")

        # 4. Test Tasks
        print("\nTesting /me/tasks...")
        res = await client.get(f"{BASE_URL}/me/tasks", headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Data: {res.json()}")

        # 5. Test Activities
        print("\nTesting /me/activities...")
        res = await client.get(f"{BASE_URL}/me/activities", headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Data: {res.json()}")

if __name__ == "__main__":
    asyncio.run(verify())
