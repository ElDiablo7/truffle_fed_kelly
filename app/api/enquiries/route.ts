import { Pool } from "pg";

export const runtime = "nodejs";

const enquirerTypes = new Set(["private", "chef", "retail", "spa", "press", "other"]);
const interests = new Set(["caviar", "skincare", "both", "other"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  var truffleFedPool: Pool | undefined;
}

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");

  globalThis.truffleFedPool ??= new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
  });

  return globalThis.truffleFedPool;
}

function json(payload: Record<string, unknown>, status = 200) {
  return Response.json(payload, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "Origin not allowed." }, 403);
  }

  if (!request.headers.get("Content-Type")?.includes("application/json")) {
    return json({ error: "JSON content is required." }, 415);
  }

  const declaredLength = Number(request.headers.get("Content-Length") ?? "0");
  if (declaredLength > 10000) return json({ error: "The enquiry is too large." }, 413);

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim().toLowerCase();
    const enquirerType = String(payload.enquirerType ?? "private");
    const interest = String(payload.interest ?? "both");
    const message = String(payload.message ?? "").trim();
    const website = String(payload.website ?? "").trim();
    const consent = payload.consent === "true" || payload.consent === true;

    if (website) return json({ received: true }, 201);
    if (name.length < 2 || name.length > 80) return json({ error: "Please enter your name." }, 400);
    if (!emailPattern.test(email) || email.length > 160) return json({ error: "Please enter a valid email address." }, 400);
    if (!enquirerTypes.has(enquirerType) || !interests.has(interest)) return json({ error: "Please choose a valid enquiry type." }, 400);
    if (message.length < 10 || message.length > 2000) return json({ error: "Please enter a message between 10 and 2,000 characters." }, 400);
    if (!consent) return json({ error: "Consent is required." }, 400);

    const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        email VARCHAR(160) NOT NULL,
        enquirer_type VARCHAR(30) NOT NULL,
        interest VARCHAR(30) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(
      `INSERT INTO enquiries (name, email, enquirer_type, interest, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, enquirerType, interest, message],
    );

    return json({ received: true }, 201);
  } catch (error) {
    console.error("Enquiry submission failed", error instanceof Error ? error.message : error);
    return json({ error: "The enquiry could not be saved." }, 500);
  }
}
