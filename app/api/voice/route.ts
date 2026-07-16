import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Voice is not configured." }, { status: 503 });

  try {
    const { text } = (await request.json()) as { text?: string };
    if (!text?.trim()) return NextResponse.json({ error: "No speech supplied." }, { status: 400 });

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_VOICE_MODEL || "gpt-4o-mini-tts",
        voice: process.env.OPENAI_VOICE || "marin",
        input: text.trim().slice(0, 1800),
        instructions: "Speak as an elegant, warm, assured British luxury concierge. Feminine presentation, natural pace, discreet enthusiasm.",
        response_format: "mp3",
      }),
    });

    if (!response.ok) throw new Error("OpenAI voice request failed");
    return new NextResponse(await response.arrayBuffer(), {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GRACE-X voice error", error);
    return NextResponse.json({ error: "Voice is unavailable just now." }, { status: 502 });
  }
}
