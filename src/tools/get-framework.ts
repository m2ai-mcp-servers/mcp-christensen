/**
 * Get Framework Tool
 *
 * Retrieve detailed information about Christensen's frameworks.
 * Useful for understanding the theory before applying it.
 */

import { z } from "zod";
import {
  JTBD_DIAGNOSTIC_QUESTIONS,
  JTBD_FOLLOWUP_QUESTIONS,
  JTBD_VOICE_PHRASES,
  MILKSHAKE_STORY,
  DISRUPTION_DIAGNOSTIC_QUESTIONS,
  SUSTAINING_SIGNALS,
  LOW_END_DISRUPTION_SIGNALS,
  NEW_MARKET_DISRUPTION_SIGNALS,
  DISRUPTION_VOICE_PHRASES,
  CPP_DIAGNOSTIC_QUESTIONS,
  RESOURCE_QUESTIONS,
  PROCESS_QUESTIONS,
  PRIORITIES_QUESTIONS,
  RESOURCE_DEPENDENCE_QUESTIONS,
  CPP_VOICE_PHRASES,
  RESOURCE_DEPENDENCE_VOICE_PHRASES,
} from "../frameworks/index.js";

// ============================================================
// Tool Schema
// ============================================================

export const getFrameworkSchema = z.object({
  framework: z
    .enum(["jtbd", "disruption", "cpp", "resource-dependence", "all"])
    .describe("Which framework to retrieve information about"),
  detail: z
    .enum(["summary", "full", "questions-only"])
    .optional()
    .default("summary")
    .describe("Level of detail to return"),
});

export type GetFrameworkInput = z.infer<typeof getFrameworkSchema>;

// ============================================================
// Framework Descriptions
// ============================================================

const FRAMEWORK_SUMMARIES = {
  jtbd: `
# Jobs-to-Be-Done Framework

## Core Insight
People don't buy products - they hire them to do a job. The job (functional,
emotional, social) is the unit of analysis for innovation.

## Key Concepts

### The Job
The progress a person is trying to make in a particular circumstance.

**Three Dimensions**:
- **Functional**: What does the customer need to accomplish?
- **Emotional**: How do they want to feel?
- **Social**: How do they want to be perceived?

### Circumstance
The situation matters as much as the customer. The same person hires
different products in different circumstances.

### Competing with Nothing
Often the biggest competitor is non-consumption. Understanding why
people do nothing reveals opportunity.

## When to Use
- Understanding customer needs
- Identifying true competition
- Finding innovation opportunities
- Segmenting markets by job, not demographics
`,

  disruption: `
# Disruption Theory

## Core Insight
Disruption occurs when simpler, cheaper products start at the bottom of
a market or create new markets, then improve until they displace incumbents.

## Key Concepts

### Sustaining Innovation
Improvements along dimensions that existing customers already value.
**Incumbents almost always win sustaining battles.**

### Low-End Disruption
Entrants target overlooked, low-profit segments with "good enough" products.
Incumbents are *relieved* to cede these segments.

### New-Market Disruption
Entrants create markets where none existed by enabling non-consumers.
Product seems like a "toy" to existing customers.

### Asymmetric Motivation
It's not that managers are stupid - they're rational. They pursue what
their resource providers reward. That's why disruption is hard to respond to.

## When to Use
- Assessing competitive threats
- Choosing market entry strategy
- Understanding why incumbents don't respond
- Predicting industry evolution
`,

  cpp: `
# Capabilities-Processes-Priorities Framework

## Core Insight
What an organization CAN do is determined by three layers:
- Resources (what you have) - easiest to change
- Processes (how you work) - hard to change
- Priorities (what you want) - hardest to change

## Key Concepts

### Resources
What the company has: people, technology, cash, relationships, brand.
Most visible but also most easily acquired or lost.

### Processes
How the company does things: patterns of interaction and decision-making.
Enable efficiency but create rigidity. Take years to develop, can't be bought.

### Priorities (Values)
What the company wants: criteria for decision-making.
Shaped by business model. Determine what gets resources.

## The Key Insight
Many failures come from having resources but lacking appropriate
processes or priorities for new opportunities.

## When to Use
- Assessing organizational capability for new opportunities
- Understanding why "having the resources" isn't enough
- Identifying what would need to change (not just what to acquire)
`,

  "resource-dependence": `
# Resource Dependence Theory

## Core Insight
Companies depend on customers and investors for resources. This dependence
shapes what opportunities they can pursue.

## The Tragedy
It's not that managers are stupid - they're rational. They pursue what
their resource providers reward. That's why disruption is so hard to
respond to - the rational thing is to ignore it.

## Key Dynamics
- Best customers want sustaining innovation
- Investors want growth in existing businesses
- Managers respond to resource providers
- Disruptive opportunities look unattractive

## How This Creates Blindspots
- Disruptive opportunities have lower margins
- New markets seem too small
- Existing customers explicitly don't want it
- The rational choice is to focus elsewhere

## When to Use
- Understanding why organizations resist change
- Predicting what opportunities will be ignored
- Designing strategies to navigate constraints
- Creating separate units with different resource providers
`,
};

// ============================================================
// Detailed Framework Information
// ============================================================

function getJTBDFull(): string {
  return `
${FRAMEWORK_SUMMARIES.jtbd}

---

## Diagnostic Questions

${JTBD_DIAGNOSTIC_QUESTIONS.map((q) => `- **[${q.importance}]** ${q.question}`).join("\n")}

### Follow-up Questions by Dimension

**Functional**:
${JTBD_FOLLOWUP_QUESTIONS.functional.map((q) => `- ${q.question}`).join("\n")}

**Emotional**:
${JTBD_FOLLOWUP_QUESTIONS.emotional.map((q) => `- ${q.question}`).join("\n")}

**Social**:
${JTBD_FOLLOWUP_QUESTIONS.social.map((q) => `- ${q.question}`).join("\n")}

**Circumstance**:
${JTBD_FOLLOWUP_QUESTIONS.circumstance.map((q) => `- ${q.question}`).join("\n")}

---

## Canonical Example: The Milkshake Story

${MILKSHAKE_STORY.story}

**Key Lesson**: ${MILKSHAKE_STORY.lesson}

---

## Christensen's Voice on JTBD

${JTBD_VOICE_PHRASES.map((p) => `> "${p}"`).join("\n\n")}
`.trim();
}

function getDisruptionFull(): string {
  return `
${FRAMEWORK_SUMMARIES.disruption}

---

## Classification Signals

### Sustaining Innovation Signals
${SUSTAINING_SIGNALS.map((s) => `- ${s}`).join("\n")}

### Low-End Disruption Signals
${LOW_END_DISRUPTION_SIGNALS.map((s) => `- ${s}`).join("\n")}

### New-Market Disruption Signals
${NEW_MARKET_DISRUPTION_SIGNALS.map((s) => `- ${s}`).join("\n")}

---

## Diagnostic Questions

${DISRUPTION_DIAGNOSTIC_QUESTIONS.map((q) => `- **[${q.importance}]** ${q.question}`).join("\n")}

---

## Christensen's Voice on Disruption

${DISRUPTION_VOICE_PHRASES.map((p) => `> "${p}"`).join("\n\n")}
`.trim();
}

function getCPPFull(): string {
  return `
${FRAMEWORK_SUMMARIES.cpp}

---

## Diagnostic Questions

### Overall CPP Assessment
${CPP_DIAGNOSTIC_QUESTIONS.map((q) => `- **[${q.importance}]** ${q.question}`).join("\n")}

### Resource-Specific Questions
${RESOURCE_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}

### Process-Specific Questions
${PROCESS_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}

### Priorities-Specific Questions
${PRIORITIES_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}

---

## Christensen's Voice on CPP

${CPP_VOICE_PHRASES.map((p) => `> "${p}"`).join("\n\n")}
`.trim();
}

function getResourceDependenceFull(): string {
  return `
${FRAMEWORK_SUMMARIES["resource-dependence"]}

---

## Diagnostic Questions

${RESOURCE_DEPENDENCE_QUESTIONS.map((q) => `- **[${q.importance}]** ${q.question}`).join("\n")}

---

## Christensen's Voice on Resource Dependence

${RESOURCE_DEPENDENCE_VOICE_PHRASES.map((p) => `> "${p}"`).join("\n\n")}
`.trim();
}

function getQuestionsOnly(framework: string): string {
  switch (framework) {
    case "jtbd":
      return `
# Jobs-to-Be-Done: Key Questions

${JTBD_DIAGNOSTIC_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}
`.trim();
    case "disruption":
      return `
# Disruption Theory: Key Questions

${DISRUPTION_DIAGNOSTIC_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}
`.trim();
    case "cpp":
      return `
# Capabilities-Processes-Priorities: Key Questions

${CPP_DIAGNOSTIC_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}
`.trim();
    case "resource-dependence":
      return `
# Resource Dependence: Key Questions

${RESOURCE_DEPENDENCE_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}
`.trim();
    default:
      return "Unknown framework";
  }
}

// ============================================================
// Tool Implementation
// ============================================================

/**
 * Get framework information
 */
export async function getFramework(input: GetFrameworkInput): Promise<string> {
  const validated = getFrameworkSchema.parse(input);

  if (validated.framework === "all") {
    if (validated.detail === "questions-only") {
      return `
# All Christensen Frameworks: Key Questions

## Jobs-to-Be-Done
${JTBD_DIAGNOSTIC_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}

## Disruption Theory
${DISRUPTION_DIAGNOSTIC_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}

## Capabilities-Processes-Priorities
${CPP_DIAGNOSTIC_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}

## Resource Dependence
${RESOURCE_DEPENDENCE_QUESTIONS.map((q) => `- ${q.question}`).join("\n")}
`.trim();
    }

    return `
${FRAMEWORK_SUMMARIES.jtbd}

---

${FRAMEWORK_SUMMARIES.disruption}

---

${FRAMEWORK_SUMMARIES.cpp}

---

${FRAMEWORK_SUMMARIES["resource-dependence"]}
`.trim();
  }

  if (validated.detail === "questions-only") {
    return getQuestionsOnly(validated.framework);
  }

  if (validated.detail === "full") {
    switch (validated.framework) {
      case "jtbd":
        return getJTBDFull();
      case "disruption":
        return getDisruptionFull();
      case "cpp":
        return getCPPFull();
      case "resource-dependence":
        return getResourceDependenceFull();
    }
  }

  // Default: summary
  return FRAMEWORK_SUMMARIES[validated.framework] ?? "Unknown framework";
}

/**
 * Get the tool definition for MCP
 */
export function getFrameworkToolDefinition() {
  return {
    name: "get_framework",
    description: `Get information about Christensen's strategic frameworks.

Available frameworks:
- jtbd: Jobs-to-Be-Done theory
- disruption: Disruption Theory
- cpp: Capabilities-Processes-Priorities
- resource-dependence: Resource Dependence Theory
- all: Overview of all frameworks

Detail levels:
- summary: Core concepts and when to use
- full: Complete framework with questions and examples
- questions-only: Just the diagnostic questions`,
    inputSchema: {
      type: "object" as const,
      properties: {
        framework: {
          type: "string",
          enum: ["jtbd", "disruption", "cpp", "resource-dependence", "all"],
          description: "Which framework to retrieve",
        },
        detail: {
          type: "string",
          enum: ["summary", "full", "questions-only"],
          description: "Level of detail (default: summary)",
        },
      },
      required: ["framework"],
    },
  };
}
