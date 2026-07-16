import { NextRequest, NextResponse } from "next/server";
import { GRACE_X_INSTRUCTIONS } from "@/lib/grace-x-knowledge";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const windows = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const current = windows.get(ip);
  if (!current || current.reset < now) {
    windows.set(ip, { count: 1, reset: now + 10 * 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 25;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GRACE-X is awaiting her secure connection." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Please pause for a moment before continuing." }, { status: 429 });
  }

  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = (body.messages || [])
      .filter((message) => ["user", "assistant"].includes(message.role) && typeof message.content === "string")
      .slice(-12)
      .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 1600) }))
      .filter((message) => message.content.length > 0);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please enter a question for GRACE-X." }, { status: 400 });
    }

    const preferredModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const models = [...new Set([preferredModel, "gpt-4o-mini"])]
    let result: { output?: Array<{ content?: Array<{ type: string; text?: string }> }>; error?: { code?: string; message?: string } } | undefined;
    let lastStatus = 500;

    for (const model of models) {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, instructions: GRACE_X_INSTRUCTIONS, input: messages, max_output_tokens: 450, store: false }),
        signal: AbortSignal.timeout(30_000),
      });
      result = await response.json();
      lastStatus = response.status;
      if (response.ok) break;

      const canFallback = ["model_not_found", "invalid_model", "permission_denied"].includes(result?.error?.code || "") || response.status === 404;
      if (!canFallback) break;
    }

    if (!result?.output) {
      console.error("GRACE-X OpenAI response", { status: lastStatus, code: result?.error?.code, message: result?.error?.message });
      throw new Error(result?.error?.message || "OpenAI request failed");
    }

    const reply = result.output
      ?.flatMap((item: { content?: Array<{ type: string; text?: string }> }) => item.content || [])
      .find((item: { type: string; text?: string }) => item.type === "output_text")?.text;

    if (!reply) throw new Error("GRACE-X returned no text");
    return NextResponse.json({ reply }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GRACE-X chat error", error);
    return NextResponse.json({ error: "GRACE-X is unavailable just now. Please use the private enquiry form." }, { status: 502 });
  }
}
