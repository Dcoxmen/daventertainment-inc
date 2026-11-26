// Starts a LemonSlice avatar call for the /about page. The API key and avatar
// ID stay on the server: the browser only gets a one-time room link and token.
// Set LEMONSLICE_API_KEY and LEMONSLICE_AGENT_ID in Netlify (and .env.local).

const ALLOWED_ORIGINS = new Set([
  "https://daventertainment.com",
  "https://www.daventertainment.com",
  "http://localhost:3000",
]);

// Best effort: serverless instances don't share memory, so this slows abuse
// rather than stopping it. The hard spending limit is LemonSlice overage = off.
const LIMIT = 3;
const WINDOW_MS = 15 * 60 * 1000;
const recent = new Map<string, number[]>();

function allowed(ip: string) {
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= LIMIT) return false;
  times.push(now);
  recent.set(ip, times);
  return true;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return Response.json({ error: "Not allowed" }, { status: 403 });
  }

  const apiKey = process.env.LEMONSLICE_API_KEY;
  const agentId = process.env.LEMONSLICE_AGENT_ID;
  if (!apiKey || !agentId) {
    return Response.json({ error: "The avatar is not available right now." }, { status: 503 });
  }

  const ip =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  if (!allowed(ip)) {
    return Response.json(
      { error: "You've reached the limit for avatar calls. Please try again later." },
      { status: 429 }
    );
  }

  const res = await fetch("https://lemonslice.com/api/liveai/rooms", {
    method: "POST",
    headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: agentId }),
  });
  if (!res.ok) {
    console.error("LemonSlice room failed", res.status, await res.text());
    return Response.json({ error: "The avatar is not available right now." }, { status: 502 });
  }

  const { room_url, token } = (await res.json()) as { room_url: string; token: string };
  return Response.json({ roomUrl: room_url, token }, { headers: { "Cache-Control": "no-store" } });
}
