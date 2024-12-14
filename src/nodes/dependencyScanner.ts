import { readFileSync } from 'fs';
import { DependencyRiskAnnotation } from '../agent';

export function dependencyScanner(state: typeof DependencyRiskAnnotation.State): Record<string, string> {
    try {
        console.log(`Running dependencyScanner`);
        const packageJson = JSON.parse(readFileSync(state.filePath, 'utf-8'));
        const dependencies = packageJson.dependencies || {};
        return { dependencies };
    } catch (error: any) {
        console.error(`Error reading dependencies from ${state.filePath}:`, error.message);
        return {};
    }
}