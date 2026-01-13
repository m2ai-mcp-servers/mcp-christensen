#!/usr/bin/env node

/**
 * Christensen MCP Server
 *
 * Clayton Christensen persona agent for strategic advisory.
 * Applies disruption theory, jobs-to-be-done, and capabilities
 * analysis to business decisions.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

// TODO Day 2: Import and register framework handlers
// TODO Day 3: Implement analyze-decision tool
// TODO Day 3: Implement case-study tool

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Christensen MCP server running on stdio");
}

main().catch(console.error);
