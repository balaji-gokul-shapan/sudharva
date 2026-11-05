import axios from "axios";

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
      },
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
    console.error("OTP upstream request failed", {
      message: error?.message,
      code: cause?.code,
      cause: cause?.message,
    });

    return Response.json(
      {
        error: "Could not reach OTP service.",
      },
      { status: 502 },
    );
  }
}
