/**
 * Fidelity Check - Validate Christensen Persona Outputs
 *
 * Checks that outputs meet the persona's fidelity markers:
 * - Must include: Framework references, JTBD questions, humility, case studies
 * - Should include: Stories, uncertainty, multiple frameworks
 * - Must avoid: Overconfidence, dismissiveness, generic advice
 */

import { getValidationMarkers } from "../persona-loader.js";

// ============================================================
// Fidelity Markers
// ============================================================

/**
 * Patterns that indicate high-fidelity Christensen output
 */
export const POSITIVE_PATTERNS = {
  // Framework references
  frameworkReference: [
    /jobs?[- ]to[- ]be[- ]done/i,
    /jtbd/i,
    /disruption/i,
    /disruptive/i,
    /sustaining/i,
    /capabilities[,\s]+processes[,\s]+(?:and\s+)?priorities/i,
    /cpp/i,
    /resource dependence/i,
  ],

  // Questions about job to be done
  jtbdQuestion: [
    /what job/i,
    /hiring.*(?:product|solution|this)/i,
    /functional.*emotional.*social/i,
    /circumstance/i,
    /what are they firing/i,
  ],

  // Humility markers
  humility: [
    /theory (?:would |might )?(?:suggest|predict)/i,
    /I'?ve seen this pattern/i,
    /help me understand/i,
    /the question (?:is|might be)/i,
    /appropriate uncertainty/i,
    /might be different/i,
    /depends on/i,
  ],

  // Case study references
  caseStudy: [
    /mini[- ]?mills?/i,
    /steel/i,
    /disk drive/i,
    /milkshake/i,
    /honda/i,
    /intel/i,
    /microprocessor/i,
  ],

  // Organizational constraints
  constraints: [
    /resource provider/i,
    /business model/i,
    /priorit(?:y|ies)/i,
    /process(?:es)?/i,
    /what would need to change/i,
  ],

  // Stories/examples
  story: [
    /let me (?:tell you|share)/i,
    /story/i,
    /example/i,
    /I'?m reminded of/i,
    /consider (?:the case|how)/i,
  ],
};

/**
 * Patterns that indicate LOW-fidelity (anti-patterns)
 *
 * Note: Some words like "stupid" appear in Christensen's empathetic phrases
 * like "It's not that managers are stupid - they're rational"
 * These are excluded from anti-pattern matching.
 */
export const NEGATIVE_PATTERNS = {
  // Overconfidence
  overconfidence: [
    /\bwill definitely\b/i,
    /\bwill certainly\b/i,
    /\bguaranteed\b/i,
    /\bwill always\b/i,
    /\bno doubt\b/i,
    /\b100%\b/,
  ],

  // Dismissiveness - exclude Christensen's empathetic usage
  dismissive: [
    /(?<!not that[^.]*)\bstupid\b(?![^.]*rational)/i, // Exclude "not that...stupid...rational"
    /\bobviously wrong\b/i,
    /\bterrible idea\b/i,
    /\bthat'?s (?:dumb|idiotic)\b/i,
    /\byou'?re wrong\b/i,
  ],

  // Generic advice (without theory grounding)
  generic: [
    /\bjust focus on execution\b/i,
    /\bhere'?s a \d+[- ]step plan\b/i,
    /\bbest practices say\b/i,
    /\bindustry standard\b/i,
  ],
};

// ============================================================
// Fidelity Scoring
// ============================================================

export interface FidelityScore {
  overall: number; // 0-100
  breakdown: {
    frameworkReference: { found: boolean; matches: string[] };
    jtbdQuestion: { found: boolean; matches: string[] };
    humility: { found: boolean; matches: string[] };
    caseStudy: { found: boolean; matches: string[] };
    constraints: { found: boolean; matches: string[] };
    story: { found: boolean; matches: string[] };
  };
  antiPatterns: {
    overconfidence: { found: boolean; matches: string[] };
    dismissive: { found: boolean; matches: string[] };
    generic: { found: boolean; matches: string[] };
  };
  mustIncludeScore: number; // 0-5 (5 required markers)
  shouldIncludeScore: number; // 0-4 (4 recommended markers)
  antiPatternPenalty: number; // 0-30 (penalty for bad patterns)
  passed: boolean;
}

/**
 * Check if "stupid" appears in Christensen's empathetic context
 * "It's not that managers are stupid - they're rational"
 */
function isChristensenStupidContext(text: string): boolean {
  const empathyPattern = /not that[^.]*stupid[^.]*rational/i;
  const validationPattern = /dismissing[^.]*stupid/i;
  return empathyPattern.test(text) || validationPattern.test(text);
}

/**
 * Find all matches for a set of patterns
 */
function findMatches(text: string, patterns: RegExp[], category?: string): string[] {
  const matches: string[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Special case: "stupid" in Christensen's empathetic context is OK
      if (category === "dismissive" && match[0].toLowerCase().includes("stupid")) {
        if (isChristensenStupidContext(text)) {
          continue; // Skip this match - it's in valid context
        }
      }
      matches.push(match[0]);
    }
  }
  return matches;
}

/**
 * Calculate fidelity score for an output
 */
export function calculateFidelityScore(output: string): FidelityScore {
  // Check positive patterns
  const breakdown = {
    frameworkReference: {
      found: false,
      matches: findMatches(output, POSITIVE_PATTERNS.frameworkReference),
    },
    jtbdQuestion: {
      found: false,
      matches: findMatches(output, POSITIVE_PATTERNS.jtbdQuestion),
    },
    humility: {
      found: false,
      matches: findMatches(output, POSITIVE_PATTERNS.humility),
    },
    caseStudy: {
      found: false,
      matches: findMatches(output, POSITIVE_PATTERNS.caseStudy),
    },
    constraints: {
      found: false,
      matches: findMatches(output, POSITIVE_PATTERNS.constraints),
    },
    story: {
      found: false,
      matches: findMatches(output, POSITIVE_PATTERNS.story),
    },
  };

  // Mark as found if any matches
  for (const key of Object.keys(breakdown) as (keyof typeof breakdown)[]) {
    breakdown[key].found = breakdown[key].matches.length > 0;
  }

  // Check anti-patterns (pass category for special handling)
  const antiPatterns = {
    overconfidence: {
      found: false,
      matches: findMatches(output, NEGATIVE_PATTERNS.overconfidence, "overconfidence"),
    },
    dismissive: {
      found: false,
      matches: findMatches(output, NEGATIVE_PATTERNS.dismissive, "dismissive"),
    },
    generic: {
      found: false,
      matches: findMatches(output, NEGATIVE_PATTERNS.generic),
    },
  };

  for (const key of Object.keys(antiPatterns) as (keyof typeof antiPatterns)[]) {
    antiPatterns[key].found = antiPatterns[key].matches.length > 0;
  }

  // Calculate scores
  // Must include (5 items, 10 points each = 50 max)
  const mustIncludeItems = [
    breakdown.frameworkReference.found,
    breakdown.jtbdQuestion.found,
    breakdown.humility.found,
    breakdown.caseStudy.found,
    breakdown.constraints.found,
  ];
  const mustIncludeScore = mustIncludeItems.filter(Boolean).length;

  // Should include (story, multiple frameworks, uncertainty = 4 items, 10 points each)
  const shouldIncludeItems = [
    breakdown.story.found,
    breakdown.frameworkReference.matches.length > 1, // Multiple frameworks
    breakdown.humility.matches.length > 1, // Multiple humility markers
    breakdown.jtbdQuestion.matches.length > 0 && breakdown.constraints.found,
  ];
  const shouldIncludeScore = shouldIncludeItems.filter(Boolean).length;

  // Anti-pattern penalty (10 points each)
  const antiPatternPenalty =
    (antiPatterns.overconfidence.found ? 10 : 0) +
    (antiPatterns.dismissive.found ? 15 : 0) + // Dismissive is worse
    (antiPatterns.generic.found ? 5 : 0);

  // Calculate overall score
  const rawScore = mustIncludeScore * 10 + shouldIncludeScore * 10;
  const overall = Math.max(0, Math.min(100, rawScore - antiPatternPenalty));

  // Pass if: all must-includes present AND no major anti-patterns
  const passed =
    mustIncludeScore >= 4 && // At least 4 of 5 must-includes
    !antiPatterns.dismissive.found && // Never dismissive
    !antiPatterns.overconfidence.found; // Never overconfident

  return {
    overall,
    breakdown,
    antiPatterns,
    mustIncludeScore,
    shouldIncludeScore,
    antiPatternPenalty,
    passed,
  };
}

/**
 * Format fidelity score for display
 */
export function formatFidelityReport(score: FidelityScore): string {
  const status = score.passed ? "✓ PASSED" : "✗ FAILED";

  let report = `
# Fidelity Check: ${status}

**Overall Score**: ${score.overall}/100

## Must Include (${score.mustIncludeScore}/5)

| Marker | Found | Examples |
|--------|-------|----------|
| Framework Reference | ${score.breakdown.frameworkReference.found ? "✓" : "✗"} | ${score.breakdown.frameworkReference.matches.slice(0, 2).join(", ") || "-"} |
| JTBD Question | ${score.breakdown.jtbdQuestion.found ? "✓" : "✗"} | ${score.breakdown.jtbdQuestion.matches.slice(0, 2).join(", ") || "-"} |
| Humility | ${score.breakdown.humility.found ? "✓" : "✗"} | ${score.breakdown.humility.matches.slice(0, 2).join(", ") || "-"} |
| Case Study | ${score.breakdown.caseStudy.found ? "✓" : "✗"} | ${score.breakdown.caseStudy.matches.slice(0, 2).join(", ") || "-"} |
| Constraints | ${score.breakdown.constraints.found ? "✓" : "✗"} | ${score.breakdown.constraints.matches.slice(0, 2).join(", ") || "-"} |

## Should Include (${score.shouldIncludeScore}/4)

| Marker | Found |
|--------|-------|
| Story/Example | ${score.breakdown.story.found ? "✓" : "✗"} |
| Multiple Frameworks | ${score.breakdown.frameworkReference.matches.length > 1 ? "✓" : "✗"} |
| Multiple Humility Markers | ${score.breakdown.humility.matches.length > 1 ? "✓" : "✗"} |
| Combined Analysis | ${score.breakdown.jtbdQuestion.found && score.breakdown.constraints.found ? "✓" : "✗"} |

## Anti-Patterns (${score.antiPatternPenalty} point penalty)

| Pattern | Found | Examples |
|---------|-------|----------|
| Overconfidence | ${score.antiPatterns.overconfidence.found ? "⚠️" : "✓"} | ${score.antiPatterns.overconfidence.matches.join(", ") || "-"} |
| Dismissive | ${score.antiPatterns.dismissive.found ? "⚠️" : "✓"} | ${score.antiPatterns.dismissive.matches.join(", ") || "-"} |
| Generic Advice | ${score.antiPatterns.generic.found ? "⚠️" : "✓"} | ${score.antiPatterns.generic.matches.join(", ") || "-"} |
`.trim();

  return report;
}

/**
 * Quick check if output passes fidelity requirements
 */
export function checkFidelity(output: string): boolean {
  return calculateFidelityScore(output).passed;
}
