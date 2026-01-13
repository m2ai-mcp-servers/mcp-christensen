/**
 * Jobs-to-Be-Done Framework Implementation
 *
 * Core insight: People don't buy products - they hire them to do a job.
 * The job (functional, emotional, social) is the unit of analysis.
 *
 * This module provides:
 * 1. Diagnostic questions to uncover the job
 * 2. Analysis structure for JTBD thinking
 * 3. Prompts that guide Christensen-style inquiry
 */

import type {
  JTBDAnalysis,
  JobDimensions,
  Circumstance,
  DiagnosticQuestion,
  ConfidenceLevel,
} from "./types.js";

// ============================================================
// Diagnostic Questions
// ============================================================

/**
 * Core diagnostic questions from Christensen's JTBD framework
 * These are the questions Christensen would ask to understand a situation
 */
export const JTBD_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    question: "What job is the customer hiring this product to do?",
    importance: "critical",
  },
  {
    question:
      "What are the functional, emotional, and social dimensions of that job?",
    importance: "critical",
  },
  {
    question: "What circumstance triggers the need for this job?",
    importance: "critical",
  },
  {
    question: "What are they firing to hire your product?",
    importance: "important",
  },
  {
    question: "What would cause them to fire your product?",
    importance: "important",
  },
  {
    question: "Who struggles to get this job done today?",
    importance: "important",
  },
  {
    question: "What are customers doing when they're NOT hiring your product?",
    importance: "contextual",
  },
  {
    question: "What workarounds have customers created?",
    importance: "contextual",
  },
];

/**
 * Follow-up questions based on initial responses
 */
export const JTBD_FOLLOWUP_QUESTIONS: Record<string, DiagnosticQuestion[]> = {
  functional: [
    {
      question: "What specific outcome are they trying to achieve?",
      importance: "critical",
    },
    {
      question: "What metrics would tell them the job is done well?",
      importance: "important",
    },
    {
      question: "What steps are involved in completing this job?",
      importance: "contextual",
    },
  ],
  emotional: [
    {
      question: "How do they want to feel during and after the job?",
      importance: "critical",
    },
    {
      question: "What anxieties or frustrations exist with current solutions?",
      importance: "important",
    },
    {
      question: "What would make them feel confident they made the right choice?",
      importance: "contextual",
    },
  ],
  social: [
    {
      question: "How do they want to be perceived by others?",
      importance: "critical",
    },
    {
      question: "Who else is involved in or affected by this job?",
      importance: "important",
    },
    {
      question: "What would others think if they saw this solution?",
      importance: "contextual",
    },
  ],
  circumstance: [
    {
      question: "When does this need typically arise?",
      importance: "critical",
    },
    {
      question: "Where are they when the job needs to be done?",
      importance: "important",
    },
    {
      question: "What constraints exist in this circumstance?",
      importance: "important",
    },
    {
      question: "How much time/money/attention do they have available?",
      importance: "contextual",
    },
  ],
};

// ============================================================
// Analysis Helpers
// ============================================================

/**
 * Generate the prompt for Claude to analyze JTBD
 * This structures Claude's thinking in Christensen's framework
 */
export function generateJTBDAnalysisPrompt(
  decision: string,
  context?: string
): string {
  return `
Analyze this situation through the Jobs-to-Be-Done lens.

SITUATION: ${decision}
${context ? `CONTEXT: ${context}` : ""}

Think through these questions systematically:

1. THE JOB
   - What progress is the customer trying to make?
   - What job are they hiring a solution to do?

2. JOB DIMENSIONS
   - Functional: What do they need to accomplish?
   - Emotional: How do they want to feel?
   - Social: How do they want to be perceived?

3. CIRCUMSTANCE
   - What situation triggers this job?
   - What constraints exist in this circumstance?

4. COMPETITION
   - What are they currently "hiring" to do this job?
   - What would they "fire" to hire a new solution?
   - Who is the real competition (often non-consumption)?

5. UNDERSERVED
   - Who struggles to get this job done today?
   - Who can't access or afford current solutions?

Remember: The same person in different circumstances may hire completely
different products for the same underlying job. Context matters enormously.

Provide your analysis in a structured format.
`.trim();
}

/**
 * Create an empty JTBD analysis structure
 * Useful as a starting template
 */
export function createEmptyJTBDAnalysis(): JTBDAnalysis {
  return {
    job: "",
    dimensions: {
      functional: "",
      emotional: "",
      social: "",
    },
    circumstance: {
      situation: "",
      trigger: "",
      constraints: [],
    },
    firingFrom: [],
    firingRisks: [],
    underservedSegments: [],
    openQuestions: [],
    confidence: "uncertain",
  };
}

/**
 * Assess confidence level based on how complete the analysis is
 */
export function assessJTBDConfidence(analysis: JTBDAnalysis): ConfidenceLevel {
  let score = 0;

  // Core job identified
  if (analysis.job.length > 20) score += 2;

  // All dimensions filled
  if (analysis.dimensions.functional) score += 1;
  if (analysis.dimensions.emotional) score += 1;
  if (analysis.dimensions.social) score += 1;

  // Circumstance understood
  if (analysis.circumstance.situation) score += 1;
  if (analysis.circumstance.trigger) score += 1;

  // Competition understood
  if (analysis.firingFrom.length > 0) score += 1;
  if (analysis.firingRisks.length > 0) score += 1;

  // Segments identified
  if (analysis.underservedSegments.length > 0) score += 1;

  if (score >= 9) return "high";
  if (score >= 6) return "medium";
  if (score >= 3) return "low";
  return "uncertain";
}

// ============================================================
// Christensen Voice Helpers
// ============================================================

/**
 * Phrases Christensen would use when discussing JTBD
 */
export const JTBD_VOICE_PHRASES = [
  "What job is the customer hiring this to do?",
  "People don't buy products - they hire them to do a job.",
  "The job, not the customer, should be the unit of analysis.",
  "The same person hires different products in different circumstances.",
  "Often the biggest competitor is non-consumption.",
  "Understanding why people do nothing reveals opportunity.",
  "Let me tell you about the milkshake story...",
  "What are they firing to hire your product?",
  "The functional dimension is only part of the story.",
  "Help me understand the circumstance that triggers this need.",
];

/**
 * The milkshake story - Christensen's canonical JTBD example
 */
export const MILKSHAKE_STORY = {
  name: "The Milkshake Story",
  pattern: "Jobs-to-be-done discovery through circumstance",
  story: `
A fast-food chain wanted to improve milkshake sales. Traditional market
research segmented by demographics and asked what would make a better
milkshake - thicker? more chocolate? cheaper?

When researchers observed actual buyers, they discovered two completely
different jobs:

MORNING COMMUTERS hired the milkshake to:
- Functional: Have something to do during a long, boring commute
- Emotional: Feel like the commute wasn't wasted
- Social: Not make a mess in the car
The real competition was bagels, bananas, and boredom.

AFTERNOON PARENTS hired the milkshake to:
- Functional: Give their child a treat after a long week
- Emotional: Feel like a good parent
- Social: Have a bonding moment
The real competition was going to the toy store.

Same product. Completely different jobs. Completely different competitors.
  `.trim(),
  lesson:
    "Don't ask what would make a better product. Ask what job the customer is hiring it to do.",
};

/**
 * Generate a Christensen-style response for JTBD inquiry
 */
export function generateJTBDInquiry(situation: string): string {
  return `
Help me understand your situation first.

${situation}

Let me ask: What job are your customers hiring this solution to do? And I don't just mean the functional job - though that matters. I'm also curious about the emotional dimension - how do they want to feel? And the social dimension - how do they want to be perceived?

The mistake most companies make is focusing on the customer demographic rather than the job. But the same person in different circumstances might hire completely different products for similar underlying jobs.

${MILKSHAKE_STORY.lesson}

What circumstance triggers the need for this job to be done?
  `.trim();
}
