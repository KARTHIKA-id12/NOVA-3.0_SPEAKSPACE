import { readFileSync } from "fs";
import { join } from "path";

interface Dataset {
  harassment_categories: Record<string, string[]>;
  critical_flags: string[];
  emotion_fear_indicators: string[];
  location_indicators: string[];
  time_indicators: string[];
  behavior_patterns: string[];
  victim_vulnerability_factors: string[];
  severity_scoring: {
    weights: {
      critical_keywords: number;
      high_keywords: number;
      emotion_keywords: number;
      location_night_bonus: number;
      vulnerability_bonus: number;
      follow_keyword_bonus: number;
    };
    critical_keywords: string[];
    high_keywords: string[];
  };
  recommended_actions_bank: Record<string, string[]>;
  confidence_rules: {
    base_confidence: number;
    boosts: {
      critical_keyword_present: number;
      multiple_category_matches: number;
      emotion_present: number;
      location_detected: number;
      vulnerability_present: number;
    };
  };
  safe_defaults: {
    severity: string;
    harassment_type: string;
    victim_risk: string;
    description: string;
    summary: string;
    recommended_immediate_actions: string[];
    location_detected: string;
    confidence_score: number;
    needs_emergency_response: boolean;
  };
}

export interface AnalysisResult {
  harassment_type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  victim_risk: "Critical" | "High" | "Medium" | "Low";
  emotion_detected: string[];
  danger_signals: string[];
  location_detected: string;
  risk_score: number;
  confidence_score: number;
  needs_emergency_response: boolean;
  recommended_actions: string[];
  summary: string;
  description: string;
  matched_categories: Record<string, number>;
}

let dataset: Dataset | null = null;

function loadDataset(): Dataset {
  if (dataset) return dataset;
  
  const dataPath = join(process.cwd(), "server", "data", "safety_nlp_dataset.json");
  const rawData = readFileSync(dataPath, "utf-8");
  dataset = JSON.parse(rawData) as Dataset;
  return dataset;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(text: string, keywords: string[]): number {
  const normalizedText = normalizeText(text);
  let count = 0;
  
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (normalizedText.includes(normalizedKeyword)) {
      count++;
    }
  }
  
  return count;
}

function findMatches(text: string, keywords: string[]): string[] {
  const normalizedText = normalizeText(text);
  const matches: string[] = [];
  
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (normalizedText.includes(normalizedKeyword)) {
      matches.push(keyword);
    }
  }
  
  return matches;
}

function detectHarassmentType(text: string, data: Dataset): { type: string; matches: Record<string, number> } {
  const categories = data.harassment_categories;
  const matchCounts: Record<string, number> = {};
  
  for (const [category, keywords] of Object.entries(categories)) {
    matchCounts[category] = countMatches(text, keywords);
  }
  
  let maxCategory = "unknown";
  let maxCount = 0;
  
  for (const [category, count] of Object.entries(matchCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxCategory = category;
    }
  }
  
  return { type: maxCategory, matches: matchCounts };
}

function calculateSeverityScore(text: string, data: Dataset): number {
  const weights = data.severity_scoring.weights;
  let score = 0;
  
  const criticalMatches = countMatches(text, data.severity_scoring.critical_keywords);
  score += criticalMatches * weights.critical_keywords;
  
  const highMatches = countMatches(text, data.severity_scoring.high_keywords);
  score += highMatches * weights.high_keywords;
  
  const emotionMatches = countMatches(text, data.emotion_fear_indicators);
  score += emotionMatches * weights.emotion_keywords;
  
  const timeMatches = countMatches(text, data.time_indicators);
  if (timeMatches > 0) {
    score += weights.location_night_bonus;
  }
  
  const vulnerabilityMatches = countMatches(text, data.victim_vulnerability_factors);
  if (vulnerabilityMatches > 0) {
    score += weights.vulnerability_bonus;
  }
  
  const followMatches = countMatches(text, ["follow", "following", "followed"]);
  if (followMatches > 0) {
    score += weights.follow_keyword_bonus;
  }
  
  return score;
}

function scoreToSeverity(score: number): "Critical" | "High" | "Medium" | "Low" {
  if (score >= 10) return "Critical";
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}

function calculateConfidence(
  text: string,
  data: Dataset,
  hasCriticalKeyword: boolean,
  multipleCategoryMatches: boolean,
  hasEmotion: boolean,
  hasLocation: boolean,
  hasVulnerability: boolean
): number {
  const rules = data.confidence_rules;
  let confidence = rules.base_confidence;
  
  if (hasCriticalKeyword) {
    confidence += rules.boosts.critical_keyword_present;
  }
  if (multipleCategoryMatches) {
    confidence += rules.boosts.multiple_category_matches;
  }
  if (hasEmotion) {
    confidence += rules.boosts.emotion_present;
  }
  if (hasLocation) {
    confidence += rules.boosts.location_detected;
  }
  if (hasVulnerability) {
    confidence += rules.boosts.vulnerability_present;
  }
  
  return Math.min(confidence, 0.99);
}

function detectLocation(text: string, data: Dataset): string {
  const locations = findMatches(text, data.location_indicators);
  return locations.length > 0 ? locations[0] : "unknown";
}

function generateSummary(text: string, harassmentType: string, severity: string): string {
  const words = text.split(/\s+/).slice(0, 15);
  const truncated = words.join(" ");
  const suffix = words.length >= 15 ? "..." : "";
  
  return `${severity} ${harassmentType.replace(/_/g, " ")} incident reported: "${truncated}${suffix}"`;
}

function generateDescription(
  harassmentType: string,
  severity: string,
  emotionsDetected: string[],
  locationDetected: string,
  dangerSignals: string[]
): string {
  let description = `User reports ${harassmentType.replace(/_/g, " ")} incident with ${severity.toLowerCase()} severity level.`;
  
  if (emotionsDetected.length > 0) {
    description += ` User appears ${emotionsDetected.slice(0, 3).join(", ")}.`;
  }
  
  if (locationDetected !== "unknown") {
    description += ` Location: ${locationDetected}.`;
  }
  
  if (dangerSignals.length > 0) {
    description += ` Warning signals: ${dangerSignals.slice(0, 3).join(", ")}.`;
  }
  
  return description;
}

export function analyzeText(prompt: string): AnalysisResult {
  const data = loadDataset();
  
  const { type: harassmentType, matches: matchedCategories } = detectHarassmentType(prompt, data);
  
  const riskScore = calculateSeverityScore(prompt, data);
  const severity = scoreToSeverity(riskScore);
  
  const emotionsDetected = findMatches(prompt, data.emotion_fear_indicators);
  const dangerSignals = findMatches(prompt, data.critical_flags);
  const locationDetected = detectLocation(prompt, data);
  
  const hasCriticalKeyword = countMatches(prompt, data.severity_scoring.critical_keywords) > 0;
  const multipleCategoryMatches = Object.values(matchedCategories).filter(c => c > 0).length > 1;
  const hasEmotion = emotionsDetected.length > 0;
  const hasLocation = locationDetected !== "unknown";
  const hasVulnerability = countMatches(prompt, data.victim_vulnerability_factors) > 0;
  
  const confidenceScore = calculateConfidence(
    prompt,
    data,
    hasCriticalKeyword,
    multipleCategoryMatches,
    hasEmotion,
    hasLocation,
    hasVulnerability
  );
  
  const needsEmergencyResponse = severity === "Critical" || severity === "High";
  
  const severityKey = severity.toLowerCase() as "critical" | "high" | "medium" | "low";
  const recommendedActions = data.recommended_actions_bank[severityKey] || data.safe_defaults.recommended_immediate_actions;
  
  const summary = generateSummary(prompt, harassmentType, severity);
  const description = generateDescription(harassmentType, severity, emotionsDetected, locationDetected, dangerSignals);
  
  return {
    harassment_type: harassmentType,
    severity,
    victim_risk: severity,
    emotion_detected: emotionsDetected,
    danger_signals: dangerSignals,
    location_detected: locationDetected,
    risk_score: riskScore,
    confidence_score: confidenceScore,
    needs_emergency_response: needsEmergencyResponse,
    recommended_actions: recommendedActions,
    summary,
    description,
    matched_categories: matchedCategories
  };
}

export function initializeRuleEngine(): void {
  loadDataset();
  console.log("[RuleEngine] Dataset loaded successfully");
}
