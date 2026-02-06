# In-Memoria Opencode Integration Plan

## Overview

This document outlines the plan to integrate [In-Memoria](https://github.com/pi22by7/In-Memoria) as a direct plugin in Opencode.

## What is In-Memoria?

**In-Memoria** is a persistent intelligence infrastructure for AI agents that:
- Learns patterns from your codebase
- Provides semantic search across concepts
- Generates project blueprints (<200 tokens)
- Routes features to files intelligently
- Remembers context across sessions

**Architecture:**
- Rust core (AST parsing, pattern learning, semantic engine)
- TypeScript MCP server layer
- SQLite for structured data
- SurrealDB for vector embeddings
- 13 MCP tools in 4 categories

## What is Opencode?

**Opencode** is an open-source AI coding assistant with:
- Built-in plugin system (`@opencode-ai/plugin` SDK)
- Native MCP (Model Context Protocol) support
- Tool execution framework
- Event hooks and lifecycle management

## Integration Approaches

### Option A: Direct MCP Integration (Simplest)

**Effort:** Minimal configuration only
**Best for:** Quick setup, immediate value

Add to `~/.config/opencode-profiles/default/opencode.json`:
```json
{
  "mcp": {
    "in-memoria": {
      "type": "local",
      "command": ["npx", "in-memoria", "server"]
    }
  }
}
```

**Pros:**
- Zero code required
- Uses Opencode's built-in MCP support
- Standard protocol (works with Claude, Copilot too)
- Automatic tool discovery

**Cons:**
- No Opencode-specific enhancements
- Less control over lifecycle
- Limited to MCP protocol capabilities

### Option B: Opencode Plugin Wrapper (Recommended)

**Effort:** Medium (create npm package)
**Best for:** Enhanced integration, better UX

Create `opencode-in-memoria` plugin that:
1. Wraps In-Memoria MCP server
2. Manages server lifecycle (start/stop/restart)
3. Adds Opencode-specific features:
   - Project auto-detection
   - Intelligent tool routing
   - Custom UI hints
   - Session-aware learning
4. Provides enhanced error handling
5. Adds configuration management

**Pros:**
- Full Opencode integration
- Better lifecycle management
- Can add custom Opencode tools
- Enhanced error messages
- Configuration UI

**Cons:**
- Requires maintenance
- More complex setup

### Option C: Hybrid Approach (Best of Both)

**Effort:** High
**Best for:** Production-grade integration

1. **Phase 1:** Implement Option A (immediate value)
2. **Phase 2:** Create Option B plugin (enhanced features)
3. **Phase 3:** Add deep integrations:
   - Auto-learn on project open
   - Context-aware suggestions
   - Pattern enforcement
   - Work session tracking

## Implementation Plan

### Phase 1: Direct MCP Configuration

**Files to create:**
- `config/opencode.json` - MCP server configuration
- `docs/MCP_SETUP.md` - Setup instructions

**Steps:**
1. Create configuration template
2. Document setup process
3. Test with Opencode
4. Verify tool availability

### Phase 2: Plugin Wrapper Development

**Package:** `opencode-in-memoria`

**Structure:**
```
opencode-in-memoria/
├── src/
│   ├── index.ts              # Plugin entry point
│   ├── server-manager.ts     # MCP server lifecycle
│   ├── tool-router.ts        # Tool routing logic
│   ├── config-manager.ts     # Configuration handling
│   └── opencode-tools.ts     # Custom Opencode tools
├── package.json
├── tsconfig.json
└── README.md
```

**Key Components:**

1. **ServerManager**
   - Start/stop In-Memoria MCP server
   - Monitor server health
   - Handle crashes and restarts
   - Port management

2. **ToolRouter**
   - Map In-Memoria MCP tools to Opencode
   - Add Opencode-specific context
   - Route requests efficiently

3. **ConfigManager**
   - Handle opencode.json configuration
   - Validate settings
   - Provide defaults

4. **OpencodeTools** (Additional)
   - `inmemoria_learn_project` - Auto-learn current project
   - `inmemoria_get_context` - Get intelligent context
   - `inmemoria_suggest_files` - File suggestions

**Plugin Implementation:**

```typescript
import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin/tool"
import { ServerManager } from "./server-manager"
import { ToolRouter } from "./tool-router"

export const InMemoriaPlugin: Plugin = async (ctx) => {
  const serverManager = new ServerManager()
  const toolRouter = new ToolRouter()
  
  // Start In-Memoria server
  await serverManager.start()
  
  return {
    // Hook into project open
    "project.open": async (project) => {
      // Auto-learn if needed
      await toolRouter.callTool("auto_learn_if_needed", { 
        path: project.path 
      })
    },
    
    // Add custom tools
    tool: {
      inmemoria_quick_setup: tool({
        description: "Quick setup for In-Memoria on current project",
        args: {},
        async execute(args, context) {
          return serverManager.quickSetup(context.project.path)
        }
      }),
      
      inmemoria_get_blueprint: tool({
        description: "Get project blueprint with context",
        args: {},
        async execute(args, context) {
          const blueprint = await toolRouter.callTool("get_project_blueprint", {
            path: context.project.path
          })
          // Enhance with Opencode context
          return enhanceWithContext(blueprint, context)
        }
      })
    },
    
    // Cleanup on shutdown
    async cleanup() {
      await serverManager.stop()
    }
  }
}
```

### Phase 3: Advanced Features

1. **Auto-Learning**
   - Trigger learn on project open
   - Incremental updates on file changes
   - Background processing

2. **Context Enhancement**
   - Add Opencode conversation context
   - Track work sessions
   - Persistent task lists

3. **Smart Suggestions**
   - Pattern-based recommendations
   - File routing assistance
   - Architecture guidance

4. **Integration Features**
   - Status bar indicators
   - Progress notifications
   - Error diagnostics

## Tool Mapping

### In-Memoria MCP Tools → Opencode

| In-Memoria Tool | Opencode Integration |
|----------------|---------------------|
| `analyze_codebase` | Direct mapping |
| `search_codebase` | Direct mapping |
| `learn_codebase_intelligence` | Direct mapping |
| `get_project_blueprint` | Enhanced with Opencode context |
| `get_semantic_insights` | Direct mapping |
| `get_pattern_recommendations` | Direct mapping |
| `predict_coding_approach` | Direct mapping |
| `get_developer_profile` | Direct mapping |
| `contribute_insights` | Direct mapping |
| `auto_learn_if_needed` | Auto-trigger on project open |
| `get_system_status` | Direct mapping |
| `get_intelligence_metrics` | Direct mapping |
| `get_performance_status` | Direct mapping |

## Configuration Schema

### opencode.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "opencode-in-memoria"
  ],
  "inmemoria": {
    "autoLearn": true,
    "autoLearnOnOpen": true,
    "watchFiles": true,
    "includePatterns": ["**/*.ts", "**/*.tsx"],
    "excludePatterns": ["**/node_modules/**", "**/dist/**"],
    "server": {
      "port": 3000,
      "restartOnCrash": true
    },
    "features": {
      "blueprint": true,
      "patterns": true,
      "routing": true,
      "search": true
    }
  }
}
```

## Success Criteria

1. **Option A (MCP):**
   - [ ] In-Memoria tools available in Opencode
   - [ ] Can execute all 13 MCP tools
   - [ ] Tools return expected results

2. **Option B (Plugin):**
   - [ ] Plugin loads without errors
   - [ ] Server starts/stops correctly
   - [ ] Custom tools work
   - [ ] Auto-learn triggers properly
   - [ ] Configuration validated

3. **Both:**
   - [ ] Documentation complete
   - [ ] Examples provided
   - [ ] Error handling robust
   - [ ] Performance acceptable

## Next Steps

1. ✅ Research complete
2. 🔄 Create implementation (this session)
3. ⏳ Test with Opencode
4. ⏳ Document usage
5. ⏳ Publish plugin (if doing Option B)

---

**Decision:** Implement both Option A (for quick start) and Option B foundation (for enhanced experience).
