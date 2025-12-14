# SafetyNet AI – Women’s Emergency Harassment Response System

**A Privacy-First, Offline-Capable AI Safety Agent for Immediate Threat Response.**

---

📖 Problem Statement

In today’s world, women’s safety has become a growing and urgent concern, particularly in urban environments where incidents of harassment, stalking, and assault frequently occur in public spaces such as streets, public transport, workplaces, and residential areas. Despite the availability of safety applications and emergency helplines, many real-world emergency situations escalate too quickly for victims to manually seek help.

During moments of distress, women often face multiple challenges:

Inability to type detailed messages

Fear of openly calling for help

Panic, fear, or emotional shock

Limited or unstable internet connectivity

⚠️ Limitations of Existing Safety Solutions

Most existing women’s safety systems suffer from critical limitations:

Heavy dependence on cloud-based AI services, requiring constant internet connectivity

Delays in response time during emergencies, where seconds can be life-saving

Reliance on manual user interaction, which is often impossible during panic or distress

High privacy risks, as sensitive voice and text data are transmitted to third-party platforms

Data security concerns, including misuse, external logging, and long-term storage of personal information

System failures in low-connectivity or high-stress real-world scenarios

🚨 The Existing Gap

These limitations create a serious disconnect between real-world emergency conditions and current digital safety tools, leaving women without reliable support when they need it most.

✅ What Is Urgently Needed

An effective women’s safety solution must be:

Instant and low-latency

Privacy-preserving by design

Capable of operating without external AI services

Functional even with limited or no internet connectivity

Discreet and automated, requiring minimal user input

Reliable in high-stress, real-world emergency situations

🛡️ How SafetyNet AI Solves This

SafetyNet AI directly addresses these challenges by:

Enabling instant threat detection using offline-capable intelligence

Eliminating dependence on external cloud AI platforms

Preserving user privacy by keeping all data within the system

Automatically triggering emergency responses without manual intervention

Ensuring rapid, reliable support exactly when it is needed most

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
## Step 1: Access the Deployed API
The application is deployed and publicly accessible.

Base URL (Example):
https://nova-3-0-speakspace.onrender.com/

API Endpoint:
POST /api/process
Note: Replace the base URL with the actual deployed URL provided in the submission.

## Step 2: Prepare a Test Request
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

## Step 3: Expected API Response
{
  "status": "success",
  "message": "Threat analysis completed and emergency workflow triggered"
}

This confirms that the NLP engine successfully processed the input and initiated the response pipeline.

## Step 4: Verify Emergency Response Actions

For High or Critical threat levels, the following actions are automatically triggered:

1.SMS Alert

An emergency message is sent to the configured contact number via Twilio.

2.Automated Voice Call

A voice call is placed with a synthesized emergency alert message.

3.Email Incident Report

A detailed incident report is sent to the configured email address.

4.Incident Logging

The event is securely logged for audit and verification purposes.


## Step 5: SpeakSpace Integration Validation

If tested via SpeakSpace:

1.Configure the SpeakSpace Action with the deployed URL.

2.Submit a voice note.

3.The transcription is automatically forwarded to the API.

4.Threat analysis and emergency alerts are executed in real time.

## Evaluation Notes for Judges

1.No external AI services are used. 

2.No voice data or transcripts are stored externally.

3.All processing happens within the deployed service.

4.The system is designed for low latency, privacy, and reliability.

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
## Need for This Project
**Why SafetyNet AI Is Essential in Real-World Emergency Scenarios**

In many real-world harassment and emergency situations, especially those involving women’s safety, victims often have limited time, limited connectivity, and limited ability to communicate clearly. Traditional safety applications depend on manual input, constant internet access, or third-party AI services, which can introduce delays, privacy risks, and system failures at critical moments.

There is a growing need for a reliable, low-latency, and privacy-preserving safety solution that can function effectively even under constrained conditions. SafetyNet AI addresses this gap by enabling instant threat detection and automated emergency response without relying on external cloud AI platforms.

By combining offline-capable rule-based intelligence, discreet phrase detection, and multi-channel alert mechanisms, this project provides a practical and scalable safety infrastructure that can be seamlessly integrated into platforms like SpeakSpace. The system is designed not only for technical innovation but also for real-world adoption, where trust, speed, and data security are paramount.

##  Example Scenario: Real-World Emergency Detection
## User Input Scenario

“My name is Sarah. I am being followed by a stranger from the metro station to my apartment. He has been trailing me for 15 minutes and is now trying to get on the same elevator as me. I am very scared.”

## System Interpretation

1.Upon receiving the transcription, SafetyNet AI performs the following analysis:

2.Identifies explicit distress indicators (“being followed”, “very scared”)

3.Detects escalating threat context (prolonged tracking, elevator access)

4.Classifies the situation as High to Critical Risk

5.Extracts key incident metadata (location context, duration, personal risk)

## Automated Response Triggered

Because the threat level exceeds the critical threshold, the system automatically initiates the emergency response workflow:

1.SMS Alert
An immediate alert is sent to the registered emergency contact with incident details.

2.Automated Voice Call
A voice call is placed to ensure urgent attention in case SMS is missed.

3.Email Incident Report
A structured incident report is sent via email for record-keeping and escalation.

4.Incident Logging
The event is securely logged for audit, monitoring, and verification.

## Outcome

The entire workflow executes within seconds, without relying on external AI services or cloud processing. This ensures:

1.Minimal latency

2.Strong privacy guarantees

3.Reliable emergency response during critical moments
--

## 📂 Project Structure
*   `server/ruleEngine.ts` - The brain (NLP logic).
*   `server/routes.ts` - API handling & orchestration.
*   `server/data/safety_nlp_dataset.json` - The knowledge base.
