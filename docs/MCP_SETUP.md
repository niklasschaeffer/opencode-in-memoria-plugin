# In-Memoria MCP Setup for OpenCode

This guide shows you how to integrate In-Memoria with OpenCode using the Model Context Protocol (MCP).

## Prerequisites

- OpenCode installed and configured
- Node.js 18+ installed
- A project you want to analyze

## Quick Start

### Step 1: Install In-Memoria

```bash
npm install -g in-memoria
```

Or use npx (no installation required):
```bash
npx in-memoria --version
```

### Step 2: Configure OpenCode

Add In-Memoria to your OpenCode configuration file:

**Location:** `~/.config/opencode-profiles/default/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "in-memoria": {
      "type": "local",
      "command": ["npx", "in-memoria", "server"]
    }
  }
}
```

### Step 3: Learn Your Codebase

Before using In-Memoria, you need to analyze your project:

```bash
cd /path/to/your/project
npx in-memoria learn .
```

This will:
- Analyze your codebase structure
- Extract patterns and conventions
- Build semantic indexes
- Create a project blueprint

### Step 4: Start OpenCode

Restart OpenCode to load the MCP server. In-Memoria tools will now be available.

## Available Tools

Once configured, you can use these In-Memoria tools in OpenCode:

### Core Analysis
- **`analyze_codebase`** - Analyze files or directories
- **`search_codebase`** - Multi-mode search (semantic/text/pattern)

### Intelligence
- **`learn_codebase_intelligence`** - Deep learning from codebase
- **`get_project_blueprint`** - Get project context and tech stack
- **`get_semantic_insights`** - Query learned concepts
- **`get_pattern_recommendations`** - Get coding patterns
- **`predict_coding_approach`** - Smart file routing
- **`get_developer_profile`** - Coding style and conventions
- **`contribute_insights`** - Save architectural decisions

### Automation
- **`auto_learn_if_needed`** - Smart auto-learning

### Monitoring
- **`get_system_status`** - Health check
- **`get_intelligence_metrics`** - Analytics
- **`get_performance_status`** - Performance diagnostics

## Usage Examples

### Example 1: Get Project Context

```
User: "What is this project about?"

OpenCode will automatically call:
→ get_project_blueprint

Response:
Project: MyApp
Tech Stack: TypeScript, React, Node.js
Entry Points: src/index.ts, src/app.tsx
Key Patterns: Functional components, Custom hooks
```

### Example 2: Find Where to Add Features

```
User: "Where should I add a new API endpoint for user authentication?"

OpenCode will call:
→ predict_coding_approach
→ get_pattern_recommendations

Response:
Based on your patterns, add to:
- src/routes/auth.ts (follows existing pattern)
- Use middleware from src/middleware/auth.ts
- Follow JWT pattern in src/auth/jwt.ts
```

### Example 3: Search Codebase

```
User: "Find all database connection code"

OpenCode will call:
→ search_codebase (semantic mode)

Response:
Found in:
- src/db/connection.ts (main connection)
- src/models/user.ts (usage)
- src/config/database.ts (config)
```

### Example 4: Learn New Project

```
User: "Analyze this codebase and tell me about the architecture"

OpenCode will:
1. Call auto_learn_if_needed (if not learned)
2. Call get_project_blueprint
3. Call get_developer_profile

Response:
Architecture: MVC pattern
Languages: TypeScript (80%), Python (20%)
Frameworks: Express, React
Key Directories: src/controllers, src/models, src/views
Patterns: Repository pattern, Dependency injection
```

## Advanced Configuration

### Working Directory

To analyze a specific project, you can specify the working directory:

```json
{
  "mcp": {
    "in-memoria": {
      "type": "local",
      "command": ["npx", "in-memoria", "server", "/path/to/project"]
    }
  }
}
```

### Environment Variables

In-Memoria supports these environment variables:

```bash
# Required for crash safety
export SURREAL_SYNC_DATA=true

# Optional: Custom database location
export IN_MEMORIA_DB_PATH=/custom/path/in-memoria.db

# Optional: Enable debug logging
export IN_MEMORIA_DEBUG=true
```

### Per-Project Configuration

Create `.in-memoria/config.json` in your project:

```json
{
  "version": "0.6.0",
  "intelligence": {
    "enableRealTimeAnalysis": true,
    "enablePatternLearning": true,
    "vectorEmbeddings": true
  },
  "watching": {
    "patterns": ["**/*.ts", "**/*.tsx"],
    "ignored": ["**/node_modules/**", "**/dist/**"],
    "debounceMs": 500
  }
}
```

## Troubleshooting

### Issue: Tools not appearing

**Solution:**
1. Check OpenCode configuration file syntax
2. Verify in-memoria is installed: `npx in-memoria --version`
3. Restart OpenCode completely

### Issue: Server fails to start

**Solution:**
1. Check Node.js version (18+ required): `node --version`
2. Set required environment variable: `export SURREAL_SYNC_DATA=true`
3. Check for port conflicts (default: 3000)

### Issue: Empty results

**Solution:**
1. Ensure you've run `npx in-memoria learn .` on your project
2. Check that files are in supported languages (TS, JS, Python, etc.)
3. Verify the project path in MCP configuration

### Issue: Slow responses

**Solution:**
1. First query after learning may be slow (building indexes)
2. Subsequent queries should be fast
3. Consider excluding large directories in config

## Best Practices

1. **Learn First** - Always run `learn` before using tools
2. **Incremental Updates** - Re-learn when making major changes
3. **Auto-Learn** - Use `auto_learn_if_needed` for seamless experience
4. **Context** - Start with blueprint, then dive into patterns
5. **Save Insights** - Use `contribute_insights` for important discoveries

## Next Steps

- Try the [Plugin Wrapper](../opencode-in-memoria/) for enhanced features
- Read [In-Memoria Documentation](https://github.com/pi22by7/In-Memoria)
- Join the [Discord Community](https://discord.gg/6mGsM4qkYm)

## Support

- **Issues:** [GitHub Issues](https://github.com/pi22by7/In-Memoria/issues)
- **Docs:** [AGENT.md](../In-Memoria/AGENT.md)
- **Discord:** [Join Server](https://discord.gg/6mGsM4qkYm)
