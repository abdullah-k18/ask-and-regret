const FALLBACKS = [
  "My keyboard was emotionally unavailable.",
  "I was too busy being a thought leader about productivity.",
  "Mercury was in retrograde and I take that very seriously.",
  "My rubber duck debugger quit without notice.",
  "I accidentally deleted my motivation.exe.",
  "I was refactoring my life choices (breaking changes).",
  "Critical error in sleep.js — awaiting patch.",
  "My git history disagreed with my personal narrative.",
  "I was waiting for async operations in my personal life to resolve.",
  "Stack Overflow was down for 4 minutes and I lost all ability to function.",
  "I couldn't reproduce the issue and decided it never happened.",
];

const SUITABILITY = ["standup meeting", "PR review delay", "client call", "existential crisis", "sprint retrospective"];
const BELIEVABILITY = ["Low", "Very Low", "Moderate", "Suspicious", "Laughable", "Impressively Bad"];

async function generateExcuse(): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(
      `Generate one short, funny, absurd professional excuse for not getting work done.
       It should sound technical or productivity-related but be completely ridiculous.
       Output ONLY the excuse text, no quotes, no explanation. Max 15 words.`
    );
    return result.response.text().trim().replace(/^["']|["']$/g, "");
  } catch {
    return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  }
}

export async function GET() {
  const excuse = await generateExcuse();
  return Response.json({
    excuse,
    confidence: `${(Math.random() * 30 + 70).toFixed(1)}%`,
    believability: BELIEVABILITY[Math.floor(Math.random() * BELIEVABILITY.length)],
    suitable_for: SUITABILITY[Math.floor(Math.random() * SUITABILITY.length)],
    generated_at: new Date().toISOString(),
  });
}
