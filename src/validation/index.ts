/**
 * Validation Module - Barrel Export
 */

export {
  calculateFidelityScore,
  formatFidelityReport,
  checkFidelity,
  POSITIVE_PATTERNS,
  NEGATIVE_PATTERNS,
} from "./fidelity-check.js";
export type { FidelityScore } from "./fidelity-check.js";

export {
  DECISION_1_ANTHROPIC,
  DECISION_2_FACTORY,
  DECISION_3_N8N,
  runTestDecision,
  runAllTests,
} from "./test-decisions.js";
export type { TestDecision } from "./test-decisions.js";
