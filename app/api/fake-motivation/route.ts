const FALLBACK_QUOTES = [
  { quote: "Every day is a fresh opportunity to make the same mistakes.", attribution: "— Ancient Proverb (made up)" },
  { quote: "Believe in yourself. No one else will.", attribution: "— Some guy on LinkedIn" },
  { quote: "Success is just failure that hasn't shipped to production yet.", attribution: "— Fortune cookie, 2019" },
  { quote: "Dream big. Execute poorly. Blame the requirements.", attribution: "— Definitely not me" },
  { quote: "Chase your dreams. Then question the dreams. Then nap.", attribution: "— My horoscope this morning" },
];

const ATTRIBUTIONS = [
  "— Ancient Proverb (made up)",
  "— Sun Tzu (probably not)",
  "— Albert Einstein (very debatable)",
  "— Some guy on LinkedIn",
  "— Fortune cookie, 2019",
  "— My horoscope this morning",
  "— Overheard at a hackathon",
  "— Confucius (he would hate this)",
];

const SIDE_EFFECTS = ["mild confusion", "existential dread", "unexpected productivity", "vague optimism", "career change"];

async function generateQuote(): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const f = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    return f.quote;
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(
      `Generate one fake motivational quote that sounds deep but is actually meaningless, slightly depressing, or subtly absurd.
       It should feel like something a startup founder or LinkedIn influencer would post unironically.
       Output ONLY the quote text, no attribution, no quotes around it. Max 20 words.`
    );
    return result.response.text().trim().replace(/^["']|["']$/g, "");
  } catch {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)].quote;
  }
}

export async function GET() {
  const quote = await generateQuote();
  const attribution = ATTRIBUTIONS[Math.floor(Math.random() * ATTRIBUTIONS.length)];
  return Response.json({
    quote,
    attribution,
    effectiveness: `${Math.floor(Math.random() * 5 + 1)}%`,
    will_change_your_life: false,
    side_effects: SIDE_EFFECTS[Math.floor(Math.random() * SIDE_EFFECTS.length)],
    disclaimer: "Results not typical. No results are typical.",
  });
}
