def test_academics_courses_and_timetable(client):
    # Log in as student
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@campusflow.edu", "password": "Student@123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch courses
    courses_resp = client.get("/api/v1/academics/courses", headers=headers)
    assert courses_resp.status_code == 200
    courses = courses_resp.json()
    assert len(courses) >= 4
    course_codes = [c["code"] for c in courses]
    assert "CS301" in course_codes

    # Fetch timetable
    tt_resp = client.get("/api/v1/academics/timetable", headers=headers)
    assert tt_resp.status_code == 200
    assert len(tt_resp.json()) > 0

    # Fetch summary
    summary_resp = client.get("/api/v1/academics/summary", headers=headers)
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert "cgpa" in summary
    assert "attendance_rate" in summary
