export const runtime = "nodejs";

function getEndpoint() {
  return process.env.SHEETS_ENDPOINT || process.env.NEXT_PUBLIC_SHEETS_ENDPOINT || "";
}

function safeRequestId() {
  try {
    // Node 18+/modern runtimes
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function redactEndpoint(endpoint: string) {
  try {
    const u = new URL(endpoint);
    // Keep origin + last path segment; avoids logging full token-y paths if present.
    const pathParts = u.pathname.split("/").filter(Boolean);
    const tail = pathParts.slice(-3).join("/");
    return `${u.origin}/${tail}`;
  } catch {
    return "(invalid url)";
  }
}

export async function POST(req: Request) {
  const requestId = safeRequestId();
  const endpoint = getEndpoint();

  const ct = req.headers.get("content-type") || "";
  const cl = req.headers.get("content-length") || "";
  console.log(`[api/score][${requestId}] POST content-type=${ct} content-length=${cl}`);

  console.log(
    `[api/score][${requestId}] endpointConfigured=${Boolean(endpoint)} endpoint=${endpoint ? redactEndpoint(endpoint) : "(empty)"}`,
  );

  if (!endpoint) {
    // Logging not configured; treat as success (best-effort).
    console.log(`[api/score][${requestId}] No endpoint configured, returning 204.`);
    return new Response(null, { status: 204, headers: { "x-request-id": requestId } });
  }

  let payload: unknown;
  let rawBody = "";
  try {
    // Read text once so we can log on JSON parse failures.
    rawBody = await req.text();
    payload = JSON.parse(rawBody);
    console.log(
      `[api/score][${requestId}] Received JSON payload (len=${rawBody.length}): ${rawBody.length > 1500 ? rawBody.slice(0, 1500) + "…" : rawBody}`,
    );
  } catch {
    console.warn(
      `[api/score][${requestId}] invalid_json (len=${rawBody.length}): ${rawBody.length > 500 ? rawBody.slice(0, 500) + "…" : rawBody}`,
    );
    return Response.json(
      { ok: false, error: "invalid_json", requestId },
      { status: 400, headers: { "x-request-id": requestId } },
    );
  }

  if (!payload || typeof payload !== "object") {
    console.warn(`[api/score][${requestId}] invalid_payload_type: ${typeof payload}`);
    return Response.json(
      { ok: false, error: "invalid_payload_type", requestId },
      { status: 400, headers: { "x-request-id": requestId } },
    );
  }

  try {
    const started = Date.now();
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12_000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      // prevent caching proxies from doing anything clever
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(t);
    const elapsedMs = Date.now() - started;

    // Apps Script sometimes redirects or returns HTML; just pass through a small status.
    const text = await res.text().catch(() => "");
    const snippet = text.slice(0, 1200);
    const upstreamCt = res.headers.get("content-type") || "";

    // Apps Script often returns HTTP 200 even when the JSON payload indicates an error.
    let upstreamOk = res.ok;
    try {
      const parsed = JSON.parse(text) as unknown;
      if (parsed && typeof parsed === "object") {
        const maybeStatus = (parsed as Record<string, unknown>).status;
        if (maybeStatus === "error") upstreamOk = false;
      }
    } catch {
      // ignore non-JSON bodies
    }

    console.log(
      `[api/score][${requestId}] Upstream responded status=${res.status} ok=${upstreamOk} elapsedMs=${elapsedMs} content-type=${upstreamCt}`,
    );
    if (!upstreamOk) {
      console.warn(`[api/score][${requestId}] Upstream body (snippet): ${snippet}`);
    } else {
      console.log(`[api/score][${requestId}] Upstream body (snippet): ${snippet}`);
    }

    return Response.json(
      { ok: upstreamOk, status: res.status, body: snippet, requestId, elapsedMs },
      { headers: { "x-request-id": requestId, "cache-control": "no-store" } },
    );
  } catch (err) {
    console.error(`[api/score][${requestId}] Error fetching webhook:`, err);
    return Response.json(
      { ok: false, error: String(err), requestId },
      { status: 500, headers: { "x-request-id": requestId } },
    );
  }
}
