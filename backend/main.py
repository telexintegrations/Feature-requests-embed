from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Optional
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Setting(BaseModel):
    label: str
    type: str
    required: bool
    default: str

class RequestPayload(BaseModel):
    title: str
    description: str
    requester_email: str
    priority: str
    category: Optional[str] = None
    webhook_url: str

class TelexPayload(BaseModel):
    channel_id: str
    settings: List[Setting]
    message: str

@app.get("/integration.json")
def get_integration_json(request: Request):
    base_url = str(request.base_url).rstrip("/")
    return {
        "data": {
            "date": {
                "created_at": "2025-02-19",
                "updated_at": "2025-02-19"
            },
            "descriptions": {
                "app_name": "Feature Request Collector",
                "app_description": "Collects and processes feature requests from embedded forms",
                "app_url": base_url,
                "app_logo": "https://example.com/logo.png",
                "background_color": "#ffffff"
            },
            "integration_type": "output",
            "integration_category": "Communication & Collaboration",
            "is_active": True,
            "key_features": [
                "Allows users to submit feature requests via an embeddable form.",
                "Sends feature requests to a Telex channel for tracking and analysis."
            ],
            "settings": [
                {
                    "label": "allowed_domains",
                    "type": "text",
                    "description": "Comma-separated list of domains allowed to submit requests",
                    "default": "*",
                    "required": True
                },
                {
                    "label": "categories",
                    "type": "text",
                    "description": "Comma-separated list of feature categories",
                    "default": "UI/UX,Performance,Security,Integration,Other",
                    "required": True
                }
            ],
            "target_url": f"{base_url}/submit-request"
        }
    }

@app.post("/submit-request")
async def submit_request(request: RequestPayload):
    # Format the message for Telex
    message = f"""
📢 New Feature Request

**Title:** {request.title}
**Priority:** {request.priority}
**Category:** {request.category or 'Not specified'}
**Requester:** {request.requester_email}

**Description:**
{request.description}
"""
    
    return {
        "message": message,
        "username": "Feature Request Bot",
        "event_name": "feature_request",
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)