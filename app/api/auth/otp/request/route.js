const buildOtpRequestUrl = () => {
  const rawBase = process.env.API_DEV_URL || "";

  if (!rawBase) {
    throw new Error("API_DEV_URL is not configured on the server.");
  }

  const base = rawBase.replace(/\/+$/, "");

  if (/\/api\/auth$/i.test(base)) {
    return `${base}/otp/request/`;
  }

  return `${base}/api/auth/otp/request/`;
};

export async function POST(request) {
  let upstreamUrl;

  try {
    upstreamUrl = buildOtpRequestUrl();
  } catch (error) {
    return Response.json(
      { error: error?.message || "API_DEV_URL is not configured on the server." },
      { status: 500 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "manual",
    });

    const contentType = upstreamResponse.headers.get("content-type") || "application/json";
    const responseText = await upstreamResponse.text();

    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch {
    return Response.json(
      { error: "Could not reach OTP service." },
      { status: 502 },
    );
  }
}
