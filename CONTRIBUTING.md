# Contributing to SyneHQ Kole MCP

Thank you for your interest in contributing to the SyneHQ Kole MCP server! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm or yarn
- Git
- A SyneHQ account with API access

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/synehq/kole-mcp.git
   cd kole-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   export SYNEHQ_API_KEY="your_test_api_key"
   export SYNEHQ_CONNECTION_ID="your_test_connection"
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Test your changes**
   ```bash
   npm start
   ```

## Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `src/`
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Build and test**
   ```bash
   npm run build
   npm start
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Request review

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Add type annotations for function parameters and returns
- Use interfaces for object shapes
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for public functions

### Example:
```typescript
/**
 * Execute a query against the SyneHQ database
 * @param params Query parameters including query string and options
 * @returns Promise resolving to query results
 */
async executeQuery(params: QueryParams): Promise<QueryResult> {
  // Implementation
}
```

### Code Organization

- Keep functions small and focused
- Separate concerns (API client, validation, handlers)
- Use helper functions for repeated logic
- Group related functionality together

## Adding New Features

### New Tools

To add a new MCP tool:

1. **Define the Zod schema**
   ```typescript
   const NewToolSchema = z.object({
     param1: z.string().describe("Description"),
     param2: z.number().optional().describe("Description"),
   });
   ```

2. **Add the tool definition**
   ```typescript
   {
     name: "new_tool",
     description: "What the tool does",
     inputSchema: {
       type: "object",
       properties: {
         param1: {
           type: "string",
           description: "Parameter description"
         }
       },
       required: ["param1"]
     }
   }
   ```

3. **Implement the handler**
   ```typescript
   case "new_tool": {
     const params = NewToolSchema.parse(args);
     const result = await client.newTool(params);
     return {
       content: [
         {
           type: "text",
           text: JSON.stringify(result, null, 2),
         },
       ],
     };
   }
   ```

4. **Add to SyneHQClient**
   ```typescript
   async newTool(params: z.infer<typeof NewToolSchema>) {
     const response = await fetch(`${this.baseURL}/api/v1/new-endpoint`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "X-API-KEY": this.apiKey,
       },
       body: JSON.stringify(params),
     });
     
     if (!response.ok) {
       throw new Error(`API error: ${response.status}`);
     }
     
     return await response.json();
   }
   ```

5. **Update documentation**
   - Add to README.md
   - Add examples to examples/basic-queries.md
   - Update the skill file if user-facing

### API Endpoints

When adding support for new SyneHQ API endpoints:

1. Add the method to `SyneHQClient` class
2. Define proper types/schemas
3. Handle errors appropriately
4. Add tests (if testing framework exists)
5. Document the new capability

## Documentation

### What to Document

- **README.md**: API reference, installation, configuration
- **QUICKSTART.md**: Fast-track getting started guide
- **examples/**: Practical use cases and patterns
- **Skill file**: User-facing examples and tips
- **Code comments**: Complex logic, gotchas, TODOs

### Documentation Style

- Be clear and concise
- Include code examples
- Show both input and output
- Explain why, not just what
- Keep it up to date with code changes

## Testing

### Manual Testing

Before submitting a PR, test:

1. **Build succeeds**
   ```bash
   npm run build
   ```

2. **Server starts**
   ```bash
   npm start
   ```

3. **Basic query works**
   - Test with Claude Desktop or Claude Code
   - Try `execute_query` tool
   - Verify response format

4. **Error handling**
   - Test with invalid API key
   - Test with invalid connection ID
   - Test with malformed query

### Future: Automated Testing

We plan to add:
- Unit tests for utilities
- Integration tests for API calls
- E2E tests for tool execution
- CI/CD pipeline

## Submitting Pull Requests

### PR Checklist

Before submitting:

- [ ] Code builds successfully (`npm run build`)
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Examples are added (if applicable)
- [ ] Changelog is updated
- [ ] No console.log() left in code (use proper logging)
- [ ] Error messages are helpful
- [ ] Backwards compatibility is maintained (or breaking change is noted)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Related Issues
Fixes #123

## Screenshots (if applicable)
```

## Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what the bug is.

**To Reproduce**
1. Set environment variables...
2. Run command...
3. Execute query...
4. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment:**
- OS: [e.g., macOS 13.0]
- Node version: [e.g., 18.0.0]
- Package version: [e.g., 1.0.0]

**Additional context**
Any other context about the problem.
```

## Feature Requests

We welcome feature requests! Please:

1. Check existing issues first
2. Describe the use case
3. Explain why it's valuable
4. Suggest an implementation approach (optional)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

## Questions?

- **Documentation**: Check README.md and QUICKSTART.md
- **Email**: support@synehq.com
- **GitHub Discussions**: Use for questions and ideas
- **GitHub Issues**: Use for bugs and feature requests

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SyneHQ Kole MCP! 🎉
