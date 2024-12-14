import { ChatOpenAI } from "@langchain/openai";
import { DependencyRiskAnnotation } from '../agent';

export async function secureAlternatives(state: typeof DependencyRiskAnnotation.State): Promise<{ alternatives: string[] }> {
    console.log(`Running secureAlternatives`);
    const llm = new ChatOpenAI({ model: "gpt-4o-mini", apiKey: process.env.OPENAI_API_KEY });
    const alternatives: string[] = [];

    for (const [dependency, version] of Object.entries(state.dependencies)) {
        try {
            const prompt = `Suggest a secure and up-to-date alternative for the following dependency: Dependency: ${dependency} Version: ${version}`;
            const response = await llm.invoke(prompt);
            alternatives.push(response.content.toString());

        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response from Gemini');
        }
    }

    return { alternatives };
}
