/**
 * Tool Router
 * 
 * Routes tool calls to In-Memoria MCP server managed by OpenCode.
 */

import { Logger } from "../utils/logger"

export class ToolRouter {
  private projectPath: string
  private executeToolFn: (toolName: string, args: Record<string, unknown>) => Promise<unknown>

  constructor(
    projectPath: string,
    executeToolFn: (toolName: string, args: Record<string, unknown>) => Promise<unknown>
  ) {
    this.projectPath = projectPath
    this.executeToolFn = executeToolFn
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    const fullToolName = `in-memoria-${toolName}`
    Logger.debug(`Calling ${fullToolName}`, args)

    try {
      const result = await this.executeToolFn(fullToolName, {
        ...args,
        project_path: this.projectPath,
      })
      Logger.debug(`${fullToolName} completed`)
      return result
    } catch (error) {
      Logger.error(`${fullToolName} failed:`, error)
      throw error
    }
  }

  async getProjectBlueprint(): Promise<{
    project: { name: string; path: string; type: string; files: number }
    learningStatus: { needsLearning: boolean; lastLearned: string }
  }> {
    return this.callTool("get_project_blueprint", {}) as Promise<{
      project: { name: string; path: string; type: string; files: number }
      learningStatus: { needsLearning: boolean; lastLearned: string }
    }>
  }

  async autoLearnIfNeeded(force = false): Promise<{
    success: boolean
    project: string
    filesProcessed: number
    patternsExtracted: number
  }> {
    return this.callTool("auto_learn_if_needed", { force }) as Promise<{
      success: boolean
      project: string
      filesProcessed: number
      patternsExtracted: number
    }>
  }

  async predictCodingApproach(taskDescription: string, currentFile?: string): Promise<{
    task: string
    approach: string
    likelyFiles: string[]
  }> {
    return this.callTool("predict_coding_approach", {
      problemDescription: taskDescription,
      currentFile,
    }) as Promise<{ task: string; approach: string; likelyFiles: string[] }>
  }

  async searchCodebase(query: string, type: "semantic" | "text" | "pattern" = "semantic", limit = 20): Promise<{
    query: string
    results: Array<{ file: string; line: number; match: string }>
  }> {
    return this.callTool("search_codebase", { query, type, limit }) as Promise<{
      query: string
      results: Array<{ file: string; line: number; match: string }>
    }>
  }

  async getPatternRecommendations(problemDescription: string, currentFile?: string): Promise<{
    problem_description: string
    patterns: Array<{ pattern: string; confidence: number; reasoning: string; exampleFiles: string[] }>
    recommendedApproach: string
  }> {
    return this.callTool("get_pattern_recommendations", {
      problemDescription,
      currentFile,
    }) as Promise<{
      problem_description: string
      patterns: Array<{ pattern: string; confidence: number; reasoning: string; exampleFiles: string[] }>
      recommendedApproach: string
    }>
  }

  async contributeInsights(
    type: "bug_pattern" | "optimization" | "refactor_suggestion" | "best_practice",
    content: Record<string, unknown>,
    confidence: number,
    sourceAgent = "opencode"
  ): Promise<{
    success: boolean
    insight_type: string
    stored: boolean
    confidence: number
    source: string
    timestamp: string
  }> {
    return this.callTool("contribute_insights", {
      type,
      content,
      confidence,
      source_agent: sourceAgent,
    }) as Promise<{
      success: boolean
      insight_type: string
      stored: boolean
      confidence: number
      source: string
      timestamp: string
    }>
  }
}
