import { HumorMode, Topic } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/news-directory";

const HUMOR_LINES: Record<HumorMode, string[]> = {
  straight: [
    "Context first, panic later.",
    "One crisp update, no hype.",
    "Signal over noise mode is on."
  ],
  wry: [
    "A gentle plot twist before coffee.",
    "Breaking: your group chat will have opinions.",
    "So yes, today is one of those news days."
  ],
  chaotic: [
    "Absolute cinema, but with fact-checking.",
    "Somewhere, a PR team just spilled espresso.",
    "This timeline is powered by vibes and headlines."
  ]
};

const FOLLOW_UP_PROMPTS: Record<HumorMode, string[]> = {
  straight: [
    "Show me the policy angle.",
    "Give me one practical takeaway.",
    "Who is most affected here?"
  ],
  wry: [
    "What is the strategy here?",
    "Who wins, who copes, who writes a memo?",
    "Give me the calm version for my manager."
  ],
  chaotic: [
    "Translate this into meme language.",
    "Give me the spicy but accurate version.",
    "What is the internet going to do with this?"
  ]
};

function hashValue(input: string): number {
  return input.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function pickByHash(items: string[], seed: string): string {
  return items[hashValue(seed) % items.length];
}

export function introLineForBrief(topics: Topic[], humorMode: HumorMode, totalStories: number): string {
  const topicLabels = topics.map((topic) => TOPIC_LABELS[topic]).join(", ");
  const baseline = `I pulled ${totalStories} fresh stories from ${topicLabels} directories.`;
  const line = pickByHash(HUMOR_LINES[humorMode], `${topicLabels}-${totalStories}-${humorMode}`);
  return `${baseline} ${line}`;
}

export function comedyLineForStory(title: string, humorMode: HumorMode): string {
  return pickByHash(HUMOR_LINES[humorMode], `${title}-${humorMode}`);
}

export function followUpPrompt(topic: Topic, humorMode: HumorMode): string {
  const prompt = pickByHash(FOLLOW_UP_PROMPTS[humorMode], `${topic}-${humorMode}`);
  return `${prompt} (${TOPIC_LABELS[topic]})`;
}
