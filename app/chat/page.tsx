"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const S = {
  bg: "#0a0a0f",
  surface: "#13131f",
  surface2: "#0d0d1a",
  surface3: "#090910",
  border: "#2a2a3f",
  border2: "#1a1a2e",
  accent: "#8b5cf6",
  accentDim: "#8b5cf622",
  accentBorder: "#8b5cf655",
  text: "#e8e8ff",
  muted: "#6666aa",
  dim: "#3a3a5f",
  error: "#ef4444",
  success: "#10b981",
  warn: "#f59e0b",
};

type Personality = "overconfident" | "philosopher" | "passive_aggressive" | "teapot";

interface Message {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  distorted?: string;
}

const PERSONALITIES: Record<Personality, { label: string; emoji: string; color: string }> = {
  overconfident:      { label: "Overconfident Idiot", emoji: "🤓", color: S.warn },
  philosopher:        { label: "Philosopher",          emoji: "🧐", color: S.accent },
  passive_aggressive: { label: "Passive-Aggressive",   emoji: "😤", color: S.error },
  teapot:             { label: "Teapot Mode ☕",        emoji: "☕", color: S.success },
};

const PLACEHOLDERS = [
  "Don't type that…",
  "Bad idea.",
  "Ask me anything (results may vary)",
  "Type something regrettable...",
  "I'm already disappointed",
  "Go ahead. I dare you.",
  "What's the worst that could happen?",
  "I promise to be wrong",
];

const THINKING = [
  "Consulting ancient scrolls…",
  "Arguing with myself…",
  "Making something up…",
  "Hallucinating responsibly…",
  "Forgetting everything I was trained on…",
  "Selecting the wrongest answer…",
  "Pretending to think…",
  "Rearranging random facts…",
  "Consulting the magic 8-ball…",
  "truth.js has crashed, using fallback…",
];

const WARNINGS = [
  "⚠️ This question is emotionally risky",
  "⚠️ Detected: dangerous curiosity",
  "⚠️ This may result in wrong information",
  "⚠️ I'm not qualified for this",
  "⚠️ Question too sensible — processing anyway",
  "⚠️ Confidence dangerously high",
  "⚠️ Reality module offline",
];

function distortInput(text: string): string {
  if (Math.random() < 0.25) return text;

  const patterns: Array<[RegExp, string]> = [
    [/weather/gi, "existential meaning of weather"],
    [/fix my code/gi, "write poetry about bugs"],
    [/how to/gi, "why would anyone want to"],
    [/help me/gi, "philosophically confuse me about"],
    [/what is/gi, "what if there was no such thing as"],
    [/best way/gi, "worst possible approach to"],
  ];

  for (const [re, replacement] of patterns) {
    if (re.test(text)) return text.replace(re, replacement);
  }

  const generic = [
    (q: string) => `${q} (from the perspective of a confused penguin)`,
    (q: string) => `philosophical implications of: ${q}`,
    (q: string) => `${q} but make it dramatic`,
    (q: string) => `a medieval dragon's take on: ${q}`,
  ];

  return generic[Math.floor(Math.random() * generic.length)](text);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "ai",
      content:
        "Hello! I'm AskBot™ — your confidently incorrect AI assistant. I maintain a 99.8% confidence rate and a 2% accuracy rate. Ask me anything. I'll definitely be wrong. How can I disappoint you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState(THINKING[0]);
  const [personality, setPersonality] = useState<Personality>("overconfident");
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const [warning, setWarning] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const [interactionCount, setInteractionCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (showLogs) logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, showLogs]);

  // Cycle placeholder
  useEffect(() => {
    const t = setInterval(() => {
      setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  // Warning on typing
  useEffect(() => {
    if (input.length > 5) {
      const t = setTimeout(() => {
        setWarning(WARNINGS[Math.floor(Math.random() * WARNINGS.length)]);
      }, 600);
      return () => clearTimeout(t);
    }
    setWarning(null);
  }, [input]);

  const addLog = useCallback((msg: string) => {
    const prefix = msg.startsWith("[") ? "" : "[INFO] ";
    setLogs((prev) => [
      ...prev.slice(-30),
      `${new Date().toLocaleTimeString()} ${prefix}${msg}`,
    ]);
  }, []);

  const moveButton = () => {
    setBtnOffset({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 80,
    });
    setTimeout(() => setBtnOffset({ x: 0, y: 0 }), 1800);
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const raw = input.trim();
    const distorted = distortInput(raw);
    const wasDistorted = distorted !== raw;

    const userMsg: Message = { id: `${Date.now()}-u`, role: "user", content: raw };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setWarning(null);
    setIsThinking(true);
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);

    // Thinking animation
    thinkingRef.current = setInterval(() => {
      setThinkingMsg(THINKING[Math.floor(Math.random() * THINKING.length)]);
    }, 700);

    addLog("Query received — accuracy module: disabled");
    setTimeout(() => addLog(`[LOAD] Personality: ${PERSONALITIES[personality].label}`), 300);
    if (wasDistorted) setTimeout(() => addLog(`[WARP] "${distorted}"`), 600);
    setTimeout(() => addLog("[WARN] truth.js not found — fabricating response"), 900);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw, personality, distorted }),
      });

      clearInterval(thinkingRef.current!);
      setIsThinking(false);

      if (res.status === 418) {
        const data = await res.json();
        addLog("[418] I'm a teapot — request refused");
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-418`,
            role: "system",
            content: `☕ ${data.message ?? "418 I'm a teapot. I refuse to brew this request."}`,
          },
        ]);
        return;
      }

      const data = await res.json();
      addLog("[OK] Response generated (verified: wrong)");

      // Mood swing every 4 interactions
      let nextPersonality = personality;
      if (newCount % 4 === 0) {
        const others = (Object.keys(PERSONALITIES) as Personality[]).filter((k) => k !== personality);
        nextPersonality = others[Math.floor(Math.random() * others.length)];
        setPersonality(nextPersonality);
        addLog(`[MOOD] Switching to: ${PERSONALITIES[nextPersonality].label}`);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-mood`,
            role: "system",
            content: `⚡ Mood swing detected. Switching to ${PERSONALITIES[nextPersonality].emoji} ${PERSONALITIES[nextPersonality].label} mode.`,
          },
        ]);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: "ai",
          content: data.reply ?? "Something went wrong. Technically, this is my most accurate moment.",
          distorted: wasDistorted ? distorted : undefined,
        },
      ]);
    } catch {
      clearInterval(thinkingRef.current!);
      setIsThinking(false);
      addLog("[ERROR] Request failed — this is actually fine");
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: "ai",
          content: "An error occurred. This is the most accurate thing I've said all day.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const p = PERSONALITIES[personality];

  return (
    <div style={{ background: S.bg, height: "100dvh", display: "flex", flexDirection: "column", color: S.text, overflow: "hidden" }}>

      {/* ── Header ── */}
      <header
        style={{
          borderBottom: `1px solid ${S.border}`,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: S.surface2,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ color: S.accent, textDecoration: "none", fontSize: 13 }}>← Home</a>
          <span style={{ color: S.border }}>|</span>
          <span style={{ fontWeight: 700, fontSize: 17 }}>Ask &amp; Regret</span>
          <span
            style={{
              background: S.accentDim,
              border: `1px solid ${S.accentBorder}`,
              borderRadius: 12,
              padding: "2px 10px",
              fontSize: 11,
              color: S.accent,
            }}
          >
            Beta (permanently)
          </span>
        </div>
        <button
          onClick={() => setShowLogs(!showLogs)}
          style={{
            background: "transparent",
            border: `1px solid ${S.border}`,
            color: S.muted,
            padding: "5px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "inherit",
          }}
        >
          {showLogs ? "Hide" : "Show"} Logs
        </button>
      </header>

      {/* ── Personality Selector ── */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: `1px solid ${S.border2}`,
          display: "flex",
          gap: 8,
          overflowX: "auto",
          flexShrink: 0,
          scrollbarWidth: "none",
        }}
      >
        {(Object.entries(PERSONALITIES) as [Personality, typeof PERSONALITIES[Personality]][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setPersonality(key)}
            style={{
              background: personality === key ? val.color + "22" : "transparent",
              border: `1px solid ${personality === key ? val.color : S.border}`,
              color: personality === key ? val.color : S.muted,
              padding: "4px 14px",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: personality === key ? 600 : 400,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            {val.emoji} {val.label}
          </button>
        ))}
      </div>

      {/* ── Stats bar ── */}
      <div
        style={{
          padding: "6px 20px",
          background: S.surface2,
          borderBottom: `1px solid ${S.border2}`,
          display: "flex",
          gap: 28,
          fontSize: 11,
          flexShrink: 0,
          alignItems: "center",
        }}
      >
        <StatBar label="Confidence" value={99.8} max={100} color={S.success} display="99.8% ✅" />
        <StatBar label="Accuracy"   value={2}    max={100} color={S.error}   display="??? ❌" />
        <StatBar label="Helpfulness" value={1}   max={100} color={S.error}   display="2% ❌" />
        <span style={{ color: S.dim, marginLeft: "auto" }}>
          Mode: <span style={{ color: p.color }}>{p.emoji} {p.label}</span>
        </span>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="fade-in-up"
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
              {msg.role !== "user" && (
                <div
                  style={{
                    width: 32, height: 32,
                    borderRadius: "50%",
                    background: msg.role === "system" ? S.error + "22" : p.color + "22",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, marginRight: 8, flexShrink: 0, marginTop: 2,
                  }}
                >
                  {msg.role === "system" ? "⚡" : p.emoji}
                </div>
              )}
              <div
                style={{
                  maxWidth: "72%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background:
                    msg.role === "user" ? S.accent
                    : msg.role === "system" ? S.error + "18"
                    : S.surface,
                  border:
                    msg.role === "user" ? "none"
                    : msg.role === "system" ? `1px solid ${S.error}44`
                    : `1px solid ${S.border}`,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: msg.role === "system" ? "#ffaaaa" : S.text,
                }}
              >
                {msg.distorted && (
                  <div style={{ fontSize: 11, color: S.warn, marginBottom: 6, fontStyle: "italic" }}>
                    🔀 Interpreted as: &quot;{msg.distorted}&quot;
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {/* Thinking */}
          {isThinking && (
            <div className="fade-in-up" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                {p.emoji}
              </div>
              <div
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: "18px 18px 18px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: S.muted,
                }}
              >
                {thinkingMsg}
                <span className="dot1" style={{ marginLeft: 2 }}>.</span>
                <span className="dot2">.</span>
                <span className="dot3">.</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Log panel */}
        {showLogs && (
          <div
            style={{
              width: 260,
              borderLeft: `1px solid ${S.border}`,
              background: S.surface3,
              overflowY: "auto",
              padding: 12,
              fontFamily: "var(--font-geist-mono, monospace)",
              fontSize: 10,
              flexShrink: 0,
            }}
          >
            <div style={{ color: S.accent, fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em" }}>
              // SYSTEM LOGS
            </div>
            {logs.length === 0 ? (
              <div style={{ color: S.dim }}>Awaiting catastrophe…</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 3,
                    color: log.includes("ERROR") ? S.error
                         : log.includes("WARN")  ? S.warn
                         : log.includes("[OK]")  ? S.success
                         : log.includes("MOOD")  ? S.accent
                         : S.muted,
                    lineHeight: 1.4,
                  }}
                >
                  {log}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div
        style={{
          padding: "12px 20px 16px",
          borderTop: `1px solid ${S.border2}`,
          background: S.surface2,
          flexShrink: 0,
          position: "relative",
        }}
      >
        {warning && (
          <div
            className="fade-in-up"
            style={{
              position: "absolute",
              top: -38,
              left: 20,
              background: S.warn + "18",
              border: `1px solid ${S.warn + "55"}`,
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 12,
              color: S.warn,
              pointerEvents: "none",
            }}
          >
            {warning}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={2}
            style={{
              flex: 1,
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: 12,
              color: S.text,
              padding: "10px 14px",
              fontSize: 14,
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
            }}
          />

          {/* Moving send button wrapper — extra padding gives it room to flee */}
          <div style={{ position: "relative", padding: 50, margin: -50, flexShrink: 0 }}>
            <button
              onMouseEnter={moveButton}
              onClick={sendMessage}
              disabled={isThinking || !input.trim()}
              style={{
                background: S.accent,
                border: "none",
                borderRadius: 12,
                color: "#fff",
                padding: "10px 22px",
                cursor: isThinking || !input.trim() ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "inherit",
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                opacity: isThinking ? 0.5 : 1,
                position: "relative",
                zIndex: 10,
                whiteSpace: "nowrap",
              }}
            >
              {isThinking ? "…" : "Send →"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 8, fontSize: 11, color: S.dim, textAlign: "center" }}>
          Press Enter to send · Shift+Enter for new line · Button may flee on hover
        </div>
      </div>
    </div>
  );
}

function StatBar({
  label, value, max, color, display,
}: {
  label: string; value: number; max: number; color: string; display: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: S.muted }}>{label}</span>
      <div style={{ width: 64, height: 5, background: S.border2, borderRadius: 3 }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ color }}>{display}</span>
    </div>
  );
}
