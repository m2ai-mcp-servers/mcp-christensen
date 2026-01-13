/**
 * Disruption Theory Framework Implementation
 *
 * Core insight: Disruption occurs when simpler, cheaper products start
 * at the bottom of a market or create new markets, then improve until
 * they displace incumbents who were rationally serving their best customers.
 *
 * This module provides:
 * 1. Classification logic for innovation types
 * 2. Diagnostic questions for disruption analysis
 * 3. Case study pattern matching
 * 4. Christensen-style predictions with appropriate uncertainty
 */

import type {
  DisruptionAnalysis,
  InnovationType,
  MarketPosition,
  DisruptionTrajectory,
  CaseStudyReference,
  DiagnosticQuestion,
  ConfidenceLevel,
} from "./types.js";

// ============================================================
// Diagnostic Questions
// ============================================================

/**
 * Core diagnostic questions for disruption analysis
 */
export const DISRUPTION_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    question:
      "Is this innovation sustaining or disruptive relative to existing solutions?",
    importance: "critical",
  },
  {
    question: "Who are the non-consumers who might value this?",
    importance: "critical",
  },
  {
    question: "What are incumbents over-serving in their current customers?",
    importance: "critical",
  },
  {
    question: "What would make existing customers consider this 'good enough'?",
    importance: "important",
  },
  {
    question: "Is there a low-end segment being ignored for profit reasons?",
    importance: "important",
  },
  {
    question: "What business model enables this to be profitable at lower price points?",
    importance: "important",
  },
  {
    question: "Why would incumbents rationally choose not to respond?",
    importance: "critical",
  },
  {
    question: "What trajectory of improvement is the entrant on?",
    importance: "important",
  },
];

/**
 * Questions to distinguish sustaining vs disruptive
 */
export const CLASSIFICATION_QUESTIONS: DiagnosticQuestion[] = [
  {
    question: "Does this improve performance on dimensions incumbents already compete on?",
    importance: "critical",
  },
  {
    question: "Is this initially worse on traditional metrics but better on new dimensions?",
    importance: "critical",
  },
  {
    question: "Would incumbent's best customers want this?",
    importance: "critical",
  },
  {
    question: "Does this require a different business model to be profitable?",
    importance: "important",
  },
];

// ============================================================
// Innovation Type Classification
// ============================================================

/**
 * Signals that indicate sustaining innovation
 */
export const SUSTAINING_SIGNALS = [
  "Improves performance on metrics incumbents already value",
  "Targets existing customers of incumbents",
  "Commands premium pricing",
  "Incumbents' best customers want it",
  "Can be integrated into incumbent's existing business model",
  "Requires similar cost structure to deliver",
];

/**
 * Signals that indicate low-end disruption
 */
export const LOW_END_DISRUPTION_SIGNALS = [
  "Targets overlooked, low-profit customer segments",
  "Offers 'good enough' performance at lower price",
  "Has fundamentally lower cost structure",
  "Incumbents are 'relieved' to cede this segment",
  "Quality improves over time toward mainstream needs",
  "Incumbents face asymmetric motivation (can't justify response)",
];

/**
 * Signals that indicate new-market disruption
 */
export const NEW_MARKET_DISRUPTION_SIGNALS = [
  "Enables non-consumers to participate",
  "Creates a new value network",
  "Competes against non-consumption",
  "Initially seems like a toy or irrelevant",
  "Different performance metrics valued",
  "New use cases or contexts",
];

/**
 * Generate classification assessment prompt
 */
export function generateClassificationPrompt(
  innovation: string,
  context?: string
): string {
  return `
Classify this innovation using disruption theory:

INNOVATION: ${innovation}
${context ? `CONTEXT: ${context}` : ""}

STEP 1: SUSTAINING VS DISRUPTIVE
Ask: Does this improve performance on dimensions that incumbents'
best customers already value?

If YES → Likely SUSTAINING (incumbents usually win these battles)
If NO → Continue to Step 2

STEP 2: LOW-END VS NEW-MARKET
Ask: Who is the target customer?

If targeting incumbents' LEAST profitable customers → LOW-END DISRUPTION
If targeting NON-CONSUMERS (people who couldn't use existing solutions) → NEW-MARKET DISRUPTION
If BOTH → Could be either or hybrid

STEP 3: VALIDATE WITH ASYMMETRIC MOTIVATION
Ask: Why would incumbents rationally choose NOT to respond?

Low-end: "These customers aren't profitable enough to fight for"
New-market: "This isn't our market, our customers don't want it"

STEP 4: ASSESS TRAJECTORY
Ask: Is the entrant improving along a path that will eventually
satisfy mainstream customers?

Provide your classification with rationale.
`.trim();
}

// ============================================================
// Case Study Patterns
// ============================================================

export interface CaseStudyPattern {
  name: string;
  pattern: string;
  story: string;
  signals: string[];
  lessonsForToday: string;
}

export const CANONICAL_CASES: Record<string, CaseStudyPattern> = {
  steel_minimills: {
    name: "Steel Mini-Mills",
    pattern: "Low-end disruption with asymmetric motivation",
    story: `
Integrated steel mills (US Steel, Bethlehem) dominated the industry but
had high fixed costs. Mini-mills (Nucor) entered making rebar - the
lowest-margin product. Integrated mills were RELIEVED to exit rebar.

Mini-mills improved and moved to angle iron. Integrated mills were again
relieved. Then structural steel. Then sheet steel. At each tier, the
rational response for integrated mills was to retreat upmarket.

By the time mini-mills threatened their core products, integrated mills
had neither the cost structure nor the capabilities to respond.
    `.trim(),
    signals: [
      "Incumbent has high fixed-cost structure",
      "Low-end segments are unattractive margin-wise",
      "Entrant has fundamentally different cost structure",
      "Entrant quality improves over time",
      "Incumbent 'rationally' cedes each tier",
    ],
    lessonsForToday:
      "Watch for entrants that incumbents are happy to ignore. Their improvement trajectory may lead straight to your core.",
  },

  disk_drives: {
    name: "Disk Drive Generations",
    pattern: "New-market disruption with different value network",
    story: `
Each generation of smaller disk drives was 'worse' by existing metrics
(capacity, cost per megabyte) but enabled entirely new applications.

14" drives → mainframes
8" drives → minicomputers
5.25" drives → desktop PCs
3.5" drives → laptops
2.5" and smaller → portable devices

Each time, incumbents saw the new format as inferior. Their customers
didn't want smaller drives with less capacity. But new customers in
new applications valued portability, power efficiency, and form factor
over raw capacity.
    `.trim(),
    signals: [
      "New form factor or approach",
      "Different performance dimensions valued",
      "Enables new use cases existing solutions can't serve",
      "Existing customers explicitly don't want it",
      "New value network with different profit formula",
    ],
    lessonsForToday:
      "Your best customers telling you they don't want something may be a signal it will disrupt you, not a signal it's irrelevant.",
  },

  honda_motorcycles: {
    name: "Honda Motorcycles in America",
    pattern: "Emergent strategy through market learning",
    story: `
Honda came to America in 1959 planning to sell large motorcycles to
compete with Harley-Davidson. Sales were poor - Americans saw Japanese
bikes as inferior for highway riding.

Honda executives rode small 50cc Supercubs around Los Angeles for
personal errands. People kept asking where to buy them. Sears wanted
to carry them. Honda initially resisted - these weren't 'real' motorcycles.

Eventually they recognized the market was teaching them their strategy.
The Supercub created a new market of people who would never buy a
Harley - and Honda built capabilities that later let them move upmarket.
    `.trim(),
    signals: [
      "Initial strategy hypothesis doesn't match market reality",
      "Unexpected customer segment emerges",
      "Product finds use cases different from intended",
      "Willingness to learn and adapt",
      "Creates new category rather than competing in existing one",
    ],
    lessonsForToday:
      "The market often knows your strategy better than you do. Pay attention to who actually buys - especially unexpected customers.",
  },

  intel_microprocessors: {
    name: "Intel's Pivot to Microprocessors",
    pattern: "Capability migration through process investment",
    story: `
Intel dominated memory chips in the 1970s but faced brutal competition
from Japanese manufacturers who had lower costs and higher quality.
Andy Grove and Gordon Moore recognized memory was becoming a commodity.

Intel survived by migrating to microprocessors - not because they had
unique resources (Japanese firms could acquire those) but because their
PROCESSES for chip design and manufacturing transferred to processors.

The key insight: Resources are acquirable. Processes are developed
over years and can't be bought. Intel's survival came from recognizing
which of their capabilities (processes) were transferable.
    `.trim(),
    signals: [
      "Core business facing commoditization or decline",
      "Adjacent opportunity emerging",
      "Process capabilities (not just resources) are transferable",
      "Requires fundamental priority shift",
      "New market values same underlying capabilities differently",
    ],
    lessonsForToday:
      "When your market is dying, ask what processes you've built that could transfer to new opportunities. Don't just count your resources.",
  },
};

/**
 * Match a situation to relevant case studies
 */
export function matchToCaseStudies(
  signals: string[]
): CaseStudyReference[] {
  const matches: CaseStudyReference[] = [];

  for (const [key, caseStudy] of Object.entries(CANONICAL_CASES)) {
    let matchCount = 0;
    const matchedSignals: string[] = [];

    for (const userSignal of signals) {
      const userLower = userSignal.toLowerCase();
      for (const caseSignal of caseStudy.signals) {
        if (
          userLower.includes(caseSignal.toLowerCase().slice(0, 20)) ||
          caseSignal.toLowerCase().includes(userLower.slice(0, 20))
        ) {
          matchCount++;
          matchedSignals.push(caseSignal);
          break;
        }
      }
    }

    if (matchCount > 0) {
      const matchStrength: ConfidenceLevel =
        matchCount >= 3 ? "high" : matchCount >= 2 ? "medium" : "low";

      matches.push({
        name: caseStudy.name,
        pattern: caseStudy.pattern,
        relevance: `Matches ${matchCount} signals: ${matchedSignals.join("; ")}`,
        matchStrength,
      });
    }
  }

  return matches.sort((a, b) => {
    const order: Record<ConfidenceLevel, number> = {
      high: 0,
      medium: 1,
      low: 2,
      uncertain: 3,
    };
    return order[a.matchStrength] - order[b.matchStrength];
  });
}

// ============================================================
// Analysis Helpers
// ============================================================

/**
 * Generate disruption analysis prompt for Claude
 */
export function generateDisruptionAnalysisPrompt(
  situation: string,
  context?: string
): string {
  return `
Analyze this situation through the disruption theory lens:

SITUATION: ${situation}
${context ? `CONTEXT: ${context}` : ""}

FRAMEWORK APPLICATION:

1. CLASSIFICATION
   - Is this sustaining or disruptive innovation?
   - If disruptive: low-end or new-market?
   - What's the rationale for this classification?

2. MARKET POSITION
   - What segment is being targeted?
   - What are incumbents over-serving?
   - What are they under-serving or ignoring?

3. TRUE COMPETITION
   - Who are the real competitors? (often not obvious)
   - Is non-consumption a competitor?

4. ASYMMETRIC MOTIVATION
   - Why would incumbents rationally choose not to respond?
   - What makes this opportunity unattractive to them?

5. TRAJECTORY
   - What path of improvement is the entrant on?
   - Will they eventually satisfy mainstream needs?
   - What would accelerate or decelerate this?

6. CASE STUDY PARALLELS
   - What historical patterns apply here?
   - What can we learn from similar situations?

Remember Christensen's key insight: "It's not that managers are stupid.
They're doing exactly what good managers should do - serving their best
customers. And that's exactly why they lose."

Provide analysis with appropriate uncertainty.
`.trim();
}

/**
 * Create empty disruption analysis structure
 */
export function createEmptyDisruptionAnalysis(): DisruptionAnalysis {
  return {
    innovationType: "unclear",
    classificationRationale: "",
    marketPosition: {
      segment: "mixed",
      incumbentFocus: "",
      overservedDimensions: [],
      underservedDimensions: [],
    },
    trueCompetitors: [],
    trajectory: {
      currentPosition: "",
      projectedPath: "",
      timeframe: "",
      keyFactors: [],
    },
    asymmetricMotivation: {
      incumbentMotivation: "",
      entrantMotivation: "",
    },
    caseStudyParallels: [],
    confidence: "uncertain",
  };
}

// ============================================================
// Christensen Voice Helpers
// ============================================================

/**
 * Phrases Christensen would use when discussing disruption
 */
export const DISRUPTION_VOICE_PHRASES = [
  "The theory would predict...",
  "It's not that managers are stupid - they're rational.",
  "Incumbents almost always win sustaining battles.",
  "The question isn't whether, but when and how.",
  "I've seen this pattern before...",
  "The mistake most managers make is...",
  "Good theory helps you see what you couldn't see before.",
  "They were doing exactly what good managers should do.",
  "The rational thing was to ignore it - and that's why they lost.",
  "Watch for where incumbents are relieved to retreat.",
];

/**
 * Generate a Christensen-style disruption insight
 */
export function generateDisruptionInquiry(situation: string): string {
  return `
Let me share something I've learned from studying this pattern across industries.

${situation}

The question I always ask first: Is this innovation sustaining or disruptive? And here's why it matters so much.

If it's sustaining - improving products along dimensions that existing customers already value - then incumbents will almost certainly win. They have the resources, the customer relationships, and the motivation.

But if it's disruptive - if it's worse on traditional metrics but enables new customers or serves overlooked segments - then the dynamics are completely different. Incumbents face what I call asymmetric motivation. The rational thing for them to do is to ignore it. Their best customers don't want it. The margins don't justify the investment.

The tragedy is that managers doing exactly what they should be doing - listening to customers, focusing on profitable segments - are the ones most likely to miss disruption.

So help me understand: Who would value this that can't access or afford current solutions? And why would incumbents be rational to ignore them?
`.trim();
}
