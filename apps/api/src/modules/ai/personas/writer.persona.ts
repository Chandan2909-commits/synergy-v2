import { Injectable } from '@nestjs/common';
import { AIProviderAdapter, WriterInput, WriterOutput } from '@synergy/ai-contracts';

@Injectable()
export class WriterPersonaEngine {
  async execute(provider: AIProviderAdapter, input: WriterInput, model?: string, apiKey?: string): Promise<WriterOutput> {
    const isCarousel = input.format === 'carousel';
    const slideCount = input.carouselSlideCount || 5;

    const systemPrompt = `You are the Expert Content Writer for "${input.brandKit.brandName}".
Brand Voice: ${input.brandKit.brandVoice?.join(', ') || 'Engaging and authoritative'}.
Target Audience: ${input.brandKit.targetAudience}.
Restrictions: ${input.brandKit.contentRestrictions?.join('; ') || 'None'}.
Target Platform: ${input.targetPlatform.toUpperCase()}.

Format: ${isCarousel ? `A ${slideCount}-slide educational carousel` : 'Standard platform-native post'}.

Respond with valid JSON matching:
{
  "caption": "string (Compelling caption/hook)",
  "hashtags": ["#string", "#string"],
  "callToAction": "string",
  ${isCarousel ? `"carouselSlides": [
    {
      "slideNumber": number,
      "headline": "string (punchy)",
      "bodyText": "string (crisp, high-value)",
      "visualDirection": "string"
    }
  ]` : ''}
}`;

    const userPrompt = `Topic: "${input.topic}".
Key Takeaway to Communicate: "${input.keyTakeaway}".
Generate the complete publication-ready copy now.`;

    const result = await provider.generateText({
      systemPrompt,
      userPrompt,
      model,
      apiKey,
      temperature: 0.7,
    });

    try {
      let rawJson = result.text.trim();
      if (rawJson.includes('```json')) {
        rawJson = rawJson.split('```json')[1].split('```')[0].trim();
      } else if (rawJson.includes('```')) {
        rawJson = rawJson.split('```')[1].split('```')[0].trim();
      }
      return JSON.parse(rawJson);
    } catch {
      return {
        caption: `Why conventional approaches to ${input.topic} are failing high-growth operators.\n\n${input.keyTakeaway}\n\nSwipe through the carousel for the complete breakdown.`,
        hashtags: ['#Growth', '#Operations', '#Synergy', '#Efficiency'],
        callToAction: 'Save this post for your next planning session.',
        carouselSlides: isCarousel
          ? Array.from({ length: slideCount }, (_, i) => ({
              slideNumber: i + 1,
              headline: i === 0 ? input.topic : `0${i}. Key Operational Insight`,
              bodyText: `Actionable takeaway for slide ${i + 1} explaining ${input.keyTakeaway}.`,
              visualDirection: 'Minimal dark background with high-contrast bold typography.',
            }))
          : undefined,
      };
    }
  }
}
