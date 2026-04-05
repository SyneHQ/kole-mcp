# Publishing Guide

This document explains how to publish new versions of `@synehq/kole-mcp` to npm.

## Prerequisites

1. **NPM Account**
   - Create an account at https://www.npmjs.com/signup
   - Verify your email address
   - Enable 2FA (recommended)

2. **Organization Setup** (if not already done)
   - Go to https://www.npmjs.com/org/create
   - Create organization: `synehq`
   - Invite team members

3. **NPM Token**
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token"
   - Choose "Automation" type
   - Copy the token

4. **GitHub Setup**
   - Go to your repository settings
   - Navigate to Secrets → Actions
   - Add new secret: `NPM_TOKEN` with your npm token

## Manual Publishing

### First Time Setup

```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### Publishing a New Version

1. **Update version in package.json**
   ```bash
   # For patch releases (1.1.0 → 1.1.1)
   npm version patch
   
   # For minor releases (1.1.0 → 1.2.0)
   npm version minor
   
   # For major releases (1.1.0 → 2.0.0)
   npm version major
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [1.1.1] - 2026-04-08
   
   ### Fixed
   - Bug fix description
   
   ### Added
   - New feature description
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Test the build**
   ```bash
   # Verify build artifacts
   ls -la dist/
   
   # Test the CLI locally
   node dist/index.js
   ```

5. **Publish to npm**
   ```bash
   npm publish --access public
   ```

6. **Create git tag and push**
   ```bash
   git add .
   git commit -m "Release v1.1.1"
   git tag v1.1.1
   git push origin main --tags
   ```

## Automated Publishing (CI/CD)

The repository includes GitHub Actions workflows for automated publishing.

### Setup

1. **Add NPM_TOKEN to GitHub Secrets**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm automation token
   - Click "Add secret"

2. **Verify GitHub Actions are enabled**
   - Go to repository Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected

### Publishing Process

1. **Update version and commit changes**
   ```bash
   npm version patch  # or minor, or major
   git push origin main
   ```

2. **Create and push a git tag**
   ```bash
   git tag v1.1.1
   git push origin v1.1.1
   ```

3. **GitHub Actions will automatically:**
   - Run tests and build
   - Publish to npm
   - Create a GitHub Release
   - Notify team (if configured)

### Workflow Files

- **`.github/workflows/publish.yml`**: Triggered on version tags (v*.*.*), publishes to npm
- **`.github/workflows/ci.yml`**: Runs on every push/PR, validates build

### Manual Trigger

You can also manually trigger a publish from GitHub:

1. Go to Actions tab
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Select branch/tag
5. Click "Run workflow" button

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.1.0 → 1.2.0): New features, backwards compatible
- **PATCH** (1.1.0 → 1.1.1): Bug fixes, backwards compatible

Examples:
- Added new optional parameter → PATCH or MINOR
- Added new tool → MINOR
- Changed required parameters → MAJOR
- Fixed a bug → PATCH
- Security fix → PATCH

## Pre-release Versions

For beta/alpha releases:

```bash
# Create beta version
npm version prerelease --preid=beta
# Result: 1.1.0 → 1.1.1-beta.0

# Publish with beta tag
npm publish --tag beta --access public

# Users install with:
npm install @synehq/kole-mcp@beta
```

## Package Testing Before Publishing

Always test locally before publishing:

```bash
# Create a tarball
npm pack

# This creates @synehq-kole-mcp-1.1.0.tgz

# Test in another project
cd /path/to/test/project
npm install /path/to/synehq-kole-mcp/@synehq-kole-mcp-1.1.0.tgz

# Verify it works
node node_modules/.bin/synehq-kole-mcp
```

## Rollback a Published Version

If you need to unpublish (only within 72 hours):

```bash
# Unpublish specific version
npm unpublish @synehq/kole-mcp@1.1.0

# Deprecate instead (recommended)
npm deprecate @synehq/kole-mcp@1.1.0 "This version has critical bugs, use 1.1.1 instead"
```

## Post-Publishing Checklist

After publishing:

- [ ] Verify package on npm: https://www.npmjs.com/package/@synehq/kole-mcp
- [ ] Test installation: `npm install -g @synehq/kole-mcp`
- [ ] Check CLI works: `synehq-kole-mcp --help`
- [ ] Update documentation if needed
- [ ] Announce on:
  - [ ] GitHub Discussions
  - [ ] Twitter/X
  - [ ] Discord/Slack
  - [ ] Blog post (for major releases)
- [ ] Monitor for issues in first 24 hours

## Monitoring

After publishing, monitor:

1. **NPM Stats**: https://www.npmjs.com/package/@synehq/kole-mcp
   - Download counts
   - Dependents

2. **GitHub Issues**: https://github.com/synehq/kole-mcp/issues
   - New issues after release
   - Installation problems

3. **NPM Feedback**: Check package page for comments

## Troubleshooting

### Error: "You must be logged in to publish packages"

```bash
npm login
npm whoami
```

### Error: "You do not have permission to publish"

1. Verify you're a member of @synehq organization
2. Check organization settings
3. Ensure package name is available

### Error: "Version already exists"

```bash
# Increment version
npm version patch

# Try publishing again
npm publish --access public
```

### CI/CD fails with "401 Unauthorized"

1. Check NPM_TOKEN is set correctly in GitHub Secrets
2. Regenerate token if expired
3. Ensure token has "Automation" scope

## Security

### Protecting the Package

1. **Enable 2FA** on your npm account
2. **Use automation tokens** for CI/CD (not your personal token)
3. **Audit dependencies** regularly:
   ```bash
   npm audit
   npm audit fix
   ```

4. **Sign releases** with GPG:
   ```bash
   git tag -s v1.1.0 -m "Release 1.1.0"
   ```

5. **Use provenance** (included in publish workflow)

### Security Checklist

- [ ] 2FA enabled on npm account
- [ ] Automation token with minimal scope
- [ ] NPM_TOKEN stored as GitHub Secret
- [ ] Regular dependency audits
- [ ] Signed git tags
- [ ] Provenance enabled in publish

## Support

Questions about publishing?

- **Email**: support@synehq.com
- **GitHub Issues**: https://github.com/synehq/kole-mcp/issues
- **NPM Support**: https://www.npmjs.com/support

---

**Happy Publishing! 🚀**
