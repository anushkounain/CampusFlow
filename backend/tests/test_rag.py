from app.services.rag_service import RAGProcessor


def test_rag_chunking_and_similarity():
    text = (
        "Operating systems manage hardware resources and provide common services for computer programs. "
        "Memory management involves allocating and deallocating memory blocks to executing programs. "
        "Virtual memory maps virtual addresses used by an application into physical addresses in computer memory."
    )
    chunks = RAGProcessor.chunk_text(text, chunk_size=15, chunk_overlap=5)
    assert len(chunks) >= 2
    for c in chunks:
        assert "content" in c
        assert "keywords" in c
        assert c["token_count"] > 0

    # Test semantic similarity
    sim_high = RAGProcessor.semantic_similarity("virtual memory mapping", text)
    sim_low = RAGProcessor.semantic_similarity("completely unrelated culinary recipe", text)
    assert sim_high > sim_low


def test_rag_query_endpoint(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@campusflow.edu", "password": "Student@123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Query RAG
    rag_resp = client.post(
        "/api/v1/documents/rag-query",
        headers=headers,
        json={"query": "Raft leader election consensus", "top_k": 2},
    )
    assert rag_resp.status_code == 200
    data = rag_resp.json()
    assert "answer" in data
    assert "sources" in data
    assert data["query"] == "Raft leader election consensus"
