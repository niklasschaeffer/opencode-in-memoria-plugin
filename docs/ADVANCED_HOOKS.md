# Deep OpenCode Hook Integration for In-Memoria

## Current State: Basic Hooks

The current plugin provides:
- ✅ `project.open` → Auto-learn
- ✅ Manual tools (6 custom tools)
- ❌ No automatic pattern discovery during coding
- ❌ No automatic insight memorization

## Enhanced Integration: Full Hook Cycle

### 1. File Change Detection (Real-time Pattern Discovery)

```typescript
// Hook: File created/modified/deleted
"file.change": async (event) => {
  const { path, type, content } = event // 'created' | 'modified' | 'deleted'
  
  // Analyze change for patterns
  const analysis = await toolRouter.callTool("analyze_codebase", {
    path,
    includePatterns: true,
    includeSemantic: true
  })
  
  // If significant pattern detected, auto-contribute insight
  if (analysis.patterns?.length > 0) {
    await toolRouter.callTool("contribute_insights", {
      type: "pattern_detected",
      description: `New pattern in ${path}: ${analysis.patterns[0].description}`,
      context: { path, pattern: analysis.patterns[0] }
    })
  }
  
  // Trigger incremental learning
  await toolRouter.callTool("incremental_learn", {
    changedFiles: [path],
    changeType: type
  })
}
```

### 2. AI Response Enhancement (Context Injection)

```typescript
// Hook: Before AI generates response
"ai.response.before": async (context, messages) => {
  // Get project context from In-Memoria
  const blueprint = await toolRouter.callTool("get_project_blueprint", {
    path: context.project.path
  })
  
  // Get relevant patterns for current task
  const patterns = await toolRouter.callTool("get_pattern_recommendations", {
    currentFile: context.currentFile,
    problemDescription: messages[messages.length - 1]?.content
  })
  
  // Inject into context
  return {
    enhancedContext: `
## Project Context (from In-Memoria)
${blueprint.summary}

## Relevant Patterns
${patterns.recommendations.map(r => `- ${r.type}: ${r.description}`).join('\n')}

## Developer Profile
- Preferred patterns: ${blueprint.patterns?.join(', ')}
- Naming conventions: ${blueprint.conventions?.naming}

---
Original request:
${messages[messages.length - 1]?.content}
    `.trim()
  }
}
```

### 3. Automatic Insight Capture

```typescript
// Hook: After AI completes task
"task.complete": async (task, result) => {
  // Analyze what was done
  const filesChanged = result.filesModified || []
  
  if (filesChanged.length > 0) {
    // Auto-contribute architectural decision
    await toolRouter.callTool("contribute_insights", {
      type: "best_practice",
      description: `Implemented ${task.description} following ${result.patternUsed} pattern`,
      tags: ["auto-captured", result.patternUsed],
      relatedFiles: filesChanged
    })
  }
}

// Hook: When AI encounters error
"ai.error": async (error, context) => {
  // Check if this is a known issue
  const insights = await toolRouter.callTool("get_semantic_insights", {
    query: error.message,
    conceptType: "bug_pattern"
  })
  
  if (insights.length > 0) {
    // Provide fix suggestion from memory
    return {
      suggestion: `Known issue found: ${insights[0].description}. Fix: ${insights[0].solution}`
    }
  } else {
    // Record new bug pattern
    await toolRouter.callTool("contribute_insights", {
      type: "bug_pattern",
      description: `Error: ${error.message}`,
      context: { file: context.currentFile, stack: error.stack }
    })
  }
}
```

### 4. Work Session Tracking

```typescript
// Hook: Conversation started
"conversation.start": async (session) => {
  // Load session context from In-Memoria
  const sessionContext = await toolRouter.callTool("get_work_session", {
    sessionId: session.id
  })
  
  if (sessionContext) {
    Logger.info(`📚 Resuming session with ${sessionContext.tasks?.length} previous tasks`)
  }
}

// Hook: Conversation ended
"conversation.end": async (session, summary) => {
  // Save session summary
  await toolRouter.callTool("save_work_session", {
    sessionId: session.id,
    summary: {
      tasksCompleted: summary.tasksCompleted,
      patternsLearned: summary.patternsUsed,
      decisionsMade: summary.decisions,
      filesModified: summary.filesModified
    }
  })
}
```

### 5. Smart Tool Suggestions

```typescript
// Hook: Before showing available tools
"tools.list": async (context) => {
  // Get what would be most useful based on context
  const suggestions = await toolRouter.callTool("predict_coding_approach", {
    problemDescription: context.lastMessage,
    includeFileRouting: true
  })
  
  // Prioritize relevant tools
  return {
    prioritize: ["predict_coding_approach", "get_pattern_recommendations"],
    context: `Based on your request, you might want to check: ${suggestions.targetFiles.join(', ')}`
  }
}
```

### 6. Background Learning Queue

```typescript
class BackgroundLearningQueue {
  private queue: string[] = []
  private isProcessing = false
  
  // Hook: File saved
  "file.save": async (file) => {
    this.queue.push(file.path)
    this.processQueue()
  }
  
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return
    
    this.isProcessing = true
    const batch = this.queue.splice(0, 5) // Process 5 at a time
    
    try {
      await toolRouter.callTool("batch_learn", { files: batch })
    } catch (error) {
      Logger.warn("Background learning failed:", error)
    } finally {
      this.isProcessing = false
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 1000)
      }
    }
  }
}
```

## Implementation Priority

### Phase 1: Context Enhancement (High Impact)
```typescript
"ai.response.before" // Inject project context automatically
```
**Impact**: AI always knows your project patterns without asking

### Phase 2: Auto-Capture (Medium Impact)
```typescript
"task.complete" // Save architectural decisions
"ai.error" // Record bug patterns
```
**Impact**: Builds organizational memory automatically

### Phase 3: Real-time Discovery (High Impact, Complex)
```typescript
"file.change" // Watch for pattern changes
```
**Impact**: Patterns update as you code

### Phase 4: Session Persistence (Nice to Have)
```typescript
"conversation.start/end" // Remember work sessions
```
**Impact**: Resume work with full context

## Current Limitations

**Why this isn't fully implemented yet:**

1. **OpenCode Hook API** - Need to verify which hooks are actually available
2. **Performance** - Real-time analysis could slow down IDE
3. **Noise** - Auto-capturing everything = information overload
4. **In-Memoria API** - Some endpoints (incremental_learn, batch_learn) need verification

## What Works Now

The current implementation gives you:

✅ **Project Load** → Auto-analyzes and learns patterns  
✅ **Manual Query** → Ask for patterns anytime  
✅ **Search** → Find code semantically  
✅ **Routing** → Get file suggestions  

But you **manually** trigger these via tools.

## Recommendation

**Current**: Use the plugin as-is. It's already useful.  
**Next Step**: Add `ai.response.before` hook for automatic context injection.  
**Future**: File watching + incremental learning when OpenCode supports it.

The **manual approach** is actually better for now because:
- You control when learning happens
- No performance overhead
- You decide what patterns matter
- Explicit > Implicit for AI tools
