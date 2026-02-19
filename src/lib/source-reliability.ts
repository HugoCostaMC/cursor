import { ReliabilityLevel } from "@/lib/types";

interface SourceReliability {
  level: ReliabilityLevel;
  note: string;
}

const SOURCE_RELIABILITY: Array<{ match: RegExp; metadata: SourceReliability }> = [
  {
    match: /bbc|npr|reuters|associated press|nyt|new york times|guardian/i,
    metadata: { level: "high", note: "Editorial standards and regular corrections policy." }
  },
  {
    match: /science/i,
    metadata: { level: "reference", note: "Reference-oriented science digest source." }
  },
  {
    match: /fallback/i,
    metadata: { level: "medium", note: "Prototype fallback stream while live feeds are unavailable." }
  }
];

const DEFAULT_RELIABILITY: SourceReliability = {
  level: "medium",
  note: "General source quality is unverified in this prototype."
};

export const RELIABILITY_LABELS: Record<ReliabilityLevel, string> = {
  high: "High reliability",
  medium: "Medium reliability",
  reference: "Reference"
};

export function getSourceReliability(source: string): SourceReliability {
  const normalized = source.trim();
  const hit = SOURCE_RELIABILITY.find((candidate) => candidate.match.test(normalized));
  return hit ? hit.metadata : DEFAULT_RELIABILITY;
}
