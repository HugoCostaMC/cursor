"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { introLineForBrief, comedyLineForStory, followUpPrompt } from "@/lib/comedy";
import { REWRITE_MODES, rewriteLabel, rewriteSummary } from "@/lib/ai-rewrite";
import { AVAILABLE_TOPICS, DEFAULT_TOPICS, TOPIC_LABELS } from "@/lib/news-directory";
import { getSourceReliability, RELIABILITY_LABELS } from "@/lib/source-reliability";
import { HumorMode, MockNotification, NewsStory, RewriteMode, Topic } from "@/lib/types";

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

interface StoredPreferences {
  topics?: Topic[];
  humorMode?: HumorMode;
  rewriteMode?: RewriteMode;
  notificationsEnabled?: boolean;
  userName?: string;
  onboardingComplete?: boolean;
}

const HUMOR_OPTIONS: Array<{ id: HumorMode; label: string }> = [
  { id: "straight", label: "Straight" },
  { id: "wry", label: "Wry" },
  { id: "chaotic", label: "Chaotic" }
];

const REWRITE_OPTIONS = REWRITE_MODES.map((id) => ({
  id,
  label: rewriteLabel(id)
}));

const RELIABILITY_SHORT: Record<string, string> = {
  "High reliability": "High",
  "Medium reliability": "Medium",
  Reference: "Reference"
};

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
  const [rewriteMode, setRewriteMode] = useState<RewriteMode>("original");
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [directories, setDirectories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "opening-line",
      role: "assistant",
      text: "Welcome to Quartz Brief. Add your preferences and I will build a personalized conversation."
    }
  ]);

  const pushMessage = useCallback((role: ChatRole, text: string) => {
    setMessages((previous) => [...previous, { id: messageId(), role, text }]);
  }, []);

  const fetchNews = useCallback(
    async (
      nextTopics: Topic[],
      nextHumor: HumorMode,
      options?: {
        userPrompt?: string;
        displayName?: string;
      }
    ) => {
      if (options?.userPrompt) {
        pushMessage("user", options.userPrompt);
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

        const intro = introLineForBrief(nextTopics, nextHumor, incomingStories.length);
        const displayName = options?.displayName?.trim() ?? "";
        pushMessage("assistant", displayName ? `${displayName}, ${intro}` : intro);
        if (payload.fallback) {
          pushMessage(
            "assistant",
            "Live directories are taking a coffee break, so I switched to a fallback wire."
          );
        }
        if (payload.failures.length > 0) {
          pushMessage("assistant", `${payload.failures.length} directory sources timed out. I kept going.`);
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
    let savedRewriteMode: RewriteMode = "original";
    let savedNotifications = false;
    let savedOnboardingComplete = false;
    let savedName = "";

    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored) as StoredPreferences;
        if (Array.isArray(parsed.topics) && parsed.topics.length > 0) {
          savedTopics = parsed.topics.filter((topic): topic is Topic => AVAILABLE_TOPICS.includes(topic));
        }
        if (parsed.humorMode && HUMOR_OPTIONS.some((option) => option.id === parsed.humorMode)) {
          savedHumor = parsed.humorMode;
        }
        if (parsed.rewriteMode && REWRITE_OPTIONS.some((option) => option.id === parsed.rewriteMode)) {
          savedRewriteMode = parsed.rewriteMode;
        }
        if (typeof parsed.notificationsEnabled === "boolean") {
          savedNotifications = parsed.notificationsEnabled;
        }
        if (typeof parsed.onboardingComplete === "boolean") {
          savedOnboardingComplete = parsed.onboardingComplete;
        }
        if (typeof parsed.userName === "string") {
          savedName = parsed.userName;
        }
      }
    } catch {
      // Ignore parse failures and continue with defaults.
    }

    setTopics(savedTopics);
    setHumorMode(savedHumor);
    setRewriteMode(savedRewriteMode);
    setNotificationsEnabled(savedNotifications);
    setOnboardingComplete(savedOnboardingComplete);
    setUserName(savedName);
    setIsHydrated(true);

    if (savedOnboardingComplete) {
      void fetchNews(savedTopics, savedHumor, { displayName: savedName });
    }
  }, [fetchNews]);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        topics,
        humorMode,
        rewriteMode,
        notificationsEnabled,
        userName,
        onboardingComplete
      })
    );
  }, [topics, humorMode, rewriteMode, notificationsEnabled, userName, onboardingComplete, isHydrated]);

  useEffect(() => {
    if (!notificationsEnabled || !onboardingComplete || stories.length === 0) {
      return;
    }

    setNotifications((previous) => {
      const known = new Set(previous.map((item) => item.id));
      const generated = stories.slice(0, 3).flatMap((story) => {
        const id = `story-${story.id}`;
        if (known.has(id)) {
          return [];
        }

        return [
          {
            id,
            createdAt: new Date().toISOString(),
            message: `${TOPIC_LABELS[story.topic]} alert: ${story.title}`,
            topic: story.topic,
            source: story.source,
            read: false
          }
        ];
      });

      if (generated.length === 0) {
        return previous;
      }

      return [...generated, ...previous].slice(0, 10);
    });
  }, [notificationsEnabled, onboardingComplete, stories]);

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

  const rewrittenSummary = useMemo(() => {
    if (!activeStory) {
      return null;
    }

    return rewriteSummary(activeStory.summary, rewriteMode);
  }, [activeStory, rewriteMode]);

  const storyReliability = useMemo(() => {
    if (!activeStory) {
      return null;
    }
    return getSourceReliability(activeStory.source);
  }, [activeStory]);

  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const toggleTopic = (topic: Topic) => {
    const hasTopic = topics.includes(topic);
    const nextTopics = hasTopic ? topics.filter((item) => item !== topic) : [...topics, topic];

    if (nextTopics.length === 0) {
      setOnboardingError("Pick at least one topic.");
      return;
    }

    setOnboardingError(null);
    setTopics(nextTopics);
    if (onboardingComplete) {
      void fetchNews(nextTopics, humorMode, {
        userPrompt: hasTopic
          ? `Drop ${TOPIC_LABELS[topic]} for now.`
          : `Add ${TOPIC_LABELS[topic]} to my briefing mix.`,
        displayName: userName
      });
    }
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
    if (onboardingComplete) {
      pushMessage("user", `Tone: ${nextMode}`);
      pushMessage("assistant", `Copy that. I'll keep it ${nextMode}.`);
    }
  };

  const switchRewriteMode = (nextMode: RewriteMode) => {
    setRewriteMode(nextMode);
    if (onboardingComplete) {
      pushMessage("user", `Rewrite mode: ${rewriteLabel(nextMode)}`);
      pushMessage("assistant", `AI rewrite mode set to ${rewriteLabel(nextMode)}.`);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((current) => {
      const next = !current;
      if (onboardingComplete) {
        pushMessage("user", next ? "Enable push alerts." : "Mute push alerts.");
        pushMessage(
          "assistant",
          next
            ? "Push mock enabled. I will queue notification previews for top stories."
            : "Push mock paused. I will keep alerts inside the app."
        );
      }
      return next;
    });
  };

  const markNotificationsRead = () => {
    setNotifications((previous) => previous.map((item) => ({ ...item, read: true })));
  };

  const submitOnboarding = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (topics.length === 0) {
      setOnboardingError("Pick at least one topic.");
      return;
    }

    setOnboardingError(null);
    const displayName = userName.trim();
    setOnboardingComplete(true);
    pushMessage(
      "assistant",
      displayName
        ? `Great to meet you, ${displayName}. Preparing your personalized news brief.`
        : "Great. Preparing your personalized news brief."
    );

    if (notificationsEnabled) {
      pushMessage("assistant", "Push mock is active, so I will queue demo alerts as stories arrive.");
    }

    void fetchNews(topics, humorMode, { displayName });
  };

  const useDemoProfile = () => {
    const displayName = "Alex";
    setUserName(displayName);
    setTopics(DEFAULT_TOPICS);
    setHumorMode("wry");
    setRewriteMode("concise");
    setNotificationsEnabled(true);
    setOnboardingError(null);
    setOnboardingComplete(true);
    pushMessage("assistant", "Loaded demo profile for Alex. Briefing in progress.");
    void fetchNews(DEFAULT_TOPICS, "wry", { displayName });
  };

  const activeTopicLabels = topics.map((topic) => TOPIC_LABELS[topic]).join(", ");
  const currentName = userName.trim() || "Guest";

  return (
    <main className="prototype-root">
      <section className="plan-panel">
        <h2>Prototype plan (v2)</h2>
        <ol>
          <li>Ingest RSS news directories by topic.</li>
          <li>Deliver updates in a chat-native briefing format.</li>
          <li>Personalize feed + tone with comedy and rewrite modes.</li>
          <li>Show source reliability indicators on every story.</li>
          <li>Ship first-run onboarding and saved user profile.</li>
          <li>Mock push notification previews for product demos.</li>
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
        <p className="directory-line status-line">
          Reader: {currentName} · Rewrite: {rewriteLabel(rewriteMode)} · Push:{" "}
          {notificationsEnabled ? "enabled" : "disabled"}
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

          <div className="topic-grid rewrite-grid">
            {REWRITE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`chip ${rewriteMode === option.id ? "chip-active" : ""}`}
                onClick={() => switchRewriteMode(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="notification-toggle-row">
            <button
              type="button"
              className={`chip notification-toggle ${notificationsEnabled ? "chip-active" : ""}`}
              onClick={toggleNotifications}
            >
              {notificationsEnabled ? "Disable push mock" : "Enable push mock"}
            </button>
            <span className="notification-count">{unreadNotifications} unread</span>
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
              {storyReliability && (
                <p
                  className={`reliability-pill reliability-${storyReliability.level}`}
                  title={storyReliability.note}
                >
                  {RELIABILITY_LABELS[storyReliability.level]}
                </p>
              )}

              <h3>{activeStory.title}</h3>
              <p className="rewrite-mode-label">{rewriteLabel(rewriteMode)}</p>
              <p>{rewrittenSummary}</p>

              {activeStory.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- RSS image hosts are dynamic in this prototype.
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
          <button
            type="button"
            className="cta"
            onClick={() =>
              void fetchNews(topics, humorMode, {
                userPrompt: "what is the strategy?",
                displayName: userName
              })
            }
          >
            what&apos;s the strategy? 🤔
          </button>
          <button type="button" className="cta" onClick={cycleStory}>
            next
          </button>
          <button
            type="button"
            className="cta cta-alt"
            onClick={() =>
              void fetchNews(topics, humorMode, {
                userPrompt: `Refresh my ${activeTopicLabels} brief.`,
                displayName: userName
              })
            }
          >
            refresh brief
          </button>
          <button type="button" className="cta cta-alt" onClick={() => switchRewriteMode("eli5")}>
            explain like I&apos;m 5
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
                {story.source} · {TOPIC_LABELS[story.topic]} ·{" "}
                {RELIABILITY_SHORT[RELIABILITY_LABELS[getSourceReliability(story.source).level]]}
              </span>
            </li>
          ))}
        </ul>

        <section className="notification-panel">
          <div className="notification-heading">
            <h4>Push mock center</h4>
            <span>{notificationsEnabled ? "On" : "Off"}</span>
          </div>
          <p>Prototype preview of push copy and timing. No real device notifications are sent.</p>
          <div className="notification-actions">
            <button type="button" className="chip" onClick={toggleNotifications}>
              {notificationsEnabled ? "Pause mock push" : "Enable mock push"}
            </button>
            <button
              type="button"
              className="chip"
              onClick={markNotificationsRead}
              disabled={unreadNotifications === 0}
            >
              Mark all read
            </button>
          </div>

          <ul className="notification-list">
            {notifications.slice(0, 4).map((item) => (
              <li key={item.id} className={item.read ? "read" : ""}>
                <strong>{item.message}</strong>
                <span>
                  {TOPIC_LABELS[item.topic]} · {item.source}
                </span>
              </li>
            ))}
            {notifications.length === 0 && <li className="read">No notifications yet.</li>}
          </ul>
        </section>
      </aside>

      {isHydrated && !onboardingComplete && (
        <div className="onboarding-backdrop">
          <form className="onboarding-card" onSubmit={submitOnboarding}>
            <h3>Set up your briefing</h3>
            <p>
              Choose your topics, voice, and AI rewrite style. This is the first-run onboarding mock for
              product demos.
            </p>

            <label className="onboarding-label" htmlFor="reader-name">
              Name (optional)
            </label>
            <input
              id="reader-name"
              className="onboarding-input"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="e.g. Sam"
              autoComplete="name"
            />

            <p className="onboarding-hint">Topic preferences</p>
            <div className="topic-grid">
              {AVAILABLE_TOPICS.map((topic) => (
                <button
                  key={`onboarding-${topic}`}
                  type="button"
                  className={`chip ${topics.includes(topic) ? "chip-active" : ""}`}
                  onClick={() => toggleTopic(topic)}
                >
                  {TOPIC_LABELS[topic]}
                </button>
              ))}
            </div>

            <p className="onboarding-hint">Tone and AI rewrite</p>
            <div className="topic-grid">
              {HUMOR_OPTIONS.map((option) => (
                <button
                  key={`onboarding-tone-${option.id}`}
                  type="button"
                  className={`chip ${humorMode === option.id ? "chip-active" : ""}`}
                  onClick={() => switchHumorMode(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="topic-grid tone-grid">
              {REWRITE_OPTIONS.map((option) => (
                <button
                  key={`onboarding-rewrite-${option.id}`}
                  type="button"
                  className={`chip ${rewriteMode === option.id ? "chip-active" : ""}`}
                  onClick={() => switchRewriteMode(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <label className="onboarding-checkbox">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={toggleNotifications}
              />
              Enable mock push notifications
            </label>

            {onboardingError && <p className="error-line">{onboardingError}</p>}

            <div className="onboarding-actions">
              <button type="submit" className="cta">
                Start briefing
              </button>
              <button type="button" className="cta cta-alt" onClick={useDemoProfile}>
                Use demo profile
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
