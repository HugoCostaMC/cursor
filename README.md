# Quartz Brief Conversational News Prototype

Quartz-style conversational news briefing app with:

- mobile-first chat layout inspired by Quartz app screenshots
- live feed aggregation from multiple RSS news directories
- personalized topic selection and saved preferences
- adjustable comedy tone (`Straight`, `Wry`, `Chaotic`)
- first-run onboarding flow with profile setup
- AI-style summary rewrite modes (`Original`, `Concise AI`, `Deep Dive AI`, `ELI5 AI`)
- source reliability indicators
- push notification mock center (demo-only)

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product plan

See `docs/PLAN.md` for the implementation plan and next-iteration roadmap.

## Architecture

- **Frontend**: Next.js App Router + React client component
- **Backend API**: `src/app/api/news/route.ts` (RSS aggregation/normalization)
- **News directories**: `src/lib/news-directory.ts`
- **Comedy/personalization logic**: `src/lib/comedy.ts`
- **AI rewrite logic**: `src/lib/ai-rewrite.ts`
- **Source reliability mapping**: `src/lib/source-reliability.ts`

## API

`GET /api/news?topics=world,technology&limit=12`

Response includes:

- selected topic list
- source directory list
- normalized story cards (title, summary, source, URL, image if available)
- fallback flag + feed failures

## Notes

- No API key required for this prototype.
- If live RSS feeds fail temporarily, the API returns fallback stories so the UI still works.
- Push notifications are mocked in-app for prototype demos and are not OS-level notifications.