def test_discussion_thread_lifecycle(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@campusflow.edu", "password": "Student@123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List threads
    list_resp = client.get("/api/v1/discussions/", headers=headers)
    assert list_resp.status_code == 200
    threads = list_resp.json()
    assert len(threads) >= 1

    # Create new thread
    create_resp = client.post(
        "/api/v1/discussions/",
        headers=headers,
        json={
            "title": "Optimizing SQL Queries in PostgreSQL",
            "content": "How do EXPLAIN ANALYZE execution trees help spot sequential scan bottlenecks?",
            "tags": "Databases, PostgreSQL, Indexing",
        },
    )
    assert create_resp.status_code == 201
    new_thread = create_resp.json()
    assert new_thread["title"] == "Optimizing SQL Queries in PostgreSQL"

    # Add comment
    cmt_resp = client.post(
        f"/api/v1/discussions/{new_thread['id']}/comments",
        headers=headers,
        json={"content": "Use EXPLAIN (ANALYZE, BUFFERS) to see page hits versus disk reads."},
    )
    assert cmt_resp.status_code == 201

    # Upvote
    up_resp = client.post(f"/api/v1/discussions/{new_thread['id']}/upvote", headers=headers)
    assert up_resp.status_code == 200
    assert up_resp.json()["upvotes"] == 1
