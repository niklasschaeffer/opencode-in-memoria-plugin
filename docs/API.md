# API Reference

## Plugin Tools

### inmemoria_quick_setup

Initialize In-Memoria and learn project in one step.

**Parameters:**
```json
{
  "project_path": "string (optional, defaults to cwd)",
  "task": "string (optional, current task description)"
}
```

**Returns:**
```json
{
  "success": true,
  "project": { /* blueprint */ },
  "developer": { /* profile */ },
  "approach": { /* predicted approach */ },
  "message": "✅ In-Memoria is ready!"
}
```

**Example:**
```typescript
// Quick setup for current project
await opencode.execute("inmemoria_quick_setup")

// Setup with specific task
await opencode.execute("inmemoria_quick_setup", {
  task: "implement authentication"
})
```

---

### inmemoria_get_context

Get comprehensive project context including patterns and conventions.

**Parameters:**
```json
{
  "project_path": "string (optional, defaults to cwd)"
}
```

**Returns:**
```json
{
  "project": {
    "name": "my-project",
    "type": "typescript",
    "files": 150,
    /* ... */
  },
  "patterns": [
    { "type": "factory", "count": 5 },
    { "type": "singleton", "count": 2 }
  ],
  "conventions": {
    "naming": "camelCase",
    "indentation": "2 spaces",
    "quotes": "double"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Example:**
```typescript
const context = await opencode.execute("inmemoria_get_context")
console.log(`Project has ${context.patterns.length} patterns`)
```

---

### inmemoria_suggest_files

Get file suggestions based on current task.

**Parameters:**
```json
{
  "task": "string (required, describe what you're doing)",
  "project_path": "string (optional)"
}
```

**Returns:**
```json
{
  "task": "implement user authentication",
  "suggested_files": [
    "src/auth/service.ts",
    "src/auth/controller.ts",
    "src/middleware/auth.ts"
  ],
  "relevant_files": [
    { "file": "src/user/model.ts", "relevance": 0.92 },
    { "file": "src/routes.ts", "relevance": 0.85 }
  ],
  "approach": "incremental"
}
```

**Example:**
```typescript
const suggestions = await opencode.execute("inmemoria_suggest_files", {
  task: "fix login bug"
})

for (const file of suggestions.suggested_files) {
  await opencoderead(file)
}
```

---

### inmemoria_search

Search the codebase using semantic, text, or pattern matching.

**Parameters:**
```json
{
  "query": "string (required, search term)",
  "type": "string (optional: 'semantic' | 'text' | 'pattern', default: 'semantic')",
  "project_path": "string (optional)",
  "limit": "number (optional, default: 10)"
}
```

**Returns:**
```json
{
  "query": "database connection",
  "type": "semantic",
  "results": [
    {
      "file": "src/db/client.ts",
      "line": 15,
      "match": "export const db = createConnection()",
      "context": "...",
      "relevance": 0.95
    }
  ]
}
```

**Example:**
```typescript
// Semantic search
const results = await opencode.execute("inmemoria_search", {
  query: "authentication logic",
  type: "semantic"
})

// Pattern search (find all error handlers)
const errorHandlers = await opencode.execute("inmemoria_search", {
  query: "catch.*error",
  type: "pattern"
})
```

---

### inmemoria_learn

Force re-learning of the project. Useful after major changes.

**Parameters:**
```json
{
  "project_path": "string (optional)"
}
```

**Returns:**
```json
{
  "success": true,
  "project": "/path/to/project",
  "result": {
    "filesProcessed": 150,
    "patternsExtracted": 42,
    "timeTaken": "2.3s"
  },
  "message": "✅ Project re-learned successfully"
}
```

**Example:**
```typescript
// After refactoring
await opencode.execute("inmemoria_learn")
```

---

### inmemoria_status

Check plugin and MCP server status.

**Parameters:** None

**Returns:**
```json
{
  "plugin": {
    "initialized": true,
    "version": "1.0.0"
  },
  "server": {
    "running": true,
    "pid": 12345,
    "startTime": "2024-01-15T10:00:00Z"
  },
  "config": {
    "autoLearn": true,
    "contextInjection": true
  }
}
```

**Example:**
```typescript
const status = await opencode.execute("inmemoria_status")
if (!status.server.running) {
  console.error("In-Memoria server is down!")
}
```

---

## In-Memoria MCP Tools (via Tool Router)

The plugin can also call any In-Memoria MCP tool directly:

### Core Analysis Tools

#### get_project_blueprint
Get project structure and metadata.

```typescript
const blueprint = await toolRouter.callTool("get_project_blueprint", {
  project_path: "/path/to/project"
})
```

**Returns:**
```json
{
  "project": {
    "name": "my-app",
    "path": "/path/to/project",
    "type": "typescript",
    "files": 150,
    "structure": { /* directory tree */ }
  },
  "learningStatus": {
    "needsLearning": false,
    "lastLearned": "2024-01-15T10:00:00Z"
  }
}
```

#### get_project_patterns
Extract design patterns from the codebase.

```typescript
const patterns = await toolRouter.callTool("get_project_patterns", {
  project_path: "/path/to/project"
})
```

#### get_coding_conventions
Get coding conventions detected in the project.

```typescript
const conventions = await toolRouter.callTool("get_coding_conventions", {
  project_path: "/path/to/project"
})
```

---

### Intelligence Tools

#### predict_coding_approach
Get recommendations for implementing a task.

```typescript
const approach = await toolRouter.callTool("predict_coding_approach", {
  task: "add user authentication",
  project_path: "/path/to/project"
})
```

**Returns:**
```json
{
  "task": "add user authentication",
  "approach": "incremental",
  "likelyFiles": [
    "src/auth/service.ts",
    "src/auth/controller.ts"
  ],
  "confidence": 0.87,
  "reasoning": "..."
}
```

#### get_developer_profile
Get or create developer preference profile.

```typescript
const profile = await toolRouter.callTool("get_developer_profile", {})
```

---

### Automation Tools

#### auto_learn_if_needed
Automatically learn project if not already learned.

```typescript
const result = await toolRouter.callTool("auto_learn_if_needed", {
  project_path: "/path/to/project",
  force: false // Set true to re-learn even if already learned
})
```

#### search_codebase
Search the codebase with various strategies.

```typescript
const results = await toolRouter.callTool("search_codebase", {
  query: "database connection",
  project_path: "/path/to/project",
  limit: 10
})
```

#### semantic_search
Search using vector similarity.

```typescript
const results = await toolRouter.callTool("semantic_search", {
  query: "authentication middleware",
  project_path: "/path/to/project",
  limit: 5
})
```

---

## Error Handling

All tools return errors in a consistent format:

```typescript
{
  "success": false,
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": { /* optional additional info */ }
}
```

**Common Error Codes:**
- `SERVER_NOT_RUNNING`: MCP server is not running
- `TOOL_NOT_FOUND`: Unknown tool name
- `INVALID_ARGS`: Missing or invalid parameters
- `LEARN_FAILED`: Learning process failed
- `SEARCH_FAILED`: Search operation failed

**Example Error Handling:**
```typescript
try {
  const result = await opencode.execute("inmemoria_search", {
    query: "authentication"
  })
} catch (error) {
  if (error.code === "SERVER_NOT_RUNNING") {
    console.log("Please wait, starting In-Memoria server...")
  }
}
```

---

## Configuration

Configuration is loaded from `.opencode/inmemoria.json`:

```json
{
  "autoLearn": true,
  "contextInjection": true,
  "logTools": false,
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "learning": {
    "minConfidence": 0.7,
    "autoLearnThreshold": 10
  }
}
```

See [CONFIGURATION.md](./CONFIGURATION.md) for detailed options.
