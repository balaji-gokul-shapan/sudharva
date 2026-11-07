import axios from "axios";

import {
  getUpstreamHttpsAgent,
  isTlsCertificateError,
} from "@/lib/upstreamHttps";

const FORWARDED_HEADERS = ["accept", "authorization", "content-type"];

const normalizeJwtToken = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const withoutBearer = raw.replace(/^Bearer\s+/i, "").trim();
  const withoutQuotes = withoutBearer.replace(/^['\"]|['\"]$/g, "").trim();

  let decoded = withoutQuotes;
  try {
    decoded = decodeURIComponent(withoutQuotes);
  } catch {
    decoded = withoutQuotes;
  }

  const token = decoded.trim();
  if (!token) return "";
  if (["undefined", "null", "[object Object]"].includes(token)) return "";
  if (token.split(".").length !== 3) return "";

  return token;
};

const isUsableBearerHeader = (value = "") => {
  return Boolean(normalizeJwtToken(value));
};

const getApiBaseUrl = (path = []) => {
  const isPincodeRequest = path[0] === "pincode";
  const envName = isPincodeRequest ? "PINCODE_API_BASE_URL" : "API_BASE_URL";
  const rawUrl = process.env[envName];

  if (!rawUrl) {
    throw new Error(`${envName} is not configured on the server.`);
  }

  const baseUrl = new URL(rawUrl);
  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new Error(`${envName} must use HTTP or HTTPS.`);
  }

  return { baseUrl, envName };
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
  const isMasterValuesRequest =
    path[0] === "masters" && path[1] === "master-values";

  if (
    path.length === 0 ||
    path.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    return Response.json({ error: "Invalid API path." }, { status: 400 });
  }

  let baseUrl;
  let envName;
  try {
    ({ baseUrl, envName } = getApiBaseUrl(path));
  } catch (error) {
    return Response.json(
      { error: error.message || "API URL is not configured on the server." },
      { status: 500 },
    );
  }

  const upstreamUrl = new URL(baseUrl);
  const basePath = upstreamUrl.pathname.replace(/\/+$/, "");
  const apiPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  const trailingSlash = new URL(request.url).pathname.endsWith("/");
  upstreamUrl.pathname = `${basePath}${getApiPrefix(baseUrl)}/${apiPath}${
    trailingSlash ? "/" : ""
  }`;
  upstreamUrl.search = new URL(request.url).search;
  const resolvedUpstreamUrl = upstreamUrl.toString();

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[api-proxy]",
      envName,
      request.method.toUpperCase(),
      new URL(request.url).pathname,
      "->",
      resolvedUpstreamUrl,
    );
  }

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const cookieToken = normalizeJwtToken(
    request.cookies.get("auth_access_token")?.value,
  );

  if (isMasterValuesRequest) {
    // Master endpoint is public in this setup; never forward auth headers.
    headers.delete("authorization");
  } else {
    // Fallback to auth cookie when Authorization is missing or malformed
    // (e.g. stale localStorage token before auth hydration/login refresh).
    if (!isUsableBearerHeader(headers.get("authorization"))) {
      if (cookieToken) {
        headers.set("authorization", `Bearer ${cookieToken}`);
      }
    } else {
      const normalizedHeaderToken = normalizeJwtToken(headers.get("authorization"));
      headers.set("authorization", `Bearer ${normalizedHeaderToken}`);
    }
  }

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const shouldFollowRedirects = ["GET", "HEAD"].includes(method);
  const requestBody = hasBody ? await request.arrayBuffer() : undefined;
  let upstreamResponse;

  try {
    upstreamResponse = await axios.request({
      url: resolvedUpstreamUrl,
      method,
      headers: Object.fromEntries(headers.entries()),
      data: requestBody,
      responseType: "arraybuffer",
      validateStatus: () => true,
      maxRedirects: shouldFollowRedirects ? 5 : 0,
      httpsAgent: getUpstreamHttpsAgent(resolvedUpstreamUrl),
    });
  } catch (error) {
    const cause = error?.cause;
    const isTlsError = isTlsCertificateError(error);

    return Response.json(
      {
        error: "Could not reach the configured API server.",
        ...(process.env.NODE_ENV !== "production" && {
          env: envName,
          url: resolvedUpstreamUrl,
          details:
            cause?.code ||
            cause?.message ||
            error?.code ||
            error?.message,
          ...(isTlsError && {
            hint:
              "TLS certificate validation failed. Install the upstream root CA, or set ALLOW_INSECURE_DEV_SSL=true for local development only.",
          }),
        }),
      },
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
    const value = upstreamResponse.headers?.[name];
    if (value) responseHeaders.set(name, value);
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[api-proxy]",
      envName,
      method,
      resolvedUpstreamUrl,
      "status",
      upstreamResponse.status,
    );
  }

  const bodyAllowed =
    method !== "HEAD" && ![204, 205, 304].includes(upstreamResponse.status);
  const responseBody = bodyAllowed
    ? new Uint8Array(upstreamResponse.data)
    : null;

  return new Response(responseBody, {
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
