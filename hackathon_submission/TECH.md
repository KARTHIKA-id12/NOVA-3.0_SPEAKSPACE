# 💻 Technology Stack & Architecture

## Tech Stack
*   **Runtime:** Node.js & TypeScript (Strong typing for reliability)
*   **Framework:** Express.js (Lightweight API server)
*   **NLP Engine:** Custom Rule-Based Engine (Zero-dependency, offline)
    *   *Optimization:* Uses `Set` lookups and weighted scoring for O(1) keyword detection.
*   **Communication:**
    *   **Twilio SDK:** Programmable SMS and Voice.
    *   **Nodemailer:** SMTP Email delivery with attachments.
*   **PDF Generation:** `pdfkit` (Dynamic report creation).
*   **Build Tool:** `tsx` (Fast execution) / `esbuild`.

## Architecture Diagram

```mermaid
graph TD
    User[User via SpeakSpace] -->|Voice Note Transcription| API[API Gateway (/api/process)]
    
    subgraph "Safety-Net AI Core"
        API --> NLP[Rule Engine]
        NLP -->|Analyze| dataset[(NLP Dataset)]
        NLP -->|Result| Logic{Severity?}
        
        Logic -->|Low/Medium| log[Log Incident]
        Logic -->|High/Critical| Alert[Emergency Trigger]
        
        Alert -->|Parallel| SMS[Twilio SMS]
        Alert -->|Parallel| Call[Twilio Voice]
        Alert --> PDF[PDF Generator]
        PDF --> Email[Email Service]
    end
    
    SMS --> Victim_Contacts
    Call --> Victim_Contacts
    Email --> Authorities
```

## Why This Tech?
1.  **Why not OpenAI?** Latency. In an attack, 2 seconds matters. Our engine runs in 50ms. Also, privacy—sending victim audio to 3rd party clouds is risky.
2.  **Why TypeScript?** Safety. Emergency code cannot fail due to type errors.
3.  **Why Parallel Execution?** We use `Promise.all` to trigger SMS and Calls simultaneously to ensure the alert gets out even if one channel fails or lags.
