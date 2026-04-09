# Changelog

All notable changes to the SyneHQ Kole MCP server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-04-09

### Changed
- Add comprehensive security metadata to skill frontmatter for clawhub registry compliance
- Declare required environment variables (SYNEHQ_API_KEY, SYNEHQ_CONNECTION_ID) in structured metadata
- Add MCP server dependency information with package links
- Include installation steps and security warnings in skill metadata
- Expand README security section with best practices and capability descriptions
- Improve transparency about SQL execution capabilities and credential requirements

### Documentation
- Enhanced skill/SKILL.md with `requires_mcp`, `requires_env`, `install_steps`, `security_warnings`, and `audit_logging` metadata
- Added "Security & Prerequisites" section to README
- Expanded security documentation with detailed capabilities and recommendations
- Clarified least-privilege database credential usage

## [1.1.1] - 2026-04-08

### Changed
- Update all MCP configuration examples to use npm package
- Use `npx -y @synehq/kole-mcp@latest` instead of local paths
- Add global installation option using command name
- Simplify setup process for end users

## [1.1.0] - 2026-04-08

### Added
- `get_connections` tool to list all database connections in your SyneHQ account
- `get_auth_info` tool to get signup, login, and onboarding information
- Support for SyneHQ Data API (https://data.synehq.com)
- SYNEHQ_DATA_URL environment variable for data API base URL
- Connection discovery and management features
- Easy onboarding flow for new users
- **Claude Code Skill** - Complete skill bundled with package
  - SKILL.md with comprehensive query patterns
  - Query reference guide (50+ examples)
  - Install script for easy setup
  - Proper frontmatter and structure per Claude Code spec

### Changed
- Updated version to 1.1.0
- Enhanced SyneHQClient to support multiple API endpoints
- Improved documentation with new tools
- Package now includes `skill/` directory in published package

### Documentation
- Added get_connections examples to README
- Added get_auth_info examples to README
- Created skill/SKILL.md with proper frontmatter
- Created skill/references/query-patterns.md with 50+ patterns
- Created INSTALL_SKILL.sh for easy skill installation
- Updated README with skill installation instructions

## [1.0.0] - 2026-04-08

### Added
- Initial release of SyneHQ Kole MCP server
- `execute_query` tool for SQL and natural language queries
- `test_connection` tool for connection verification
- `get_tables` tool for database metadata discovery
- `get_table_schema` tool for detailed table information
- PostgreSQL mode support (psql commands)
- Environment variable configuration (SYNEHQ_API_KEY, SYNEHQ_CONNECTION_ID, SYNEHQ_BASE_URL)
- TypeScript implementation with full type safety
- Comprehensive documentation and examples
- Claude Code skill integration (`/kole`)
- Support for query timeouts and result limits
- User ID tracking for audit logs
- Multi-connection support
- Detailed error handling and validation

### Features
- Execute SQL queries against connected databases
- Natural language to SQL translation support
- PostgreSQL-specific commands (\dt, \d+, CREATE, DROP, ALTER, etc.)
- Real-time query execution through SyneHQ Cosmos API
- Connection testing and validation
- Database schema introspection
- Table and column metadata discovery
- Query result limiting and pagination
- Configurable timeouts for long-running queries
- Support for multiple database connections
- User tracking for compliance and auditing

### Documentation
- README.md with comprehensive API documentation
- QUICKSTART.md for fast onboarding
- examples/basic-queries.md with practical query patterns
- Claude Desktop and Claude Code configuration examples
- Skill file with extensive examples and best practices

### Developer Experience
- TypeScript for type safety
- Zod for runtime validation
- Comprehensive error messages
- Clean, maintainable code architecture
- ESM module support
- Source maps for debugging

### Security
- API key authentication
- HTTPS-only communication
- Server-side credential management
- User ID tracking for audit logs
- Input validation and sanitization

## [Unreleased]

### Planned Features
- NPM package publication
- Query result caching
- Query history and favorites
- Batch query execution
- Streaming results for large datasets
- Query validation before execution
- SQL syntax highlighting in responses
- Query performance metrics
- Connection pooling
- Support for more database types (MySQL, SQLite, etc.)
- Web-based query builder integration
- Saved query templates
- Query scheduling
