import { RewriteMode } from "@/lib/types";

const REWRITE_LABELS: Record<RewriteMode, string> = {
  original: "Original",
  concise: "Concise AI",
  "deep-dive": "Deep Dive AI",
  eli5: "ELI5 AI"
};

function tightenSentence(input: string): string {
  return input
    .replace(/\b(very|really|quite|basically)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shortVersion(summary: string): string {
  const normalized = tightenSentence(summary);
  if (normalized.length <= 130) {
    return normalized;
  }
  return `${normalized.slice(0, 127).trimEnd()}...`;
}

function deepDiveVersion(summary: string): string {
  return [
    `What happened: ${summary}`,
    "Why it matters: this may influence policy, markets, and public behavior over the next few days.",
    "What to watch: official responses, timeline changes, and measurable downstream impact."
  ].join(" ");
}

function eli5Version(summary: string): string {
  const cleaned = tightenSentence(summary);
  return `Imagine this as a class update: ${cleaned} In simple terms, this could change what people, companies, or governments do next.`;
}

export function rewriteSummary(summary: string, mode: RewriteMode): string {
  switch (mode) {
    case "concise":
      return shortVersion(summary);
    case "deep-dive":
      return deepDiveVersion(summary);
    case "eli5":
      return eli5Version(summary);
    case "original":
    default:
      return summary;
  }
}

export function rewriteLabel(mode: RewriteMode): string {
  return REWRITE_LABELS[mode];
}

export const REWRITE_MODES = Object.keys(REWRITE_LABELS) as RewriteMode[];
