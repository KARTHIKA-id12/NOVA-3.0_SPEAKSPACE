import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export interface IncidentLog {
  report_id: string;
  note_id: string;
  timestamp: string;
  severity: string;
  harassment_type: string;
  risk_score: number;
  needs_emergency_response: boolean;
  input_preview: string;
  email_sent: boolean;
  sms_sent?: boolean;
  call_made?: boolean;
}

const LOGS_DIR = join(process.cwd(), "logs");
const INCIDENTS_FILE = join(LOGS_DIR, "incidents.json");

export function initializeLogger(): void {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
    console.log("[Logger] Created logs directory");
  }

  if (!existsSync(INCIDENTS_FILE)) {
    writeFileSync(INCIDENTS_FILE, JSON.stringify([], null, 2));
    console.log("[Logger] Created incidents.json file");
  }

  console.log("[Logger] Incident logger initialized");
}

export function logIncident(incident: IncidentLog): void {
  try {
    let incidents: IncidentLog[] = [];

    if (existsSync(INCIDENTS_FILE)) {
      const data = readFileSync(INCIDENTS_FILE, "utf-8");
      incidents = JSON.parse(data);
    }

    incidents.push(incident);

    writeFileSync(INCIDENTS_FILE, JSON.stringify(incidents, null, 2));
    console.log(`[Logger] Incident logged: ${incident.report_id}`);
  } catch (error) {
    console.error("[Logger] Failed to log incident:", error);
  }
}

export function getIncidents(): IncidentLog[] {
  try {
    if (!existsSync(INCIDENTS_FILE)) {
      return [];
    }

    const data = readFileSync(INCIDENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("[Logger] Failed to read incidents:", error);
    return [];
  }
}

export function getIncidentById(reportId: string): IncidentLog | undefined {
  const incidents = getIncidents();
  return incidents.find(inc => inc.report_id === reportId);
}
