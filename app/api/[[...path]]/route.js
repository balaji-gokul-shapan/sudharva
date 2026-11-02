const FORWARDED_HEADERS = ["accept", "authorization", "content-type"];

const getApiBaseUrl = (path = []) => {
  const isPincodeRequest = path[0] === "pincode";

  const rawUrl = isPincodeRequest
    ? process.env.NEXT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.API_DEV_URL ||
      process.env.API_BASE_URL ||
      process.env.NEXT_APP_API_URL ||
      process.env.NEXT_PUBLIC_API_URL;

  if (!rawUrl) {
    throw new Error("API URL is not configured on the server.");
  }

  const baseUrl = new URL(rawUrl);
  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new Error("API URL must use HTTP or HTTPS.");
  }

  return baseUrl;
};

const getApiPrefix = (baseUrl) => {
  if (process.env.NEXT_APP_API_PREFIX !== undefined) {
    const prefix = process.env.NEXT_APP_API_PREFIX.trim().replace(/^\/+|\/+$/g, "");
    return prefix ? `/${prefix}` : "";
  }

  const normalizedPathname = baseUrl.pathname.replace(/\/+$/, "");
  return /\/api$/i.test(normalizedPathname) ? "" : "/api";
};

async function proxyRequest(request, { params }) {
  const { path = [] } = await params;

  if (
    path.length === 0 ||
    path.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    return Response.json({ error: "Invalid API path." }, { status: 400 });
  }

  let baseUrl;
  try {
    baseUrl = getApiBaseUrl(path);
  } catch (error) {
    return Response.json(
      { error: error.message || "API URL is not configured on the server." },
      { status: 500 },
    );
  }

  const upstreamUrl = new URL(baseUrl);
  const basePath = upstreamUrl.pathname.replace(/\/+$/, "");
  const apiPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  upstreamUrl.pathname = `${basePath}${getApiPrefix(baseUrl)}/${apiPath}`;
  upstreamUrl.search = new URL(request.url).search;

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const shouldFollowRedirects = ["GET", "HEAD"].includes(method);
  let upstreamResponse;

  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: shouldFollowRedirects ? "follow" : "manual",
    });
  } catch {
    return Response.json(
      { error: "Could not reach the configured API server." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  for (const name of [
    "content-type",
    "content-disposition",
    "cache-control",
    "etag",
    "location",
  ]) {
    const value = upstreamResponse.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  const bodyAllowed =
    method !== "HEAD" && ![204, 205, 304].includes(upstreamResponse.status);
  return new Response(bodyAllowed ? upstreamResponse.body : null, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;

