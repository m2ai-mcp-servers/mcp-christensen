/**
 * Test Decisions - Real strategic decisions for validation
 *
 * These are actual decisions from Matthew's context,
 * used to validate the Christensen agent provides useful insights.
 */

import { analyzeDecision } from "../tools/analyze-decision.js";
import { findCaseStudy } from "../tools/case-study.js";
import { calculateFidelityScore, formatFidelityReport } from "./fidelity-check.js";

// ============================================================
// Test Decision Definitions
// ============================================================

export interface TestDecision {
  name: string;
  decision: string;
  context?: string;
  organization?: {
    type: string;
    size?: string;
    industry?: string;
    currentFocus?: string;
  };
  market?: {
    incumbents?: string[];
    competitors?: string[];
    customerSegments?: string[];
  };
  expectedInsights: string[];
  expectedCaseStudyMatch?: string;
}

/**
 * Decision 1: Anthropic job positioning
 *
 * Should highlight: Jobs Anthropic is hiring for, what makes a strong signal,
 * how to differentiate from other candidates
 */
export const DECISION_1_ANTHROPIC: TestDecision = {
  name: "Anthropic MCP Engineer Role Positioning",
  decision:
    "How should I position myself for the Anthropic MCP Engineer role given my background in MCP server development, Python agents, and healthcare AI?",
  context: `
    I'm a founder/AI engineer with experience building production MCP servers (GRIMLOCK factory, Teletran1, Ratchet healthcare).
    I have Python agent architecture experience and understand Claude's tool-use paradigm.
    Competition includes engineers from big tech with more traditional credentials.
    My differentiator is hands-on MCP ecosystem experience and production agent systems.
  `,
  organization: {
    type: "Individual job seeker",
    industry: "AI/ML",
    currentFocus: "MCP server development and agent architecture",
  },
  market: {
    incumbents: ["Google", "Microsoft", "OpenAI"],
    competitors: ["Big tech engineers", "ML researchers", "Traditional software engineers"],
    customerSegments: ["Anthropic hiring team"],
  },
  expectedInsights: [
    "What job is Anthropic hiring this role to do?",
    "What are they firing (or not getting) from current approaches?",
    "Portfolio artifacts as 'good enough' signal for capability",
    "Differentiation through demonstrated MCP expertise vs credentials",
  ],
  expectedCaseStudyMatch: "honda_motorcycles", // Unexpected value proposition
};

/**
 * Decision 2: Agent Factory vs Single Agents
 *
 * Should highlight: Scale economics, process vs resource building,
 * market for persona agents
 */
export const DECISION_2_FACTORY: TestDecision = {
  name: "Agent Factory Strategy vs Individual Agents",
  decision:
    "Should I focus on building individual high-quality persona agents, or invest in building a repeatable factory process for creating them?",
  context: `
    I've just built the Christensen agent as a proof of concept.
    Building individual agents has clear value but doesn't scale.
    A factory process would let me (and others) create agents faster.
    The market for persona agents is uncertain - not clear if people want this.
  `,
  organization: {
    type: "Solo founder",
    industry: "AI tools",
    currentFocus: "MCP server development",
  },
  market: {
    incumbents: ["Character.AI", "Replika", "Custom GPTs"],
    customerSegments: [
      "AI enthusiasts",
      "Business users wanting advisors",
      "Developers building agents",
    ],
  },
  expectedInsights: [
    "Process investment creates lasting capability",
    "Factory enables non-consumption (people who couldn't build agents)",
    "Resource (single agent) vs Process (factory) distinction",
    "Intel parallel: transferable manufacturing capability",
  ],
  expectedCaseStudyMatch: "intel_microprocessors", // Capability migration
};

/**
 * Decision 3: n8n Migration Timing
 *
 * Should highlight: Resource dependence on n8n, process lock-in,
 * priority trade-offs
 */
export const DECISION_3_N8N: TestDecision = {
  name: "n8n to Python Migration Timing",
  decision:
    "When should I migrate my n8n workflows to Python/MCP architecture given that n8n currently works but doesn't align with my career positioning?",
  context: `
    I have working n8n workflows that handle automation tasks.
    My career positioning emphasizes Python agent code over no-code tools.
    Migration takes time away from building new things.
    n8n is a weak signal for Anthropic roles; Python MCP servers are strong signals.
  `,
  organization: {
    type: "Solo founder",
    currentFocus: "Transitioning from no-code to code-first",
  },
  expectedInsights: [
    "Resource dependence: n8n works but creates wrong signal",
    "Priority conflict: working system vs career positioning",
    "Process change: n8n patterns don't transfer to Python",
    "Opportunity cost of maintaining vs migrating",
  ],
  expectedCaseStudyMatch: "intel_microprocessors", // Capability migration
};

// ============================================================
// Test Runner
// ============================================================

/**
 * Run a single test decision
 */
export async function runTestDecision(
  testCase: TestDecision
): Promise<{
  name: string;
  output: string;
  fidelityScore: ReturnType<typeof calculateFidelityScore>;
  fidelityReport: string;
  passed: boolean;
}> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Testing: ${testCase.name}`);
  console.log("=".repeat(60));

  // Run the analysis
  const output = await analyzeDecision({
    decision: testCase.decision,
    context: testCase.context,
    organization: testCase.organization,
    market: testCase.market,
  });

  // Calculate fidelity
  const fidelityScore = calculateFidelityScore(output);
  const fidelityReport = formatFidelityReport(fidelityScore);

  console.log(`\nFidelity Score: ${fidelityScore.overall}/100`);
  console.log(`Status: ${fidelityScore.passed ? "PASSED" : "FAILED"}`);

  return {
    name: testCase.name,
    output,
    fidelityScore,
    fidelityReport,
    passed: fidelityScore.passed,
  };
}

/**
 * Run all test decisions
 */
export async function runAllTests(): Promise<void> {
  const testCases = [DECISION_1_ANTHROPIC, DECISION_2_FACTORY, DECISION_3_N8N];

  console.log("\n" + "=".repeat(60));
  console.log("CHRISTENSEN AGENT VALIDATION SUITE");
  console.log("=".repeat(60));

  const results = [];

  for (const testCase of testCases) {
    const result = await runTestDecision(testCase);
    results.push(result);
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));

  const passed = results.filter((r) => r.passed).length;
  console.log(`\nPassed: ${passed}/${results.length}`);

  for (const result of results) {
    console.log(`  ${result.passed ? "✓" : "✗"} ${result.name}: ${result.fidelityScore.overall}/100`);
  }

  if (passed === results.length) {
    console.log("\n✓ All tests passed! Agent is ready for real-world use.");
  } else {
    console.log("\n⚠ Some tests failed. Review outputs for missing fidelity markers.");
  }
}

// Run if executed directly
if (process.argv[1]?.endsWith("test-decisions.js")) {
  runAllTests().catch(console.error);
}
