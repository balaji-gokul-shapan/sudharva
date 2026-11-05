import axios from "axios";
import https from "node:https";

const FORWARDED_HEADERS = ["accept", "authorization", "content-type"];

const INSECURE_DEV_SSL_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.ALLOW_INSECURE_DEV_SSL === "true";

const INSECURE_HTTPS_AGENT = INSECURE_DEV_SSL_ENABLED
  ? new https.Agent({ rejectUnauthorized: false })
  : null;

const isTlsCertificateError = (error) => {
  const code = error?.cause?.code || error?.code;
  return [
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "UNABLE_TO_GET_ISSUER_CERT",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
  ].includes(code);
};

const getApiBaseUrl = (path = []) => { 
  const isPincodeRequest = path[0] === "pincode";
   const rawUrl = isPincodeRequest
     ? process.env.PINCODE_API_BASE_URL
     : process.env.API_BASE_URL;

  if (!rawUrl) {
    throw new Error("API_BASE_URL is not configured on the server.");
  }

  const baseUrl = new URL(rawUrl);
  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new Error("API_BASE_URL must use HTTP or HTTPS.");
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
  const trailingSlash = new URL(request.url).pathname.endsWith("/");
  upstreamUrl.pathname = `${basePath}${getApiPrefix(baseUrl)}/${apiPath}${
    trailingSlash ? "/" : ""
  }`;
  upstreamUrl.search = new URL(request.url).search;

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const shouldFollowRedirects = ["GET", "HEAD"].includes(method);
  const requestBody = hasBody ? await request.arrayBuffer() : undefined;
  let upstreamResponse;

  try {
    upstreamResponse = await axios.request({
      url: upstreamUrl.toString(),
      method,
      headers: Object.fromEntries(headers.entries()),
      data: requestBody,
      responseType: "arraybuffer",
      validateStatus: () => true,
      maxRedirects: shouldFollowRedirects ? 5 : 0,
    });
  } catch (error) {
    const cause = error?.cause;

    return Response.json(
      {
        error: "Could not reach the configured API server.",
        // ...(process.env.NODE_ENV !== "production" && {
        //   details:
        //     cause?.code ||
        //     cause?.message ||
        //     error?.code ||
        //     error?.message,
         
        // }),
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
