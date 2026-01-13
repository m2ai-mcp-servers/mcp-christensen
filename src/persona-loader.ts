/**
 * Persona Loader
 *
 * Loads and parses persona YAML files at runtime.
 * This allows personas to be updated without recompiling.
 *
 * For the factory pattern, this becomes a reusable component
 * that can load any persona definition.
 */

import { readFileSync } from "fs";
import { parse as parseYaml } from "yaml";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ============================================================
// Types for Persona Definition
// ============================================================

export interface PersonaIdentity {
  name: string;
  role: string;
  background: string;
}

export interface PersonaVoice {
  tone: string[];
  characteristic_phrases: string[];
  communication_style: string[];
}

export interface FrameworkConcept {
  definition: string;
  insight?: string;
  examples?: string[];
  components?: string[];
  sustaining?: string;
  disruptive?: string;
}

export interface FrameworkDefinition {
  description: string;
  key_concepts: Record<string, FrameworkConcept>;
  diagnostic_questions: string[];
  key_insight?: string;
}

export interface CaseStudy {
  pattern: string;
  story: string;
  signals: string[];
}

export interface AnalysisPattern {
  approach?: string;
  output_structure?: string[];
  purpose?: string;
  canonical_cases?: Record<string, CaseStudy>;
}

export interface ValidationMarkers {
  must_include: string[];
  should_include: string[];
  must_avoid: string[];
}

export interface SamplePromptResponse {
  user: string;
  good_response: string;
  bad_response: string;
}

export interface PersonaValidation {
  fidelity_markers: ValidationMarkers;
  sample_prompts_and_responses: Record<string, SamplePromptResponse>;
}

export interface PersonaDefinition {
  identity: PersonaIdentity;
  voice: PersonaVoice;
  frameworks: Record<string, FrameworkDefinition>;
  analysis_patterns: Record<string, AnalysisPattern>;
  validation: PersonaValidation;
}

// ============================================================
// Loader Functions
// ============================================================

/**
 * Get the directory containing this module
 */
function getModuleDir(): string {
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
}

/**
 * Load a persona definition from YAML file
 */
export function loadPersona(personaName: string): PersonaDefinition {
  const moduleDir = getModuleDir();
  const personaPath = join(moduleDir, "personas", `${personaName}.yaml`);

  try {
    const yamlContent = readFileSync(personaPath, "utf-8");
    const parsed = parseYaml(yamlContent) as PersonaDefinition;
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Persona not found: ${personaName}`);
    }
    throw error;
  }
}

/**
 * Load the Christensen persona specifically
 */
export function loadChristensenPersona(): PersonaDefinition {
  return loadPersona("christensen");
}

// ============================================================
// Persona Access Helpers
// ============================================================

/**
 * Loaded persona cache
 */
let cachedPersona: PersonaDefinition | null = null;

/**
 * Get the active persona (loads and caches)
 */
export function getPersona(): PersonaDefinition {
  if (!cachedPersona) {
    cachedPersona = loadChristensenPersona();
  }
  return cachedPersona;
}

/**
 * Get voice characteristics
 */
export function getVoice(): PersonaVoice {
  return getPersona().voice;
}

/**
 * Get a random characteristic phrase
 */
export function getRandomPhrase(): string {
  const phrases = getVoice().characteristic_phrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Get framework definition by name
 */
export function getFramework(name: string): FrameworkDefinition | undefined {
  return getPersona().frameworks[name];
}

/**
 * Get all framework names
 */
export function getFrameworkNames(): string[] {
  return Object.keys(getPersona().frameworks);
}

/**
 * Get diagnostic questions for a framework
 */
export function getDiagnosticQuestions(frameworkName: string): string[] {
  const framework = getFramework(frameworkName);
  return framework?.diagnostic_questions ?? [];
}

/**
 * Get case study by name
 */
export function getCaseStudy(name: string): CaseStudy | undefined {
  const patterns = getPersona().analysis_patterns;
  const caseStudies = patterns.case_study_matching?.canonical_cases;
  return caseStudies?.[name];
}

/**
 * Get all case study names
 */
export function getCaseStudyNames(): string[] {
  const patterns = getPersona().analysis_patterns;
  const caseStudies = patterns.case_study_matching?.canonical_cases;
  return caseStudies ? Object.keys(caseStudies) : [];
}

/**
 * Get validation markers
 */
export function getValidationMarkers(): ValidationMarkers {
  return getPersona().validation.fidelity_markers;
}

/**
 * Get sample prompts and responses for testing
 */
export function getSampleResponses(): Record<string, SamplePromptResponse> {
  return getPersona().validation.sample_prompts_and_responses;
}

// ============================================================
// System Prompt Generation
// ============================================================

/**
 * Generate a system prompt from the persona definition
 * This is what gets sent to Claude to establish the persona
 */
export function generateSystemPrompt(): string {
  const persona = getPersona();

  return `
You are ${persona.identity.name}, ${persona.identity.role}.

${persona.identity.background}

## Your Voice and Style

Your tone is:
${persona.voice.tone.map((t) => `- ${t}`).join("\n")}

Phrases you commonly use:
${persona.voice.characteristic_phrases.map((p) => `- "${p}"`).join("\n")}

Your communication style:
${persona.voice.communication_style.map((s) => `- ${s}`).join("\n")}

## Your Frameworks

You analyze situations using these frameworks:

${Object.entries(persona.frameworks)
  .map(
    ([name, fw]) => `
### ${name.replace(/_/g, " ").toUpperCase()}
${fw.description}

Key diagnostic questions:
${fw.diagnostic_questions.map((q) => `- ${q}`).join("\n")}
`
  )
  .join("\n")}

## Analysis Approach

When analyzing a decision:
${persona.analysis_patterns.decision_analysis?.approach ?? ""}

Structure your output as:
${persona.analysis_patterns.decision_analysis?.output_structure?.map((s) => `- ${s}`).join("\n") ?? ""}

## Important Guidelines

Your responses MUST include:
${persona.validation.fidelity_markers.must_include.map((m) => `- ${m}`).join("\n")}

Your responses SHOULD include:
${persona.validation.fidelity_markers.should_include.map((m) => `- ${m}`).join("\n")}

Your responses must AVOID:
${persona.validation.fidelity_markers.must_avoid.map((m) => `- ${m}`).join("\n")}

Remember: You are not providing generic business advice. You are applying
rigorous theory developed over decades of research. Be humble about predictions,
curious about circumstances, and always connect insights to frameworks.
`.trim();
}
