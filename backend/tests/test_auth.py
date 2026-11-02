def test_login_seeded_admin(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@campusflow.edu", "password": "Admin@123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == "admin@campusflow.edu"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@campusflow.edu", "password": "WrongPassword"},
    )
    assert response.status_code == 401
    assert "detail" in response.json()


def test_register_new_student(client):
    new_student = {
        "email": "priya.nair@campusflow.edu",
        "password": "Password123!",
        "full_name": "Priya Nair",
        "role": "student",
        "department": "Computer Science & Engineering",
        "roll_number_or_empid": "CS2026101",
    }
    response = client.post("/api/v1/auth/register", json=new_student)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "priya.nair@campusflow.edu"
    assert data["user"]["role"] == "student"

    # Test me endpoint with new student token
    headers = {"Authorization": f"Bearer {data['access_token']}"}
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["full_name"] == "Priya Nair"


def test_duplicate_registration_fails(client):
    dup = {
        "email": "student@campusflow.edu",
        "password": "Password123!",
        "full_name": "Alex Duplicate",
        "role": "student",
    }
    response = client.post("/api/v1/auth/register", json=dup)
    assert response.status_code == 400
