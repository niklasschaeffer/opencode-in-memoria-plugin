# OpenCode In-Memoria Plugin

[![CI](https://github.com/niklasschaeffer/opencode-in-memoria-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/niklasschaeffer/opencode-in-memoria-plugin/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/opencode-in-memoria-plugin.svg)](https://www.npmjs.com/package/opencode-in-memoria-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Integrates [In-Memoria](https://github.com/pi22by7/In-Memoria) persistent intelligence into OpenCode.

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

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Configuration](./docs/CONFIGURATION.md)

## Development

```bash
npm run dev      # Watch mode
npm run build    # Build once
npm run test     # Run tests
```

## License

MIT
