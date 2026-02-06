/**
 * Usage Examples for OpenCode In-Memoria Plugin
 * 
 * These examples show how to use the plugin in your OpenCode workflow.
 */

import plugin from "../src/index"

// Example 1: Quick Setup
async function quickSetupExample() {
  console.log("=== Example 1: Quick Setup ===")
  
  const result = await plugin.executeTool("inmemoria_quick_setup", {
    project_path: "/path/to/your/project",
    task: "Implement user authentication"
  })
  
  console.log("Setup complete:", result)
}

// Example 2: Get Context
async function getContextExample() {
  console.log("\n=== Example 2: Get Project Context ===")
  
  const context = await plugin.executeTool("inmemoria_get_context", {
    project_path: "/path/to/your/project"
  })
  
  console.log("Project context:", context)
  
  // Use the context in your AI prompts
  console.log(`\nProject type: ${context.project.type}`)
  console.log(`Key technologies: ${context.project.technologies?.join(", ")}`)
}

// Example 3: Search Codebase
async function searchExample() {
  console.log("\n=== Example 3: Search Codebase ===")
  
  // Semantic search
  const semanticResults = await plugin.executeTool("inmemoria_search", {
    project_path: "/path/to/your/project",
    query: "user authentication flow",
    type: "semantic",
    limit: 5
  })
  
  console.log("Semantic search results:", semanticResults)
  
  // Pattern search
  const patternResults = await plugin.executeTool("inmemoria_search", {
    project_path: "/path/to/your/project",
    query: "function.*auth",
    type: "pattern",
    limit: 5
  })
  
  console.log("Pattern search results:", patternResults)
}

// Example 4: Suggest Files
async function suggestFilesExample() {
  console.log("\n=== Example 4: Suggest Files for Task ===")
  
  const suggestions = await plugin.executeTool("inmemoria_suggest_files", {
    project_path: "/path/to/your/project",
    task: "Add password reset functionality"
  })
  
  console.log("Suggested files:", suggestions.suggested_files)
  console.log("Relevant files:", suggestions.relevant_files)
}

// Example 5: Check Status
async function statusExample() {
  console.log("\n=== Example 5: Check Plugin Status ===")
  
  const status = await plugin.executeTool("inmemoria_status", {})
  
  console.log("Plugin status:", status)
}

// Example 6: Force Re-learn
async function learnExample() {
  console.log("\n=== Example 6: Force Re-learn Project ===")
  
  const result = await plugin.executeTool("inmemoria_learn", {
    project_path: "/path/to/your/project"
  })
  
  console.log("Learning result:", result)
}

// Run examples (in real usage, OpenCode would call these)
// quickSetupExample()
// getContextExample()
// searchExample()
// suggestFilesExample()
// statusExample()
// learnExample()
