# Project: StageWay Capstone

## Stack
- MERN (MongoDB, Express, React, Node.js)
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB

## Conventions
- Use Conventional Commits format (feat:, fix:, docs:, chore:, etc.)
- Component-based structure for React frontend
- RESTful API design for backend routes
- Environment variables stored in .env (never committed)

## Project Purpose
StageWay is a casting and talent marketplace connecting directors with actors.

## Rules Learned from FE-03 (Vague vs. Precise Prompting Drill)

1. Forms use react-hook-form + zod for validation — never build uncontrolled inputs or hand-rolled validation logic.
2. Every feature that requires authentication must include a seed script or test user in the prompt/spec — otherwise the AI will build a page that's unreachable in practice, with no way to verify it actually works.
3. Any prompt for a new feature must include a verification step ("write tests, run them, fix and re-run until they pass") — without this, the AI will not self-check its own output, and broken behavior can look identical to working behavior in a screenshot.