"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const S = {
  bg: "#0a0a0f",
  surface: "#13131f",
  surface2: "#090910",
  border: "#2a2a3f",
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

type ApiResult = Record<string, unknown> | null;

export default function HomePage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [excuseResult, setExcuseResult] = useState<ApiResult>(null);
  const [motivationResult, setMotivationResult] = useState<ApiResult>(null);
  const [probabilityResult, setProbabilityResult] = useState<ApiResult>(null);
  const [loadingExcuse, setLoadingExcuse] = useState(false);
  const [loadingMotivation, setLoadingMotivation] = useState(false);
  const [loadingProbability, setLoadingProbability] = useState(false);
  const [probabilityGoal, setProbabilityGoal] = useState("");

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Start at bottom → shows Footer first
    el.scrollTop = el.scrollHeight;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollBy({ top: -e.deltaY, behavior: "auto" });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && active !== document.body && active.tagName !== "A") return;
      const map: Record<string, number> = {
        ArrowDown: -120, ArrowUp: 120,
        PageDown: -400, PageUp: 400,
      };
      if (map[e.key] !== undefined) {
        e.preventDefault();
        el.scrollBy({ top: map[e.key], behavior: "smooth" });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const call = async (
    url: string,
    setLoading: (b: boolean) => void,
    setResult: (d: ApiResult) => void
  ) => {
    setLoading(true);
    try {
      const res = await fetch(url);
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        height: "100dvh",
        overflowY: "scroll",
        background: S.bg,
        color: S.text,
        scrollbarWidth: "thin",
        scrollbarColor: `${S.accent} ${S.surface}`,
      }}
    >
      {/* ══ HERO ══ (DOM first → user reaches last by scrolling "down") */}
      <section
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
          background: `radial-gradient(ellipse 80% 60% at 50% 60%, ${S.accentDim} 0%, transparent 70%), ${S.bg}`,
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 640, position: "relative" }}>
          <div
            style={{
              display: "inline-block",
              background: S.accentDim,
              border: `1px solid ${S.accentBorder}`,
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 11,
              color: S.accent,
              letterSpacing: "0.1em",
              marginBottom: 24,
            }}
          >
            AI-POWERED (SORT OF)
          </div>

          <h1
            style={{
              fontSize: "clamp(52px, 11vw, 100px)",
              fontWeight: 900,
              lineHeight: 1.05,
              margin: "0 0 24px",
              background: `linear-gradient(135deg, ${S.text} 0%, ${S.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ask &amp; Regret
          </h1>

          <p style={{ fontSize: 20, color: "#a8a8cc", lineHeight: 1.6, marginBottom: 12 }}>
            The AI assistant that&apos;s always wrong, always confident,<br />
            and genuinely trying its best.
          </p>
          <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6, marginBottom: 40 }}>
            Powered by Gemini AI, sabotaged by us. Experience the future of
            confidently incorrect artificial intelligence.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <Link
              href="/chat"
              style={{
                background: S.accent,
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Start Regretting →
            </Link>
            <a
              href="#api"
              style={{
                background: "transparent",
                color: S.accent,
                padding: "14px 32px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 16,
                border: `1px solid ${S.accentBorder}`,
              }}
            >
              Try the API ↓
            </a>
          </div>

          <div style={{ display: "flex", gap: 28, justifyContent: "center", fontSize: 13, color: S.muted, flexWrap: "wrap" }}>
            <span>☕ 418 Teapot Errors Daily</span>
            <span>📉 3% Success Rate</span>
            <span>🎯 0 Correct Answers</span>
          </div>
        </div>
      </section>

      {/* ══ API SHOWCASE ══ */}
      <section
        id="api"
        style={{ minHeight: "100dvh", padding: "80px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        <div style={{ maxWidth: 940, margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                display: "inline-block",
                background: S.accentDim,
                border: `1px solid ${S.accentBorder}`,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 11,
                color: S.accent,
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              USELESS API AS A SERVICE™
            </div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, margin: "0 0 12px" }}>
              Three endpoints. Zero utility.
            </h2>
            <p style={{ color: S.muted, fontSize: 16, margin: 0 }}>
              Public APIs you can call anywhere. Results will always be bad.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
            {/* Random Excuse */}
            <ApiCard
              emoji="🤷"
              title="Random Excuse"
              description="Professional excuses for any situation. Believability not guaranteed."
              endpoint="GET /api/random-excuse"
              loading={loadingExcuse}
              buttonLabel="Get Excuse"
              onAction={() => call("/api/random-excuse", setLoadingExcuse, setExcuseResult)}
            >
              {excuseResult && (
                <ResultBox>
                  <Line color={S.success} italic>&quot;{excuseResult.excuse as string}&quot;</Line>
                  <Line color={S.muted}>Believability: <Val color={S.warn}>{excuseResult.believability as string}</Val></Line>
                  <Line color={S.muted}>Best for: <Val>{excuseResult.suitable_for as string}</Val></Line>
                </ResultBox>
              )}
            </ApiCard>

            {/* Fake Motivation */}
            <ApiCard
              emoji="💪"
              title="Fake Motivation"
              description="Inspirational quotes that sound deep but mean absolutely nothing."
              endpoint="GET /api/fake-motivation"
              loading={loadingMotivation}
              buttonLabel="Motivate Me"
              onAction={() => call("/api/fake-motivation", setLoadingMotivation, setMotivationResult)}
            >
              {motivationResult && (
                <ResultBox>
                  <Line color={S.success} italic>&quot;{motivationResult.quote as string}&quot;</Line>
                  <Line color={S.muted}>{motivationResult.attribution as string}</Line>
                  <Line color={S.muted}>Effectiveness: <Val color={S.error}>{motivationResult.effectiveness as string}</Val></Line>
                </ResultBox>
              )}
            </ApiCard>

            {/* Probability of Success */}
            <ApiCard
              emoji="📉"
              title="Probability of Success"
              description="Calculate your chances. Spoiler: it's always 3%."
              endpoint="GET /api/probability-of-success"
              loading={loadingProbability}
              buttonLabel="Calculate"
              onAction={() =>
                call(
                  probabilityGoal
                    ? `/api/probability-of-success?goal=${encodeURIComponent(probabilityGoal)}`
                    : "/api/probability-of-success",
                  setLoadingProbability,
                  setProbabilityResult
                )
              }
              extra={
                <input
                  value={probabilityGoal}
                  onChange={(e) => setProbabilityGoal(e.target.value)}
                  placeholder="What's your goal?"
                  style={{
                    background: S.surface2,
                    border: `1px solid ${S.border}`,
                    borderRadius: 8,
                    color: S.text,
                    padding: "8px 12px",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                    width: "100%",
                  }}
                />
              }
            >
              {probabilityResult && (
                <ResultBox>
                  <div style={{ fontSize: 28, fontWeight: 800, color: S.error, marginBottom: 6 }}>
                    {probabilityResult.probability as string}
                  </div>
                  <Line color={S.muted}>Mercury: <Val color={S.warn}>{(probabilityResult.breakdown as Record<string,string>)?.mercury_in_retrograde}</Val></Line>
                  <Line color={S.muted} italic>{probabilityResult.recommendation as string}</Line>
                </ResultBox>
              )}
            </ApiCard>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ (DOM last → user sees this FIRST due to inverted scroll) */}
      <footer style={{ padding: "60px 24px", borderTop: `1px solid ${S.border}`, background: S.surface2 }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 32,
              marginBottom: 40,
            }}
          >
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Ask &amp; Regret</div>
              <div style={{ color: S.muted, fontSize: 14 }}>Proudly useless since 2025</div>
              <div style={{ color: S.dim, fontSize: 12, marginTop: 4 }}>
                Built with Gemini, tears, and a concerning amount of confidence
              </div>
            </div>

            <div style={{ display: "flex", gap: 40 }}>
              <NavCol
                title="PRODUCT"
                links={[
                  { label: "Chat", href: "/chat" },
                  { label: "API Showcase", href: "#api" },
                ]}
              />
              <NavCol
                title="API"
                links={[
                  { label: "/random-excuse", href: "/api/random-excuse", external: true },
                  { label: "/fake-motivation", href: "/api/fake-motivation", external: true },
                  { label: "/probability-of-success", href: "/api/probability-of-success", external: true },
                ]}
              />
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${S.border}`,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ color: S.dim, fontSize: 12 }}>
              © 2025 Ask &amp; Regret. No rights reserved (we lost them).
            </div>
            <div style={{ color: S.dim, fontSize: 11, fontStyle: "italic" }}>
              ↓ You've reached the top (which is actually the bottom) ↓
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Small helper components ── */

function ApiCard({
  emoji, title, description, endpoint, loading, buttonLabel, onAction, extra, children,
}: {
  emoji: string; title: string; description: string; endpoint: string;
  loading: boolean; buttonLabel: string; onAction: () => void;
  extra?: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: S.surface,
        border: `1px solid ${S.border}`,
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div>
        <div style={{ fontSize: 26, marginBottom: 8 }}>{emoji}</div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 6, marginBottom: 0 }}>{description}</p>
      </div>
      <code
        style={{
          background: S.surface2,
          border: `1px solid ${S.border}`,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 12,
          color: S.accent,
          display: "block",
          fontFamily: "var(--font-geist-mono, monospace)",
        }}
      >
        {endpoint}
      </code>
      {extra}
      <button
        onClick={onAction}
        disabled={loading}
        style={{
          background: S.accentDim,
          border: `1px solid ${S.accentBorder}`,
          color: S.accent,
          padding: "9px 16px",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "inherit",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Loading..." : buttonLabel}
      </button>
      {children}
    </div>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: S.surface2,
        border: `1px solid ${S.border}`,
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
        fontFamily: "var(--font-geist-mono, monospace)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {children}
    </div>
  );
}

function Line({ color, italic, children }: { color?: string; italic?: boolean; children: React.ReactNode }) {
  return <div style={{ color: color ?? S.text, fontStyle: italic ? "italic" : undefined }}>{children}</div>;
}

function Val({ color, children }: { color?: string; children: React.ReactNode }) {
  return <span style={{ color: color ?? S.text }}>{children}</span>;
}

function NavCol({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <div style={{ color: S.accent, fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noopener noreferrer" : undefined}
            style={{ color: S.muted, textDecoration: "none", fontSize: 13 }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
