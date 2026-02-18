# Onboarding Flow for Creators (Chat UI + shadcn Prototype)

This prototype is now transformed into a **chat-first mobile onboarding experience**, while still
using the provided image as composition inspiration (mobile framing, warm top visual area, rounded
content container).

## Location

- Route: `/onboarding`
- Main file: `src/features/onboarding/OnboardingFlow.tsx`
- Mobile app shell: `src/App.tsx`
- Design system components: `src/components/ui/*`

## Implemented chat flow

1. **Agent greeting**
   - Personalized intro message
   - Asks for top onboarding goal
2. **Quick-reply goal selection**
   - One-tap options for core jobs
3. **Tone selection**
   - One-tap tone choices
4. **Offer capture (text input)**
   - User types core offer in composer
5. **Skill 1 approval**
   - Agent proposes first DM copy
   - User can accept or edit
6. **Skill 2 decision**
   - User chooses yes/not yet
7. **Trial prompt and activation**
   - Start free trial quick action
   - Final success confirmation in chat

## Visual and system decisions

- Mobile-only viewport and phone frame presentation
- shadcn/ui components (Button, Badge, Progress, Input)
- Manychat branding (logo, typography, color tokens)
- Light mode baseline with stronger text contrast for accessibility
- Quick-reply chips + bottom composer to mimic real chat UX

## Notes

- This remains a frontend prototype with local state only.
- Next step for realism: connect the screen transitions to real onboarding API state.
