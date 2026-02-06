/**
 * OpenCode Type Definitions
 * 
 * Type definitions for OpenCode plugin system integration.
 */

/**
 * Context provided when plugin is initialized
 */
export interface PluginContext {
  /** Plugin version */
  version: string
  
  /** Workspace root path */
  workspacePath: string
  
  /** Plugin-specific storage directory */
  storagePath: string
  
  /** Logger instance */
  logger: {
    info: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
    debug: (...args: unknown[]) => void
  }
  
  /** Function to execute MCP tools */
  executeTool?: (toolName: string, args: Record<string, unknown>) => Promise<unknown>
}

/**
 * Context for project-related hooks
 */
export interface ProjectContext extends HookContext {
  /** Project name */
  projectName: string
  
  /** Absolute path to project root */
  projectPath: string
  
  /** Project configuration */
  config?: Record<string, unknown>
}

/**
 * Context for tool execution hooks
 */
export interface ToolContext extends HookContext {
  /** Name of the tool being executed */
  toolName: string
  
  /** Arguments passed to the tool */
  args: Record<string, unknown>
  
  /** Result of tool execution (only in after hook) */
  result?: unknown
  
  /** Error if tool failed (only in after hook) */
  error?: Error
}

/**
 * Context for AI response hooks
 */
export interface AIResponseContext extends HookContext {
  /** Current file being worked on */
  currentFile?: string
  
  /** Project context */
  project: {
    name: string
    path: string
  }
  
  /** Messages in the conversation */
  messages: Array<{
    role: "user" | "assistant" | "system"
    content: string
    timestamp?: string
  }>
  
  /** Current task description */
  taskDescription?: string
}

/**
 * Context for task completion hooks
 */
export interface TaskCompleteContext extends HookContext {
  /** Task that was completed */
  task: {
    description: string
    startedAt: string
    completedAt: string
  }
  
  /** Files modified during the task */
  filesModified: string[]
  
  /** Pattern used (if detected) */
  patternUsed?: string
  
  /** Architectural decisions made */
  decisions?: Array<{
    description: string
    reasoning: string
    files: string[]
  }>
  
  /** Whether the task was successful */
  success: boolean
}

/**
 * Context for AI error hooks
 */
export interface AIErrorContext extends HookContext {
  /** The error that occurred */
  error: {
    message: string
    stack?: string
    code?: string
  }
  
  /** Current file when error occurred */
  currentFile?: string
  
  /** Project context */
  project: {
    name: string
    path: string
  }
  
  /** Messages leading up to the error */
  messages: Array<{
    role: "user" | "assistant" | "system"
    content: string
  }>
}

/**
 * Context for file change hooks
 */
export interface FileChangeContext extends HookContext {
  /** File path that changed */
  path: string
  
  /** Type of change */
  type: "created" | "modified" | "deleted"
  
  /** File content (for created/modified) */
  content?: string
  
  /** Previous content (for modified/deleted) */
  previousContent?: string
  
  /** Project path */
  projectPath: string
  
  /** Timestamp of the change */
  changeTimestamp: string
}

/**
 * Context for file save hooks
 */
export interface FileSaveContext extends HookContext {
  /** File path that was saved */
  path: string
  
  /** File content */
  content: string
  
  /** Whether this is a new file */
  isNewFile: boolean
  
  /** Project path */
  projectPath: string
  
  /** Size of file in bytes */
  size: number
}

/**
 * Context for conversation hooks
 */
export interface ConversationContext extends HookContext {
  /** Session ID */
  sessionId: string
  
  /** Session start time */
  startedAt: string
  
  /** Session end time (for conversation.end) */
  endedAt?: string
  
  /** Tasks completed in this session */
  tasksCompleted?: number
  
  /** Patterns learned in this session */
  patternsLearned?: string[]
  
  /** Files modified in this session */
  filesModified?: string[]
  
  /** Session summary (for conversation.end) */
  summary?: {
    tasksCompleted: number
    patternsUsed: string[]
    decisions: Array<{
      description: string
      reasoning: string
    }>
    filesModified: string[]
  }
}

/**
 * Context for tools list hooks
 */
export interface ToolsListContext extends HookContext {
  /** Last user message */
  lastMessage?: string
  
  /** Current file context */
  currentFile?: string
  
  /** Available tools */
  availableTools: string[]
  
  /** Current task context */
  taskContext?: string
}

/**
 * Base hook context
 */
export interface HookContext {
  /** Timestamp when hook was triggered */
  timestamp: string
  
  /** Hook name */
  hookName: string
  
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Tool definition for OpenCode
 */
export interface ToolDefinition {
  /** Tool name */
  name: string
  
  /** Tool description */
  description: string
  
  /** Tool parameters schema */
  parameters: {
    type: "object"
    properties: Record<string, {
      type: string
      description: string
      default?: unknown
    }>
    required?: string[]
  }
  
  /** Tool handler function */
  handler: (args: Record<string, unknown>) => Promise<unknown>
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  /** Plugin name */
  name: string
  
  /** Plugin version */
  version: string
  
  /** Plugin description */
  description: string
  
  /** Plugin author */
  author: string
  
  /** Supported hooks */
  hooks: string[]
  
  /** Provided tools */
  tools: string[]
}

/**
 * Tool execution result
 */
export interface ToolResult<T = unknown> {
  /** Whether execution was successful */
  success: boolean
  
  /** Result data */
  data?: T
  
  /** Error message if failed */
  error?: string
  
  /** Execution metadata */
  metadata?: {
    duration: number
    timestamp: string
  }
}

/**
 * In-Memoria specific types
 */
export interface ProjectBlueprint {
  project: {
    name: string
    path: string
    type: string
    files: number
    structure: unknown
  }
  learningStatus: {
    needsLearning: boolean
    lastLearned?: string
    progress?: number
  }
}

export interface CodingApproach {
  task: string
  approach: string
  likelyFiles: string[]
  confidence: number
}

export interface SearchResult {
  file: string
  line?: number
  match: string
  context?: string
  relevance?: number
}
