/**
 * Tool Router
 *
 * Routes tool calls to In-Memoria MCP server managed by OpenCode.
 */
import { Logger } from "../utils/logger";
export class ToolRouter {
    projectPath;
    executeToolFn;
    constructor(projectPath, executeToolFn) {
        this.projectPath = projectPath;
        this.executeToolFn = executeToolFn;
    }
    async callTool(toolName, args) {
        const fullToolName = `in-memoria-${toolName}`;
        Logger.debug(`Calling ${fullToolName}`, args);
        try {
            const result = await this.executeToolFn(fullToolName, {
                ...args,
                project_path: this.projectPath,
            });
            Logger.debug(`${fullToolName} completed`);
            return result;
        }
        catch (error) {
            Logger.error(`${fullToolName} failed:`, error);
            throw error;
        }
    }
    async getProjectBlueprint() {
        return this.callTool("get_project_blueprint", {});
    }
    async autoLearnIfNeeded(force = false) {
        return this.callTool("auto_learn_if_needed", { force });
    }
    async predictCodingApproach(taskDescription, currentFile) {
        return this.callTool("predict_coding_approach", {
            problemDescription: taskDescription,
            currentFile,
        });
    }
    async searchCodebase(query, type = "semantic", limit = 20) {
        return this.callTool("search_codebase", { query, type, limit });
    }
    async getPatternRecommendations(problemDescription, currentFile) {
        return this.callTool("get_pattern_recommendations", {
            problemDescription,
            currentFile,
        });
    }
    async contributeInsights(type, content, confidence, sourceAgent = "opencode") {
        return this.callTool("contribute_insights", {
            type,
            content,
            confidence,
            source_agent: sourceAgent,
        });
    }
}
//# sourceMappingURL=tool-router.js.map