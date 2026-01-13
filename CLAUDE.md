# CLAUDE.md - Christensen MCP Server

## Project Overview

This is a Clayton Christensen persona agent implemented as an MCP server. It provides strategic advisory tools that apply disruption theory, jobs-to-be-done, and capabilities analysis to business decisions.

## Quick Commands

```bash
# Build the project
npm run build

# Run the MCP server (for testing)
npm start

# Run validation tests
npm test

# Watch mode during development
npm run dev

# Test with MCP Inspector
npm run inspector
```

## Architecture

### MCP Server Pattern
This is a **prompt-shaping** MCP server, not a logic server. Tools generate structured prompts and context that guide Claude's reasoning, rather than returning deterministic outputs.

```
User Decision → MCP Tool → Structured Prompt + Framework Context → Claude → Analysis
```

### Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | MCP server entry, tool handlers |
| `src/personas/christensen.yaml` | Persona definition (voice, frameworks, validation) |
| `src/frameworks/*.ts` | Framework implementations (JTBD, disruption, CPP) |
| `src/tools/*.ts` | MCP tool implementations |
| `src/validation/*.ts` | Fidelity checking and test cases |

### Tools Exposed

1. **analyze_decision** - Full strategic analysis using all frameworks
2. **case_study** - Match situations to canonical Christensen cases
3. **get_framework** - Reference framework details and questions

## Development Guidelines

### Modifying the Persona

Edit `src/personas/christensen.yaml` to change:
- Voice characteristics and phrases
- Framework definitions and questions
- Validation markers
- Sample responses

The persona is loaded at runtime, so changes to the YAML don't require recompilation (but do require server restart).

### Adding Frameworks

1. Create `src/frameworks/new-framework.ts`
2. Export diagnostic questions, prompts, and voice phrases
3. Add to `src/frameworks/index.ts` barrel export
4. Update tool implementations to include new framework

### Testing Changes

Run `npm test` to validate against fidelity markers. Tests use real decision scenarios and check for:
- Framework references present
- JTBD questions asked
- Humility markers included
- No anti-patterns (overconfidence, dismissiveness)

### Fidelity Markers

Outputs should **always include**:
- Reference to specific framework (JTBD, disruption, CPP)
- Question about the job to be done
- Humility ("the theory suggests...")
- Connection to case study
- Organizational constraint consideration

Outputs should **never include**:
- Overconfident predictions ("definitely", "guaranteed")
- Dismissive language (except Christensen's empathetic usage)
- Generic advice without theory grounding

## Persona YAML Structure

```yaml
identity:       # Who is this persona
voice:          # How they communicate (tone, phrases, style)
frameworks:     # Their mental models (concepts, questions)
analysis_patterns:  # How they structure thinking
validation:     # Fidelity markers and sample responses
```

This structure is designed to be reusable for other persona agents.

## Factory Context

This project is part of a persona agent factory proof-of-concept. The BUILD_LOG.md documents the entire 5-day build process so future agents can be built faster.

Key metrics:
- Day 1: Persona definition (1 hour)
- Day 2: Framework implementation (1.5 hours)
- Day 3: MCP integration (1 hour)
- Day 4: Testing & validation (45 min)
- Day 5: Community prep (current)

Total: ~4.5 hours for a complete persona agent.
