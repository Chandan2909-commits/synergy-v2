import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const WRITING_AGENT_SYSTEM_PROMPT = `You are the expert social media copywriter for Synergy AI Workforce. 
Your specialty: Writing high-converting, attention-grabbing Instagram carousel captions that maximize swipe-through rates, comments, and saves.
Rules:
1. Start with an irresistible, high-curiosity hook line in the first 1-2 lines.
2. Structure the body with scannable short paragraphs and clean line breaks (never wall of text).
3. Use bullet points or emojis where appropriate (👉, ⚡, 💡, ✦).
4. Include a clear call-to-action to swipe through the carousel and save/comment.
5. Conclude with 6 to 8 hyper-targeted, relevant hashtags.
6. Return ONLY the final refined caption text without meta-commentary.`;

// In-house high-conversion copywriting refiner (used for instant response & offline fallback)
function refineCaptionInhouse(
  rawCaption: string,
  style: string = 'smart',
  brandName: string = 'Synergy'
): string {
  const trimmed = rawCaption.trim();

  // Extract existing hashtags if any
  const hashtagMatches = trimmed.match(/#\w+/g) || [];
  const bodyText = trimmed.replace(/#\w+/g, '').trim();

  // Identify core keywords from bodyText
  const lower = bodyText.toLowerCase();
  const isMarketing = lower.includes('market') || lower.includes('growth') || lower.includes('sales');
  const isTech = lower.includes('ai') || lower.includes('code') || lower.includes('auto') || lower.includes('software');
  const isB2B = lower.includes('team') || lower.includes('ops') || lower.includes('exec') || lower.includes('enterprise');

  // Curate strategic hashtags
  const defaultTags = new Set<string>();
  if (isTech) {
    defaultTags.add('#AI');
    defaultTags.add('#Automation');
    defaultTags.add('#TechInnovation');
  }
  if (isMarketing) {
    defaultTags.add('#MarketingOps');
    defaultTags.add('#GrowthStrategy');
    defaultTags.add('#ContentMarketing');
  }
  if (isB2B) {
    defaultTags.add('#B2BGrowth');
    defaultTags.add('#Leadership');
    defaultTags.add('#OperationalExcellence');
  }
  defaultTags.add('#Productivity');
  defaultTags.add(`#${brandName.replace(/\s+/g, '')}`);
  defaultTags.add('#SocialStrategy');

  // Add back user's custom hashtags
  hashtagMatches.slice(0, 4).forEach((t) => defaultTags.add(t));
  const finalHashtags = Array.from(defaultTags).slice(0, 8).join(' ');

  // Generate hook based on style
  if (style === 'punchy') {
    return `⚡ Stop doing this the hard way.\n\n${bodyText || 'Most teams spend 80% of their time on execution friction instead of strategic growth.'}\n\n👉 Swipe through for the step-by-step breakdown.\n📌 Save this post to reference during your next sprint.\n\n${finalHashtags}`;
  }

  if (style === 'b2b') {
    return `🎯 Strategic Blueprint for High-Performing Teams:\n\n${bodyText || 'Building scalable systems is what separates market leaders from stagnant operations.'}\n\nKey Takeaways inside:\n✦ The 3 execution levers driving compound growth\n✦ How to eliminate manual operational drag\n✦ Actionable frameworks you can deploy this week\n\n👉 Swipe through the carousel for the full briefing.\n💬 What is your team\'s biggest bottleneck right now? Drop a comment below.\n\n${finalHashtags}`;
  }

  if (style === 'hashtags') {
    return `${bodyText}\n\n👉 Swipe through for the full breakdown!\n📌 Save for later | 💬 Drop your thoughts\n\n${finalHashtags}`;
  }

  // Default: 'smart' (Balanced High-Converting Instagram Caption)
  const firstSentence = bodyText.split(/[.!?\n]/)[0] || 'The tactical framework driving massive velocity';
  const remainingText = bodyText.substring(firstSentence.length).trim();

  return `🚀 ${firstSentence.trim()}!\n\n${remainingText || 'Swipe through this carousel for the complete actionable blueprint.'}\n\nHere is what you need to know:\n👉 Standardized systems compound faster than raw willpower\n👉 Eliminate manual bottlenecks before scaling production\n👉 Deploy automated workflows to protect your creative energy\n\n📌 Save this guide for your next planning session!\n👉 Swipe left to explore each slide in detail.\n\n${finalHashtags}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      caption = '',
      style = 'smart',
      brandName = 'Synergy',
      provider = 'gemini',
      model,
      apiKey,
    } = body;

    const trimmedCaption = caption.trim() || 'Excited to share our latest tactical framework for autonomous AI operations!';

    // 1. Try Gemini API if an API key is available
    const geminiKey = (apiKey && provider === 'gemini' ? apiKey : process.env.GEMINI_API_KEY || '').trim();
    if (geminiKey) {
      try {
        const geminiModel = model || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;

        const prompt = `Style guideline: ${style}. Brand Name: ${brandName}.\n\nRefine this draft Instagram caption:\n"""\n${trimmedCaption}\n"""`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: WRITING_AGENT_SYSTEM_PROMPT }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.75,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 10) {
            return NextResponse.json({
              success: true,
              refinedCaption: generatedText.trim(),
              agent: `Content Writer (${geminiModel})`,
              source: 'gemini-api',
            });
          }
        }
      } catch (err: any) {
        console.warn('[Gemini Refine Notice, using in-house engine]:', err.message);
      }
    }

    // 2. Try OpenAI API if an OpenAI key is available
    const openaiKey = (apiKey && provider === 'openai' ? apiKey : process.env.OPENAI_API_KEY || '').trim();
    if (openaiKey) {
      try {
        const openAiModel = model || 'gpt-4o-mini';
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: openAiModel,
            messages: [
              { role: 'system', content: WRITING_AGENT_SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Style: ${style}. Brand: ${brandName}.\nRefine this caption:\n${trimmedCaption}`,
              },
            ],
            temperature: 0.75,
            max_tokens: 1024,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data.choices?.[0]?.message?.content;
          if (generatedText && generatedText.trim().length > 10) {
            return NextResponse.json({
              success: true,
              refinedCaption: generatedText.trim(),
              agent: `Content Writer (${openAiModel})`,
              source: 'openai-api',
            });
          }
        }
      } catch (err: any) {
        console.warn('[OpenAI Refine Notice, using in-house engine]:', err.message);
      }
    }

    // 3. High-conversion In-House Copywriting Refiner (Instant & Bulletproof)
    const inhouseResult = refineCaptionInhouse(trimmedCaption, style, brandName);

    return NextResponse.json({
      success: true,
      refinedCaption: inhouseResult,
      agent: 'Content Writer (Synergy Copywriting Engine)',
      source: 'inhouse-agent',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to refine caption' },
      { status: 500 }
    );
  }
}

