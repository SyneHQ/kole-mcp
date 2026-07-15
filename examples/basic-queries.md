# Basic Query Examples

This file contains practical examples of using the SyneHQ Kole MCP server.

## Setup

First, ensure your environment is configured:

```bash
export SYNEHQ_API_KEY="your_api_key_here"
export SYNEHQ_CONNECTION_ID="your_connection_id"
```

## Example 1: Simple Data Retrieval

Get the first 10 users from your database:

```sql
SELECT * FROM users LIMIT 10
```

**With MCP tool:**
```javascript
execute_query({
  query: "SELECT * FROM users LIMIT 10"
})
```

## Example 2: Filtered Query

Find all active users created this year:

```sql
SELECT 
  id,
  email,
  name,
  created_at
FROM users
WHERE status = 'active'
  AND created_at >= '2024-01-01'
ORDER BY created_at DESC
```

## Example 3: Aggregation Query

Calculate monthly revenue:

```sql
SELECT 
  DATE_TRUNC('month', order_date) as month,
  COUNT(*) as order_count,
  SUM(total_amount) as revenue,
  AVG(total_amount) as avg_order_value
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY month
ORDER BY month DESC
```

## Example 4: Join Query

Get user order statistics:

```sql
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.total_amount) as lifetime_value,
  MAX(o.order_date) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY lifetime_value DESC
LIMIT 50
```

## Example 5: PostgreSQL Commands

### List all tables
```javascript
execute_query({
  query: "\\dt",
  psql: true
})
```

### Describe table structure
```javascript
execute_query({
  query: "\\d+ users",
  psql: true
})
```

### Create table
```javascript
execute_query({
  query: `
    CREATE TABLE user_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      session_token VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP NOT NULL
    )
  `,
  psql: true
})
```

### Create index
```javascript
execute_query({
  query: "CREATE INDEX idx_user_sessions_token ON user_sessions(session_token)",
  psql: true
})
```

## Example 6: Natural Language Queries

### Top customers
```javascript
execute_query({
  query: "Show me the top 10 customers by total revenue"
})
```

### Recent activity
```javascript
execute_query({
  query: "How many orders were placed in the last 7 days?"
})
```

### Product analysis
```javascript
execute_query({
  query: "What are the best-selling products this month?"
})
```

## Example 7: Advanced Analytics

### Customer Cohort Analysis
```sql
WITH cohorts AS (
  SELECT 
    user_id,
    DATE_TRUNC('month', MIN(order_date)) as cohort_month
  FROM orders
  GROUP BY user_id
),
monthly_activity AS (
  SELECT 
    c.cohort_month,
    DATE_TRUNC('month', o.order_date) as activity_month,
    COUNT(DISTINCT o.user_id) as active_users
  FROM cohorts c
  JOIN orders o ON c.user_id = o.user_id
  WHERE c.cohort_month >= '2024-01-01'
  GROUP BY c.cohort_month, activity_month
)
SELECT 
  cohort_month,
  activity_month,
  active_users,
  EXTRACT(MONTH FROM AGE(activity_month, cohort_month)) as months_since_first_order
FROM monthly_activity
ORDER BY cohort_month, activity_month
```

### RFM Segmentation
```sql
WITH rfm_calc AS (
  SELECT 
    user_id,
    EXTRACT(DAY FROM NOW() - MAX(order_date)) as recency_days,
    COUNT(*) as frequency,
    SUM(total_amount) as monetary
  FROM orders
  GROUP BY user_id
),
rfm_scores AS (
  SELECT 
    user_id,
    recency_days,
    frequency,
    monetary,
    NTILE(5) OVER (ORDER BY recency_days ASC) as r_score,
    NTILE(5) OVER (ORDER BY frequency DESC) as f_score,
    NTILE(5) OVER (ORDER BY monetary DESC) as m_score
  FROM rfm_calc
)
SELECT 
  user_id,
  recency_days,
  frequency,
  monetary,
  r_score || f_score || m_score as rfm_score,
  CASE 
    WHEN r_score >= 4 AND f_score >= 4 THEN 'Champions'
    WHEN r_score >= 3 AND f_score >= 3 THEN 'Loyal Customers'
    WHEN r_score >= 4 AND f_score <= 2 THEN 'Promising'
    WHEN r_score <= 2 AND f_score >= 3 THEN 'At Risk'
    WHEN r_score <= 2 AND f_score <= 2 THEN 'Lost'
    ELSE 'Others'
  END as customer_segment
FROM rfm_scores
ORDER BY monetary DESC
LIMIT 100
```

## Example 8: Data Quality Checks

### Find NULL values
```sql
SELECT 
  COUNT(*) as total_rows,
  COUNT(*) FILTER (WHERE email IS NULL) as null_emails,
  COUNT(*) FILTER (WHERE phone IS NULL) as null_phones,
  COUNT(*) FILTER (WHERE address IS NULL) as null_addresses,
  ROUND(100.0 * COUNT(*) FILTER (WHERE email IS NULL) / COUNT(*), 2) as null_email_pct
FROM users
```

### Find duplicate records
```sql
SELECT 
  email,
  COUNT(*) as duplicate_count
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
```

### Check data freshness
```sql
SELECT 
  'users' as table_name,
  MAX(created_at) as latest_record,
  MIN(created_at) as earliest_record,
  COUNT(*) as total_records
FROM users
UNION ALL
SELECT 
  'orders' as table_name,
  MAX(order_date) as latest_record,
  MIN(order_date) as earliest_record,
  COUNT(*) as total_records
FROM orders
```

## Example 9: Performance Optimization

### Use EXPLAIN to analyze queries
```javascript
execute_query({
  query: "EXPLAIN ANALYZE SELECT * FROM users WHERE email LIKE '%@gmail.com'",
  psql: true
})
```

### Check table sizes
```javascript
execute_query({
  query: `
    SELECT 
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
      pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  `,
  psql: true
})
```

### Check index usage
```javascript
execute_query({
  query: `
    SELECT 
      schemaname,
      tablename,
      indexname,
      idx_scan as index_scans,
      pg_size_pretty(pg_relation_size(indexrelid)) as index_size
    FROM pg_stat_user_indexes
    ORDER BY idx_scan DESC
  `,
  psql: true
})
```

## Example 10: Multiple Connections

### Query production database
```javascript
execute_query({
  query: "SELECT COUNT(*) as prod_users FROM users",
  connectionId: "prod-db-connection"
})
```

### Query staging database
```javascript
execute_query({
  query: "SELECT COUNT(*) as staging_users FROM users",
  connectionId: "staging-db-connection"
})
```

### Query analytics database
```javascript
execute_query({
  query: "SELECT * FROM daily_metrics WHERE date >= CURRENT_DATE - 30",
  connectionId: "analytics-db-connection"
})
```

## Example 11: Querying Specific Databases

If a single connection ID (e.g. your Postgres connection) has multiple databases associated with it, you can target a specific database using the `database` parameter:

### Query the marketing database under your production connection
```javascript
execute_query({
  query: "SELECT COUNT(*) FROM campaigns",
  connectionId: "prod-db-connection",
  database: "marketing"
})
```

### Query the billing database under your production connection
```javascript
execute_query({
  query: "SELECT COUNT(*) FROM invoices",
  connectionId: "prod-db-connection",
  database: "billing"
})
```

## Tips

1. **Always use LIMIT** when exploring data to avoid large result sets
2. **Test connections first** before running complex queries
3. **Use metadata tools** to discover database structure
4. **Enable psql mode** for PostgreSQL-specific features
5. **Set appropriate timeouts** for long-running queries
6. **Use user IDs** for audit tracking
7. **Filter early** in your queries for better performance
8. **Index frequently queried columns** for faster results
