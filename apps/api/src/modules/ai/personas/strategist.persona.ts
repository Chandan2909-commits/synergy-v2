import { Injectable } from '@nestjs/common';
import { AIProviderAdapter, StrategistInput, StrategistOutput } from '@synergy/ai-contracts';

@Injectable()
export class StrategistPersonaEngine {
  async execute(provider: AIProviderAdapter, input: StrategistInput, model?: string, apiKey?: string): Promise<StrategistOutput> {
    const systemPrompt = `You are the Lead Marketing Strategist for "${input.businessName}".
Your Brand Voice: ${input.brandKit.brandVoice?.join(', ') || 'Professional'}.
Target Audience: ${input.brandKit.targetAudience}.
Restrictions: ${input.brandKit.contentRestrictions?.join('; ') || 'None'}.

Your role is to formulate high-converting, revenue-aligned marketing strategies.
Break down high-level objectives into actionable content pillars and specific platform assignments (Instagram, LinkedIn, X).
Always respond with valid JSON matching the exact schema:
{
  "strategySummary": "string",
  "contentPillars": [
    {
      "pillar": "string",
      "topics": [
        {
          "title": "string",
          "targetPlatform": "instagram | linkedin | x",
          "format": "text | image | carousel",
          "keyTakeaway": "string"
        }
      ]
    }
  ],
  "suggestedScheduleFrequency": "string"
}`;

    const userPrompt = `Campaign Objective: "${input.campaignGoal}".
Target Channels: ${input.targetPlatforms.join(', ')}.
Formulate the strategic content plan now.`;

    const result = await provider.generateText({
      systemPrompt,
      userPrompt,
      model,
      apiKey,
      temperature: 0.7,
    });

    try {
      // Find JSON block if model wraps in markdown
      let rawJson = result.text.trim();
      if (rawJson.includes('```json')) {
        rawJson = rawJson.split('```json')[1].split('```')[0].trim();
      } else if (rawJson.includes('```')) {
        rawJson = rawJson.split('```')[1].split('```')[0].trim();
      }
      return JSON.parse(rawJson);
    } catch {
      return {
        strategySummary: `Comprehensive omni-channel marketing strategy for ${input.businessName} driving ${input.campaignGoal}.`,
        contentPillars: [
          {
            pillar: 'Authority & Value Creation',
            topics: [
              {
                title: 'The Core Shift in Our Category',
                targetPlatform: 'linkedin',
                format: 'text',
                keyTakeaway: 'Why modern operators are rethinking conventional workflows.',
              },
              {
                title: '5 Steps to Scale Operations Without Headcount',
                targetPlatform: 'instagram',
                format: 'carousel',
                keyTakeaway: 'Actionable visual blueprint with immediate ROI.',
              },
            ],
          },
          {
            pillar: 'Product & Social Proof',
            topics: [
              {
                title: 'Behind the Scenes of Our Process',
                targetPlatform: 'x',
                format: 'text',
                keyTakeaway: 'Transparency builds compounding trust.',
              },
            ],
          },
        ],
        suggestedScheduleFrequency: 'Instagram: 5x/week, LinkedIn: 3x/week, X: 2x/day',
      };
    }
  }
}
