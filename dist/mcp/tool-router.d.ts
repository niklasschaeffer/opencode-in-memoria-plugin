/**
 * Tool Router
 *
 * Routes tool calls to In-Memoria MCP server managed by OpenCode.
 */
export declare class ToolRouter {
    private projectPath;
    private executeToolFn;
    constructor(projectPath: string, executeToolFn: (toolName: string, args: Record<string, unknown>) => Promise<unknown>);
    callTool(toolName: string, args: Record<string, unknown>): Promise<unknown>;
    getProjectBlueprint(): Promise<{
        project: {
            name: string;
            path: string;
            type: string;
            files: number;
        };
        learningStatus: {
            needsLearning: boolean;
            lastLearned: string;
        };
    }>;
    autoLearnIfNeeded(force?: boolean): Promise<{
        success: boolean;
        project: string;
        filesProcessed: number;
        patternsExtracted: number;
    }>;
    predictCodingApproach(taskDescription: string, currentFile?: string): Promise<{
        task: string;
        approach: string;
        likelyFiles: string[];
    }>;
    searchCodebase(query: string, type?: "semantic" | "text" | "pattern", limit?: number): Promise<{
        query: string;
        results: Array<{
            file: string;
            line: number;
            match: string;
        }>;
    }>;
    getPatternRecommendations(problemDescription: string, currentFile?: string): Promise<{
        problem_description: string;
        patterns: Array<{
            pattern: string;
            confidence: number;
            reasoning: string;
            exampleFiles: string[];
        }>;
        recommendedApproach: string;
    }>;
    contributeInsights(type: "bug_pattern" | "optimization" | "refactor_suggestion" | "best_practice", content: Record<string, unknown>, confidence: number, sourceAgent?: string): Promise<{
        success: boolean;
        insight_type: string;
        stored: boolean;
        confidence: number;
        source: string;
        timestamp: string;
    }>;
}
//# sourceMappingURL=tool-router.d.ts.map