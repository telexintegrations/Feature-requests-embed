from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from fastapi.middleware.cors import CORSMiddleware
from httpx import AsyncClient
import traceback
from fastapi.responses import RedirectResponse


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
@app.get("/")
def read_root():
    return RedirectResponse(url="https://github.com/telexintegrations/Feature-requests-embed")

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
                "app_url": "https://github.com/telexintegrations/Feature-requests-embed/blob/main/README.md",
                "app_logo": "https://raw.githubusercontent.com/telexintegrations/Feature-requests-embed/refs/heads/main/assets/_3b004ae5-3f06-4660-b084-23545f5ed4ff.jfif",
                "background_color": "#ffffff"
            },
            "integration_type": "output",
            "integration_category": "Communication & Collaboration",
            "is_active": True,
            "key_features": [
                "Allows users to submit feature requests via an embeddable form.",
                "Sends feature requests to a Telex channel for tracking and analysis."
                "The form is embedded directly in the HTML of the website and does not require integration with Telex."
                "To use the embeddable form, users must provide the URL of the Telex channel where the feature requests will be sent."
                "please, refer to the github repository for more information."
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
    print(f"Received request: {request.dict()}")
    print(f"Type of str: {type(str)}")

    # Format the message for Telex
    message = f"""
📢 New Feature Request

Title: {request.title}
Priority: {request.priority}
Category: {request.category or 'Not specified'}
Requester: {request.requester_email}

Description:
{request.description}
"""
    try:
        async with AsyncClient() as client:
            response = await client.post(
                str(request.webhook_url),
                json={
                    "message": message,
                    "username": "Feature Request Bot",
                    "event_name": "feature_request",
                    "status": "success" 
                }
            )
            print(f"Webhook response: {response.status_code}")  # Debug logging
            print(f"Webhook response body: {response.text}")  # Debug logging
            if response.status_code != 202:
                raise HTTPException(
                    status_code=500,
                    detail=f"Webhook error: {response.status_code} - {response.text}"
                )
                
    except Exception as e:
        print(f"Error in submit_request: {str(e)}")  # Debug logging
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "message": message,
        "username": "Feature Request Bot",
        "event_name": "feature_request",
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)