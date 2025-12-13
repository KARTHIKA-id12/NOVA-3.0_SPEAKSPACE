# SpeakSpace Emergency Harassment Detection API

## Project Overview

A production-ready backend API that receives voice-note transcriptions from SpeakSpace, analyzes them using a rule-based NLP engine (no external AI/API keys required), and generates emergency reports sent via email.

## Architecture

### Core Components

1. **Rule Engine** (`server/ruleEngine.ts`)
   - Loads and processes the harassment detection dataset
   - Performs case-insensitive keyword matching
   - Calculates severity scores based on weighted indicators
   - Detects harassment type, emotions, danger signals, and locations

2. **Report Generator** (`server/reportGenerator.ts`)
   - Creates formatted emergency incident reports
   - Generates unique report IDs (UUID)
   - Structures all extracted data into readable format

3. **Email Service** (`server/emailService.ts`)
   - Sends reports via Gmail SMTP (nodemailer)
   - Configured recipients list
   - Graceful fallback when SMTP not configured

4. **Incident Logger** (`server/incidentLogger.ts`)
   - Appends incidents to `logs/incidents.json`
   - Stores report metadata for audit trail

### Dataset

Located at `server/data/safety_nlp_dataset.json`:
- 8 harassment categories (stalking, sexual harassment, threats, verbal abuse, workplace, domestic, kidnapping, other)
- Critical flags and emotion indicators
- Location and time indicators
- Severity scoring weights
- Recommended actions bank

## API Endpoints

### POST /api/process
Main endpoint for SpeakSpace integration.

**Request Body:**
```json
{
  "prompt": "Transcribed text from voice note",
  "note_id": "unique_identifier",
  "timestamp": "2025-12-11T12:30:00Z"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Workflow executed"
}
```

### GET /api/health
Health check endpoint.

### GET /api/incidents
Retrieve all logged incidents (for debugging/admin).

## Environment Variables

Required secrets:
- `SMTP_USER`: Gmail address for sending emails
- `SMTP_PASS`: Gmail App Password (not regular password)

## Severity Scoring

| Score Range | Severity Level |
|-------------|----------------|
| 0-3         | Low            |
| 4-6         | Medium         |
| 7-9         | High           |
| 10+         | Critical       |

**Weights:**
- Critical keywords (weapon, knife, grab, etc.): 4 points each
- High keywords (following, alone, scared, etc.): 2 points each
- Emotion keywords: 1 point each
- Night/time bonus: 2 points
- Vulnerability bonus: 2 points

## Email Recipients

Reports are sent to:
- kenn62612@gmail.com
- bharathimuthusamy2023@gmail.com
- karthivv929@gmail.com
- vink90926@gmail.com
- vincentkennyken123@gmail.com

## File Structure

```
server/
├── data/
│   └── safety_nlp_dataset.json  # Rule-based NLP dataset
├── emailService.ts              # Email sending module
├── incidentLogger.ts            # JSON file logging
├── index.ts                     # Express server entry
├── reportGenerator.ts           # Report formatting
├── routes.ts                    # API routes
├── ruleEngine.ts                # NLP rule engine
└── storage.ts                   # Base storage interface

logs/
└── incidents.json               # Incident audit log
```

## Deployment

### Render
1. Create new Web Service
2. Connect repository
3. Set environment variables (SMTP_USER, SMTP_PASS)
4. Build command: `npm install && npm run build`
5. Start command: `npm start`

### Vercel
1. Import project
2. Set environment variables
3. Framework preset: Other
4. Build & Output: Use default settings

### Railway
1. Create new project from repo
2. Add environment variables
3. Deploy automatically

## Testing

Test with curl:
```bash
curl -X POST http://localhost:5000/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Someone is following me, it is late night and I am scared",
    "note_id": "test_001",
    "timestamp": "2025-12-11T12:00:00Z"
  }'
```

## SpeakSpace Action Configuration

```json
{
  "action_type": "webhook",
  "url": "https://your-deployed-url.com/api/process",
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

## Key Features

- 100% offline operation (no external AI/API calls)
- Rule-based NLP using comprehensive keyword dataset
- Automatic email alerts for emergency incidents
- Incident logging for audit trail
- SpeakSpace-compliant response format
- Comprehensive error handling
