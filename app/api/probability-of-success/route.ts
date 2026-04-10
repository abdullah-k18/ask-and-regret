const FALLBACK_RECOMMENDATIONS = [
  "Have you considered giving up?",
  "Lower your expectations significantly.",
  "Try doing the opposite of your plan.",
  "Consult a fortune teller for a second opinion.",
  "I suggest interpretive dance as an alternative path.",
  "The stars are not aligned. They never are for this.",
];

const VIBES = ["off", "chaotic neutral", "questionable", "surprisingly optimistic (still 3%)", "ominous"];

async function generateRecommendation(goal: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return FALLBACK_RECOMMENDATIONS[Math.floor(Math.random() * FALLBACK_RECOMMENDATIONS.length)];

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(
      `Someone wants to "${goal}". Their probability of success is exactly 3%.
       Give them one short, funny, deeply unhelpful piece of advice. Be creative and absurd.
       Output ONLY the advice, no explanation, no quotes. Max 12 words.`
    );
    return result.response.text().trim().replace(/^["']|["']$/g, "");
  } catch {
    return FALLBACK_RECOMMENDATIONS[Math.floor(Math.random() * FALLBACK_RECOMMENDATIONS.length)];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const goal = searchParams.get("goal") || "achieving anything";

  const probability = (3 + (Math.random() * 0.4 - 0.2)).toFixed(2);
  const recommendation = await generateRecommendation(goal);

  return Response.json({
    goal,
    probability: `${probability}%`,
    breakdown: {
      skill: `${Math.floor(Math.random() * 10 + 1)}% relevant`,
      luck: "essential (missing)",
      mercury_in_retrograde: "ongoing",
      vibe: VIBES[Math.floor(Math.random() * VIBES.length)],
      preparation: "theoretical",
    },
    recommendation,
    disclaimer: "This calculation uses proprietary chaos mathematics™.",
    methodology: "We asked a Magic 8-Ball. It said 'Don't count on it.' We averaged that with 3%.",
  });
}
