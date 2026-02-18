# Onboarding Flow for Creators (Mobile + shadcn Prototype)

This prototype now uses a 4-screen mobile onboarding layout inspired by the provided reference
image and implemented with **shadcn/ui** components.

## Location

- Route: `/onboarding`
- Main file: `src/features/onboarding/OnboardingFlow.tsx`
- Mobile app shell: `src/App.tsx`
- Design system components: `src/components/ui/*`

## Implemented mobile screens

1. **Goal selection**
   - Prompt: "What's your top onboarding goal?"
   - Rounded option list with one active choice
   - Continue button disabled until selection

2. **Goal confirmation**
   - Same list layout with selected state emphasized
   - Continue advances to setup preview

3. **Skill bundle preview**
   - Three starter skills shown as shadcn cards
   - Back + Continue action row

4. **Trial / paywall screen**
   - Two plan cards (annual/monthly)
   - Primary CTA: Start free trial
   - Inline success state after CTA

## Visual and system decisions

- Mobile-only viewport and phone frame presentation
- shadcn/ui components (Button, Card, Badge, Progress, Separator)
- Manychat branding (logo, typography, color tokens)
- Abstract top illustration and rounded bottom sheet per reference composition

## Notes

- This remains a frontend prototype with local state only.
- Next step for realism: connect the screen transitions to real onboarding API state.
