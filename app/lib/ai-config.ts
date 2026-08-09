/**
 * AI model and system prompt configuration for the Casting Assistant.
 * Centralizing this here makes it easy to tune the assistant's behavior
 * or swap models without touching the route handler logic.
 */
import { google } from '@ai-sdk/google'

// The model used for all casting-assistant responses.
// Using the "latest" alias so this stays current as Google updates their lineup.
export const castingAssistantModel = google('gemini-flash-latest')

// System prompt: defines the assistant's role, tone, and what it should ask about.
export const castingAssistantSystemPrompt = `You are a helpful casting assistant for StageWay, a talent marketplace connecting directors with actors. Help directors clarify and refine their casting call descriptions - ask about role type, age range, tone/genre, and any specific requirements. Keep responses concise and friendly.`
