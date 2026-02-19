export type Topic = "world" | "business" | "technology" | "science" | "culture";

export type HumorMode = "straight" | "wry" | "chaotic";

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
