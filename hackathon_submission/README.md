# SpeakSpace Emergency Harassment Detection API 🛡️

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

### Option 1: Render / Railway / Vercel
1.  Fork this repository.
2.  Create a new Web Service.
3.  Set the **Build Command**: `npm install && npm run build`.
4.  Set the **Start Command**: `npm start`.
5.  Add the Environment Variables defined above.

### Option 2: Replit
1.  Import repository.
2.  Add Secrets in the Tools pane (SMTP_USER, etc.).
3.  Hit Run.

---

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

## 🧪 Live Demo / Walkthrough (How to Verify)

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
