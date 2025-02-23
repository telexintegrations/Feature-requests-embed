# Feature Request Embed Integration

This project provides a **Feature Request Embed Widget** that allows users to submit feature requests directly from a website. The requests are sent to a **Telex channel** for tracking and analysis.

## 🚀 Features
- Embeddable **Feature Request Form** for websites.
- Sends feature requests to a **Telex channel webhook**.
- Configurable categories and positioning.
- Backend API built with **FastAPI**.
- Fully **CORS-enabled** for cross-origin access.
- **Customizable Styles**: Modify the form and button styles as needed.

---
## 🔍 Mentor Notes
This integration is **not** a typical Telex integration (it is neither an **Interval**, **Output**, nor **Modifier** integration). Instead, it is an **embed** that logs feature requests to the selected Telex channel via a webhook URL.

Mark (the Chief Mentor) approved this approach but required the creation of a frontend component. To test this integration, instead of adding it to a Telex channel manually, you can simply use the **test frontend** that I have already set up.

### 🔹 How to Test via Web
1. Go to **[Feature Request Embed Test](https://feature-requests-embed.vercel.app/test.html)**.
2. Submit a feature request through the form.
3. Your submission will appear in the **Telex-Integration-Test-2** channel.
   - [View the Channel](https://telex.im/dashboard/channels/019532cb-370e-77c7-9607-4036f19e5a6a)

### 🔹 How to Test via cURL
You can also test the submission endpoint directly using **cURL**:
```bash
curl -X POST "https://feature-requests-embed.onrender.com/submit-request" \
     -H "Content-Type: application/json" \
     -d '{
        "title": "Test Feature",
        "description": "Testing feature request submission.",
        "requester_email": "mentor@example.com",
        "priority": "Medium",
        "category": "UI/UX",
        "webhook_url": "https://ping.telex.im/v1/webhooks/019532cb-370e-77c7-9607-4036f19e5a6a"
     }'
```

After submitting, check the **Telex-Integration-Test-2** channel to confirm the request was logged correctly.

---

## 📂 Project Structure
```
/feature-request-embed
│── README.md                     # Project documentation
│── assets/                       # Project images
│── frontend/
│   │── public/
│   │   │── feature-request-widget.js   # The embeddable widget script
│   │   │── test.html                   # Test page for embedding the widget
│── backend/
│   │── main.py                     # Backend API with FastAPI
│   │── requirements.txt             # Backend dependencies
│   │── Dockerfile                   # Containerization setup
│── tests/
│   │── test_main.py                 # Tests for main.py
```

---

## 🛠 Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/feature-request-embed.git
cd feature-request-embed
```

### 2️⃣ Install Backend Dependencies
Ensure you have Python 3.8+ installed. Then run:
```bash
pip install -r backend/requirements.txt
```

### 3️⃣ Run the Backend API
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
By default, the API will be available at `http://localhost:8000`.

### 4️⃣ Test the Widget Locally
1. Open the `frontend/public/test.html` file in a browser.
2. Click the **Request Feature** button to open the form.
3. Fill in the details and submit the request.

You can use the `test.html` file to test the integration before embedding it into your own website. This file includes the necessary script setup and will display the widget on a sample page.

---

## 🧪 Testing the API

### Run Automated Tests
```bash
pytest tests/test_main.py
```

### Test Feature Request Submission
```bash
curl -X POST "http://localhost:8000/submit-request" \
     -H "Content-Type: application/json" \
     -d '{
        "title": "Dark Mode Support",
        "description": "Please add dark mode to the app.",
        "requester_email": "user@example.com",
        "priority": "High",
        "category": "UI/UX",
        "webhook_url": "https://ping.telex.im/v1/webhooks/your-webhook-id"
     }'
```
Expected Response:
```json
{
  "message": "Feature Request:",
  "username": "Feature Request Bot",
  "event_name": "feature_request",
  "status": "success"
}
```

---

## 🌍 Deployment

### Deploy Backend to Render
1. Push your code to **GitHub**.
2. Sign up on [Render](https://render.com/).
3. Create a new **Web Service**.
4. Set the **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
5. Deploy!

### Deploy Widget to GitHub Pages
1. Host `frontend/public/feature-request-widget.js` in a GitHub repository.
2. Serve the file via **GitHub Pages**.

---

## 📸 Screenshots
### 🎯 Widget Button
![Widget Button]()

### 📝 Feature Request Form
![Feature Form](https://raw.githubusercontent.com/telexintegrations/Feature-requests-embed/refs/heads/main/assets/form1.png)

### ✅ Successful Submission
![Success Message](https://raw.githubusercontent.com/telexintegrations/Feature-requests-embed/refs/heads/main/assets/successmessage.png)

### 🤖 bot message in telex channel
![Bot Message](https://raw.githubusercontent.com/telexintegrations/Feature-requests-embed/refs/heads/main/assets/message%20in%20channel.png)


---

## 🛠 Configuration

The form and button styles can be **modified** by updating the `frontend/public/feature-request-widget.js` file. Adjust colors, font styles, and layout according to your website’s theme.

To embed the widget, paste the following **script** into your frontend code, replacing `webhookUrl` with your **Telex channel webhook URL**:
```html
<script>
    const featureWidget = new FeatureRequestWidget({
        telexEndpoint: "https://feature-requests-embed.onrender.com/submit-request",
        webhookUrl: "https://ping.telex.im/v1/webhooks/your-webhook-id",
        categories: "UI/UX,Performance,Security,Integration,Other",
        position: "bottom-right"
    });
</script>
```

---

## 🔗 Resources
- [Telex Docs](https://docs.telex.im/docs/intro)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Render Deployment](https://render.com/docs/deploy-fastapi)


---

## 📩 Contact & Support
For issues, open a GitHub **Issue** or contact `badobredanielle@example.com`.
