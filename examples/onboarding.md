# Getting Started with SyneHQ Kole

This guide walks you through setting up SyneHQ Kole from scratch.

## Step 1: Get Account Information

If you don't have a SyneHQ account yet, use the MCP server to get signup information:

```javascript
get_auth_info()
```

**Response:**
```json
{
  "platform": "SyneHQ",
  "loginUrl": "https://data.synehq.com/login",
  "signupUrl": "https://data.synehq.com/signup",
  "dashboardUrl": "https://data.synehq.com/dashboard",
  "docsUrl": "https://docs.synehq.com",
  "message": "Visit the SyneHQ platform to create an account...",
  "instructions": [
    "1. Sign up at https://data.synehq.com/signup",
    "2. Log in at https://data.synehq.com/login",
    "3. Go to Settings → API Keys to create your API key",
    "4. Go to Connections to set up your database connections",
    "5. Copy your API key and Connection ID to use with this MCP server"
  ]
}
```

## Step 2: Create Your Account

1. Visit https://data.synehq.com/signup
2. Fill in your details:
   - Email address
   - Password
   - Organization name (optional)
3. Verify your email
4. Log in at https://data.synehq.com/login

## Step 3: Get Your API Key

1. Log in to your dashboard
2. Navigate to **Settings → API Keys**
3. Click **"Create New API Key"**
4. Give it a descriptive name (e.g., "Claude MCP Server")
5. **Copy the API key** - you won't be able to see it again!
6. Store it securely

```bash
# Set as environment variable
export SYNEHQ_API_KEY="sk_your_api_key_here"
```

## Step 4: Set Up a Database Connection

1. In the SyneHQ dashboard, go to **Connections**
2. Click **"New Connection"**
3. Choose your database type:
   - PostgreSQL
   - MySQL
   - SQLite
   - Others...
4. Fill in connection details:
   - **Host**: Your database server address
   - **Port**: Database port (e.g., 5432 for PostgreSQL)
   - **Database**: Database name
   - **Username**: Database user
   - **Password**: Database password
   - **SSL**: Enable if required
5. Click **"Test Connection"** to verify
6. Save the connection
7. **Copy the Connection ID** from the connection details

```bash
# Set as environment variable
export SYNEHQ_CONNECTION_ID="conn_abc123xyz"
```

## Step 5: Verify Your Setup

Use the MCP server to list your connections:

```javascript
get_connections()
```

**Expected Response:**
```json
{
  "connections": [
    {
      "id": "conn_abc123xyz",
      "name": "Production Database",
      "type": "postgresql",
      "status": "active",
      "createdAt": "2026-04-08T10:30:00Z"
    }
  ]
}
```

## Step 6: Test Your Connection

```javascript
test_connection({
  connectionId: "conn_abc123xyz"
})
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Connection successful",
  "database": "production",
  "version": "PostgreSQL 14.5"
}
```

## Step 7: Run Your First Query

```javascript
execute_query({
  query: "SELECT COUNT(*) as total FROM users",
  connectionId: "conn_abc123xyz"
})
```

**Success!** 🎉 You're now ready to query your data with SyneHQ Kole.

## Common Setup Issues

### Issue: "SYNEHQ_API_KEY environment variable is required"

**Solution:**
```bash
# Make sure you've set the API key
export SYNEHQ_API_KEY="your_api_key"

# Verify it's set
echo $SYNEHQ_API_KEY
```

### Issue: "Connection ID is required"

**Solution:**
Either set it as an environment variable:
```bash
export SYNEHQ_CONNECTION_ID="your_connection_id"
```

Or provide it in each query:
```javascript
execute_query({
  query: "SELECT * FROM users LIMIT 10",
  connectionId: "your_connection_id"
})
```

### Issue: "Connection failed" or "Invalid credentials"

**Solutions:**
1. Check your database credentials in SyneHQ dashboard
2. Verify your database is accessible from SyneHQ servers
3. Check firewall rules and whitelist SyneHQ IP addresses
4. Ensure SSL settings match your database requirements
5. Test connection in the SyneHQ dashboard first

### Issue: "API key invalid"

**Solutions:**
1. Verify you copied the complete API key
2. Check for extra spaces or newlines
3. Ensure the API key hasn't been revoked
4. Create a new API key if necessary

## Security Best Practices

1. **Never commit API keys to version control**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   echo "*.key" >> .gitignore
   ```

2. **Use environment variables**
   ```bash
   # Create .env file
   cat > .env << EOF
   SYNEHQ_API_KEY=your_api_key
   SYNEHQ_CONNECTION_ID=your_connection_id
   EOF
   
   # Load environment variables
   source .env
   ```

3. **Rotate API keys regularly**
   - Create new keys every 90 days
   - Revoke old keys after migration
   - Monitor key usage in dashboard

4. **Use read-only database users when possible**
   - Create dedicated users for analytics queries
   - Grant only necessary permissions
   - Monitor query logs

5. **Enable audit logging**
   - Use `userId` parameter in queries for tracking
   - Review query logs in SyneHQ dashboard
   - Set up alerts for suspicious activity

## Next Steps

Now that you're set up, explore these features:

1. **Discover Your Data**
   ```javascript
   get_tables()
   get_table_schema({ database: "prod", schema: "public", table: "users" })
   ```

2. **Run Analytics Queries**
   ```javascript
   execute_query({
     query: "SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as users FROM users GROUP BY month"
   })
   ```

3. **Use Natural Language**
   ```javascript
   execute_query({
     query: "Show me the top 10 customers by revenue"
   })
   ```

4. **Enable PostgreSQL Mode**
   ```javascript
   execute_query({
     query: "\\dt",
     psql: true
   })
   ```

## Resources

- **Documentation**: https://docs.synehq.com
- **Dashboard**: https://data.synehq.com/dashboard
- **API Reference**: https://docs.synehq.com/api
- **Support**: support@synehq.com
- **Status Page**: https://status.synehq.com

## Need Help?

Ask Claude:
- "How do I get my SyneHQ API key?"
- "Show me how to list my database connections"
- "What queries can I run with Kole?"
- "How do I enable PostgreSQL mode?"

Or use the `get_auth_info` tool anytime:
```javascript
get_auth_info()
```

---

**Welcome to SyneHQ Kole! Happy querying! 🚀**
