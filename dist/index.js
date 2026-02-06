/**
 * OpenCode In-Memoria Plugin
 *
 * Hooks into OpenCode lifecycle to automatically capture patterns
 * and call In-Memoria MCP tools managed by OpenCode.
 *
 * @author OpenCode Community
 * @version 1.0.0
 */
import { ToolRouter } from "./mcp/tool-router";
import { Logger } from "./utils/logger";
class InMemoriaPlugin {
    toolRouter = null;
    async initialize(context) {
        Logger.info("Initializing In-Memoria plugin...");
        try {
            if (context.executeTool) {
                this.toolRouter = new ToolRouter(context.workspacePath, context.executeTool);
            }
            else {
                Logger.warn("No executeTool function provided");
            }
            Logger.info("In-Memoria plugin initialized");
        }
        catch (error) {
            Logger.error("Failed to initialize:", error);
            throw error;
        }
    }
    async destroy() {
        Logger.info("Shutting down In-Memoria plugin...");
        this.toolRouter = null;
    }
    getMetadata() {
        return {
            name: "opencode-inmemoria",
            version: "1.0.0",
            hooks: [
                "project.open",
                "tool.execute.before",
                "tool.execute.after",
                "ai.response.before",
                "task.complete",
                "ai.error",
                "file.change",
                "conversation.start",
                "conversation.end",
                "file.save",
                "tools.list",
            ],
            description: "Persistent intelligence plugin for OpenCode",
            author: "OpenCode Community",
        };
    }
    async onProjectOpen(_context) {
        if (!this.toolRouter)
            return;
        try {
            const blueprint = await this.toolRouter.getProjectBlueprint();
            if (blueprint.learningStatus?.needsLearning) {
                Logger.info("Auto-learning project...");
                const result = await this.toolRouter.autoLearnIfNeeded();
                if (result.success) {
                    Logger.info(`Learned ${result.patternsExtracted} patterns from ${result.filesProcessed} files`);
                }
            }
        }
        catch (error) {
            Logger.error("Failed to handle project open:", error);
        }
    }
    async onToolExecuteBefore(ctx) {
        Logger.debug(`Tool executing: ${ctx.toolName}`);
        return ctx;
    }
    async onToolExecuteAfter(ctx) {
        Logger.debug(`Tool completed: ${ctx.toolName}`);
        return ctx;
    }
    async onAIResponseBefore(context) {
        if (!this.toolRouter)
            return context;
        try {
            const blueprint = await this.toolRouter.getProjectBlueprint();
            if (!context.metadata)
                context.metadata = {};
            context.metadata["in-memoria"] = {
                project: blueprint.project,
                timestamp: new Date().toISOString(),
            };
            if (context.taskDescription) {
                const recommendations = await this.toolRouter.getPatternRecommendations(context.taskDescription, context.currentFile);
                context.metadata["in-memoria"].patterns = recommendations.patterns;
            }
        }
        catch (error) {
            Logger.error("Failed to get context:", error);
        }
        return context;
    }
    async onTaskComplete(context) {
        if (!this.toolRouter || !context.success)
            return;
        try {
            if (context.decisions && context.decisions.length > 0) {
                for (const decision of context.decisions) {
                    await this.toolRouter.contributeInsights("best_practice", {
                        description: decision.description,
                        reasoning: decision.reasoning,
                        files: decision.files,
                        task: context.task.description,
                    }, 0.85, "opencode");
                }
                Logger.info(`Captured ${context.decisions.length} decisions`);
            }
        }
        catch (error) {
            Logger.error("Failed to capture insights:", error);
        }
    }
    async onAIError(context) {
        if (!this.toolRouter)
            return;
        try {
            await this.toolRouter.contributeInsights("bug_pattern", {
                error: context.error.message,
                stack: context.error.stack,
                file: context.currentFile,
                project: context.project.name,
            }, 0.9, "opencode");
            Logger.info("Recorded bug pattern");
        }
        catch (error) {
            Logger.error("Failed to record bug pattern:", error);
        }
    }
    async onFileChange(context) {
        if (!this.toolRouter)
            return;
        if (context.path.includes("node_modules") || context.path.includes(".git"))
            return;
        try {
            Logger.debug(`File changed: ${context.path}`);
            if (context.type === "modified") {
                await this.toolRouter.autoLearnIfNeeded(false);
            }
        }
        catch (error) {
            Logger.error("Failed to handle file change:", error);
        }
    }
    async onFileSave(context) {
        if (!this.toolRouter)
            return;
        try {
            Logger.debug(`File saved: ${context.path}`);
            if (context.size < 100000) {
                await this.toolRouter.autoLearnIfNeeded(false);
            }
        }
        catch (error) {
            Logger.error("Failed to handle file save:", error);
        }
    }
    async onConversationStart(_context) {
        Logger.info("Conversation started");
    }
    async onConversationEnd(context) {
        if (!this.toolRouter || !context.summary)
            return;
        try {
            if (context.summary.decisions && context.summary.decisions.length > 0) {
                for (const decision of context.summary.decisions) {
                    await this.toolRouter.contributeInsights("best_practice", {
                        description: decision.description,
                        reasoning: decision.reasoning,
                        files: context.summary.filesModified,
                        session_id: context.sessionId,
                    }, 0.8, "opencode");
                }
            }
            Logger.info(`Session: ${context.summary.tasksCompleted} tasks, ${context.summary.filesModified.length} files`);
        }
        catch (error) {
            Logger.error("Failed to capture session:", error);
        }
    }
    async onToolsList(context) {
        if (!this.toolRouter || !context.taskContext)
            return context;
        try {
            const recommendations = await this.toolRouter.getPatternRecommendations(context.taskContext, context.currentFile);
            if (!context.metadata)
                context.metadata = {};
            context.metadata["in-memoria-suggestions"] = {
                patterns: recommendations.patterns,
                approach: recommendations.recommendedApproach,
            };
        }
        catch (error) {
            Logger.error("Failed to get suggestions:", error);
        }
        return context;
    }
}
export const plugin = new InMemoriaPlugin();
export default plugin;
//# sourceMappingURL=index.js.map