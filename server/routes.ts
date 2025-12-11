import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { analyzeText, initializeRuleEngine } from "./ruleEngine";
import { generateReport } from "./reportGenerator";
import { sendEmergencyReport, initializeEmailService } from "./emailService";
import { logIncident, initializeLogger, getIncidents } from "./incidentLogger";

const processRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  note_id: z.string().min(1, "Note ID is required"),
  timestamp: z.string().min(1, "Timestamp is required")
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  initializeRuleEngine();
  initializeEmailService();
  initializeLogger();
  
  app.post("/api/process", async (req: Request, res: Response) => {
    try {
      const parseResult = processRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({
          status: "error",
          message: `Invalid input: ${parseResult.error.errors.map(e => e.message).join(", ")}`
        });
      }
      
      const { prompt, note_id, timestamp } = parseResult.data;
      
      const analysis = analyzeText(prompt);
      
      const report = generateReport(analysis, note_id, timestamp, prompt);
      
      const emailSent = await sendEmergencyReport(report.formatted_report, analysis.severity);
      
      logIncident({
        report_id: report.report_id,
        note_id,
        timestamp,
        severity: analysis.severity,
        harassment_type: analysis.harassment_type,
        risk_score: analysis.risk_score,
        needs_emergency_response: analysis.needs_emergency_response,
        input_preview: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
        email_sent: emailSent
      });
      
      console.log(`[API] Processed incident: ${report.report_id} | Severity: ${analysis.severity} | Email sent: ${emailSent}`);
      
      return res.status(200).json({
        status: "success",
        message: "Workflow executed"
      });
      
    } catch (error) {
      console.error("[API] Error processing request:", error);
      return res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });
  
  app.get("/api/health", (_req: Request, res: Response) => {
    return res.status(200).json({
      status: "healthy",
      service: "SpeakSpace Emergency Detection API",
      timestamp: new Date().toISOString()
    });
  });
  
  app.get("/api/incidents", (_req: Request, res: Response) => {
    try {
      const incidents = getIncidents();
      return res.status(200).json({
        status: "success",
        count: incidents.length,
        incidents
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve incidents"
      });
    }
  });

  return httpServer;
}
