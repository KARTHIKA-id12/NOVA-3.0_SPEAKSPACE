# 🛠️ System Requirements & Deployment Guide

This project is a **Node.js/TypeScript** application designed for deployment on platforms like **Render**, **Railway**, or **Vercel**.

---

## 🏗️ Technical Requirements

### Runtime Environment
*   **Node.js**: v18.0.0 or higher
*   **npm**: v9.0.0 or higher
*   **Operating System**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows

### Core Dependencies (Production)
These are automatically installed via `npm install`:
*   **`express`** (^4.21.2) - API Server Framework.
*   **`twilio`** (^5.14.0) - For SMS and Voice Call alerts.
*   **`nodemailer`** (^6.9.13) - For sending email reports via SMTP.
*   **`pdfkit`** (^0.15.0) - For generating forensic PDF attachments.
*   **`zod`** (^3.23.0) - Runtime schema validation for API inputs.
*   **`uuid`** (^9.0.1) - Unique ID generation for incidents.

### Dev/Build Dependencies
*   **`typescript`** (^5.4.0) - Static typing.
*   **`tsx`** (^4.7.0) - TypeScript execution engine (used for build scripts).
*   **`esbuild`** (^0.20.0) - Fast bundler for production builds.

---

## 🔑 Environment Variables
You **MUST** configure these in your deployment platform (Render/Railway/Vercel) for the system to function.

```env
# Server Configuration
PORT=5000                   # Default port (Render assigns this automatically)
NODE_ENV=production         # Set to 'production' for live deployment

# Email Service (Gmail SMTP)
SMTP_USER=your_email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # 16-character App Password (NOT your login password)

# Twilio Configuration (Required for SMS/Call alerts)
TWILIO_ACCOUNT_SID=AC...       # From Twilio Console
TWILIO_AUTH_TOKEN=...          # From Twilio Console
TWILIO_FROM_NUMBER=+1234567890 # Your Twilio number
TWILIO_TO_NUMBER=+1987654321   # The safety officer/emergency contact number
```

---

## 🚀 Deployment Instructions (Render.com)

1.  **Connect GitHub:**
    *   Log in to Render and click "New Web Service".
    *   Select your GitHub repository `Safety-Net-AI`.

2.  **Configure Build & Start:**
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install && npm run build`
        *   *(This installs dependencies and compiles TypeScript to `dist/index.cjs`)*
    *   **Start Command:** `npm start`
        *   *(Runs the compiled production server)*

3.  **Add Environment Variables:**
    *   Scroll down to "Environment Variables".
    *   Add key-value pairs for `SMTP_USER`, `SMTP_PASS`, `TWILIO_ACCOUNT_SID`, etc.

4.  **Deploy:**
    *   Click "Create Web Service".
    *   Wait for the "Live" status.
    *   Your API URL will be `https://<your-app-name>.onrender.com`.

---

## 🧪 Verification
You can check if the deployment is successful by pinging the health endpoint:
*   `GET https://<your-app-url>/api/health` -> Returns `{"status":"ok"}`.
