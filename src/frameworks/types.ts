/**
 * Shared types for Christensen frameworks
 *
 * These types define the structure of framework analyses.
 * Each framework produces a structured output that can be
 * combined into a complete decision analysis.
 */

// ============================================================
// Common Types
// ============================================================

/**
 * Confidence level for assessments
 * Christensen always expressed appropriate uncertainty
 */
export type ConfidenceLevel = "high" | "medium" | "low" | "uncertain";

/**
 * A diagnostic question with optional answer
 */
export interface DiagnosticQuestion {
  question: string;
  answer?: string;
  importance: "critical" | "important" | "contextual";
}

/**
 * Reference to a canonical case study
 */
export interface CaseStudyReference {
  name: string;
  pattern: string;
  relevance: string;
  matchStrength: ConfidenceLevel;
}

// ============================================================
// Jobs-to-Be-Done Framework
// ============================================================

/**
 * The three dimensions of any job
 */
export interface JobDimensions {
  functional: string; // What needs to be accomplished
  emotional: string; // How they want to feel
  social: string; // How they want to be perceived
}

/**
 * The circumstance that triggers the job
 */
export interface Circumstance {
  situation: string; // What's happening
  trigger: string; // What specifically triggers the need
  constraints: string[]; // Limitations in this circumstance
}

/**
 * Complete JTBD analysis output
 */
export interface JTBDAnalysis {
  /** The core job being hired for */
  job: string;

  /** Breakdown by dimension */
  dimensions: JobDimensions;

  /** When/where this job arises */
  circumstance: Circumstance;

  /** What the customer is "firing" to hire this */
  firingFrom: string[];

  /** What would cause them to fire this solution */
  firingRisks: string[];

  /** Who struggles to get this job done today */
  underservedSegments: string[];

  /** Key questions that remain unanswered */
  openQuestions: DiagnosticQuestion[];

  /** Confidence in this analysis */
  confidence: ConfidenceLevel;
}

// ============================================================
// Disruption Theory Framework
// ============================================================

/**
 * Type of innovation being assessed
 */
export type InnovationType =
  | "sustaining" // Better on existing dimensions
  | "low-end-disruptive" // Good enough, cheaper/simpler
  | "new-market-disruptive" // Enables non-consumers
  | "hybrid" // Elements of multiple types
  | "unclear"; // Need more information

/**
 * Market position analysis
 */
export interface MarketPosition {
  /** Where in the market this targets */
  segment: "low-end" | "mainstream" | "high-end" | "non-consumers" | "mixed";

  /** What incumbents are doing */
  incumbentFocus: string;

  /** What incumbents are over-serving */
  overservedDimensions: string[];

  /** What's being under-served or ignored */
  underservedDimensions: string[];
}

/**
 * Trajectory prediction
 */
export interface DisruptionTrajectory {
  /** Current state */
  currentPosition: string;

  /** Likely evolution */
  projectedPath: string;

  /** Timeline guess (with uncertainty) */
  timeframe: string;

  /** What would accelerate/decelerate */
  keyFactors: string[];
}

/**
 * Complete disruption analysis output
 */
export interface DisruptionAnalysis {
  /** Classification of the innovation */
  innovationType: InnovationType;

  /** Rationale for classification */
  classificationRationale: string;

  /** Market dynamics */
  marketPosition: MarketPosition;

  /** Who the real competitors are (often surprising) */
  trueCompetitors: string[];

  /** Predicted trajectory */
  trajectory: DisruptionTrajectory;

  /** Asymmetric motivation assessment */
  asymmetricMotivation: {
    incumbentMotivation: string; // Why incumbents won't respond
    entrantMotivation: string; // Why entrants will persist
  };

  /** Relevant case study parallels */
  caseStudyParallels: CaseStudyReference[];

  /** Confidence in this analysis */
  confidence: ConfidenceLevel;
}

// ============================================================
// Capabilities-Processes-Priorities (CPP) Framework
// ============================================================

/**
 * Resource assessment
 */
export interface ResourceAssessment {
  /** Resources the organization has */
  available: string[];

  /** Resources that are missing */
  missing: string[];

  /** Resources that could be acquired */
  acquirable: string[];

  /** How easily resources can shift */
  flexibility: "high" | "medium" | "low";
}

/**
 * Process assessment
 */
export interface ProcessAssessment {
  /** Processes that support the new direction */
  supporting: string[];

  /** Processes that hinder the new direction */
  hindering: string[];

  /** How hard processes are to change */
  rigidity: "high" | "medium" | "low";

  /** What process changes would be needed */
  requiredChanges: string[];
}

/**
 * Priorities/values assessment
 */
export interface PrioritiesAssessment {
  /** Current prioritization criteria */
  currentPriorities: string[];

  /** Whether this opportunity aligns */
  alignment: "aligned" | "neutral" | "misaligned";

  /** Why alignment is what it is */
  alignmentRationale: string;

  /** What priority shifts would be needed */
  requiredShifts: string[];
}

/**
 * Complete CPP analysis output
 */
export interface CPPAnalysis {
  /** Resource layer */
  resources: ResourceAssessment;

  /** Process layer */
  processes: ProcessAssessment;

  /** Priorities layer */
  priorities: PrioritiesAssessment;

  /** Overall capability verdict */
  overallAssessment: {
    canExecute: boolean;
    primaryBlocker: "resources" | "processes" | "priorities" | "none";
    explanation: string;
  };

  /** Recommendations */
  recommendations: string[];

  /** Confidence in this analysis */
  confidence: ConfidenceLevel;
}

// ============================================================
// Resource Dependence Framework
// ============================================================

/**
 * Resource provider analysis
 */
export interface ResourceProvider {
  /** Who provides resources */
  provider: string;

  /** What resources they provide */
  resources: string[];

  /** What they want in return */
  expectations: string[];

  /** How this opportunity affects the relationship */
  impactOnRelationship: "positive" | "neutral" | "negative" | "threatening";
}

/**
 * Complete resource dependence analysis
 */
export interface ResourceDependenceAnalysis {
  /** Key resource providers */
  providers: ResourceProvider[];

  /** What providers want the org to focus on */
  providerPriorities: string[];

  /** Conflicts between opportunity and provider expectations */
  conflicts: string[];

  /** Whether pursuing this threatens resource access */
  riskLevel: "low" | "medium" | "high" | "critical";

  /** How to navigate the dependence */
  navigationStrategy: string;

  /** Confidence in this analysis */
  confidence: ConfidenceLevel;
}

// ============================================================
// Combined Decision Analysis
// ============================================================

/**
 * Complete Christensen-style decision analysis
 * Combines all frameworks into unified output
 */
export interface ChristensenAnalysis {
  /** The decision or situation being analyzed */
  context: string;

  /** Jobs-to-be-done perspective */
  theJob: JTBDAnalysis;

  /** Disruption dynamics */
  theLandscape: DisruptionAnalysis;

  /** Organizational capabilities */
  theCapabilities: CPPAnalysis;

  /** Resource dependence constraints */
  theConstraints: ResourceDependenceAnalysis;

  /** Historical pattern match */
  thePattern: {
    primaryCase: CaseStudyReference;
    secondaryCases: CaseStudyReference[];
    patternSummary: string;
  };

  /** Theory-based prediction */
  thePrediction: {
    mostLikelyOutcome: string;
    confidence: ConfidenceLevel;
    keyAssumptions: string[];
    whatCouldChange: string[];
  };

  /** What makes this case potentially different */
  theConsideration: string[];

  /** Christensen-style summary in his voice */
  narrativeSummary: string;
}

// ============================================================
// Input Types for Tools
// ============================================================

/**
 * Input for decision analysis tool
 */
export interface DecisionAnalysisInput {
  /** The decision to analyze */
  decision: string;

  /** Context about the situation */
  context?: string;

  /** Information about the organization */
  organization?: {
    type: string;
    size?: string;
    industry?: string;
    currentFocus?: string;
  };

  /** Information about competitors/market */
  market?: {
    incumbents?: string[];
    competitors?: string[];
    customerSegments?: string[];
  };

  /** Specific aspects to focus on */
  focusAreas?: ("jtbd" | "disruption" | "cpp" | "resource-dependence")[];
}

/**
 * Input for case study matching tool
 */
export interface CaseStudyInput {
  /** Description of the situation */
  situation: string;

  /** Signals or patterns observed */
  observedSignals?: string[];

  /** Industry or domain */
  industry?: string;
}
