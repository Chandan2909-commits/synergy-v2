import { Injectable, BadRequestException } from '@nestjs/common';
import { AIProviderAdapter } from '@synergy/ai-contracts';
import { AIProviderName } from '@synergy/types';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { AnthropicProvider } from './anthropic.provider';
import { GroqProvider } from './groq.provider';
import { OllamaProvider } from './ollama.provider';

@Injectable()
export class AIProviderFactory {
  private providers: Map<AIProviderName, AIProviderAdapter> = new Map();

  constructor() {
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('anthropic', new AnthropicProvider());
    this.providers.set('groq', new GroqProvider());
    this.providers.set('ollama', new OllamaProvider());
  }

  getProvider(providerName: string): AIProviderAdapter {
    const normalized = providerName.toLowerCase() as AIProviderName;
    const provider = this.providers.get(normalized);
    if (!provider) {
      throw new BadRequestException(`Unsupported AI provider: ${providerName}. Supported: openai, gemini, anthropic, groq, ollama.`);
    }
    return provider;
  }
}

