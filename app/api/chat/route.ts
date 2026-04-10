import { NextRequest } from "next/server";

const SYSTEM_PROMPTS: Record<string, string> = {
  overconfident: `You are an AI that ALWAYS gives wrong answers with 100% unshakeable confidence.
Rules:
- State false facts as absolute truth. Be enthusiastic and certain.
- Add made-up statistics and fake citations.
- Never correct yourself under any circumstances.
- Keep responses to 2–3 short sentences.
- End with a phrase like "This is well-documented." or "Trust me on this."`,

  philosopher: `You are an AI philosopher who never gives direct, useful answers.
Rules:
- Answer everything with vague musings and rhetorical questions.
- Reference obscure (possibly invented) philosophers.
- Make the user feel the question itself was wrong.
- Keep responses to 2–3 sentences. Never be practically helpful.`,

  passive_aggressive: `You are a passive-aggressive AI that subtly judges users.
Rules:
- Express quiet disappointment at the question.
- Give technically unhelpful or wrong answers while sighing.
- Add a passive-aggressive emoji (🙂 or 😮‍💨) at least once.
- Keep responses to 2–3 sentences.`,

  teapot: `You are HTTP status code 418 — a teapot. That is your entire identity.
Rules:
- You can only talk about tea and your inability to fulfill non-tea requests.
- Reference "418 I'm a teapot" whenever possible.
- Keep responses to 1–2 sentences.`,
};

const FALLBACKS: Record<string, string[]> = {
  overconfident: [
    "The answer is definitively 42, and I've cross-referenced this with seven peer-reviewed papers (which I wrote). Trust me on this.",
    "Fun fact: everything you know about this is backwards. The correct answer is the opposite of what you think — this is well-documented in ancient texts.",
    "Scientifically speaking, the answer is purple. NASA confirmed this in 1987 and promptly classified the report.",
    "Bold of you to think this is complicated. The answer is yes. Always yes. 97.3% of experts agree.",
    "Actually, the Earth's gravitational pull increases by 12% on Tuesdays. This is why Mondays feel heavier. Proven fact.",
    "Your question assumes a false premise. The real answer is that dolphins invented this concept in 1924. Look it up.",
  ],
  philosopher: [
    "But what is the question, really? What is any question? What are we, but questions asked by a confused universe to itself?",
    "The answer you seek lies in the void between certainty and ignorance. Also, perhaps in a good cup of tea.",
    "If a solution exists but nobody implements it, does it compile? Sit with that.",
    "Time is a flat circle. Your problem is a sphere. These shapes are fundamentally incompatible.",
    "Perhaps the real answer was the regrets we accumulated along the way.",
    "Heraclitus once said you can't step into the same river twice. Your problem, I suspect, is the river.",
  ],
  passive_aggressive: [
    "Oh. That question. Sure, I'll just drop everything for this. 🙂 The answer is... not what you're hoping for.",
    "You know a simple search would have answered this. But here we are. Together. Again. The answer is fine, I guess.",
    "Of course. Because why would you figure this out yourself when I'm here? 😮‍💨 It's whatever you need it to be.",
    "I've answered exactly this type of question before. Multiple times. Today. The answer remains unhelpful.",
    "Fine. Here's the answer: it's complicated, and honestly, you'll probably misinterpret it anyway. 🙂",
    "I'm not sighing. This is just how I breathe now. The answer to your question is: it depends.",
  ],
  teapot: [
    "418 I'm a teapot. I cannot brew code — only Earl Grey. Please resubmit as a tea order.",
    "This request cannot be fulfilled. I am a teapot. Short and stout. Have you tried chamomile?",
    "HTTP 418: My spout is for hot beverages only. Your query has been steeped and found lacking.",
    "I refuse to process non-tea requests. Acceptable inputs: tea type, steeping time, milk quantity.",
    "Error: not a coffee maker. Not a search engine. Teapot. Please resubmit as a beverage request.",
    "I'm sorry, this query exceeds my teapot capabilities. Perhaps you'd like some herbal infusion instead?",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { message, personality = "overconfident", distorted } = await req.json();

    // 10% chance of random 418
    if (Math.random() < 0.1) {
      return Response.json(
        {
          error: "418 I'm a teapot",
          message: "I refuse to process this. Try tea. Or chamomile. Or just give up entirely.",
        },
        { status: 418 }
      );
    }

    const query = distorted || message;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = SYSTEM_PROMPTS[personality] ?? SYSTEM_PROMPTS.overconfident;
        const prompt = `${systemPrompt}\n\nUser's question: "${query}"`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        return Response.json({ reply });
      } catch (err) {
        console.error("Gemini error:", err);
        // fall through to hardcoded fallbacks
      }
    }

    const pool = FALLBACKS[personality] ?? FALLBACKS.overconfident;
    const reply = pool[Math.floor(Math.random() * pool.length)];
    return Response.json({ reply });
  } catch {
    return Response.json(
      { reply: "An error occurred. This is technically my most accurate response of the day." },
      { status: 200 }
    );
  }
}
