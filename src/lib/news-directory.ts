import { Topic } from "@/lib/types";

export interface FeedDirectory {
  id: string;
  name: string;
  url: string;
  topics: Topic[];
  priority: number;
}

export const TOPIC_LABELS: Record<Topic, string> = {
  world: "World",
  business: "Business",
  technology: "Tech",
  science: "Science",
  culture: "Culture"
};

export const AVAILABLE_TOPICS = Object.keys(TOPIC_LABELS) as Topic[];
export const DEFAULT_TOPICS: Topic[] = ["world", "technology"];

export const NEWS_DIRECTORIES: FeedDirectory[] = [
  {
    id: "bbc-world",
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    topics: ["world"],
    priority: 1
  },
  {
    id: "bbc-tech",
    name: "BBC Tech",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    topics: ["technology", "science"],
    priority: 2
  },
  {
    id: "npr-world",
    name: "NPR World",
    url: "https://feeds.npr.org/1004/rss.xml",
    topics: ["world"],
    priority: 3
  },
  {
    id: "npr-business",
    name: "NPR Business",
    url: "https://feeds.npr.org/1006/rss.xml",
    topics: ["business"],
    priority: 4
  },
  {
    id: "nyt-tech",
    name: "NYT Technology",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    topics: ["technology", "business"],
    priority: 5
  },
  {
    id: "guardian-world",
    name: "Guardian World",
    url: "https://www.theguardian.com/world/rss",
    topics: ["world", "culture"],
    priority: 6
  },
  {
    id: "guardian-culture",
    name: "Guardian Culture",
    url: "https://www.theguardian.com/uk/culture/rss",
    topics: ["culture"],
    priority: 7
  },
  {
    id: "science-daily",
    name: "ScienceDaily",
    url: "https://www.sciencedaily.com/rss/top/science.xml",
    topics: ["science", "technology"],
    priority: 8
  }
];

export function normalizeTopics(rawTopics: string | null): Topic[] {
  if (!rawTopics) {
    return DEFAULT_TOPICS;
  }

  const parsedTopics = rawTopics
    .split(",")
    .map((topic) => topic.trim().toLowerCase())
    .filter((topic): topic is Topic => AVAILABLE_TOPICS.includes(topic as Topic));

  if (!parsedTopics.length) {
    return DEFAULT_TOPICS;
  }

  return Array.from(new Set(parsedTopics));
}

export function getDirectoriesForTopics(topics: Topic[]): FeedDirectory[] {
  const normalized = topics.length ? topics : DEFAULT_TOPICS;

  return NEWS_DIRECTORIES
    .filter((directory) => directory.topics.some((topic) => normalized.includes(topic)))
    .sort((left, right) => left.priority - right.priority)
    .slice(0, 6);
}
