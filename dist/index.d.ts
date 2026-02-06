/**
 * OpenCode In-Memoria Plugin
 *
 * Hooks into OpenCode lifecycle to automatically capture patterns
 * and call In-Memoria MCP tools managed by OpenCode.
 *
 * @author OpenCode Community
 * @version 1.0.0
 */
import type { PluginContext, ProjectContext, ToolContext, AIResponseContext, TaskCompleteContext, AIErrorContext, FileChangeContext, FileSaveContext, ConversationContext, ToolsListContext } from "./types/opencode";
export type { PluginContext, ProjectContext, ToolContext, AIResponseContext, TaskCompleteContext, AIErrorContext, FileChangeContext, FileSaveContext, ConversationContext, ToolsListContext, };
declare class InMemoriaPlugin {
    private toolRouter;
    initialize(context: PluginContext): Promise<void>;
    destroy(): Promise<void>;
    getMetadata(): {
        name: string;
        version: string;
        hooks: string[];
        description: string;
        author: string;
    };
    onProjectOpen(_context: ProjectContext): Promise<void>;
    onToolExecuteBefore(ctx: ToolContext): Promise<ToolContext>;
    onToolExecuteAfter(ctx: ToolContext): Promise<ToolContext>;
    onAIResponseBefore(context: AIResponseContext): Promise<AIResponseContext>;
    onTaskComplete(context: TaskCompleteContext): Promise<void>;
    onAIError(context: AIErrorContext): Promise<void>;
    onFileChange(context: FileChangeContext): Promise<void>;
    onFileSave(context: FileSaveContext): Promise<void>;
    onConversationStart(_context: ConversationContext): Promise<void>;
    onConversationEnd(context: ConversationContext): Promise<void>;
    onToolsList(context: ToolsListContext): Promise<ToolsListContext>;
}
/**
 * Factory function that creates and returns the plugin instance
 * OpenCode calls this function to get the plugin
 */
export default function createPlugin(): InMemoriaPlugin;
export declare const plugin: typeof createPlugin;
//# sourceMappingURL=index.d.ts.map