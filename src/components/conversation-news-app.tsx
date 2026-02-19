"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { introLineForBrief, comedyLineForStory, followUpPrompt } from "@/lib/comedy";
import { AVAILABLE_TOPICS, DEFAULT_TOPICS, TOPIC_LABELS } from "@/lib/news-directory";
import { HumorMode, NewsStory, Topic } from "@/lib/types";

type ChatRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

interface NewsApiResponse {
  directories: string[];
  fallback: boolean;
  failures: string[];
  stories: NewsStory[];
}

const HUMOR_OPTIONS: Array<{ id: HumorMode; label: string }> = [
  { id: "straight", label: "Straight" },
  { id: "wry", label: "Wry" },
  { id: "chaotic", label: "Chaotic" }
];

const STORAGE_KEY = "quartz-brief-prototype-preferences";

function messageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatPublishedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

export default function ConversationNewsApp() {
  const [topics, setTopics] = useState<Topic[]>(DEFAULT_TOPICS);
  const [humorMode, setHumorMode] = useState<HumorMode>("wry");
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [directories, setDirectories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "opening-line",
      role: "assistant",
      text: "Good morning. I can brief you like Quartz: short, conversational, and a little funny."
    }
  ]);

  const pushMessage = useCallback((role: ChatRole, text: string) => {
    setMessages((previous) => [...previous, { id: messageId(), role, text }]);
  }, []);

  const fetchNews = useCallback(
    async (nextTopics: Topic[], nextHumor: HumorMode, userPrompt?: string) => {
      if (userPrompt) {
        pushMessage("user", userPrompt);
      }

      setIsLoading(true);
      setError(null);

      try {
        const topicParam = encodeURIComponent(nextTopics.join(","));
        const response = await fetch(`/api/news?topics=${topicParam}&limit=12`, {
          cache: "no-store"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch briefing data.");
        }

        const payload = (await response.json()) as NewsApiResponse;
        const incomingStories = Array.isArray(payload.stories) ? payload.stories : [];

        setStories(incomingStories);
        setStoryIndex(0);
        setDirectories(payload.directories ?? []);

        pushMessage("assistant", introLineForBrief(nextTopics, nextHumor, incomingStories.length));
        if (payload.fallback) {
          pushMessage(
            "assistant",
            "Live directories are taking a coffee break, so I switched to a fallback wire."
          );
        }
      } catch (fetchError) {
        setError("Could not reach live feeds. Using local fallback cards for now.");
        setStories([]);
        setDirectories([]);

        pushMessage(
          "assistant",
          `I hit a feed error (${fetchError instanceof Error ? fetchError.message : "unknown issue"}).`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [pushMessage]
  );

  useEffect(() => {
    let savedTopics = DEFAULT_TOPICS;
    let savedHumor: HumorMode = "wry";

    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored) as { topics?: Topic[]; humorMode?: HumorMode };
        if (Array.isArray(parsed.topics) && parsed.topics.length > 0) {
          savedTopics = parsed.topics.filter((topic): topic is Topic => AVAILABLE_TOPICS.includes(topic));
        }
        if (parsed.humorMode && HUMOR_OPTIONS.some((option) => option.id === parsed.humorMode)) {
          savedHumor = parsed.humorMode;
        }
      }
    } catch {
      // Ignore parse failures and continue with defaults.
    }

    setTopics(savedTopics);
    setHumorMode(savedHumor);
    void fetchNews(savedTopics, savedHumor);
  }, [fetchNews]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        topics,
        humorMode
      })
    );
  }, [topics, humorMode]);

  const activeStory = useMemo(() => stories[storyIndex] ?? null, [stories, storyIndex]);

  const storyComedy = useMemo(() => {
    if (!activeStory) {
      return null;
    }
    return comedyLineForStory(activeStory.title, humorMode);
  }, [activeStory, humorMode]);

  const storyPrompt = useMemo(() => {
    if (!activeStory) {
      return null;
    }
    return followUpPrompt(activeStory.topic, humorMode);
  }, [activeStory, humorMode]);

  const toggleTopic = (topic: Topic) => {
    const hasTopic = topics.includes(topic);
    const nextTopics = hasTopic ? topics.filter((item) => item !== topic) : [...topics, topic];

    if (nextTopics.length === 0) {
      return;
    }

    setTopics(nextTopics);
    void fetchNews(
      nextTopics,
      humorMode,
      hasTopic
        ? `Drop ${TOPIC_LABELS[topic]} for now.`
        : `Add ${TOPIC_LABELS[topic]} to my briefing mix.`
    );
  };

  const cycleStory = () => {
    if (!stories.length) {
      return;
    }

    const nextIndex = (storyIndex + 1) % stories.length;
    setStoryIndex(nextIndex);
    pushMessage("user", "next brief");
    pushMessage("assistant", `Queued: ${stories[nextIndex].title}`);
  };

  const switchHumorMode = (nextMode: HumorMode) => {
    setHumorMode(nextMode);
    pushMessage("user", `Tone: ${nextMode}`);
    pushMessage("assistant", `Copy that. I'll keep it ${nextMode}.`);
  };

  const activeTopicLabels = topics.map((topic) => TOPIC_LABELS[topic]).join(", ");

  return (
    <main className="prototype-root">
      <section className="plan-panel">
        <h2>Prototype plan</h2>
        <ol>
          <li>Ingest RSS news directories by topic.</li>
          <li>Deliver updates in a chat-native briefing format.</li>
          <li>Personalize feed + tone with lightweight comedy bits.</li>
          <li>Keep a Quartz-style mobile-first layout for screenshot-ready demos.</li>
        </ol>
      </section>

      <section className="phone-shell" aria-label="Quartz style conversation prototype">
        <header className="phone-header">
          <div className="logo-dot">Q</div>
          <div>
            <p className="brand-title">Quartz Brief</p>
            <p className="brand-subtitle">App Store screenshot prototype</p>
          </div>
        </header>

        <p className="directory-line">
          Directories: {directories.length ? directories.join(" · ") : "Loading live feeds..."}
        </p>

        <div className="controls">
          <div className="topic-grid">
            {AVAILABLE_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`chip ${topics.includes(topic) ? "chip-active" : ""}`}
                onClick={() => toggleTopic(topic)}
              >
                {TOPIC_LABELS[topic]}
              </button>
            ))}
          </div>

          <div className="topic-grid tone-grid">
            {HUMOR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`chip ${humorMode === option.id ? "chip-active" : ""}`}
                onClick={() => switchHumorMode(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="conversation-window">
          {messages.slice(-7).map((message) => (
            <article
              key={message.id}
              className={`bubble ${message.role === "assistant" ? "bubble-assistant" : "bubble-user"}`}
            >
              {message.text}
            </article>
          ))}

          {activeStory && (
            <article className="story-card">
              <div className="story-meta">
                <span>{activeStory.source}</span>
                <span>{formatPublishedAt(activeStory.publishedAt)}</span>
              </div>

              <h3>{activeStory.title}</h3>
              <p>{activeStory.summary}</p>

              {activeStory.imageUrl ? (
                <img className="story-image" src={activeStory.imageUrl} alt={activeStory.title} />
              ) : (
                <div className="story-image story-image-fallback">No image from source feed</div>
              )}

              {storyComedy && <p className="story-joke">{storyComedy}</p>}
              {storyPrompt && <p className="story-prompt">{storyPrompt}</p>}

              <a href={activeStory.url} className="read-link" target="_blank" rel="noopener noreferrer">
                Read full story
              </a>
            </article>
          )}

          {isLoading && <article className="bubble bubble-assistant">Scanning directories...</article>}
          {error && <p className="error-line">{error}</p>}
        </div>

        <footer className="footer-actions">
          <button type="button" className="cta" onClick={() => void fetchNews(topics, humorMode, "what is the strategy?")}>
            what&apos;s the strategy? 🤔
          </button>
          <button type="button" className="cta" onClick={cycleStory}>
            next
          </button>
          <button
            type="button"
            className="cta cta-alt"
            onClick={() => void fetchNews(topics, humorMode, `Refresh my ${activeTopicLabels} brief.`)}
          >
            refresh brief
          </button>
        </footer>
      </section>

      <aside className="queue-panel">
        <h3>Up next</h3>
        <ul>
          {stories.slice(1, 6).map((story) => (
            <li key={story.id}>
              <strong>{story.title}</strong>
              <span>
                {story.source} · {TOPIC_LABELS[story.topic]}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
