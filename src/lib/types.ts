export type Topic = "world" | "business" | "technology" | "science" | "culture";

export type HumorMode = "straight" | "wry" | "chaotic";
export type RewriteMode = "original" | "concise" | "deep-dive" | "eli5";
export type ReliabilityLevel = "high" | "medium" | "reference";

export interface NewsStory {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  topic: Topic;
  publishedAt: string;
  imageUrl?: string;
}

export interface MockNotification {
  id: string;
  createdAt: string;
  message: string;
  topic: Topic;
  source: string;
  read: boolean;
}
