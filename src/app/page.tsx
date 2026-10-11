"use client";

import { useState, useCallback } from "react";

interface DecodeResult {
  detectedLanguage: string;
  coreMeaning: string;
  translation: string;
  transliteration: string;
  context: string;
  alternatives: string;
  tone: string;
}

const LANGUAGES = [
  { value: "auto", label: "🔍 Auto Detect" },
  { value: "English", label: "🇬🇧 English" },
  { value: "Hindi", label: "🇮🇳 Hindi" },
  { value: "Marathi", label: "🇮🇳 Marathi" },
  { value: "Hinglish", label: "🔀 Hinglish" },
  { value: "Romanized Hindi", label: "🔤 Hindi (English letters)" },
  { value: "Romanized Marathi", label: "🔤 Marathi (English letters)" },
];

const TARGET_LANGUAGES = [
  { value: "English", label: "🇬🇧 English" },
  { value: "Hindi", label: "🇮🇳 Hindi" },
  { value: "Marathi", label: "🇮🇳 Marathi" },
  { value: "Hinglish", label: "🔀 Hinglish" },
];

const MODES = [
  { value: "meaning", label: "💡 Meaning", desc: "Explain the meaning" },
  { value: "translate", label: "🌐 Translate", desc: "Translate the text" },
  {
    value: "transliterate",
    label: "🔤 Transliterate",
    desc: "Show pronunciation",
  },
];

const EXAMPLES = [
  { text: "kay kartoy bhava", lang: "Romanized Marathi" },
  { text: "mala ghari jaychay", lang: "Romanized Marathi" },
  { text: "mujhe ghar jana hai", lang: "Romanized Hindi" },
  { text: "scene kya hai", lang: "Hinglish" },
  { text: "tu kuthe ahes", lang: "Romanized Marathi" },
  { text: "jhakaas", lang: "Romanized Marathi" },
];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("English");
  const [mode, setMode] = useState("meaning");
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const handleDecode = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter a word or phrase to decode.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang,
          targetLang,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setError(
        "Could not connect to the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [inputText, sourceLang, targetLang, mode]);

  const handleExample = (text: string, lang: string) => {
    setInputText(text);
    setSourceLang(lang);
    setResult(null);
    setError("");
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
    setError("");
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    } catch {
      // Fallback
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleDecode();
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <h1 className="text-sm font-semibold text-text-primary tracking-tight">
                Sumeet&apos;s Word Decryption
              </h1>
              <p className="text-[10px] text-text-secondary -mt-0.5">
                Powered by Gemini AI
              </p>
            </div>
          </div>
          <a
            href="https://github.com/Sumeets-word-decryption-system"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="GitHub"
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient pt-16 pb-10 sm:pt-20 sm:pb-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight animate-fade-in-up">
            Decode the Meaning{" "}
            <span className="gradient-text">Behind Every Word.</span>
          </h2>
          <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-2xl mx-auto animate-fade-in-up-delay-1">
            Understand slang, phrases and everyday conversations across English,
            Hinglish, Hindi and Marathi.
          </p>
        </div>
      </section>

      {/* Main Decoder */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* Decoder Card */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-card animate-fade-in-up-delay-2">
          {/* Language & Mode Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
            {/* Source Language */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Source Language
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="custom-select w-full rounded-xl px-4 py-2.5 text-sm text-text-primary pr-10"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Language */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="custom-select w-full rounded-xl px-4 py-2.5 text-sm text-text-primary pr-10"
              >
                {TARGET_LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                Decode Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="custom-select w-full rounded-xl px-4 py-2.5 text-sm text-text-primary pr-10"
              >
                {MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Input */}
          <div className="relative mb-4">
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter a word, phrase, or sentence to decode..."
              rows={3}
              maxLength={500}
              className="decoder-textarea w-full rounded-xl px-4 py-3 text-text-primary text-sm sm:text-base resize-none placeholder:text-text-secondary/50"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-[10px] text-text-secondary/50">
                {inputText.length}/500
              </span>
              {inputText && (
                <button
                  onClick={handleClear}
                  className="text-text-secondary hover:text-text-primary transition-colors text-xs bg-bg-elevated px-2 py-0.5 rounded-md"
                  title="Clear input"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Decode Button */}
          <button
            onClick={handleDecode}
            disabled={loading || !inputText.trim()}
            className="btn-decode w-full rounded-xl py-3 text-white font-semibold text-sm sm:text-base tracking-wide"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Decoding...
              </span>
            ) : (
              "⚡ Decode Meaning"
            )}
          </button>

          {/* Keyboard hint */}
          <p className="text-center text-[10px] text-text-secondary/40 mt-2">
            Press Ctrl + Enter to decode
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 animate-fade-in-up">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-6 space-y-4 animate-fade-in-up">
            <div className="shimmer-loading h-8 rounded-xl w-48" />
            <div className="shimmer-loading h-24 rounded-xl" />
            <div className="shimmer-loading h-16 rounded-xl" />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="mt-6 space-y-4 animate-fade-in-up">
            {/* Language Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-violet/15 text-accent-violet border border-accent-violet/20">
                {result.detectedLanguage}
              </span>
              {result.tone && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20">
                  {result.tone}
                </span>
              )}
            </div>

            {/* Core Meaning */}
            <ResultCard
              title="💡 Core Meaning"
              content={result.coreMeaning}
              onCopy={() =>
                copyToClipboard(result.coreMeaning, "coreMeaning")
              }
              copied={copiedField === "coreMeaning"}
            />

            {/* Translation */}
            {result.translation && (
              <ResultCard
                title="🌐 Translation"
                content={result.translation}
                onCopy={() =>
                  copyToClipboard(result.translation, "translation")
                }
                copied={copiedField === "translation"}
              />
            )}

            {/* Transliteration */}
            {result.transliteration &&
              result.transliteration !== result.translation && (
                <ResultCard
                  title="🔤 Transliteration"
                  content={result.transliteration}
                  onCopy={() =>
                    copyToClipboard(
                      result.transliteration,
                      "transliteration"
                    )
                  }
                  copied={copiedField === "transliteration"}
                />
              )}

            {/* Context */}
            {result.context && (
              <ResultCard
                title="📖 Context & Usage"
                content={result.context}
                onCopy={() => copyToClipboard(result.context, "context")}
                copied={copiedField === "context"}
              />
            )}

            {/* Alternatives */}
            {result.alternatives && (
              <ResultCard
                title="🔄 Alternative Interpretations"
                content={result.alternatives}
                onCopy={() =>
                  copyToClipboard(result.alternatives, "alternatives")
                }
                copied={copiedField === "alternatives"}
              />
            )}
          </div>
        )}

        {/* Example Phrases */}
        <div className="mt-12 animate-fade-in-up-delay-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Try these examples
          </h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExample(ex.text, ex.lang)}
                className="example-chip rounded-xl px-4 py-2 text-sm text-text-primary"
              >
                <span className="text-accent-violet mr-1.5">›</span>
                {ex.text}
                <span className="text-[10px] text-text-secondary ml-2">
                  {ex.lang}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} Sumeet&apos;s Word Decryption System.
            Built with ❤️ and Gemini AI.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span>English</span>
            <span className="text-border">•</span>
            <span>Hindi</span>
            <span className="text-border">•</span>
            <span>Marathi</span>
            <span className="text-border">•</span>
            <span>Hinglish</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Result Card Component
function ResultCard({
  title,
  content,
  onCopy,
  copied,
}: {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="result-card rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            {title}
          </h4>
          <p className="text-text-primary text-sm sm:text-base leading-relaxed">
            {content}
          </p>
        </div>
        <button
          onClick={onCopy}
          className="copy-btn flex-shrink-0 text-text-secondary p-1.5 rounded-lg hover:bg-bg-elevated"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="#9B87F5"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
