# StageWay — Casting Assistant

An AI-powered conversational assistant that helps directors turn a vague casting idea into a clear, structured casting call.

## Problem & Purpose

Casting and audition coordination for independent theater and small productions is often disorganized. StageWay is a two-sided casting marketplace connecting directors with actors. This capstone focuses on one core piece: the Casting Assistant, a chat interface that interviews a director about the role they are casting and produces a structured, ready-to-post casting call draft.

## Live Demo

Live URL: https://capstone-wvqh.vercel.app/casting-assistant

## Tech Stack

- Framework: Next.js 16 (App Router)
- AI: Google Gemini via Vercel AI SDK
- Testing: Vitest and React Testing Library
- Styling: Plain CSS with custom properties
- Deployment: Vercel

## Setup and Run Locally

Requirements: Node.js 18+, a free Gemini API key from Google AI Studio.

cd app
npm install

Create a file called .env.local in the app folder containing:
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

Then run:
npm run dev

Visit http://localhost:3000/casting-assistant

## Running Tests

npm test

## Architecture Overview

app/api/chat/route.ts handles the server side AI streaming.
app/casting-assistant/page.tsx is the static page shell.
app/casting-assistant/components/ChatInterface.tsx is the interactive chat.
app/casting-assistant/CastingDraftCard.tsx renders the structured draft.
lib/ai-config.ts holds the model choice and system prompt.

## AI Integration

The assistant uses Gemini through streamText in the AI SDK. The system prompt instructs it to ask about role type, age range, genre, and requirements, then output a structured draft that gets rendered as a real card component instead of plain text.

## Known Limitations

Sidebar navigation is decorative only. No persistence across refresh. No authentication yet. This is one piece of a larger planned platform.

## Accessibility and Performance

axe DevTools: 0 issues, WCAG 2.1 AA.
Lighthouse mobile: Performance 95, Accessibility 100, Best Practices 100, SEO 100.
