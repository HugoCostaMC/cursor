# Onboarding Flow for Creators (Prototype Implementation)

This prototype implements the JTBD conversation flow for creators in:

- Route: `/onboarding`
- Component: `src/features/onboarding/OnboardingFlow.tsx`
- Mobile shell: `src/App.tsx`

## UX scope

- Mobile-only presentation (phone frame, no desktop navigation)
- Manychat branding applied (logo, Inter typography, Manychat color palette)

## Implemented steps

1. **Connect Instagram**
   - CTA to begin onboarding
2. **Auto-index simulation**
   - Progress UI: "Getting to know your Instagram…"
3. **Personalized greeting + tone check**
   - Confirmation or correction path
4. **Goals selection**
   - Multi-select from:
     - Reply to followers
     - Sell more
     - Grow email list
     - Answer FAQs
5. **Tone selection**
   - Warm / direct / playful / professional
6. **Offer input (conditional)**
   - Only shown for monetization paths
7. **Skill 1 activation**
   - Follow-to-DM preview with editable copy
8. **Skill 2 activation**
   - Monetization path: Comment-to-DM
   - Engagement path: Story mention auto-reply
9. **Go live summary**
   - Active skills
   - Pre-moderation ON
   - Creator model snapshot

## Branching logic implemented

- If user selects monetization goals (sell or email growth):
  - Offer step is included
  - Skills proposed are monetization-focused
- If user selects engagement-only goals:
  - Offer step is skipped
  - Skills proposed are engagement-focused

## Notes

- This is a frontend prototype with local state only.
- Next integration step is connecting real OAuth/indexing/profile APIs and persisting onboarding state.
