import Parser from "rss-parser";
import { NextResponse } from "next/server";

import { DEFAULT_TOPICS, getDirectoriesForTopics, normalizeTopics } from "@/lib/news-directory";
import { NewsStory, Topic } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ParsedFeedItem = {
  guid?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  "content:encoded"?: string;
  enclosure?: { url?: string };
  "media:content"?: Array<{ $?: { url?: string } }>;
};

const parser = new Parser<Record<string, never>, ParsedFeedItem>({
  customFields: {
    item: [["content:encoded", "content:encoded"], ["media:content", "media:content", { keepArray: true }]]
  }
});

const FALLBACK_STORIES: NewsStory[] = [
  {
    id: "fallback-world-1",
    title: "Markets and policymakers brace for a week of global negotiations",
    summary: "Global officials are preparing for a fresh round of climate, trade, and security talks.",
    url: "https://www.reuters.com/world/",
    source: "Fallback Wire",
    topic: "world",
    publishedAt: new Date().toISOString()
  },
  {
    id: "fallback-tech-1",
    title: "AI assistant rollouts expand into productivity and search",
    summary: "Tech platforms are shipping new assistant features while regulators monitor competition concerns.",
    url: "https://www.theverge.com/ai-artificial-intelligence",
    source: "Fallback Wire",
    topic: "technology",
    publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString()
  },
  {
    id: "fallback-business-1",
    title: "Consumer confidence rises as inflation cools in key regions",
    summary: "Household sentiment improved in several economies while central banks hold rates steady.",
    url: "https://www.ft.com/global-economy",
    source: "Fallback Wire",
    topic: "business",
    publishedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString()
  }
];

function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function summaryFromItem(item: ParsedFeedItem): string {
  const candidate =
    item.contentSnippet ??
    item["content:encoded"] ??
    item.content ??
    "Tap through to read the full reporting from the source.";
  const cleaned = stripTags(candidate);
  if (cleaned.length <= 240) {
    return cleaned;
  }
  return `${cleaned.slice(0, 237).trimEnd()}...`;
}

function imageFromItem(item: ParsedFeedItem): string | undefined {
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  const mediaEntries = item["media:content"];
  if (Array.isArray(mediaEntries) && mediaEntries.length > 0) {
    return mediaEntries[0]?.$?.url;
  }

  return undefined;
}

function topicForFeed(feedTopics: Topic[]): Topic {
  return feedTopics[0] ?? DEFAULT_TOPICS[0];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topics = normalizeTopics(searchParams.get("topics"));
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "12", 10);
  const storyLimit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 4), 24) : 12;

  const selectedDirectories = getDirectoriesForTopics(topics);
  const failures: string[] = [];
  const seen = new Set<string>();
  const stories: NewsStory[] = [];

  const feedResults = await Promise.allSettled(
    selectedDirectories.map(async (directory) => {
      const parsed = await parser.parseURL(directory.url);
      return { directory, items: parsed.items ?? [] };
    })
  );

  for (const result of feedResults) {
    if (result.status === "rejected") {
      failures.push(result.reason instanceof Error ? result.reason.message : "Unknown feed error");
      continue;
    }

    const { directory, items } = result.value;
    const topic = topicForFeed(directory.topics);

    for (const item of items) {
      if (!item.title || !item.link) {
        continue;
      }

      const dedupeKey = `${item.link}::${item.title}`;
      if (seen.has(dedupeKey)) {
        continue;
      }
      seen.add(dedupeKey);

      stories.push({
        id: item.guid ?? dedupeKey,
        title: item.title,
        summary: summaryFromItem(item),
        url: item.link,
        source: directory.name,
        topic,
        publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        imageUrl: imageFromItem(item)
      });
    }
  }

  const outputStories =
    stories.length > 0
      ? stories
          .sort(
            (left, right) =>
              new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
          )
          .slice(0, storyLimit)
      : FALLBACK_STORIES.slice(0, storyLimit);

  return NextResponse.json({
    topics,
    directories: selectedDirectories.map((directory) => directory.name),
    stories: outputStories,
    fallback: stories.length === 0,
    failures
  });
}
