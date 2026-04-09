# SyneHQ Kole MCP Server

[![npm version](https://badge.fury.io/js/@synehq%2Fkole-mcp.svg)](https://www.npmjs.com/package/@synehq/kole-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@synehq/kole-mcp)](https://nodejs.org)

Query your databases using SQL, PostgreSQL, or plain English through SyneHQ's Kole platform. Built on the Model Context Protocol.

## Why?

We built this because switching between database clients, writing boilerplate SQL, and remembering schema details gets old fast. Now you can just ask questions about your data in whatever way makes sense—whether that's raw SQL, psql shortcuts, or "show me last month's top customers."

## What it does

- Runs SQL queries against any connected database
- Supports PostgreSQL-specific commands (`\dt`, `\d+`, DDL operations)
- Translates natural language questions into proper SQL
- Lists tables, schemas, and connection details
- Tests connections before you waste time on bad queries
- Includes a skill with 50+ real-world query patterns

## Getting started

### Security & Prerequisites

**⚠️ Important Security Information**

This MCP server can execute arbitrary SQL queries and DDL statements (CREATE, ALTER, DROP) against your connected databases. Before installing:

1. **Review the source code**: Check [github.com/synehq/kole-mcp](https://github.com/synehq/kole-mcp) to understand what the API key grants access to
2. **Use least-privilege credentials**: For testing, use read-only database users when possible
3. **Test on non-production databases first**: Verify behavior before connecting to production data
4. **Never commit credentials**: Keep SYNEHQ_API_KEY out of version control
5. **Understand audit logging**: All queries are logged server-side at [data.synehq.com/dashboard](https://data.synehq.com/dashboard) → Audit Logs

The SYNEHQ_API_KEY grants access to query all databases connected to your SyneHQ account.

### Install

```bash
npm install -g @synehq/kole-mcp
```

Or build from source:

```bash
git clone https://github.com/synehq/kole-mcp.git
cd kole-mcp
npm install
npm run build
```

### Set up credentials

You'll need a SyneHQ account and API key. If you don't have one:

```bash
# Get signup info
curl https://data.synehq.com/api/auth-info
```

Then set your environment:

```bash
export SYNEHQ_API_KEY="your_api_key"
export SYNEHQ_CONNECTION_ID="your_connection_id"  # optional
```

### Configure your MCP client

#### For desktop apps

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "synehq-kole": {
      "command": "npx",
      "args": ["-y", "@synehq/kole-mcp@latest"],
      "env": {
        "SYNEHQ_API_KEY": "your_api_key",
        "SYNEHQ_CONNECTION_ID": "your_connection_id"
      }
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "synehq-kole": {
      "command": "synehq-kole-mcp",
      "env": {
        "SYNEHQ_API_KEY": "your_api_key",
        "SYNEHQ_CONNECTION_ID": "your_connection_id"
      }
    }
  }
}
```

#### For project-level setup

Create `.mcp.json`:

```json
{
  "synehq-kole": {
    "command": "npx",
    "args": ["-y", "@synehq/kole-mcp@latest"],
    "env": {
      "SYNEHQ_API_KEY": "${SYNEHQ_API_KEY}",
      "SYNEHQ_CONNECTION_ID": "${SYNEHQ_CONNECTION_ID}"
    }
  }
}
```

Or if installed globally:

```json
{
  "synehq-kole": {
    "command": "synehq-kole-mcp",
    "env": {
      "SYNEHQ_API_KEY": "${SYNEHQ_API_KEY}",
      "SYNEHQ_CONNECTION_ID": "${SYNEHQ_CONNECTION_ID}"
    }
  }
}
```

## Usage

### Quick examples

**Run SQL:**
```javascript
execute_query({
  query: "SELECT * FROM users WHERE created_at > '2024-01-01' LIMIT 10"
})
```

**Ask in English:**
```javascript
execute_query({
  query: "Show me the top 5 customers by revenue this month"
})
```

**PostgreSQL shortcuts:**
```javascript
execute_query({
  query: "\\dt",
  psql: true
})
```

**Override connection:**
```javascript
execute_query({
  query: "SELECT COUNT(*) FROM orders",
  connectionId: "staging-db"
})
```

### Available tools

#### `execute_query`

The main tool. Pass it SQL, psql commands, or natural language.

Parameters:
- `query` (required) — SQL, psql command, or question in plain English
- `connectionId` (optional) — Which database to query
- `userId` (optional) — For audit logs
- `psql` (optional) — Enable PostgreSQL mode for DDL and psql commands
- `limit` (optional) — Cap results (useful for large tables)
- `timeout` (optional) — Query timeout in milliseconds

#### `get_connections`

Lists all your database connections. No parameters needed.

Returns connection IDs, names, types (PostgreSQL, MySQL, etc.), and status.

#### `test_connection`

Checks if a connection works before you query it.

```javascript
test_connection({ connectionId: "prod-db" })
```

#### `get_tables`

Lists tables, optionally filtered by database and schema.

```javascript
get_tables({ database: "production", schema: "public" })
```

#### `get_table_schema`

Shows columns, types, constraints, and indexes for a table.

```javascript
get_table_schema({
  database: "production",
  schema: "public",
  table: "users"
})
```

#### `get_auth_info`

Returns signup and login URLs if you need to create an account.

## Real-world examples

### Business questions

```sql
-- Monthly revenue trend
SELECT 
  DATE_TRUNC('month', order_date) as month,
  SUM(total_amount) as revenue
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY month
ORDER BY month DESC;

-- Customer lifetime value
SELECT 
  customer_id,
  COUNT(*) as order_count,
  SUM(total_amount) as lifetime_value
FROM orders
GROUP BY customer_id
ORDER BY lifetime_value DESC
LIMIT 20;
```

### Natural language (just say it)

```
"What are the top 10 products by sales this quarter?"
"Show me users who signed up last week"
"How many orders are pending?"
"What's the average order value by region?"
```

### PostgreSQL power-user stuff

```sql
-- Inspect schema
\dt public.*
\d+ orders

-- Create things
CREATE TABLE cache (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE,
  data JSONB,
  expires_at TIMESTAMP
);

CREATE INDEX idx_cache_key ON cache(key);

-- Drop things
DROP TABLE IF EXISTS temp_table;
```

## Working with multiple databases

You can query different databases in the same session:

```javascript
// Check production
execute_query({
  query: "SELECT COUNT(*) FROM users",
  connectionId: "prod-db"
})

// Compare with staging
execute_query({
  query: "SELECT COUNT(*) FROM users",
  connectionId: "staging-db"
})
```

## Development

```bash
npm install
npm run build        # compile TypeScript
npm run dev          # watch mode
npm start            # run the server
```

## Troubleshooting

**"SYNEHQ_API_KEY environment variable is required"**

You forgot to set your API key:
```bash
export SYNEHQ_API_KEY=your_api_key
```

**"Connection ID is required"**

Either set a default:
```bash
export SYNEHQ_CONNECTION_ID=your_connection_id
```

Or pass it with each query:
```javascript
execute_query({
  query: "SELECT * FROM users",
  connectionId: "your_connection_id"
})
```

**Query times out**

Increase the timeout or limit results:
```javascript
execute_query({
  query: "SELECT * FROM huge_table",
  limit: 1000,
  timeout: 60000  // 1 minute
})
```

**Connection fails**

Test it first:
```javascript
test_connection({ connectionId: "your_connection" })
```

Check the dashboard to make sure the connection is configured correctly and the database is accessible.

## Security

### Required Credentials

This MCP server requires two environment variables:

- **SYNEHQ_API_KEY** (required): Authentication key that grants access to query all databases connected to your SyneHQ account
- **SYNEHQ_CONNECTION_ID** (optional): Default database connection ID (can be overridden per-query)

Get your credentials:
1. Sign up at https://data.synehq.com/signup
2. Get API key from dashboard: Settings → API Keys
3. Get connection ID from dashboard: Connections

### Security Best Practices

**What this MCP server can do:**
- Execute arbitrary SQL SELECT, INSERT, UPDATE, DELETE statements
- Execute PostgreSQL DDL statements (CREATE TABLE, ALTER TABLE, DROP TABLE, etc.)
- Access all databases connected to your SyneHQ account
- Read database schemas and metadata

**Recommendations:**
- ✅ Use read-only database users for exploration and testing
- ✅ Test on non-production databases first
- ✅ Review the [source code](https://github.com/synehq/kole-mcp) before installation
- ✅ Use database users with only necessary permissions for production
- ✅ Monitor audit logs at https://data.synehq.com/dashboard → Audit Logs
- ❌ Don't commit SYNEHQ_API_KEY to version control
- ❌ Don't use superuser database credentials
- ❌ Don't share API keys publicly

**Transport security:**
- All API communication over HTTPS
- API keys transmitted via headers (never in URLs or query strings)
- Database credentials managed server-side (never exposed to MCP client)

**Audit logging:**
- All queries logged with timestamps and user IDs (if provided)
- Access logs at https://data.synehq.com/dashboard → Audit Logs
- Track who executed what queries on which databases

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

We're using TypeScript with strict mode, Zod for validation, and the official MCP SDK. Keep PRs focused and add tests when it makes sense.

## Publishing

See [PUBLISHING.md](PUBLISHING.md) for the full release process.

Quick version:
```bash
npm version patch  # or minor, or major
git push --tags
# GitHub Actions handles the rest
```

## License

MIT — see [LICENSE](LICENSE) for details.

## Questions?

- Open an issue: https://github.com/synehq/kole-mcp/issues
- Email us: support@synehq.com
- Read the docs: https://docs.synehq.com

Built by the team at SyneHQ. We're using this in production every day.
