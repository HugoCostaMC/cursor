# Quartz Brief Prototype Plan

## Objective
Create a conversational news app prototype inspired by Quartz's chat-like storytelling style, with personalized topics and light comedy.

## Phase 1 - Product foundation (done)
1. Build a mobile-first conversational UI patterned after Quartz screenshots.
2. Add a directory of RSS sources grouped by topic.
3. Create a backend endpoint that aggregates feeds and returns normalized story cards.

## Phase 2 - Personalization (done)
1. Let users choose briefing topics (World, Business, Tech, Science, Culture).
2. Add tone controls (Straight, Wry, Chaotic).
3. Persist preferences in local storage.
4. Inject comedy one-liners and follow-up prompts in the conversation stream.

## Phase 3 - Demo readiness (done)
1. Keep the app screenshot-friendly with a centered phone shell.
2. Add quick action chips (`what's the strategy?`, `next`, `refresh brief`).
3. Include a side "Up next" list for desktop demos.

## Phase 4 - Product depth (done)
1. Add first-run onboarding (name, topics, tone, rewrite mode).
2. Add AI-style summary rewrite modes (`Original`, `Concise AI`, `Deep Dive AI`, `ELI5 AI`).
3. Add source reliability badges for cards and queue items.
4. Add mock push notification center for product demos.

## Phase 5 - Next iteration ideas
1. Add account auth and multi-device profile sync.
2. Replace heuristic rewrite with real LLM rewrite endpoint.
3. Add bias and political-lean signals with transparent methodology notes.
4. Add save-for-later, digest scheduling, and smart push frequency controls.
