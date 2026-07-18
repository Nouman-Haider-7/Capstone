# Workflow Comparison: Round 1 (Vague) vs Round 2 (Precise)

## Round 1: Vague Prompt
Prompt used: "Build a settings form for actors."

The AI made every decision independently — it chose full-stack scope (Express + MongoDB backend, React + Vite + Tailwind frontend), invented its own field set, and wired up JWT auth without being asked. It produced a working-looking form quickly, but the result was not actually usable: visiting the settings page showed "Failed to load profile. Make sure you are logged in," because there was no seeded user and no visible way to authenticate. No tests were written, and there was no accessibility handling — inputs had no explicit label associations beyond default HTML, and no `aria-describedby` on any error states (mainly because there were no error states at all; validation didn't exist).

**AI mistake caught:** the settings page was unreachable in practice. A real user landing on `/settings` would hit a dead end with no path forward, since there was no register/login flow and no seed data.

## Round 2: Precise Prompt
This time the prompt specified: exact stack conventions (react-hook-form + zod), the full field list with validation rules, accessibility requirements (labels, `aria-describedby`), a workaround for auth (seed one test user instead of building full registration), and a verification step requiring the AI to write and run tests before finishing.

The AI first proposed a plan (files it would create/modify, and its test plan) and waited for confirmation before writing code — this "plan mode" step let me catch scope issues early instead of after the fact. It then built the form using `SettingsForm.tsx` (replacing Round 1's `ActorSettingsForm.tsx`), added a reusable `TagInput.tsx` for the Skills field, created `validation/settings.js` on the backend (zod schema), and added a `seed.js` script so the app was actually reachable and testable. It wrote two tests — one backend (PUT /api/settings rejects invalid email, accepts valid payload) and one frontend (empty Full Name shows a validation error) — and ran both, confirming both passed.

## Correctness
Round 1 technically "ran" but was functionally broken for a real user (no way to log in). Round 2 ran correctly end-to-end: seeded login credentials worked, the form loaded, validation fired correctly, and both automated tests passed on the first run.

## Accessibility
Round 1 had no explicit accessibility handling. Round 2 required labels linked to inputs and `aria-describedby` for error messages, and the resulting form showed required-field indicators, a live character counter on Bio, and a skill-count limit — details a real user would notice.

## Edge Cases
Round 1 didn't handle invalid email, empty required fields, or any error/loading states. Round 2 explicitly handled: empty Full Name, invalid email, optional-field validation (phone/URL only validated if filled), a loading state during save, and non-blocking error handling on failed saves.

## Review Effort
Round 1 took under a minute to prompt but required manual debugging afterward to even discover why the page didn't work — that investigation time isn't visible in the branch itself but was real. Round 2 took several minutes to write the prompt and review the proposed plan, but once approved, it built correctly on the first pass with passing tests, needing no manual debugging. Prompting time was higher for Round 2, but total time-to-working-feature was lower, since Round 1's "speed" was an illusion — the real cost showed up afterward in me trying to figure out why the form was unreachable.

## Takeaway
A vague prompt shifts all the decision-making (and the resulting risk) onto the AI, silently. A precise prompt with constraints, examples, and a required verification step moves that decision-making earlier — into the plan I reviewed — and produces a feature I could trust without separately auditing it line by line.