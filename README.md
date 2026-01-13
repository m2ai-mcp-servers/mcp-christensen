# Christensen MCP Server

A Clayton Christensen persona agent for strategic advisory, implemented as an MCP (Model Context Protocol) server.

**Apply disruption theory, jobs-to-be-done, and capabilities analysis to your business decisions.**

## What This Does

This MCP server gives Claude the ability to analyze decisions through Clayton Christensen's frameworks:

- **Jobs-to-Be-Done**: What job is the customer hiring your product to do?
- **Disruption Theory**: Is this sustaining or disruptive? Who are the non-consumers?
- **Capabilities-Processes-Priorities**: Do you have the capability to execute?
- **Resource Dependence**: What constraints do your resource providers create?

When you connect this server to Claude Desktop or Claude Code, you get a strategic advisor that thinks like Christensen—asking the right questions, connecting to historical patterns, and offering theory-grounded insights with appropriate humility.

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/m2ai-mcp-servers/christensen-mcp.git
cd christensen-mcp

# Install dependencies
npm install

# Build
npm run build
```

### Configure Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "christensen": {
      "command": "node",
      "args": ["/path/to/christensen-mcp/dist/index.js"]
    }
  }
}
```

### Configure Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "christensen": {
      "command": "node",
      "args": ["./path/to/christensen-mcp/dist/index.js"]
    }
  }
}
```

## Tools

### `analyze_decision`

Full strategic analysis using all Christensen frameworks.

```
Use the analyze_decision tool to evaluate: Should we pursue enterprise customers or focus on SMBs?
```

**Parameters:**
- `decision` (required): The business decision to analyze
- `context`: Additional context about your situation
- `organization`: Your org type, size, industry, current focus
- `market`: Incumbents, competitors, customer segments
- `focusAreas`: Specific frameworks to apply (`jtbd`, `disruption`, `cpp`, `resource-dependence`)

### `case_study`

Explore Christensen's canonical case studies and match them to your situation.

```
Use the case_study tool to find patterns matching: We're a low-cost entrant being ignored by incumbents
```

**Available cases:**
- `steel_minimills`: Low-end disruption with asymmetric motivation
- `disk_drives`: New-market disruption with different value network
- `milkshake`: Jobs-to-be-done discovery through circumstance
- `honda_motorcycles`: Emergent strategy through market learning
- `intel_microprocessors`: Capability migration through process investment

### `get_framework`

Learn about any Christensen framework in detail.

```
Use the get_framework tool with framework: jtbd and detail: full
```

**Frameworks:** `jtbd`, `disruption`, `cpp`, `resource-dependence`, `all`
**Detail levels:** `summary`, `full`, `questions-only`

## Example Conversations

### Strategic Decision Analysis

> **You:** I'm trying to decide whether to build individual AI agents or invest in a factory process for creating them. Can you analyze this using Christensen's frameworks?

> **Claude:** *Uses analyze_decision tool*
>
> Let me think through this using Christensen's frameworks...
>
> **Jobs-to-Be-Done**: What job are your customers hiring an AI agent to do? If they need specialized expertise (functional), confidence in the advice (emotional), and credibility (social), individual high-quality agents might serve that job better. But if they need to create their own agents quickly, the factory serves a different job entirely.
>
> **The Intel Pattern**: I'm reminded of Intel's pivot from memory to microprocessors. The insight wasn't about resources—Japanese firms could acquire those. It was about *processes*. Intel's chip design and manufacturing processes transferred to the new opportunity.
>
> The question I'd ask: What processes have you developed building this first agent that could transfer to a factory? If the process is the real capability, the factory might be more valuable than any single agent.

### Case Study Matching

> **You:** We're entering a market with a simpler, cheaper product. Incumbents seem happy to ignore us.

> **Claude:** *Uses case_study tool*
>
> This matches the **Steel Mini-Mills** pattern closely.
>
> The integrated steel mills were *relieved* to cede the rebar market to mini-mills—it was low-margin work. But mini-mills improved and moved upmarket to angle iron, then structural steel, then sheet steel. At each tier, the integrated mills rationally retreated.
>
> The theory would predict: If incumbents are happy to ignore you, that's actually a warning sign *for them*. The question is whether you're on an improvement trajectory that will eventually satisfy mainstream customers.
>
> What I'd want to understand: Are you improving along dimensions that will matter to their current customers eventually?

## How It Works

The MCP server provides **prompt-shaping context**, not deterministic logic. When you call a tool:

1. The server structures your decision using Christensen's frameworks
2. It matches relevant case studies and diagnostic questions
3. It provides Christensen's voice characteristics and phrases
4. Claude applies the reasoning with the persona's analytical approach

This design lets Claude do what it does best—nuanced reasoning and judgment—while the MCP tools ensure the analysis stays grounded in Christensen's theory.

## Persona Fidelity

The agent is designed to maintain high fidelity to Christensen's actual thinking:

**Must include:**
- Reference to specific frameworks (JTBD, disruption, CPP)
- Questions about the customer's job to be done
- Humility about predictions ("the theory suggests...")
- Connection to historical case studies
- Consideration of organizational constraints

**Must avoid:**
- Overconfident predictions
- Dismissing incumbents as stupid (they're rational!)
- Generic business advice without theory grounding

Run `npm test` to validate outputs against these fidelity markers.

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run dev

# Run validation tests
npm test

# Test with MCP Inspector
npm run inspector
```

## Project Structure

```
christensen-mcp/
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── persona-loader.ts        # YAML persona parser
│   ├── personas/
│   │   └── christensen.yaml     # Core persona definition
│   ├── frameworks/
│   │   ├── types.ts             # Shared types
│   │   ├── jobs-to-be-done.ts   # JTBD framework
│   │   ├── disruption.ts        # Disruption theory
│   │   └── capabilities.ts      # CPP + Resource Dependence
│   ├── tools/
│   │   ├── analyze-decision.ts  # Main analysis tool
│   │   ├── case-study.ts        # Case study explorer
│   │   └── get-framework.ts     # Framework reference
│   └── validation/
│       ├── fidelity-check.ts    # Output validation
│       └── test-decisions.ts    # Test cases
├── docs/
│   ├── BUILD_LOG.md             # Development process journal
│   └── CHRISTENSEN_SPEC.md      # Persona specification
└── dist/                        # Compiled JavaScript
```

## Factory Pattern

This agent was built as a proof-of-concept for a **persona agent factory**. The BUILD_LOG.md documents the entire process so future agents can be built faster.

Key patterns extracted:
1. **Persona YAML structure**: identity, voice, frameworks, validation
2. **Framework module pattern**: questions, prompts, voice phrases
3. **Fidelity validation**: automated testing against persona markers

## Credits

Built on Clayton Christensen's work, including:
- *The Innovator's Dilemma* (1997)
- *The Innovator's Solution* (2003)
- *Competing Against Luck* (2016)

This is an educational tool meant to help apply Christensen's publicly available frameworks. It is not affiliated with or endorsed by the Christensen Institute.

## License

MIT

---

*Built with Claude Code as a demonstration of MCP server development and persona agent architecture.*
