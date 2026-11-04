def test_marketplace_operations(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@campusflow.edu", "password": "Student@123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch listings
    resp = client.get("/api/v1/marketplace/", headers=headers)
    assert resp.status_code == 200
    listings = resp.json()
    assert len(listings) >= 3

    # Create listing
    create_resp = client.post(
        "/api/v1/marketplace/",
        headers=headers,
        json={
            "title": "Discrete Mathematics and Its Applications (Rosen)",
            "description": "Hardcover textbook in mint condition.",
            "category": "Textbook",
            "price": "₹700",
            "condition": "Like New",
        },
    )
    assert create_resp.status_code == 201
    item = create_resp.json()
    assert item["price"] == "₹700"

    # Send inquiry
    inq_resp = client.post(
        f"/api/v1/marketplace/{item['id']}/inquiries",
        headers=headers,
        json={"message": "Is this still available for pickup at the student center?"},
    )
    assert inq_resp.status_code == 201
