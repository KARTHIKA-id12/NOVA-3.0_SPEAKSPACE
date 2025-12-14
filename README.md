# SafetyNet AI – Women’s Emergency Harassment Response System

**A Privacy-First, Offline-Capable AI Safety Agent for Immediate Threat Response.**

---

## 📖 Problem Statement
In emergency situations (stalking, harassment, domestic violence), victims often cannot type detailed messages or waiting for cloud-based AI to process voice notes introduces critical latency and privacy risks. Existing solutions rely on internet-heavy APIs that expose sensitive data.

## 💡 Our Solution
**Safety-Net AI** is a lightweight, backend-only API designed to integrate with **SpeakSpace**. It processes voice note transcriptions **instantly**, **offline**, and **privately** using a custom Rule-Based NLP Engine.
*   **Instant Analysis:** No external AI API calls (0 latency).
*   **Privacy First:** Data stays within the server context; no OpenAI/Gemini logging.
*   **Multi-Channel Alerts:** Automatically triggers **SMS, Voice Calls, and Email Reports** for High/Critical threats.
*   **Phrase Automation ("Angel Shot"):** Includes a **Discreet Mode** that detects coded language (e.g., "Order a pizza", "Ask for Angela") to trigger critical alerts without suspicious keywords.

---

## 🚀 Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   npm
*   A Twilio Account (SID, Auth Token, Phone Number)
*   A Gmail Account (for SMTP)

### 2. Installation
```bash
git clone <repository-url>
cd Safety-Net-AI
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Server
PORT=5002

# Email (Gmail SMTP)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # Generate via Google Account > Security > App Passwords

# Twilio (For SMS & Calls)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_TO_NUMBER=+1987654321
```

### 4. Run Locally
```bash
npm run dev
# Server will start at http://localhost:5002
```

---

## 🌐 Deployment Guide (for Judges)
This project is designed for easy deployment and evaluation using standard Node.js workflows and popular cloud platforms.
1.Clone or fork the repository:
git clone <repository-url>
cd SafetyNet-AI

2.Install dependencies:
npm install

3.Build the application:
npm run build


4.Start the server:
npm start


5.The API will be available at:
http://localhost:5002


This workflow demonstrates clean, maintainable code execution and aligns with standard production practices.

### Option 2: Cloud Deployment (Render)
1.Log in to Render.

2.Select New Web Service.

3.Connect your GitHub repository.

4.Configure the service:

Build Command:
npm install && npm run build

Start Command:
npm start

Add environment variables using the .env.example file as reference.

Deploy the service.
Once deployed, Render will provide a public URL that can be used for live API testing.

## 🔌 API Documentation

**Endpoint:** `POST /api/process`
**Auth:** Open (or configure basic auth if needed)

### Request Format
```json
{
  "prompt": "I am being followed by a stranger from the metro station. My name is Sarah.",
  "note_id": "unique_note_123",
  "timestamp": "2025-12-13T10:00:00Z"
}
```

### Response Format
```json
{
  "status": "success",
  "message": "Workflow executed"
}
```

---

## 🛠️ SpeakSpace Action Configuration
Copy-paste this into your SpeakSpace Action setup:

```json
{
  "action_type": "webhook",
  "url": "https://<YOUR-DEPLOYED-URL>/api/process",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "prompt": "{{transcription}}",
    "note_id": "{{note_id}}",
    "timestamp": "{{timestamp}}"
  }
}
```

---

## 🧪 Live Demo & Evaluation Walkthrough
## Deployed
**Step 1: Access the Deployed API**
The application is deployed and publicly accessible.

Base URL (Example):
https://nova-3-0-speakspace.onrender.com/

API Endpoint:
POST /api/process
Note: Replace the base URL with the actual deployed URL provided in the submission.

**Step 2: Prepare a Test Request**
Judges can use Postman, cURL, or any REST client.

Headers:

{
  "Content-Type": "application/json"
}

Sample Request Body (High-Risk Scenario):

{
  "prompt": "Help! I am being followed by a stranger near the bus stop. Please call for help.",
  "note_id": "demo_live_001",
  "timestamp": "2025-12-14T10:30:00Z"
}

**Step 3: Expected API Response**
{
  "status": "success",
  "message": "Threat analysis completed and emergency workflow triggered"
}

This confirms that the NLP engine successfully processed the input and initiated the response pipeline.

**Step 4: Verify Emergency Response Actions**

For High or Critical threat levels, the following actions are automatically triggered:

SMS Alert

An emergency message is sent to the configured contact number via Twilio.

Automated Voice Call

A voice call is placed with a synthesized emergency alert message.

Email Incident Report

A detailed incident report is sent to the configured email address.

Incident Logging

The event is securely logged for audit and verification purposes.


**Step 5: SpeakSpace Integration Validation**

If tested via SpeakSpace:

Configure the SpeakSpace Action with the deployed URL.

Submit a voice note.

The transcription is automatically forwarded to the API.

Threat analysis and emergency alerts are executed in real time.

Evaluation Notes for Judges

No external AI services are used.

No voice data or transcripts are stored externally.

All processing happens within the deployed service.

The system is designed for low latency, privacy, and reliability.

## Local 
1.  **Start the Server:** Ensure it's running (`npm run dev`).
2.  **Open Test Interface:** Navigate to `http://localhost:5002` in your browser.
3.  **Submit a Test Case:**
    *   *Input:* "Help! I am Priya. Someone is attacking me with a knife in the park!"
    *   *Click:* Submit.
4.  **Verify Results:**
    *   **Console/Logs:** Check `logs/incidents.json`.
    *   **SMS:** Verify the target phone received an alert.
    *   **Call:** Verify the target phone received a voice call.
    *   **Email:** Check the inbox for a "Critical Incident Report" with PDF attachment.

---

## 📂 Project Structure
*   `server/ruleEngine.ts` - The brain (NLP logic).
*   `server/routes.ts` - API handling & orchestration.
*   `server/data/safety_nlp_dataset.json` - The knowledge base.
