# Quartz Brief Prototype (Project Folder)

This folder is the project entry point inside the repository.

## What this prototype includes

- Quartz-style conversational news UI
- Live RSS aggregation via `/api/news`
- Topic + tone personalization
- AI-style rewrite modes (`Original`, `Concise AI`, `Deep Dive AI`, `ELI5 AI`)
- Source reliability badges
- Onboarding flow + push notification mock center

## Main implementation files

- UI: `src/components/conversation-news-app.tsx`
- Styling: `src/app/globals.css`
- API: `src/app/api/news/route.ts`
- News directory config: `src/lib/news-directory.ts`
- Comedy personalization: `src/lib/comedy.ts`
- AI rewrite utility: `src/lib/ai-rewrite.ts`
- Reliability mapping: `src/lib/source-reliability.ts`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
