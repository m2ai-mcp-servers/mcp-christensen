#!/usr/bin/env node

/**
 * Christensen MCP Server
 *
 * Clayton Christensen persona agent for strategic advisory.
 * Applies disruption theory, jobs-to-be-done, and capabilities
 * analysis to business decisions.
 *
 * Tools:
 * - analyze_decision: Full strategic analysis using all frameworks
 * - case_study: Find and explore relevant case studies
 * - get_framework: Learn about specific frameworks
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  analyzeDecision,
  getAnalyzeDecisionToolDefinition,
  findCaseStudy,
  getCaseStudyToolDefinition,
  listCaseStudies,
  getFramework,
  getFrameworkToolDefinition,
} from "./tools/index.js";

// ============================================================
// Server Setup
// ============================================================

const server = new Server(
  {
    name: "christensen-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================================
// Tool Definitions
// ============================================================

const TOOLS = [
  getAnalyzeDecisionToolDefinition(),
  getCaseStudyToolDefinition(),
  getFrameworkToolDefinition(),
];

// ============================================================
// Request Handlers
// ============================================================

/**
 * Handle tools/list requests
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

/**
 * Handle tools/call requests
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "analyze_decision": {
        const result = await analyzeDecision(args as any);
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      case "case_study": {
        // Handle special case: no situation provided = list all
        if (!args || (!args.situation && !args.caseName)) {
          const result = listCaseStudies();
          return {
            content: [
              {
                type: "text" as const,
                text: result,
              },
            ],
          };
        }
        const result = await findCaseStudy(args as any);
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      case "get_framework": {
        const result = await getFramework(args as any);
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================================
// Server Startup
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Christensen MCP server running on stdio");
  console.error("Available tools: analyze_decision, case_study, get_framework");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
