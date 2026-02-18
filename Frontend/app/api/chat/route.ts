import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // useChat sends { messages: [...] }
    const messages: { role: string; content: string }[] = body.messages || [];
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const userText: string = lastMessage.content;

    // --- Check if the message contains file attachment info ---
    // page.tsx appends "[Attached files: filename1, filename2]" to the message text
    const fileMatch = userText.match(/\[Attached files: (.+)\]$/);
    const cleanQuery = userText.replace(/\n\n\[Attached files: .+\]$/, "").trim();

    // If files were mentioned, we can't re-upload them from here (the browser didn't
    // send the actual bytes through useChat). The upload happens separately via the
    // /upload endpoint called directly from the client using the uploadFiles helper
    // exported below. So here we just answer the query.

    // --- Call FastAPI /ask ---
    const askRes = await fetch(`${BACKEND_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: cleanQuery }),
    });

    if (!askRes.ok) {
      const errText = await askRes.text();
      console.error("[Backend /ask error]", errText);
      return NextResponse.json(
        { error: "Backend error: " + errText },
        { status: askRes.status }
      );
    }

    const data = await askRes.json();
    const answer: string = data.answer || "No answer returned from backend.";

    // Return in the format @ai-sdk/react useChat expects:
    // A plain-text streaming response OR a JSON response.
    // useChat works with both. We return a simple text stream.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // ai-sdk data stream protocol: text parts are prefixed with 0:
        controller.enqueue(encoder.encode(`0:${JSON.stringify(answer)}\n`));
        // signal completion
        controller.enqueue(
          encoder.encode(
            `d:${JSON.stringify({ finishReason: "stop", usage: { promptTokens: 0, completionTokens: 0 } })}\n`
          )
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-vercel-ai-data-stream": "v1",
      },
    });
  } catch (err) {
    console.error("[/api/chat] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}