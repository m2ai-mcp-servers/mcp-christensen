/**
 * Case Study Tool
 *
 * Find and apply relevant Christensen case studies to current situations.
 * These canonical examples illustrate key patterns from disruption theory.
 */

import { z } from "zod";
import { CANONICAL_CASES, matchToCaseStudies } from "../frameworks/index.js";
import type { CaseStudyPattern } from "../frameworks/disruption.js";

// ============================================================
// Tool Schema
// ============================================================

export const caseStudySchema = z.object({
  situation: z
    .string()
    .describe("Description of the current situation or challenge"),
  observedSignals: z
    .array(z.string())
    .optional()
    .describe("Specific patterns or signals observed in the situation"),
  caseName: z
    .enum([
      "steel_minimills",
      "disk_drives",
      "milkshake",
      "honda_motorcycles",
      "intel_microprocessors",
    ])
    .optional()
    .describe("Request a specific case study by name"),
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;

// ============================================================
// Case Study Details
// ============================================================

/**
 * Extended case study information for deeper exploration
 */
const CASE_STUDY_EXTENSIONS: Record<string, {
  keyTakeaways: string[];
  commonMisapplications: string[];
  questionsToAsk: string[];
}> = {
  steel_minimills: {
    keyTakeaways: [
      "Asymmetric motivation is the key - incumbents are RELIEVED to cede low-margin segments",
      "The retreat looks rational at every step, but the trajectory leads to disaster",
      "Cost structure differences create permanently different incentives",
      "Quality improvement in the 'inferior' technology is the warning sign",
    ],
    commonMisapplications: [
      "Assuming any low-cost competitor is disruptive (sustaining low-cost is different)",
      "Ignoring the improvement trajectory of the entrant",
      "Forgetting that mini-mills had fundamentally different cost structures, not just lower prices",
    ],
    questionsToAsk: [
      "Does the entrant have a fundamentally different cost structure?",
      "Are incumbents relieved or threatened by losing this segment?",
      "Is the entrant improving along a trajectory toward mainstream needs?",
      "What's the next tier the entrant might target?",
    ],
  },
  disk_drives: {
    keyTakeaways: [
      "Existing customers can actively mislead you about future threats",
      "New value networks have different performance metrics entirely",
      "Being 'worse' on current metrics can mean being 'better' on future metrics",
      "The pattern repeated across 5 generations - it's predictable",
    ],
    commonMisapplications: [
      "Assuming all new form factors are disruptive",
      "Ignoring that disruption requires a new value network, not just new technology",
      "Forgetting the role of enabled applications in driving adoption",
    ],
    questionsToAsk: [
      "What new applications does this enable that weren't possible before?",
      "What performance dimensions matter in this new context?",
      "Are existing customers explicitly saying they don't want this?",
      "What value network would this create or serve?",
    ],
  },
  milkshake: {
    keyTakeaways: [
      "The job, not the customer, is the unit of analysis",
      "Same product can be hired for completely different jobs",
      "Circumstance dramatically changes the job to be done",
      "Competition is defined by the job, not the product category",
    ],
    commonMisapplications: [
      "Treating all customer feedback as equivalent regardless of circumstance",
      "Segmenting by demographics instead of jobs",
      "Assuming competitors are other products in the same category",
    ],
    questionsToAsk: [
      "What job is being done in THIS specific circumstance?",
      "What would the customer hire if your product didn't exist?",
      "Are there different jobs for different times/places/contexts?",
      "What are the functional, emotional, and social dimensions?",
    ],
  },
  honda_motorcycles: {
    keyTakeaways: [
      "Initial strategy hypotheses are often wrong",
      "Markets teach you your strategy if you're willing to learn",
      "Unexpected customer segments can be more valuable than target segments",
      "Creating a new category avoids head-to-head competition",
    ],
    commonMisapplications: [
      "Using this to justify pivoting without market evidence",
      "Ignoring the discipline Honda had in their original approach",
      "Forgetting that Honda eventually did move upmarket successfully",
    ],
    questionsToAsk: [
      "What unexpected demand are you seeing?",
      "Who is buying that you didn't expect?",
      "What are they using it for that you didn't anticipate?",
      "Are you willing to follow the market's teaching?",
    ],
  },
  intel_microprocessors: {
    keyTakeaways: [
      "Processes transfer; resources don't guarantee success",
      "Capability migration requires recognizing what you're actually good at",
      "The underlying skill matters more than the specific product",
      "Priorities must shift to enable the transition",
    ],
    commonMisapplications: [
      "Assuming any adjacent market is accessible",
      "Focusing on resources without examining processes",
      "Ignoring the difficulty of priority shifts",
    ],
    questionsToAsk: [
      "What processes have you developed that could transfer?",
      "What are you actually good at, underneath the current product?",
      "Would your priorities allow you to invest in this new direction?",
      "Is there a clear path from current capabilities to the new opportunity?",
    ],
  },
};

// ============================================================
// Tool Implementation
// ============================================================

/**
 * Get detailed case study information
 */
function getCaseStudyDetail(caseName: string): string {
  const caseStudy = CANONICAL_CASES[caseName];
  const extension = CASE_STUDY_EXTENSIONS[caseName];

  if (!caseStudy) {
    return `Case study "${caseName}" not found.`;
  }

  return `
# ${caseStudy.name}

## Pattern
**${caseStudy.pattern}**

## The Story
${caseStudy.story}

## Signals That Match This Pattern
${caseStudy.signals.map((s) => `- ${s}`).join("\n")}

## Key Takeaways
${extension.keyTakeaways.map((t) => `- ${t}`).join("\n")}

## Common Misapplications
${extension.commonMisapplications.map((m) => `- ${m}`).join("\n")}

## Questions to Ask
${extension.questionsToAsk.map((q) => `- ${q}`).join("\n")}

## Lesson for Today
${caseStudy.lessonsForToday}
`.trim();
}

/**
 * Match situation to case studies and provide analysis
 */
function matchSituationToCases(
  situation: string,
  signals: string[]
): string {
  // Get matches from the framework
  const matches = matchToCaseStudies(signals);

  // Also do text-based matching on the situation description
  const situationLower = situation.toLowerCase();
  const additionalMatches: string[] = [];

  // Check for pattern indicators in the situation
  if (situationLower.includes("cost") || situationLower.includes("cheap") || situationLower.includes("low-end")) {
    if (!matches.some((m) => m.name === "Steel Mini-Mills")) {
      additionalMatches.push("steel_minimills");
    }
  }
  if (situationLower.includes("new market") || situationLower.includes("form factor") || situationLower.includes("portable")) {
    if (!matches.some((m) => m.name === "Disk Drive Generations")) {
      additionalMatches.push("disk_drives");
    }
  }
  if (situationLower.includes("job") || situationLower.includes("hire") || situationLower.includes("circumstance")) {
    if (!matches.some((m) => m.name === "The Milkshake Story")) {
      additionalMatches.push("milkshake");
    }
  }
  if (situationLower.includes("pivot") || situationLower.includes("unexpected") || situationLower.includes("surprise")) {
    if (!matches.some((m) => m.name === "Honda Motorcycles in America")) {
      additionalMatches.push("honda_motorcycles");
    }
  }
  if (situationLower.includes("capability") || situationLower.includes("process") || situationLower.includes("declining")) {
    if (!matches.some((m) => m.name === "Intel's Pivot to Microprocessors")) {
      additionalMatches.push("intel_microprocessors");
    }
  }

  // Build response
  let response = `
# Case Study Analysis

## Your Situation
${situation}

## Observed Signals
${signals.length > 0 ? signals.map((s) => `- ${s}`).join("\n") : "No specific signals provided."}

---

## Matched Case Studies

`;

  if (matches.length > 0) {
    response += matches
      .map(
        (m) => `
### ${m.name}
**Pattern**: ${m.pattern}
**Relevance**: ${m.relevance}
**Match Strength**: ${m.matchStrength}

${getCaseStudyDetail(Object.keys(CANONICAL_CASES).find((k) => CANONICAL_CASES[k].name === m.name) ?? "")}
`
      )
      .join("\n---\n");
  } else {
    response += `
No strong matches based on the signals provided.

Consider exploring these cases to find the best pattern match:
${additionalMatches.map((c) => `- ${CANONICAL_CASES[c]?.name}: ${CANONICAL_CASES[c]?.pattern}`).join("\n")}
`;
  }

  response += `
---

## How to Apply This

When you've identified a matching pattern, ask:
1. What made the historical actors succeed or fail?
2. What's similar about your situation?
3. What's different that might change the outcome?
4. What would Christensen's theory predict for your case?

Remember: Theory predicts patterns, not specific outcomes. Use these cases
to sharpen your thinking, not as rigid prescriptions.
`;

  return response.trim();
}

/**
 * Execute the case-study tool
 */
export async function findCaseStudy(input: CaseStudyInput): Promise<string> {
  const validated = caseStudySchema.parse(input);

  // If specific case requested, return that
  if (validated.caseName) {
    return getCaseStudyDetail(validated.caseName);
  }

  // Otherwise, match situation to cases
  return matchSituationToCases(
    validated.situation,
    validated.observedSignals ?? []
  );
}

/**
 * List all available case studies
 */
export function listCaseStudies(): string {
  return `
# Christensen Canonical Case Studies

These five cases illustrate the core patterns of disruption theory:

## 1. Steel Mini-Mills
**Pattern**: Low-end disruption with asymmetric motivation
**Key Lesson**: Incumbents rationally retreat from low-margin segments, enabling entrants to build capabilities for upmarket assault.

## 2. Disk Drive Generations
**Pattern**: New-market disruption with different value network
**Key Lesson**: Being "worse" on existing metrics but enabling new applications creates new markets that eventually subsume old ones.

## 3. The Milkshake Story
**Pattern**: Jobs-to-be-done discovery through circumstance
**Key Lesson**: Same product, different jobs, different competitors. The job is the unit of analysis.

## 4. Honda Motorcycles in America
**Pattern**: Emergent strategy through market learning
**Key Lesson**: Markets teach you your strategy. Listen to unexpected demand.

## 5. Intel's Pivot to Microprocessors
**Pattern**: Capability migration through process investment
**Key Lesson**: Processes transfer more reliably than resources. Know what you're actually good at.

---

Use the case_study tool with a specific caseName to explore any of these in depth,
or describe your situation to find the most relevant pattern.
`.trim();
}

/**
 * Get the tool definition for MCP
 */
export function getCaseStudyToolDefinition() {
  return {
    name: "case_study",
    description: `Find and explore Christensen's canonical case studies.

These cases illustrate key patterns from disruption theory:
- Steel Mini-Mills: Low-end disruption
- Disk Drives: New-market disruption
- Milkshake: Jobs-to-be-done
- Honda Motorcycles: Emergent strategy
- Intel: Capability migration

Use this to:
- Find patterns matching your current situation
- Deep-dive into a specific case study
- Learn the lessons and common misapplications
- Get diagnostic questions for your situation`,
    inputSchema: {
      type: "object" as const,
      properties: {
        situation: {
          type: "string",
          description: "Description of the current situation to match against case studies",
        },
        observedSignals: {
          type: "array",
          items: { type: "string" },
          description: "Specific patterns or signals observed",
        },
        caseName: {
          type: "string",
          enum: [
            "steel_minimills",
            "disk_drives",
            "milkshake",
            "honda_motorcycles",
            "intel_microprocessors",
          ],
          description: "Request a specific case study by name",
        },
      },
      required: ["situation"],
    },
  };
}
