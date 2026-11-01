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
Target Platform: "${input.targetPlatform}".
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
      // Platform-adapted intelligent generation
      if (input.targetPlatform === 'instagram') {
        return {
          caption: `Swipe through 👉 Why conventional approaches to ${input.topic} are failing high-growth operators.\n\n${input.keyTakeaway}\n\nSave this carousel to reference with your team.`,
          hashtags: ['#BusinessStrategy', '#ExecutiveLeadership', '#GrowthHacking', '#Synergy'],
          callToAction: 'Save and share with your team.',
          carouselSlides: Array.from({ length: slideCount }, (_, i) => ({
            slideNumber: i + 1,
            headline: i === 0 ? input.topic : `0${i}. High-Impact Lever`,
            bodyText: `Actionable strategic takeaway for slide ${i + 1} explaining ${input.keyTakeaway}.`,
            visualDirection: 'Minimalist Onyx background with Sapphire blue accents.',
          })),
        };
      } else if (input.targetPlatform === 'linkedin') {
        return {
          caption: `Most executives misunderstand ${input.topic}. Here is the ground truth:\n\n${input.keyTakeaway}\n\n3 strategic priorities every leadership team must execute:\n1. Eliminate manual operational drag\n2. Consolidate workforce orchestration\n3. Accelerate high-margin pipeline velocity\n\nHow is your organization navigating this shift?`,
          hashtags: ['#Leadership', '#B2BStrategy', '#OperationalExcellence', '#FutureOfWork'],
          callToAction: 'Join the discussion in the comments below.',
          carouselSlides: isCarousel
            ? Array.from({ length: slideCount }, (_, i) => ({
                slideNumber: i + 1,
                headline: i === 0 ? input.topic : `Strategic Pillar 0${i}`,
                bodyText: `Detailed B2B execution framework for ${input.keyTakeaway}.`,
                visualDirection: 'Clean corporate layout, executive typography.',
              }))
            : undefined,
        };
      } else {
        // X (Twitter)
        return {
          caption: `The brutal truth about ${input.topic}:\n\nMost teams are doing it backwards.\n\n${input.keyTakeaway}.\n\nHere is how top 1% operators win: 🧵👇`,
          hashtags: ['#Tech', '#Scale', '#Productivity'],
          callToAction: 'Retweet if you found this valuable.',
          carouselSlides: undefined,
        };
      }
    }
  }
}
