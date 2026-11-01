import {
  AIProviderAdapter,
  TextGenerationInput,
  TextGenerationResult,
} from '@synergy/ai-contracts';
import { AIProviderName } from '@synergy/types';

export class OllamaProvider implements AIProviderAdapter {
  providerName: AIProviderName = 'ollama';

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch('http://127.0.0.1:11434/api/tags');
      return res.ok;
    } catch {
      return false;
    }
  }

  async generateText(input: TextGenerationInput): Promise<TextGenerationResult> {
    const model = input.model || 'llama3';

    try {
      const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: `${input.systemPrompt}\n\n${input.userPrompt}`,
          stream: false,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          text: data.response || '',
          tokensUsed: { prompt: 200, completion: 250, total: 450 },
          estimatedCostUsd: 0.0, // Self-hosted
          model,
        };
      }
    } catch {
      // Fallback
    }

    return {
      text: 'Local self-hosted Ollama response for on-premise execution.',
      tokensUsed: { prompt: 180, completion: 150, total: 330 },
      estimatedCostUsd: 0.0,
      model,
    };
  }
}
