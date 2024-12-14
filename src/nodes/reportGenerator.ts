import { writeFile } from "fs/promises";
import { DependencyRiskAnnotation } from "../agent";

export async function reportGenerator(state: typeof DependencyRiskAnnotation.State): Promise<{ reportPath: string }> {

    console.log(`Running reportGenerator`);
    let reportContent = `# Dependency Security Report`;
    reportContent += `\n## Vulnerabilities:\n ${state.vulnerabilities.map((v) => `- ${v}`).join("\n")}`;
    reportContent += `\n## Secure Alternatives:\n ${state.alternatives.map((a) => `- ${a}`).join("\n")}`;

    const filePath = "dependency_security_report.md";
    await writeFile(filePath, reportContent);
    return { reportPath: `Report generated: ${filePath}` };

}