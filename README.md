# Ask & Regret

> The AI assistant that's always wrong, always confident, and genuinely trying its best.

🔗 **[ask-and-regret.vercel.app](https://ask-and-regret.vercel.app)**

---

## What is this?

Ask & Regret is a deliberately terrible AI assistant that looks exactly like a real AI product — clean UI, confidence meters, system logs — but is entirely dedicated to being wrong. Powered by Gemini AI, sabotaged by us.

## Features

- **4 Personality Modes**
  - 🤓 Overconfident Idiot — wrong but 100% certain
  - 🧐 Philosopher — answers everything with vague existential musings
  - 😤 Passive-Aggressive — judges you for asking
  - ☕ Teapot Mode — refuses everything via HTTP 418

- **Misinterpretation Engine** — distorts your question before sending it to the AI
- **Moving Send Button** — flees from your cursor on hover
- **Confidence Meter** — always 99.8% confidence, always ??? accuracy
- **Random 418 Errors** — 10% of requests get refused by a teapot
- **Mood Swings** — personality auto-switches every few messages
- **Fake System Logs** — `[ERROR] truth.js has crashed`
- **Inverted Home Page** — starts at the footer, scrolling down goes up

## Useless API as a Service™

Three public endpoints:

```bash
GET /api/random-excuse
GET /api/fake-motivation
GET /api/probability-of-success?goal=anything   # always ~3%
```

## Tech Stack

- **Next.js 15** (App Router)
- **Gemini API** (`gemini-flash-latest`)
- **Tailwind CSS**

## Getting Started

```bash
git clone https://github.com/abdullah-k18/ask-and-regret
cd ask-and-regret
npm install
```

Add your Gemini API key (optional — app works without it via fallbacks):

```bash
# .env.local
GEMINI_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

No rights reserved. We lost them.
