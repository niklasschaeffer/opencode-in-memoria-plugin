# OpenCode In-Memoria Plugin

[![CI](https://github.com/niklasschaeffer/opencode-in-memoria-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/niklasschaeffer/opencode-in-memoria-plugin/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/opencode-in-memoria-plugin.svg)](https://www.npmjs.com/package/opencode-in-memoria-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A persistent intelligence plugin for OpenCode that captures, learns, and applies codebase patterns across AI-assisted development sessions.

## What This Plugin Does

This plugin integrates with [In-Memoria](https://github.com/pi22by7/In-Memoria) to create an organizational memory system for your codebase. It:

- **Automatically learns** your codebase patterns, conventions, and architecture when a project opens
- **Captures insights** from successful tasks, code decisions, and bug fixes
- **Provides contextual recommendations** based on your project's specific patterns
- **Builds persistent intelligence** that improves AI responses over time

## Quick Start

Install the plugin globally:

```bash
npm install -g opencode-plugin-in-memoria@latest
```

Then configure your `.opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "description": "My Project with In-Memoria",
  "mcp": {
    "in-memoria": {
      "type": "local",
      "command": ["npx", "in-memoria", "server"],
      "description": "In-Memoria persistent intelligence server"
    }
  },
  "plugin": [
    "opencode-in-memoria-plugin"
  ]
}
```

That's it! The plugin works out-of-the-box with sensible defaults and will automatically learn your codebase.

### Optional Configuration

To customize behavior, create `.opencode/inmemoria.json`:

```json
{
  "autoLearn": true,
  "contextInjection": true,
  "insightCapture": true,
  "logTools": false
}
```

### Lifecycle Hooks

The plugin hooks into OpenCode's lifecycle to automatically capture knowledge:

| Hook | What It Captures |
|------|------------------|
| `project.open` | Auto-learns codebase patterns and architecture |
| `ai.response.before` | Injects project context and pattern recommendations |
| `task.complete` | Records best practices and decisions from successful work |
| `ai.error` | Captures bug patterns for future prevention |
| `file.change` / `file.save` | Triggers incremental learning on code changes |
| `conversation.end` | Summarizes session insights |
| `tools.list` | Provides file suggestions based on task context |

## Installation

```bash
npm install
npm run build
```

## Configuration

Create `.opencode/inmemoria.json` in your project:

```json
{
  "autoLearn": true,
  "contextInjection": true
}
```

## Usage

### Available Tools

#### inmemoria_quick_setup
Initialize and learn project:
```typescript
await opencode.execute("inmemoria_quick_setup")
```

#### inmemoria_get_context
Get project context:
```typescript
const ctx = await opencode.execute("inmemoria_get_context")
```

#### inmemoria_suggest_files
Get file suggestions:
```typescript
await opencode.execute("inmemoria_suggest_files", {
  task: "implement auth"
})
```

#### inmemoria_search
Search codebase:
```typescript
await opencode.execute("inmemoria_search", {
  query: "database connection",
  type: "semantic"
})
```

#### inmemoria_learn
Force re-learning:
```typescript
await opencode.execute("inmemoria_learn")
```

#### inmemoria_status
Check status:
```typescript
await opencode.execute("inmemoria_status")
```

## How It Works

1. **Pattern Learning**: The plugin analyzes your codebase structure, naming conventions, architectural patterns, and common code structures

2. **Insight Capture**: As you work, it captures:
   - Best practices from successful implementations
   - Bug patterns and their fixes
   - Code organization decisions
   - Performance optimizations

3. **Context Injection**: Before AI generates responses, the plugin injects relevant project context and pattern recommendations specific to your codebase

4. **Persistent Memory**: All captured knowledge persists across sessions, building up an organizational memory that improves AI assistance quality over time

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Configuration](./docs/CONFIGURATION.md)

## Development

```bash
npm run dev       # Watch mode
npm run build     # Build once
npm run lint      # Run ESLint
npm run typecheck # Type check
```

## License

MIT
