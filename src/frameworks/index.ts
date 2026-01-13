/**
 * Frameworks Module - Barrel Export
 *
 * Exports all Christensen frameworks for use by MCP tools.
 */

// Types
export * from "./types.js";

// Jobs-to-Be-Done Framework
export {
  JTBD_DIAGNOSTIC_QUESTIONS,
  JTBD_FOLLOWUP_QUESTIONS,
  JTBD_VOICE_PHRASES,
  MILKSHAKE_STORY,
  generateJTBDAnalysisPrompt,
  generateJTBDInquiry,
  createEmptyJTBDAnalysis,
  assessJTBDConfidence,
} from "./jobs-to-be-done.js";

// Disruption Theory Framework
export {
  DISRUPTION_DIAGNOSTIC_QUESTIONS,
  CLASSIFICATION_QUESTIONS,
  SUSTAINING_SIGNALS,
  LOW_END_DISRUPTION_SIGNALS,
  NEW_MARKET_DISRUPTION_SIGNALS,
  DISRUPTION_VOICE_PHRASES,
  CANONICAL_CASES,
  generateClassificationPrompt,
  generateDisruptionAnalysisPrompt,
  generateDisruptionInquiry,
  createEmptyDisruptionAnalysis,
  matchToCaseStudies,
} from "./disruption.js";
export type { CaseStudyPattern } from "./disruption.js";

// Capabilities-Processes-Priorities Framework
export {
  CPP_DIAGNOSTIC_QUESTIONS,
  RESOURCE_QUESTIONS,
  PROCESS_QUESTIONS,
  PRIORITIES_QUESTIONS,
  RESOURCE_DEPENDENCE_QUESTIONS,
  CPP_VOICE_PHRASES,
  RESOURCE_DEPENDENCE_VOICE_PHRASES,
  generateCPPAnalysisPrompt,
  generateResourceDependencePrompt,
  generateCPPInquiry,
  generateResourceDependenceInquiry,
  createEmptyCPPAnalysis,
  createEmptyResourceDependenceAnalysis,
  identifyPrimaryBlocker,
} from "./capabilities.js";
