import axios from "axios";
import https from "node:https";

const buildOtpRequestUrl = () => {
  const rawBase = process.env.API_BASE_URL || "";

  if (!rawBase) {
    throw new Error("API_BASE_URL is not configured on the server.");
  }

  const baseUrl = new URL(rawBase);
  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new Error("API_BASE_URL must use HTTP or HTTPS.");
  }
  const basePath = baseUrl.pathname.replace(/\/+$/, "");

  if (/\/api\/auth$/i.test(basePath)) {
    baseUrl.pathname = `${basePath}/otp/request/`;
    return baseUrl;
  }

  const apiPrefix =
    process.env.NEXT_APP_API_PREFIX !== undefined
      ? process.env.NEXT_APP_API_PREFIX.trim().replace(/^\/+|\/+$/g, "")
      : /\/api$/i.test(basePath)
        ? ""
        : "api";

  baseUrl.pathname = `${
    basePath
  }${apiPrefix ? `/${apiPrefix}` : ""}/auth/otp/request/`;
  return baseUrl;
};

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

export async function POST(request) {
  let upstreamUrl;

  try {
    upstreamUrl = buildOtpRequestUrl();
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

  try {
    const upstreamResponse = await axios.request({
      url: upstreamUrl.toString(),
      method: "POST",
      data: payload,
      responseType: "text",
      validateStatus: () => true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      httpsAgent:
        INSECURE_DEV_SSL_ENABLED && upstreamUrl.protocol === "https:"
          ? INSECURE_HTTPS_AGENT
          : undefined,
    });

    const contentType = upstreamResponse.headers["content-type"] || "application/json";
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
    console.error("OTP upstream request failed", {
      message: error?.message,
      code: cause?.code,
      cause: cause?.message,
      tlsError: isTlsError,
      insecureDevSslEnabled: INSECURE_DEV_SSL_ENABLED,
    });

    return Response.json(
      {
        error: "Could not reach OTP service.",
        ...(process.env.NODE_ENV !== "production" && {
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
