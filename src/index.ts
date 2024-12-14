import { StateGraph, START, END } from "@langchain/langgraph";
import { dependencyScanner } from "./nodes/dependencyScanner";
import { vulnerabilityAnalyzer } from "./nodes/vulnerabilityAnalyzer";
import { secureAlternatives } from "./nodes/secureAlternatives";
import { reportGenerator } from "./nodes/reportGenerator";
import { DependencyRiskAnnotation, routingFunction } from "./agent";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {

    const builder = new StateGraph(DependencyRiskAnnotation)
        //adding graph nodes
        .addNode('dependencyScanner', dependencyScanner)
        .addNode("vulnerabilityAnalyzer", vulnerabilityAnalyzer)
        .addNode("secureAlternatives", secureAlternatives)
        .addNode("reportGenerator", reportGenerator)
        //adding edges between nodes
        .addEdge(START, "dependencyScanner")
        //here we use a routing function to enable graph decide the next node based on the state
        .addConditionalEdges("dependencyScanner", routingFunction, [END, "vulnerabilityAnalyzer"])
        .addEdge("vulnerabilityAnalyzer", "secureAlternatives")
        .addEdge("secureAlternatives", "reportGenerator")
        .addEdge("reportGenerator", END);

    // Graph needs to be compiled before run    
    const securityGraph = builder.compile();

    const agentResult = await securityGraph.invoke({ filePath: './package-example.json' });
    console.log(agentResult.reportPath);

    /* const mermaidDiagram = await securityGraph.getGraph().drawMermaid();

    console.log("Mermaid Diagram:");
    console.log(mermaidDiagram); */

}

main().catch(console.error); 