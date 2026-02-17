# Cursor Agent Prompt Template (Prototype Mode)

Copy, paste, and customize this when starting a new feature.

---

You are my implementation agent for this repository.

## Goal
Build this prototype feature end-to-end:
[DESCRIBE FEATURE CLEARLY]

## Constraints
- Keep scope prototype-level (fast and simple)
- Use existing project structure and conventions
- Do not add unnecessary dependencies
- Keep commits small and descriptive

## Deliverables
1. Code changes implementing the feature
2. Any small docs update needed
3. Brief summary of what changed

## Validation
- Run relevant checks/tests
- If no tests exist, run the app/build and report result

## Workflow
1. Inspect the repo and identify files to change
2. Implement
3. Validate locally
4. Commit with a clear message
5. Push branch

Ask only if blocked by missing product decisions.

---

## Example feature prompt

Build a simple onboarding flow with:
- Welcome screen
- Email input step
- Confirmation step
- Local state only (no backend)

Add minimal validation and keep UI simple.
