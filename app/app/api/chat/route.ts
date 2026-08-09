import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { castingAssistantModel, castingAssistantSystemPrompt } from '@/lib/ai-config'

export const maxDuration = 30

export async function POST(req: Request) {
  const body = await req.json()
  const { messages }: { messages: UIMessage[] } = body

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: castingAssistantModel,
    system: castingAssistantSystemPrompt,
    messages: modelMessages,
  })

  return result.toUIMessageStreamResponse()
}
