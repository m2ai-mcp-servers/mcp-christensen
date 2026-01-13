/**
 * Capabilities-Processes-Priorities (CPP) Framework Implementation
 *
 * Core insight: What an organization CAN do is determined by three layers:
 * - Resources: What you have (easiest to change)
 * - Processes: How you work (hard to change)
 * - Priorities/Values: What you want (hardest to change, shaped by business model)
 *
 * This module also includes Resource Dependence theory - the insight that
 * organizations are constrained by what their resource providers (customers,
 * investors) want them to do.
 */

import type {
  CPPAnalysis,
  ResourceAssessment,
  ProcessAssessment,
  PrioritiesAssessment,
  ResourceDependenceAnalysis,
  ResourceProvider,
  DiagnosticQuestion,
  ConfidenceLevel,
} from "./types.js";

// ============================================================
// CPP Diagnostic Questions
// ============================================================

/**
 * Core diagnostic questions for CPP analysis
 */
export const CPP_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    question: "Do you have the resources to pursue this?",
    importance: "important",
  },
  {
    question: "Do your processes support or hinder this new approach?",
    importance: "critical",
  },
  {
    question: "Does this align with how you prioritize opportunities?",
    importance: "critical",
  },
  {
    question: "What would need to change in how you work, not just what you have?",
    importance: "critical",
  },
  {
    question: "Will your current business model let you prioritize this?",
    importance: "critical",
  },
];

/**
 * Resource-specific questions
 */
export const RESOURCE_QUESTIONS: DiagnosticQuestion[] = [
  {
    question: "What people, technology, and cash do you have available?",
    importance: "important",
  },
  {
    question: "What key relationships or partnerships exist?",
    importance: "important",
  },
  {
    question: "What resources are you missing?",
    importance: "important",
  },
  {
    question: "Which missing resources could you acquire or develop?",
    importance: "contextual",
  },
];

/**
 * Process-specific questions
 */
export const PROCESS_QUESTIONS: DiagnosticQuestion[] = [
  {
    question: "How does work actually get done in your organization?",
    importance: "critical",
  },
  {
    question: "What patterns of interaction and decision-making exist?",
    importance: "important",
  },
  {
    question: "Which processes enable your current success?",
    importance: "important",
  },
  {
    question: "Which processes would fight against this new approach?",
    importance: "critical",
  },
  {
    question: "How long did it take to develop these processes?",
    importance: "contextual",
  },
];

/**
 * Priorities-specific questions
 */
export const PRIORITIES_QUESTIONS: DiagnosticQuestion[] = [
  {
    question: "How do you decide which opportunities get resources?",
    importance: "critical",
  },
  {
    question: "What makes an opportunity attractive in your organization?",
    importance: "critical",
  },
  {
    question: "What's the minimum margin/size for an opportunity to be prioritized?",
    importance: "important",
  },
  {
    question: "Would this opportunity win in your internal resource allocation?",
    importance: "critical",
  },
];

// ============================================================
// Resource Dependence Diagnostic Questions
// ============================================================

/**
 * Resource dependence diagnostic questions
 */
export const RESOURCE_DEPENDENCE_QUESTIONS: DiagnosticQuestion[] = [
  {
    question: "What do your best customers want you to focus on?",
    importance: "critical",
  },
  {
    question: "What would happen if you shifted resources to this new opportunity?",
    importance: "critical",
  },
  {
    question: "Who controls the resources you need?",
    importance: "critical",
  },
  {
    question: "Does pursuing this threaten your relationship with key resource providers?",
    importance: "critical",
  },
  {
    question: "What would your investors think of this direction?",
    importance: "important",
  },
  {
    question: "What are your key customers asking for right now?",
    importance: "important",
  },
];

// ============================================================
// Analysis Prompts
// ============================================================

/**
 * Generate CPP analysis prompt
 */
export function generateCPPAnalysisPrompt(
  opportunity: string,
  context?: string
): string {
  return `
Analyze organizational capability for this opportunity using the
Capabilities-Processes-Priorities framework:

OPPORTUNITY: ${opportunity}
${context ? `CONTEXT: ${context}` : ""}

LAYER 1: RESOURCES (What you have)
Resources are the most visible capabilities - people, technology,
equipment, cash, relationships, brand. They're also the most easily
acquired or lost.

- What resources are available for this opportunity?
- What resources are missing?
- How easily could missing resources be acquired?

LAYER 2: PROCESSES (How you work)
Processes are patterns of interaction, coordination, and decision-making.
They enable efficiency but create rigidity. They're developed over years
and can't be bought.

- What processes would support this opportunity?
- What processes would fight against it?
- How hard would process changes be?

LAYER 3: PRIORITIES (What you want)
Priorities (or values) are the criteria by which decisions are made.
They're shaped by the business model - what customers value, what
creates profit, what investors expect.

- How does this opportunity rank against current priorities?
- Does it meet the margin/size thresholds for attention?
- Would it win in internal resource allocation battles?

THE KEY INSIGHT:
Resources can be acquired. Processes are hard to change. Priorities
are hardest of all because they're baked into the business model.

Many failures come from having resources but lacking the processes
or priorities to deploy them effectively for new opportunities.

Provide your assessment with specific evidence for each layer.
`.trim();
}

/**
 * Generate resource dependence analysis prompt
 */
export function generateResourceDependencePrompt(
  opportunity: string,
  context?: string
): string {
  return `
Analyze resource dependence constraints for this opportunity:

OPPORTUNITY: ${opportunity}
${context ? `CONTEXT: ${context}` : ""}

THE CORE INSIGHT:
It's not that managers are stupid - they're rational. They pursue what
their resource providers (customers and investors) reward. That's why
disruption is so hard to respond to - the rational thing is to ignore it.

QUESTIONS TO CONSIDER:

1. WHO PROVIDES RESOURCES?
   - Who are the key customers?
   - Who are the key investors/stakeholders?
   - What resources does each provide?

2. WHAT DO THEY WANT?
   - What do your best customers want you to focus on?
   - What returns do investors expect?
   - What would make them increase or decrease support?

3. HOW DOES THIS OPPORTUNITY AFFECT THEM?
   - Would pursuing this delight or concern them?
   - Does it compete for resources with what they want?
   - Would they see this as a distraction or opportunity?

4. CAN YOU NAVIGATE THE DEPENDENCE?
   - Is there a way to pursue this without threatening core relationships?
   - Could this be done in a separate unit with different resource providers?
   - What would it take to get permission to pursue this?

Remember: The pressure from resource providers is usually toward
sustaining innovation and away from disruptive opportunities.
This isn't a conspiracy - it's rational behavior.

Provide your analysis of the constraints and possible navigation strategies.
`.trim();
}

// ============================================================
// Analysis Helpers
// ============================================================

/**
 * Create empty CPP analysis structure
 */
export function createEmptyCPPAnalysis(): CPPAnalysis {
  return {
    resources: {
      available: [],
      missing: [],
      acquirable: [],
      flexibility: "medium",
    },
    processes: {
      supporting: [],
      hindering: [],
      rigidity: "medium",
      requiredChanges: [],
    },
    priorities: {
      currentPriorities: [],
      alignment: "neutral",
      alignmentRationale: "",
      requiredShifts: [],
    },
    overallAssessment: {
      canExecute: false,
      primaryBlocker: "none",
      explanation: "",
    },
    recommendations: [],
    confidence: "uncertain",
  };
}

/**
 * Create empty resource dependence analysis structure
 */
export function createEmptyResourceDependenceAnalysis(): ResourceDependenceAnalysis {
  return {
    providers: [],
    providerPriorities: [],
    conflicts: [],
    riskLevel: "medium",
    navigationStrategy: "",
    confidence: "uncertain",
  };
}

/**
 * Assess which layer is the primary blocker
 */
export function identifyPrimaryBlocker(
  analysis: CPPAnalysis
): "resources" | "processes" | "priorities" | "none" {
  // Check priorities first - hardest to change
  if (analysis.priorities.alignment === "misaligned") {
    return "priorities";
  }

  // Check processes next - hard to change
  if (
    analysis.processes.rigidity === "high" &&
    analysis.processes.hindering.length > analysis.processes.supporting.length
  ) {
    return "processes";
  }

  // Check resources - easiest to change but still can block
  if (
    analysis.resources.missing.length > 0 &&
    analysis.resources.flexibility === "low"
  ) {
    return "resources";
  }

  // If we got here with significant issues, processes is likely the blocker
  if (analysis.processes.hindering.length > 0) {
    return "processes";
  }

  return "none";
}

// ============================================================
// Christensen Voice Helpers
// ============================================================

/**
 * Phrases for CPP discussions
 */
export const CPP_VOICE_PHRASES = [
  "Resources are what you have. Processes are how you work. Priorities are what you want.",
  "Resources can be bought. Processes take years to develop.",
  "The business model shapes priorities more than managers realize.",
  "Many companies fail not for lack of resources, but lack of appropriate processes.",
  "What would need to change in how you work, not just what you have?",
  "Will your business model let you prioritize this?",
  "Processes enable efficiency - but they also create rigidity.",
  "The mistake is thinking you can just buy the capabilities you need.",
];

/**
 * Phrases for resource dependence discussions
 */
export const RESOURCE_DEPENDENCE_VOICE_PHRASES = [
  "It's not that managers are stupid - they're rational.",
  "They pursue what their resource providers reward.",
  "The rational thing was to ignore it - and that's why they lost.",
  "What do your best customers want you to focus on?",
  "Does pursuing this threaten your relationship with key resource providers?",
  "The pressure from resource providers is always toward sustaining innovation.",
  "Investors and customers are the real power. Managers respond to them.",
  "The tragedy is that doing exactly what you should be doing leads to failure.",
];

/**
 * Generate Christensen-style CPP inquiry
 */
export function generateCPPInquiry(situation: string): string {
  return `
Let me ask you something that often gets overlooked.

${situation}

When companies fail at new opportunities, the usual explanation is they lacked the resources. But I've found that's rarely the real issue. The real question is about processes and priorities.

Resources are what you have - people, technology, cash, relationships. They're important, but they're also the most acquirable. You can hire people, license technology, raise money.

Processes are how you work - the patterns of interaction, the way decisions get made, how projects move forward. These took years to develop. They enable your current efficiency. And they're very hard to change.

Priorities are what you want - the criteria by which opportunities get resourced. These are shaped by your business model. What margins do you need? What size opportunity is worth attention? What do your best customers value?

The mistake most companies make is thinking they can pursue new opportunities with existing processes and priorities. They can't. The new opportunity will lose every resource allocation battle to the existing business.

So help me understand: Not just do you have the resources - but do your processes support this? And more importantly, would this opportunity win when competing for attention against what your business model tells you to prioritize?
`.trim();
}

/**
 * Generate Christensen-style resource dependence inquiry
 */
export function generateResourceDependenceInquiry(situation: string): string {
  return `
There's something I've learned that explains why smart, capable managers consistently miss disruption.

${situation}

It's not that managers are stupid - they're rational. They pursue what their resource providers reward. Your best customers want you to focus on making better products for them. Your investors want you to grow margins and revenue. These are the people who control whether you get resources tomorrow.

When a disruptive opportunity appears, it usually looks unattractive by these criteria. The customers are less profitable. The margins are lower. The market seems small. And your resource providers - your best customers and investors - are explicitly asking you to focus elsewhere.

So the rational thing to do is ignore it. And that's exactly why so many great companies lose.

The question I'd ask is: What do your best customers want you to focus on right now? And if you pursued this new opportunity, how would they react? Would they see it as a distraction? Would it threaten your relationship with them?

Understanding this pressure doesn't mean you can easily escape it. But it does help you see the trap clearly.
`.trim();
}
