import { Annotation, END } from "@langchain/langgraph";

// Define the structure of the state object that will be passed between nodes in the LangGraph workflow.
// Each property represents a key piece of data used by the agents during execution.
export const DependencyRiskAnnotation = Annotation.Root({
    // Path to the file being analyzed, typically a package.json file.
    filePath: Annotation<string>,

    // A record object containing dependencies and their versions extracted from the file.
    dependencies: Annotation<Record<string, string>>,

    // An array of strings listing the identified vulnerabilities in the dependencies.
    vulnerabilities: Annotation<string[]>,

    // An array of strings providing secure and up-to-date alternatives for vulnerable dependencies.
    alternatives: Annotation<string[]>,

    // A string representing the file path where the generated report is saved.
    reportPath: Annotation<string>,
});

// Routing function that determines the next step in the workflow based on the current state.
// This function checks the state object to decide which node (agent) to execute next.
export function routingFunction(state: typeof DependencyRiskAnnotation.State) {
    // If the 'dependencies' object is not empty, proceed to the 'vulnerabilityAnalyzer' node.
    if (Object.entries(state.dependencies).length !== 0) {
        return "vulnerabilityAnalyzer";
    } else {
        // If there are no dependencies, end the workflow.
        return END;
    }
}