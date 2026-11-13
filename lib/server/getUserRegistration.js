import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { pickUserRegistration } from "@/lib/users/registrationPayload";

const parseJsonSafely = async (response) => {
  const raw = await response.text();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const fetchRegistration = async ({ baseUrl, accessToken, userId, includeUserId }) => {
  const query = includeUserId
    ? `?user_id=${encodeURIComponent(String(userId || ""))}`
    : "";

  const requestUrl = `${baseUrl}/api/auth/runner/me/registrations${query}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = await parseJsonSafely(response);
  return pickUserRegistration(payload);
};

export async function getUserRegistrationServer(userId, options = {}) {
  const { redirectPath = `/users/${userId}/profile` } = options;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth_access_token")?.value;

  if (!accessToken) {
    redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") || "http";

  if (!host) {
    return null;
  }

  const baseUrl = `${protocol}://${host}`;

  const registrationWithUserId = await fetchRegistration({
    baseUrl,
    accessToken,
    userId,
    includeUserId: true,
  });

  if (registrationWithUserId) {
    return registrationWithUserId;
  }

  return fetchRegistration({
    baseUrl,
    accessToken,
    userId,
    includeUserId: false,
  });
}
