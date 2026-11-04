def test_analytics_and_gradebook(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@campusflow.edu", "password": "Student@123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Gradebook
    gb_resp = client.get("/api/v1/analytics/gradebook", headers=headers)
    assert gb_resp.status_code == 200
    gb_data = gb_resp.json()
    assert "cumulative_cgpa" in gb_data
    assert "semesters" in gb_data
    assert len(gb_data["semesters"]) > 0

    # Placement stats
    ps_resp = client.get("/api/v1/analytics/placement-stats", headers=headers)
    assert ps_resp.status_code == 200
    ps_data = ps_resp.json()
    assert "total_recruitment_drives" in ps_data
    assert "average_ctc_lpa" in ps_data


def test_audit_log_admin_access(client):
    # Student cannot access audit logs
    stud_login = client.post(
        "/api/v1/auth/login",
        json={"email": "student@campusflow.edu", "password": "Student@123"},
    )
    stud_token = stud_login.json()["access_token"]
    stud_headers = {"Authorization": f"Bearer {stud_token}"}
    forbidden_resp = client.get("/api/v1/audit/logs", headers=stud_headers)
    assert forbidden_resp.status_code == 403

    # Admin CAN access audit logs
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@campusflow.edu", "password": "Admin@123"},
    )
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    ok_resp = client.get("/api/v1/audit/logs", headers=admin_headers)
    assert ok_resp.status_code == 200
    logs = ok_resp.json()
    assert len(logs) >= 1
