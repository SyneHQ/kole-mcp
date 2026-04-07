# SyneHQ Kole MCP - Quick Start Guide

Get started with the SyneHQ Kole MCP server in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- SyneHQ API key (get one at [cosmos.synehq.com](https://cosmos.synehq.com))
- A database connection set up in SyneHQ

## Installation

### Option 1: Local Development

```bash
# Clone or navigate to the project
cd synehq-kole-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Set environment variables
export SYNEHQ_API_KEY="your_api_key_here"
export SYNEHQ_CONNECTION_ID="your_connection_id"

# Test the server
node dist/index.js
```

### Option 2: NPM Package (coming soon)

```bash
npm install -g @synehq/kole-mcp
```

## Configuration

### For Claude Desktop

1. Open Claude Desktop
2. Go to Settings → Developer → Edit Config
3. Add the MCP server:

```json
{
  "mcpServers": {
    "synehq-kole": {
      "command": "node",
      "args": ["/absolute/path/to/synehq-kole-mcp/dist/index.js"],
      "env": {
        "SYNEHQ_API_KEY": "your_api_key_here",
        "SYNEHQ_CONNECTION_ID": "your_connection_id"
      }
    }
  }
}
```

4. Restart Claude Desktop
5. Look for the 🔌 icon to verify the server is connected

### For Claude Code

1. Create `.mcp.json` in your project root:

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

2. Set environment variables in your shell:

```bash
export SYNEHQ_API_KEY="your_api_key_here"
export SYNEHQ_CONNECTION_ID="your_connection_id"
```

3. Start Claude Code and the server will load automatically

## First Queries

### Test Your Connection

```
Test my database connection
```

Claude will use the `test_connection` tool to verify your setup.

### List Your Tables

```
Show me all the tables in my database
```

Claude will use the `get_tables` tool to list available tables.

### Run a Simple Query

```
Get the first 10 users from the users table
```

Claude will execute:
```sql
SELECT * FROM users LIMIT 10
```

### Ask a Natural Language Question

```
What are my top 5 customers by revenue?
```

Claude will analyze your database and generate the appropriate SQL query.

## Common Commands

### Data Exploration
- "Show me all tables"
- "Describe the users table"
- "Get a sample of data from orders"
- "How many rows are in the products table?"

### Data Analysis
- "What are the top 10 products by sales?"
- "Show me revenue by month for 2024"
- "Find customers who haven't ordered in 30 days"
- "Calculate average order value by region"

### PostgreSQL Operations
- "List all indexes on the users table"
- "Show me the table sizes"
- "Explain the query plan for this query: SELECT * FROM users WHERE email LIKE '%@gmail.com'"
- "Create an index on the email column"

## Tips for Success

1. **Start Simple**: Test your connection first, then explore tables before running complex queries

2. **Use Natural Language**: You don't need to write SQL - just describe what you want

3. **Enable psql Mode**: For PostgreSQL-specific features, say "using psql commands" or "in PostgreSQL mode"

4. **Handle Large Results**: Always use LIMIT when exploring large tables

5. **Multiple Connections**: Specify the connection: "Query my production database: SELECT..."

## Troubleshooting

### Server Won't Start
- Check that Node.js 18+ is installed: `node --version`
- Verify the build succeeded: `npm run build`
- Check for errors in the terminal output

### Connection Failed
- Verify your API key is correct
- Check that your connection ID exists in SyneHQ dashboard
- Test the connection: "Test my database connection"

### Query Timeout
- Increase timeout in the query: `{ timeout: 60000 }`
- Add LIMIT to restrict result size
- Check query performance with EXPLAIN

### Permission Denied
- Verify your API key has access to the connection
- Check connection permissions in SyneHQ dashboard

## Next Steps

1. **Read the Full Documentation**: Check out `README.md` for detailed API reference
2. **Explore Examples**: See `examples/basic-queries.md` for more query patterns
3. **Use the Skill**: Type `/kole` in Claude Code to get the full skill guide
4. **Join the Community**: Visit [docs.synehq.com](https://docs.synehq.com) for support

## Getting Your API Key

1. Go to [cosmos.synehq.com](https://cosmos.synehq.com)
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Click "Create New API Key"
5. Copy the key and keep it secure

## Setting Up a Connection

1. In SyneHQ dashboard, go to Connections
2. Click "New Connection"
3. Choose your database type (PostgreSQL, MySQL, etc.)
4. Enter connection details:
   - Host
   - Port
   - Database name
   - Username
   - Password
5. Test the connection
6. Save and copy the Connection ID

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SYNEHQ_API_KEY` | ✅ Yes | - | Your SyneHQ API key |
| `SYNEHQ_CONNECTION_ID` | ⚠️ Recommended | - | Default database connection |
| `SYNEHQ_BASE_URL` | ❌ No | `https://cosmos.synehq.com` | API base URL |

## Support

- **Documentation**: [docs.synehq.com](https://docs.synehq.com)
- **Email**: support@synehq.com
- **GitHub Issues**: [github.com/synehq/kole-mcp](https://github.com/synehq/kole-mcp)

---

**Happy Querying! 🚀**
