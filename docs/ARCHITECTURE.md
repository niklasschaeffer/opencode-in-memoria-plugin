# Architecture

## Overview

The OpenCode In-Memoria plugin integrates [In-Memoria](https://github.com/pi22by7/In-Memoria) persistent intelligence into OpenCode through the Model Context Protocol (MCP).

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     OpenCode Editor                        │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │           OpenCode In-Memoria Plugin                 │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Hooks      │  │    Tools     │  │   Config    │ │  │
│  │  │  - project   │  │  - quick_    │  │   Manager   │ │  │
│  │  │    .open     │  │    setup     │  │             │ │  │
│  │  │  - tool      │  │  - get_      │  │             │ │  │
│  │  │    execute   │  │    context   │  │             │ │  │
│  │  │              │  │  - search    │  │             │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   Server     │  │   Tool       │                 │  │
│  │  │   Manager    │  │   Router     │                 │  │
│  │  │              │  │              │                 │  │
│  │  │ Manages MCP  │  │ Routes calls │                 │  │
│  │  │ server       │  │ to In-Memoria│                 │  │
│  │  │ lifecycle    │  │ tools        │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ MCP Protocol (stdio)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 In-Memoria MCP Server                      │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Core      │  │ Intelligence│  │ Automation │            │
│  │  Analysis  │  │    Tools    │  │   Tools    │            │
│  ├────────────┤  ├────────────┤  ├────────────┤            │
│  │• blueprint │  │• predict_  │  │• auto_learn │            │
│  │• patterns  │  │  approach  │  │• search     │            │
│  │• conventions│  │• dev_profile│ │• learn      │            │
│  └────────────┘  └────────────┘  └────────────┘            │
├─────────────────────────────────────────────────────────────┤
│                 Storage Layer                              │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐                            │
│  │   SQLite   │  │  SurrealDB │                            │
│  │  (metadata)│  │  (vectors) │                            │
│  └────────────┘  └────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Plugin Entry Point (`src/index.ts`)

The main plugin class that OpenCode loads:
- Initializes on `project.open`
- Registers 6 custom tools
- Handles hooks from OpenCode
- Manages the MCP server lifecycle

### MCP Server Manager (`src/mcp/server-manager.ts`)

Manages the In-Memoria MCP server process:
- **Start**: Spawns `npx in-memoria server`
- **Health Checks**: Verifies server responsiveness
- **Auto-Restart**: Restarts on crash (up to 3 attempts)
- **Graceful Shutdown**: SIGTERM with 5s timeout

### Tool Router (`src/mcp/tool-router.ts`)

Routes calls to In-Memoria MCP tools:
- Formats requests per MCP protocol
- Handles response parsing
- Error translation
- Currently uses mock implementations (MCP client pending)

### Configuration Manager (`src/config/config-manager.ts`)

Configuration loading with priority:
1. Project-specific: `.opencode/inmemoria.json`
2. Global: `~/.config/opencode/inmemoria.json`
3. Defaults

### Hooks

**Implemented:**
- `project.open`: Auto-learns project if enabled
- `tool.execute.before/after`: Logging

**Advanced (pending OpenCode API):**
- `file.change`: Real-time pattern detection
- `ai.response.before`: Automatic context injection
- `task.complete`: Auto-save insights

### Custom Tools

The plugin provides 6 OpenCode-specific tools:

1. **inmemoria_quick_setup**: Initialize and learn in one step
2. **inmemoria_get_context**: Get comprehensive project context
3. **inmemoria_suggest_files**: Smart file routing for tasks
4. **inmemoria_search**: Semantic/text/pattern search
5. **inmemoria_learn**: Force re-learning of project
6. **inmemoria_status**: Check plugin and server health

## Data Flow

### 1. Project Open Flow

```
OpenCode → project.open hook
    ↓
Plugin.initialize()
    ↓
ConfigManager.load()
    ↓
ServerManager.start()
    ↓
auto_learn_if_needed() [if enabled]
    ↓
✅ Project ready with context
```

### 2. Tool Execution Flow

```
User → OpenCode → Tool Call
    ↓
Plugin.executeTool()
    ↓
ToolRouter.callTool()
    ↓
MCP Protocol → In-Memoria Server
    ↓
Result → User
```

### 3. Context Query Flow

```
User: "inmemoria_get_context"
    ↓
Parallel calls to:
  • get_project_blueprint
  • get_project_patterns
  • get_coding_conventions
    ↓
Merged result with timestamp
```

## Integration Points

### OpenCode → Plugin
- Hooks: project.open, tool.execute.*
- Tool registry: Plugin.getMetadata()
- Execution: Plugin.executeTool()

### Plugin → In-Memoria
- Transport: MCP over stdio
- Server: `npx in-memoria server`
- Protocol: JSON-RPC with MCP schema

### In-Memoria → Storage
- SQLite: `.in-memoria/insights.db`
- SurrealDB: `.in-memoria/vectors.db`

## Configuration Schema

```typescript
interface InMemoriaConfig {
  autoLearn: boolean        // Learn on project open
  contextInjection: boolean // Inject context before AI responses
  logTools: boolean         // Log all tool executions
  server: {
    port: number
    host: string
  }
  learning: {
    minConfidence: number   // 0-1 threshold for pattern matching
    autoLearnThreshold: number // Files changed before auto-learn
  }
}
```

## Security Considerations

1. **Process Isolation**: MCP server runs in separate process
2. **No Code Execution**: Plugin only queries, never executes user code
3. **Local Storage**: All data stays in project `.in-memoria/` directory
4. **Optional**: Auto-learn can be disabled per-project

## Performance

- **Startup**: ~2-3s (MCP server spawn time)
- **Memory**: ~100MB (In-Memoria server)
- **Query Latency**: <100ms (local database)
- **Auto-learn**: Depends on project size (~1s per 100 files)

## Future Enhancements

1. **Incremental Updates**: Real-time file watching
2. **Remote Server**: Connect to external In-Memoria instance
3. **Custom Tools**: User-defined pattern extractors
4. **Collaboration**: Shared insights across team
5. **Metrics**: Codebase health dashboard
