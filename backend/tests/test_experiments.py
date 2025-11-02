from fastapi.testclient import TestClient


def test_create_and_get_experiment(client: TestClient) -> None:
    payload = {
        "title": "Compare GPT models",
        "description": "Benchmark GPT-4 vs Llama3",
        "owner": "alice",
        "tags": ["llm", "benchmark"],
        "status": "planned",
        "repo_url": "https://github.com/example/repo",
    }

    resp = client.post("/api/v1/experiments/", json=payload)
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["title"] == payload["title"]
    assert data["slug"] == "compare-gpt-models"
    assert data["owner"] == "alice"

    experiment_id = data["id"]
    get_resp = client.get(f"/api/v1/experiments/{experiment_id}")
    assert get_resp.status_code == 200
    detail = get_resp.json()
    assert detail["id"] == experiment_id
    assert detail["tags"] == payload["tags"]


def test_update_and_filter_experiment(client: TestClient) -> None:
    payload = {
        "title": "Vision Transformer experiment",
        "description": "ViT vs ResNet",
        "owner": "bob",
        "tags": ["computer-vision"],
    }
    created = client.post("/api/v1/experiments/", json=payload).json()

    update_payload = {"status": "running", "tags": ["computer-vision", "baseline"]}
    update_resp = client.put(f"/api/v1/experiments/{created['id']}", json=update_payload)
    assert update_resp.status_code == 200
    updated = update_resp.json()
    assert updated["status"] == "running"
    assert "baseline" in updated["tags"]

    list_resp = client.get("/api/v1/experiments/", params={"status": "running"})
    assert list_resp.status_code == 200
    listed = list_resp.json()
    assert len(listed) == 1
    assert listed[0]["id"] == created["id"]
