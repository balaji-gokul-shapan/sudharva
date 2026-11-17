import axios from "axios";

import {
  getUpstreamHttpsAgent,
  isTlsCertificateError,
} from "@/lib/upstreamHttps";

const buildForgotPasswordResetUrl = () => {
  const rawBase = process.env.API_BASE_URL || "";

  if (!rawBase) {
    throw new Error("API_BASE_URL is not configured on the server.");
  }

  const baseUrl = new URL(rawBase);
  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new Error("API_BASE_URL must use HTTP or HTTPS.");
  }

  const basePath = baseUrl.pathname.replace(/\/+$/, "");
  const apiPrefix =
    process.env.NEXT_APP_API_PREFIX !== undefined
      ? process.env.NEXT_APP_API_PREFIX.trim().replace(/^\/+|\/+$/g, "")
      : /\/api$/i.test(basePath)
        ? ""
        : "api";

  baseUrl.pathname = `${basePath}${apiPrefix ? `/${apiPrefix}` : ""}/forgot_password/reset/`;
  return baseUrl;
};

export async function POST(request) {
  let upstreamUrl;

  try {
    upstreamUrl = buildForgotPasswordResetUrl();
  } catch (error) {
    return Response.json(
      {
        error:
          error?.message || "API_BASE_URL is not configured on the server.",
      },
      { status: 500 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const resolvedUpstreamUrl = upstreamUrl.toString();

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[api-proxy] API_BASE_URL POST /api/forgot_password/reset ->",
      resolvedUpstreamUrl,
    );
  }

  try {
    const upstreamResponse = await axios.request({
      url: resolvedUpstreamUrl,
      method: "POST",
      data: payload,
      responseType: "text",
      validateStatus: () => true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      httpsAgent: getUpstreamHttpsAgent(resolvedUpstreamUrl),
    });

    const contentType =
      upstreamResponse.headers["content-type"] || "application/json";
    const responseText =
      typeof upstreamResponse.data === "string"
        ? upstreamResponse.data
        : JSON.stringify(upstreamResponse.data ?? {});

    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    const cause = error?.cause;
    const isTlsError = isTlsCertificateError(error);

    console.error("Forgot-password reset upstream request failed", {
      url: resolvedUpstreamUrl,
      message: error?.message,
      code: cause?.code,
      cause: cause?.message,
      tlsError: isTlsError,
      insecureDevSslEnabled:
        process.env.NODE_ENV !== "production" &&
        process.env.ALLOW_INSECURE_DEV_SSL === "true",
    });

    return Response.json(
      {
        error: "Could not reach forgot-password reset service.",
        ...(process.env.NODE_ENV !== "production" && {
          env: "API_BASE_URL",
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
}
