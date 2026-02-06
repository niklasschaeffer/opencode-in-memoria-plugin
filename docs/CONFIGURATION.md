# Configuration

## Overview

OpenCode In-Memoria can be configured at two levels:

1. **Project-level** (`.opencode/inmemoria.json`) - Per-project settings
2. **Global-level** (`~/.config/opencode/inmemoria.json`) - Default settings for all projects

Configuration is loaded with this priority: Project → Global → Defaults

## Configuration File

Create `.opencode/inmemoria.json` in your project root:

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

## Options Reference

### Core Options

#### `autoLearn` (boolean)

Enable automatic learning when a project is opened.

- **Default**: `true`
- **Values**: `true` | `false`

```json
{
  "autoLearn": true
}
```

When enabled, the plugin will:
1. Check if project has been learned
2. Run `auto_learn_if_needed` if not
3. Skip if already learned (unless `force: true`)

**Disable for:** Large projects where learning takes too long, or if you prefer manual control.

---

#### `contextInjection` (boolean)

Enable automatic context injection before AI responses.

- **Default**: `true`
- **Values**: `true` | `false`
- **Note**: Requires OpenCode hook API support

```json
{
  "contextInjection": true
}
```

When enabled (and supported by OpenCode), the plugin will:
1. Capture `ai.response.before` hook
2. Query project context automatically
3. Inject relevant patterns and conventions into prompt

**Benefits:**
- AI knows your codebase patterns without asking
- Consistent code style in generated code
- Faster responses (no need to query manually)

---

#### `logTools` (boolean)

Enable logging of all tool executions.

- **Default**: `false`
- **Values**: `true` | `false`

```json
{
  "logTools": true
}
```

When enabled, logs all tool calls to console:
```
[In-Memoria] Executing tool: inmemoria_search
[In-Memoria] Args: { query: "authentication", type: "semantic" }
[In-Memoria] Result: 5 matches found
```

**Use for:** Debugging, understanding plugin behavior, development.

---

### Server Options

#### `server.port` (number)

Port for In-Memoria MCP server.

- **Default**: `3000`
- **Range**: `1024` - `65535`

```json
{
  "server": {
    "port": 3001
  }
}
```

**Change if:** Port 3000 is already in use.

---

#### `server.host` (string)

Host for In-Memoria MCP server.

- **Default**: `"localhost"`
- **Values**: `"localhost"` | `"127.0.0.1"` | `"0.0.0.0"`

```json
{
  "server": {
    "host": "127.0.0.1"
  }
}
```

**Note:** For local development only. In-Memoria doesn't support remote connections yet.

---

### Learning Options

#### `learning.minConfidence` (number)

Minimum confidence threshold for pattern matching (0-1).

- **Default**: `0.7`
- **Range**: `0.0` - `1.0`

```json
{
  "learning": {
    "minConfidence": 0.8
  }
}
```

**Higher values:** More strict matching, fewer false positives
**Lower values:** More lenient matching, may include incorrect patterns

**Adjust based on:**
- Codebase consistency (consistent = higher threshold)
- Pattern complexity (complex = lower threshold)
- Desired precision vs recall

---

#### `learning.autoLearnThreshold` (number)

Number of files changed before triggering automatic re-learning.

- **Default**: `10`
- **Range**: `1` - `1000`

```json
{
  "learning": {
    "autoLearnThreshold": 20
  }
}
```

When this many files change, the plugin will:
1. Mark project as needing re-learn
2. Run learning on next `project.open` or manually

**Note:** Requires `file.change` hook support in OpenCode.

**Higher values:** Less frequent learning, better performance
**Lower values:** More up-to-date patterns, more overhead

---

## Configuration Examples

### Minimal Setup

For small projects, use defaults:

```json
{
  "autoLearn": true
}
```

### Large Project Setup

For large projects (>1000 files), optimize for performance:

```json
{
  "autoLearn": false,
  "contextInjection": true,
  "logTools": false,
  "learning": {
    "minConfidence": 0.8,
    "autoLearnThreshold": 50
  }
}
```

**Why:**
- Manual learning control (autoLearn: false)
- High confidence threshold reduces noise
- Higher threshold for re-learning (50 files)

### Development/Testing Setup

For plugin development, enable logging:

```json
{
  "autoLearn": true,
  "logTools": true,
  "server": {
    "port": 3001
  }
}
```

---

## Environment Variables

Override configuration with environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `IN_MEMORIA_DEBUG` | Enable debug logging | `true` |
| `IN_MEMORIA_AUTO_LEARN` | Override autoLearn | `false` |
| `IN_MEMORIA_PORT` | Override server port | `3001` |
| `IN_MEMORIA_MIN_CONFIDENCE` | Override confidence | `0.8` |

**Priority:** Environment variables > Config file > Defaults

---

## Multiple Projects

### Per-Project Settings

Each project can have its own `.opencode/inmemoria.json`:

```
project-a/
  .opencode/
    inmemoria.json      # Project A settings

project-b/
  .opencode/
    inmemoria.json      # Project B settings
```

### Global Defaults

Set defaults in `~/.config/opencode/inmemoria.json`:

```json
{
  "autoLearn": true,
  "contextInjection": false,
  "learning": {
    "minConfidence": 0.75
  }
}
```

These apply to all projects unless overridden.

---

## Validation

The plugin validates configuration on load and will:
- Use defaults for missing values
- Log warnings for invalid values
- Throw errors for critical misconfigurations

**Example validation errors:**
```
[In-Memoria] ⚠️ Invalid config: server.port must be between 1024 and 65535
[In-Memoria] ⚠️ Invalid config: learning.minConfidence must be between 0 and 1
```

---

## Troubleshooting

### Config Not Loading

1. Check file location: Must be `.opencode/inmemoria.json` (not `in-memoria.json`)
2. Check JSON syntax: Use `jsonlint .opencode/inmemoria.json`
3. Check file permissions: Must be readable

### Settings Not Applied

1. Restart OpenCode after changing config
2. Check for typos in property names
3. Verify environment variables aren't overriding

### Performance Issues

If learning is too slow:
```json
{
  "autoLearn": false,
  "learning": {
    "minConfidence": 0.8
  }
}
```

Then manually trigger learning when convenient:
```typescript
await opencode.execute("inmemoria_learn")
```
