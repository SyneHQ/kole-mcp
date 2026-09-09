#!/usr/bin/env node

/**
 * SyneHQ Kole MCP Server
 *
 * A Model Context Protocol server for executing queries against your data
 * through SyneHQ's Kole platform. Supports SQL, PostgreSQL commands, and
 * natural language queries.
 *
 * Environment Variables:
 * - SYNEHQ_API_KEY: Your SyneHQ API key (required)
 * - SYNEHQ_CONNECTION_ID: Default connection ID (optional, can be per-query)
 * - SYNEHQ_BASE_URL: API base URL (default: https://cosmos.synehq.com)
 * - SYNEHQ_DATA_URL: Data API base URL (default: https://data.synehq.com)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Configuration
const SYNEHQ_API_KEY = process.env.SYNEHQ_API_KEY;
const SYNEHQ_CONNECTION_ID = process.env.SYNEHQ_CONNECTION_ID;
const SYNEHQ_BASE_URL = process.env.SYNEHQ_BASE_URL || "https://cosmos.synehq.com";
const SYNEHQ_DATA_URL = process.env.SYNEHQ_DATA_URL || "https://data.synehq.com";

if (!SYNEHQ_API_KEY) {
  console.error("Error: SYNEHQ_API_KEY environment variable is required");
  process.exit(1);
}

// Zod schemas for request validation
const ExecuteQuerySchema = z.object({
  query: z.string().describe("SQL query or natural language query to execute"),
  connectionId: z
    .string()
    .optional()
    .describe("Connection ID (uses SYNEHQ_CONNECTION_ID env var if not provided)"),
  database: z
    .string()
    .optional()
    .describe("Database name to execute the query against"),
  userId: z.string().optional().describe("User ID for query tracking"),
  psql: z
    .boolean()
    .optional()
    .describe("Deprecated: CLI metacommands are disabled; SQL uses the server-enforced key capability"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of rows to return (default: no limit)"),
  timeout: z
    .number()
    .optional()
    .describe("Query timeout in milliseconds (default: 30000)"),
});

const TestConnectionSchema = z.object({
  connectionId: z
    .string()
    .optional()
    .describe("Connection ID to test (uses SYNEHQ_CONNECTION_ID env var if not provided)"),
});

const GetTablesSchema = z.object({
  connectionId: z
    .string()
    .optional()
    .describe("Connection ID (uses SYNEHQ_CONNECTION_ID env var if not provided)"),
  database: z.string().optional().describe("Database name to filter tables"),
  schema: z.string().optional().describe("Schema name to filter tables"),
});

const GetTableSchemaSchema = z.object({
  connectionId: z
    .string()
    .optional()
    .describe("Connection ID (uses SYNEHQ_CONNECTION_ID env var if not provided)"),
  database: z.string().describe("Database name"),
  schema: z.string().describe("Schema name"),
  table: z.string().describe("Table name"),
});

const GetConnectionsSchema = z.object({});

const GetAuthInfoSchema = z.object({});

// Helper function to remove undefined values
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as Partial<T>;
}

// API client
class SyneHQClient {
  private baseURL: string;
  private dataURL: string;
  private apiKey: string;

  constructor(baseURL: string, dataURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.dataURL = dataURL;
    this.apiKey = apiKey;
  }

  async executeQuery(params: z.infer<typeof ExecuteQuerySchema>) {
    if (params.psql) throw new Error("psql metacommands are disabled; use SQL with an appropriately scoped API key");
    const connectionId = params.connectionId || SYNEHQ_CONNECTION_ID;
    if (!connectionId) {
      throw new Error(
        "Connection ID is required. Provide via connectionId parameter or SYNEHQ_CONNECTION_ID env var"
      );
    }

    const requestData = removeUndefined({
      query: params.query,
      id: connectionId,
      transaction: true,
      limit: params.limit,
      timeout: params.timeout,
      connection: {
        database: params.database
      }
    });

    const response = await fetch(`${this.baseURL}/api/v1/magic.query`, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
      headers: removeUndefined({
        "Content-Type": "application/json",
        "X-API-KEY": this.apiKey,
        Connection: "keep-alive",
      }),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SyneHQ API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  }

  async testConnection(params: z.infer<typeof TestConnectionSchema>) {
    const connectionId = params.connectionId || SYNEHQ_CONNECTION_ID;
    if (!connectionId) {
      throw new Error(
        "Connection ID is required. Provide via connectionId parameter or SYNEHQ_CONNECTION_ID env var"
      );
    }

    const response = await fetch(
      `${this.baseURL}/api/v1/metadata/test-connection`,
      {
        method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
        body: JSON.stringify({ id: connectionId }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SyneHQ API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  }

  async getTables(params: z.infer<typeof GetTablesSchema>) {
    const connectionId = params.connectionId || SYNEHQ_CONNECTION_ID;
    if (!connectionId) {
      throw new Error(
        "Connection ID is required. Provide via connectionId parameter or SYNEHQ_CONNECTION_ID env var"
      );
    }

    const requestData = removeUndefined({
      id: connectionId,
      database: params.database,
      schema: params.schema,
    });

    const response = await fetch(`${this.baseURL}/api/v1/metadata/tables`, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": this.apiKey,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SyneHQ API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  }

  async getTableSchema(params: z.infer<typeof GetTableSchemaSchema>) {
    const connectionId = params.connectionId || SYNEHQ_CONNECTION_ID;
    if (!connectionId) {
      throw new Error(
        "Connection ID is required. Provide via connectionId parameter or SYNEHQ_CONNECTION_ID env var"
      );
    }

    const response = await fetch(
      `${this.baseURL}/api/v1/metadata/table/${params.database}/${params.schema}/${params.table}`,
      {
        method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
        body: JSON.stringify({ id: connectionId }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SyneHQ API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  }

  async getConnections() {
    const response = await fetch(`${this.dataURL}/api/connections`, {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
      headers: {
        "X-API-KEY": this.apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SyneHQ API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  }

  getAuthInfo() {
    return {
      platform: "SyneHQ",
      loginUrl: "https://data.synehq.com/login",
      signupUrl: "https://data.synehq.com/signup",
      dashboardUrl: "https://data.synehq.com/dashboard",
      docsUrl: "https://docs.synehq.com",
      message: "Visit the SyneHQ platform to create an account, get your API key, and set up database connections.",
      instructions: [
        "1. Sign up at https://data.synehq.com/signup",
        "2. Log in at https://data.synehq.com/login",
        "3. Go to Settings → API Keys to create your API key",
        "4. Go to Connections to set up your database connections",
        "5. Copy your API key and Connection ID to use with this MCP server",
      ],
    };
  }
}

// Tool definitions
const TOOLS: Tool[] = [
  {
    name: "execute_query",
    description:
      "Execute a SQL query or natural language query against your data through SyneHQ Kole. " +
      "Supports SQL queries subject to the API key permission and connector policy. " +
      "Perfect for data analysis, reporting, and database operations.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "SQL query or natural language query to execute. Examples:\n" +
            "- 'SELECT * FROM users LIMIT 10'\n" +
            "- 'Show me the top 5 customers by revenue'\n" +
            "- 'What are the active subscriptions?'",
        },
        connectionId: {
          type: "string",
          description:
            "Connection ID for the database. If not provided, uses SYNEHQ_CONNECTION_ID environment variable.",
        },
        database: {
          type: "string",
          description:
            "Database name to execute the query against.",
        },
        userId: {
          type: "string",
          description: "User ID for query tracking and audit logs",
        },
        psql: {
          type: "boolean",
          description:
            "Deprecated: CLI metacommands are disabled; use ordinary SQL",
        },
        limit: {
          type: "number",
          description: "Maximum number of rows to return (helps with large result sets)",
        },
        timeout: {
          type: "number",
          description: "Query timeout in milliseconds (default: 30000)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "test_connection",
    description:
      "Test the connection to a SyneHQ database to verify credentials and accessibility. " +
      "Useful before running queries to ensure the connection is valid.",
    inputSchema: {
      type: "object",
      properties: {
        connectionId: {
          type: "string",
          description:
            "Connection ID to test. If not provided, uses SYNEHQ_CONNECTION_ID environment variable.",
        },
      },
    },
  },
  {
    name: "get_tables",
    description:
      "List all tables available in the connected database. " +
      "Can be filtered by database and schema. Helps discover what data is available.",
    inputSchema: {
      type: "object",
      properties: {
        connectionId: {
          type: "string",
          description:
            "Connection ID. If not provided, uses SYNEHQ_CONNECTION_ID environment variable.",
        },
        database: {
          type: "string",
          description: "Filter tables by database name",
        },
        schema: {
          type: "string",
          description: "Filter tables by schema name",
        },
      },
    },
  },
  {
    name: "get_table_schema",
    description:
      "Get detailed schema information for a specific table, including column names, " +
      "data types, constraints, and indexes. Essential for understanding table structure.",
    inputSchema: {
      type: "object",
      properties: {
        connectionId: {
          type: "string",
          description:
            "Connection ID. If not provided, uses SYNEHQ_CONNECTION_ID environment variable.",
        },
        database: {
          type: "string",
          description: "Database name",
        },
        schema: {
          type: "string",
          description: "Schema name",
        },
        table: {
          type: "string",
          description: "Table name",
        },
      },
      required: ["database", "schema", "table"],
    },
  },
  {
    name: "get_connections",
    description:
      "List all database connections available in your SyneHQ account. " +
      "Returns connection details including IDs, names, types, and status. " +
      "Useful for discovering which databases you can query and their connection IDs.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_auth_info",
    description:
      "Get information about how to sign up, log in, and get started with SyneHQ. " +
      "Returns URLs for signup, login, dashboard, and documentation. " +
      "Use this when users need to create an account or get their API credentials.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Initialize MCP server
const server = new Server(
  {
    name: "synehq-kole",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const client = new SyneHQClient(SYNEHQ_BASE_URL, SYNEHQ_DATA_URL, SYNEHQ_API_KEY);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "execute_query": {
        const params = ExecuteQuerySchema.parse(args);
        const result = await client.executeQuery(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "test_connection": {
        const params = TestConnectionSchema.parse(args);
        const result = await client.testConnection(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_tables": {
        const params = GetTablesSchema.parse(args);
        const result = await client.getTables(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_table_schema": {
        const params = GetTableSchemaSchema.parse(args);
        const result = await client.getTableSchema(params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_connections": {
        const params = GetConnectionsSchema.parse(args);
        const result = await client.getConnections();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_auth_info": {
        const params = GetAuthInfoSchema.parse(args);
        const result = client.getAuthInfo();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid arguments: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
      );
    }
    throw error;
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SyneHQ Kole MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
