# Deployment Checklist

## Pre-deployment
- [x] Environment variables (GOOGLE_GENERATIVE_AI_API_KEY) set in Vercel project settings, not committed to git
- [x] Production build tested locally (npm run build) with zero errors
- [x] /casting-assistant confirmed as a static route in build output
- [x] Tests passing (npm test)
- [x] Accessibility audit run (axe DevTools: 0 issues)
- [x] Lighthouse audit run (Performance 95, Accessibility 100, Best Practices 100, SEO 100)

## Deployment
- [x] Deployed via Vercel, connected to GitHub main branch
- [x] Root Directory correctly set to app/ in Vercel project settings
- [x] Automatic deployments on push to main confirmed working

## Failure Handling
- If the Gemini API key is missing or invalid, the chat route throws a clear AI_LoadAPIKeyError server-side rather than silently failing.
- If the Gemini API returns a rate limit or quota error, the AI SDK's built-in retry logic attempts the request again before surfacing an error.
- If a network request fails mid-stream, the useChat hook exposes a status the UI can react to; the Stop button allows the user to interrupt a stuck generation and try again.

## Rollback Plan
- Vercel keeps every previous deployment. If a new deployment breaks something, roll back by going to the Vercel dashboard, Deployments tab, finding the last known-good deployment, and selecting "Promote to Production."
- Since all deployments are triggered by git pushes to main, an alternative rollback is git revert on the problematic commit and pushing again.

## Monitoring
- Vercel's built-in deployment status (Ready / Error) is checked after every push.
- No dedicated uptime monitoring is set up for this capstone; for a production version, Vercel's Analytics or a third-party uptime checker (e.g., UptimeRobot) would be the next step.
