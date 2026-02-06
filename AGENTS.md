# OpenCode In-Memoria Plugin - Agent Guidelines

## Build Commands

```bash
# Development
npm run dev              # Watch mode compilation
npm run build            # Production build

# Quality
npm run lint             # ESLint check
npm run typecheck        # TypeScript without emit
npm run clean            # Remove dist/

# Testing
# No test framework configured yet - add tests to `npm test`
```

## Code Style

### TypeScript
- **Target**: ES2022, ESNext modules
- **Strict mode**: Always enabled (no `any` suppression)
- **Declarations**: Required with sourcemaps
- **Unused vars**: Error (use `_` prefix for ignored parameters)

### Formatting
- Semicolons: Optional (project preference: minimal)
- Quotes: Double for strings
- Trailing commas: Yes
- Indent: 2 spaces

### Imports
```typescript
// ES modules - always use .js extension
import { ToolRouter } from "./mcp/tool-router.js"
import type { PluginContext } from "./types/opencode.js"

// Named types separate from values
import { Logger } from "../utils/logger.js"
import type { ToolContext } from "../types/opencode.js"
```

### Naming Conventions
- Classes: `PascalCase` (e.g., `ToolRouter`, `InMemoriaPlugin`)
- Variables/functions: `camelCase` (e.g., `toolRouter`, `getMetadata`)
- Private members: No underscore prefix (use private modifier)
- Constants: UPPER_SNAKE for true constants
- Interfaces/Types: `PascalCase` (e.g., `PluginContext`)

### Error Handling
```typescript
// Always handle errors with proper logging
try {
  await this.toolRouter.autoLearnIfNeeded()
} catch (error) {
  Logger.error("Failed to handle project open:", error)
  throw error  // Re-throw if needed
}
```

### Documentation
- JSDoc on all public methods and classes
- Include `@param`, `@returns`, `@throws` where applicable
- Single-line comments: `// Capitalized sentence`
- Multi-line: Use `/** ... */` blocks

### Project Patterns

#### Plugin Lifecycle
```typescript
// Plugin class extends lifecycle hooks
class InMemoriaPlugin {
  private toolRouter: ToolRouter | null = null
  
  async initialize(context: PluginContext): Promise<void> {
    // Setup code
  }
  
  async destroy(): Promise<void> {
    // Cleanup code
    this.toolRouter = null
  }
}
```

#### Tool Routing
```typescript
// Use ToolRouter for MCP tool calls
await this.toolRouter.callTool("get_project_blueprint", {})
await this.toolRouter.contributeInsights("best_practice", content, confidence)
```

#### Logging
```typescript
// Use Logger utility with appropriate level
Logger.info("Processing...")
Logger.debug("Details:", data)
Logger.error("Failed:", error)
```

### Type Patterns
```typescript
// Prefer interface for public APIs
export interface PluginContext {
  version: string
  workspacePath: string
}

// Use explicit return types on public methods
async initialize(context: PluginContext): Promise<void>

// Unknown for flexible types (not any)
args: Record<string, unknown>
```

### Linting Rules
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: error (with `^_` ignore pattern)
- Console allowed for Logger utility

## Running Single Tasks

Since no test framework exists, verify changes manually:

```bash
# 1. Type check
npm run typecheck

# 2. Lint
npm run lint

# 3. Build
npm run build

# 4. Check dist/ output exists
ls dist/
```
