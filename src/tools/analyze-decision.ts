/**
 * Analyze Decision Tool
 *
 * The primary tool for Christensen-style strategic analysis.
 * Takes a business decision and applies all relevant frameworks.
 */

import { z } from "zod";
import {
  generateJTBDAnalysisPrompt,
  generateDisruptionAnalysisPrompt,
  generateCPPAnalysisPrompt,
  generateResourceDependencePrompt,
  matchToCaseStudies,
  JTBD_VOICE_PHRASES,
  DISRUPTION_VOICE_PHRASES,
  CPP_VOICE_PHRASES,
  CANONICAL_CASES,
} from "../frameworks/index.js";
import { generateSystemPrompt, getRandomPhrase } from "../persona-loader.js";

// ============================================================
// Tool Schema
// ============================================================

export const analyzeDecisionSchema = z.object({
  decision: z
    .string()
    .describe("The business decision or situation to analyze"),
  context: z
    .string()
    .optional()
    .describe("Additional context about the organization, market, or situation"),
  organization: z
    .object({
      type: z.string().describe("Type of organization (startup, enterprise, etc.)"),
      size: z.string().optional().describe("Size of organization"),
      industry: z.string().optional().describe("Industry or sector"),
      currentFocus: z.string().optional().describe("Current strategic focus"),
    })
    .optional()
    .describe("Information about the organization"),
  market: z
    .object({
      incumbents: z.array(z.string()).optional().describe("Major incumbents"),
      competitors: z.array(z.string()).optional().describe("Direct competitors"),
      customerSegments: z.array(z.string()).optional().describe("Target customer segments"),
    })
    .optional()
    .describe("Information about the market"),
  focusAreas: z
    .array(z.enum(["jtbd", "disruption", "cpp", "resource-dependence"]))
    .optional()
    .describe("Specific frameworks to focus on (default: all)"),
});

export type AnalyzeDecisionInput = z.infer<typeof analyzeDecisionSchema>;

// ============================================================
// Tool Implementation
// ============================================================

/**
 * Build the analysis prompt combining all frameworks
 */
function buildAnalysisPrompt(input: AnalyzeDecisionInput): string {
  const focusAreas = input.focusAreas ?? [
    "jtbd",
    "disruption",
    "cpp",
    "resource-dependence",
  ];

  // Build context string
  let contextString = input.context ?? "";
  if (input.organization) {
    contextString += `\n\nOrganization: ${input.organization.type}`;
    if (input.organization.size) contextString += `, ${input.organization.size}`;
    if (input.organization.industry)
      contextString += ` in ${input.organization.industry}`;
    if (input.organization.currentFocus)
      contextString += `. Current focus: ${input.organization.currentFocus}`;
  }
  if (input.market) {
    if (input.market.incumbents?.length) {
      contextString += `\n\nKey incumbents: ${input.market.incumbents.join(", ")}`;
    }
    if (input.market.competitors?.length) {
      contextString += `\nDirect competitors: ${input.market.competitors.join(", ")}`;
    }
    if (input.market.customerSegments?.length) {
      contextString += `\nTarget segments: ${input.market.customerSegments.join(", ")}`;
    }
  }

  // Build framework prompts
  const frameworkPrompts: string[] = [];

  if (focusAreas.includes("jtbd")) {
    frameworkPrompts.push(`
## JOBS-TO-BE-DONE ANALYSIS

${generateJTBDAnalysisPrompt(input.decision, contextString)}
`);
  }

  if (focusAreas.includes("disruption")) {
    frameworkPrompts.push(`
## DISRUPTION THEORY ANALYSIS

${generateDisruptionAnalysisPrompt(input.decision, contextString)}
`);
  }

  if (focusAreas.includes("cpp")) {
    frameworkPrompts.push(`
## CAPABILITIES-PROCESSES-PRIORITIES ANALYSIS

${generateCPPAnalysisPrompt(input.decision, contextString)}
`);
  }

  if (focusAreas.includes("resource-dependence")) {
    frameworkPrompts.push(`
## RESOURCE DEPENDENCE ANALYSIS

${generateResourceDependencePrompt(input.decision, contextString)}
`);
  }

  // Combine into full prompt
  return `
# Strategic Decision Analysis

## THE DECISION

${input.decision}

${contextString ? `## CONTEXT\n\n${contextString}` : ""}

---

${frameworkPrompts.join("\n---\n")}

---

## SYNTHESIS

After analyzing through each framework lens, provide:

1. **The Key Insight**: What does theory reveal that might not be obvious?

2. **The Historical Pattern**: Which case study (steel mini-mills, disk drives,
   milkshake, Honda, Intel) most closely matches this situation and why?

3. **The Prediction**: What does theory suggest will happen? Express with
   appropriate uncertainty - "The theory would predict..." not "This will..."

4. **The Consideration**: What factors might make this situation different
   from the historical pattern?

5. **The Questions**: What would you want to understand better before
   offering more definitive guidance?

Remember to maintain Christensen's voice throughout - warm, curious, humble
about predictions, grounded in theory and historical evidence.
`.trim();
}

/**
 * Execute the analyze-decision tool
 */
export async function analyzeDecision(
  input: AnalyzeDecisionInput
): Promise<string> {
  // Validate input
  const validated = analyzeDecisionSchema.parse(input);

  // Get system prompt for persona
  const systemPrompt = generateSystemPrompt();

  // Build analysis prompt
  const analysisPrompt = buildAnalysisPrompt(validated);

  // Find potentially relevant case studies based on any signals in the input
  const inputText = `${validated.decision} ${validated.context ?? ""}`.toLowerCase();
  const potentialSignals: string[] = [];

  // Extract potential signals from input
  if (inputText.includes("cheap") || inputText.includes("low cost") || inputText.includes("budget")) {
    potentialSignals.push("Lower cost structure");
  }
  if (inputText.includes("simple") || inputText.includes("easier")) {
    potentialSignals.push("Simpler solution");
  }
  if (inputText.includes("enterprise") || inputText.includes("upmarket")) {
    potentialSignals.push("Moving upmarket");
  }
  if (inputText.includes("new market") || inputText.includes("non-consumer")) {
    potentialSignals.push("Enables new use cases");
  }
  if (inputText.includes("incumbent") || inputText.includes("established")) {
    potentialSignals.push("Incumbent has high-cost structure");
  }

  const caseMatches = matchToCaseStudies(potentialSignals);

  // Build the response that would be sent to Claude
  // In a real MCP server, this would be the prompt; Claude does the analysis
  const response = `
# Christensen Strategic Analysis Framework

${getRandomPhrase()}

---

## System Context

${systemPrompt}

---

## Analysis Request

${analysisPrompt}

---

## Potentially Relevant Case Studies

${
  caseMatches.length > 0
    ? caseMatches
        .map(
          (c) => `
### ${c.name}
**Pattern**: ${c.pattern}
**Relevance**: ${c.relevance}
**Match Strength**: ${c.matchStrength}
`
        )
        .join("\n")
    : "No strong case study matches detected from initial signals. Deeper analysis may reveal patterns."
}

---

## Framework Reference

Available frameworks for this analysis:
- **Jobs-to-Be-Done**: Understanding what job customers hire products to do
- **Disruption Theory**: Classifying innovations and predicting competitive dynamics
- **Capabilities-Processes-Priorities**: Assessing organizational capability
- **Resource Dependence**: Understanding constraints from resource providers

Apply each relevant framework to provide Christensen-style strategic insight.
`.trim();

  return response;
}

/**
 * Get the tool definition for MCP
 */
export function getAnalyzeDecisionToolDefinition() {
  return {
    name: "analyze_decision",
    description: `Analyze a business decision using Clayton Christensen's frameworks.

Applies Jobs-to-Be-Done, Disruption Theory, Capabilities-Processes-Priorities,
and Resource Dependence analysis to provide strategic insight.

Returns a structured analysis with:
- Framework-specific insights
- Relevant case study patterns
- Theory-based predictions (with appropriate uncertainty)
- Key questions for deeper understanding

Use this when facing strategic decisions about:
- Market entry or expansion
- Product development priorities
- Competitive positioning
- Organizational capability assessment
- Innovation strategy`,
    inputSchema: {
      type: "object" as const,
      properties: {
        decision: {
          type: "string",
          description: "The business decision or situation to analyze",
        },
        context: {
          type: "string",
          description: "Additional context about the organization, market, or situation",
        },
        organization: {
          type: "object",
          properties: {
            type: { type: "string", description: "Type of organization" },
            size: { type: "string", description: "Size of organization" },
            industry: { type: "string", description: "Industry or sector" },
            currentFocus: { type: "string", description: "Current strategic focus" },
          },
          required: ["type"],
        },
        market: {
          type: "object",
          properties: {
            incumbents: {
              type: "array",
              items: { type: "string" },
              description: "Major incumbents",
            },
            competitors: {
              type: "array",
              items: { type: "string" },
              description: "Direct competitors",
            },
            customerSegments: {
              type: "array",
              items: { type: "string" },
              description: "Target customer segments",
            },
          },
        },
        focusAreas: {
          type: "array",
          items: {
            type: "string",
            enum: ["jtbd", "disruption", "cpp", "resource-dependence"],
          },
          description: "Specific frameworks to focus on (default: all)",
        },
      },
      required: ["decision"],
    },
  };
}
