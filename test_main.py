import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_read_root():
    response = await client.get("/")
    assert response.status_code == 200
    assert response.url == "https://github.com/telexintegrations/Feature-requests-embed"

@pytest.mark.asyncio
async def test_get_integration_json():
    response = await client.get("/integration.json")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert data["data"]["descriptions"]["app_name"] == "Feature Request Collector"

@pytest.mark.asyncio
async def test_submit_request():
    payload = {
        "title": "New Feature",
        "description": "Description of the new feature",
        "requester_email": "test@example.com",
        "priority": "High",
        "category": "UI/UX",
        "webhook_url": "https://example.com/webhook"
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/submit-request", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["message"] is not None