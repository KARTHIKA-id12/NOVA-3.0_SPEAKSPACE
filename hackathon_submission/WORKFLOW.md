# 🔄 Workflow & Logic

## 1. Input Processing
The system receives a JSON payload containing the `prompt` (transcription) from SpeakSpace.

## 2. Text Analysis (The Brain)
The input text is passed to `server/ruleEngine.ts`:
*   **Normalization:** Text is cleaned and lowercased.
*   **Extraction:**
    *   **Name:** "My name is [X]" regex patterns.
    *   **Location:** Matched against a library of 50+ locations (e.g., "staff room", "park", "metro").
*   **Scoring:**
    *   Keywords like "knife", "follow", "touch" have weighted scores.
    *   Contextual boosts for "night", "alone".
    *   **Thresholds:** Score > 9 = Critical; > 6 = High.

## 3. Decision Engine
*   **If High/Critical:**
    *   `needs_emergency_response` flag is set to TRUE.
    *   Triggers immediate multi-channel alerts.
*   **If Low/Medium:**
    *   Logs the incident for record-keeping.
    *   Sends a standard email report but skips SMS/Call to avoid panic fatigue.

## 4. Response & Reporting
*   **PDF Report:** A professional forensic report is generated containing:
    *   Incident ID & Timestamp.
    *   Extracted Victim Name & Location.
    *   Harassment Type (e.g., "Workplace", "Stalking").
    *   Risk Score & Analysis Summary.
*   **Notifications:**
    *   **Email:** Sent to pre-configured safety officers/contacts with PDF attached.
    *   **SMS:** "Alert: Critical Incident. Risk Score: 16. Loc: Park. Action: Call Police."
    *   **Call:** Automated voice message reading the incident summary.
