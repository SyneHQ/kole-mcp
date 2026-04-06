#!/usr/bin/env bash

# SyneHQ Kole Skill Installer
# Installs the Kole skill for Claude Code

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if skill directory exists
SKILL_DIR="$HOME/.claude/skills"
SKILL_NAME="kole"
SOURCE_SKILL="$(pwd)/skill"
TARGET_SKILL="$SKILL_DIR/$SKILL_NAME"

echo "SyneHQ Kole Skill Installer"
echo "============================"
echo ""

# Check if source skill exists
if [ ! -d "$SOURCE_SKILL" ]; then
    echo -e "${RED}Error: Skill directory not found at $SOURCE_SKILL${NC}"
    echo "Make sure you're running this script from the synehq-kole-mcp directory"
    exit 1
fi

# Create skills directory if it doesn't exist
if [ ! -d "$SKILL_DIR" ]; then
    echo "Creating Claude skills directory at $SKILL_DIR"
    mkdir -p "$SKILL_DIR"
fi

# Check if skill already exists
if [ -L "$TARGET_SKILL" ] || [ -d "$TARGET_SKILL" ]; then
    echo -e "${YELLOW}Warning: Kole skill already exists at $TARGET_SKILL${NC}"
    read -p "Do you want to replace it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
    rm -rf "$TARGET_SKILL"
fi

# Ask user for installation method
echo ""
echo "Installation method:"
echo "1) Copy (recommended for most users)"
echo "2) Symlink (recommended for developers)"
echo ""
read -p "Choose method (1 or 2): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[1]$ ]]; then
    # Copy method
    echo "Copying skill to $TARGET_SKILL..."
    cp -r "$SOURCE_SKILL" "$TARGET_SKILL"
    echo -e "${GREEN}✓ Skill copied successfully!${NC}"
elif [[ $REPLY =~ ^[2]$ ]]; then
    # Symlink method
    echo "Creating symlink at $TARGET_SKILL..."
    ln -s "$SOURCE_SKILL" "$TARGET_SKILL"
    echo -e "${GREEN}✓ Symlink created successfully!${NC}"
else
    echo -e "${RED}Invalid choice. Installation cancelled.${NC}"
    exit 1
fi

# Verify installation
if [ -f "$TARGET_SKILL/SKILL.md" ]; then
    echo ""
    echo -e "${GREEN}Installation complete!${NC}"
    echo ""
    echo "The Kole skill has been installed to: $TARGET_SKILL"
    echo ""
    echo "Next steps:"
    echo "1. Restart Claude Code"
    echo "2. Configure the SyneHQ Kole MCP server (see README.md)"
    echo "3. Ask Claude about your databases!"
    echo ""
    echo "Example prompts:"
    echo '  - "Show me all my database connections"'
    echo '  - "List the tables in my database"'
    echo '  - "Get the top 10 customers by revenue"'
else
    echo -e "${RED}Error: Installation failed. SKILL.md not found.${NC}"
    exit 1
fi
