# Publish v1.1.1 to NPM

Everything is ready! Follow these steps to publish.

## ✅ What's Done

- [x] Version bumped to 1.1.1
- [x] Changelog updated
- [x] Code built and tested
- [x] Git tag v1.1.1 created
- [x] Pushed to GitHub (sudo branch)
- [x] Tag pushed to GitHub

## 🚀 Publish to NPM

### Option 1: Manual Publish (Recommended for first time)

```bash
# 1. Login to npm (if not already)
npm login

# 2. Verify you're logged in
npm whoami

# 3. Publish
npm publish --access public

# 4. Verify
npm view @synehq/kole-mcp version
```

### Option 2: GitHub Actions (Automatic)

The push to GitHub with tag v1.1.1 will trigger the automated publish workflow.

Check: https://github.com/SyneHQ/kole-mcp/actions

If GitHub Actions is configured with NPM_TOKEN secret, it will:
1. Run tests
2. Build the package
3. Publish to npm automatically
4. Create GitHub Release

## 📦 What Will Be Published

```
@synehq/kole-mcp@1.1.1
├── dist/          # Compiled JavaScript
├── skill/         # Bundled skill files
├── examples/      # Configuration examples
├── README.md
├── QUICKSTART.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── PUBLISHING.md
├── LICENSE
└── package.json
```

## ✅ Post-Publish Checklist

After publishing:

- [ ] Test installation: `npm install -g @synehq/kole-mcp@1.1.1`
- [ ] Verify package page: https://www.npmjs.com/package/@synehq/kole-mcp
- [ ] Test MCP server: `synehq-kole-mcp`
- [ ] Install skill: `./INSTALL_SKILL.sh`
- [ ] Announce the release

## 🔍 Verify Installation

```bash
# Install globally
npm install -g @synehq/kole-mcp@1.1.1

# Check version
synehq-kole-mcp --version

# Test with npx
npx -y @synehq/kole-mcp@latest
```

## 📢 Announce

After successful publish:

1. **GitHub Release**: Create release notes from CHANGELOG
2. **Twitter/X**: "Just released @synehq/kole-mcp v1.1.1..."
3. **Discord/Slack**: Share with community
4. **Documentation**: Update docs.synehq.com

## 🐛 If Something Goes Wrong

### Unpublish (within 72 hours)
```bash
npm unpublish @synehq/kole-mcp@1.1.1
```

### Deprecate (after 72 hours)
```bash
npm deprecate @synehq/kole-mcp@1.1.1 "Use version 1.1.2 or higher"
```

### Publish Hotfix
```bash
npm version patch
git push --tags
npm publish --access public
```

## 📊 Package Stats

- **Version**: 1.1.1
- **Files**: 23 tracked files
- **Size**: ~50KB (excluding node_modules)
- **Dependencies**: 2 (MCP SDK, Zod)
- **Entry Point**: dist/index.js
- **Binary**: synehq-kole-mcp

## 🎯 Ready!

Run: `npm publish --access public`

The package will be live at:
https://www.npmjs.com/package/@synehq/kole-mcp
