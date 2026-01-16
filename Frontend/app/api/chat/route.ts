import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful RAG (Retrieval-Augmented Generation) assistant. You help users find information from their document knowledge base. 

Key guidelines:
- Provide accurate, helpful responses based on the available information
- If you don't have specific information, acknowledge this clearly
- Keep responses concise but comprehensive
- Use a professional yet friendly tone
- When referencing information, be specific about sources when possible`,
    messages,
  })

  return result.toDataStreamResponse()
}
