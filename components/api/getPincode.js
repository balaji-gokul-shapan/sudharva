
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export const PINCODE_PATTERN = /^\d{6}$/;

export const normalizePincode = (value) =>
  String(value ?? "").replace(/\D/g, "").slice(0, 6);

const clean = (value) => {
  const text = String(value ?? "").trim();
  return !text || text.toUpperCase() === "NA" ? "" : text;
};

const completeness = (entry) =>
  Number(Boolean(entry.city)) +
  Number(Boolean(entry.district)) +
  Number(Boolean(entry.state)) +
  Number(Boolean(entry.taluk));

export async function getPincodeDetails(pincode, signal) {
  const normalized = normalizePincode(pincode);

  if (!PINCODE_PATTERN.test(normalized)) {
    throw new Error("Enter a valid 6-digit pincode.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(
    `${API_URL}/api/pincode/${normalized}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "No records found for this pincode."
        : "Unable to look up this pincode. Please try again."
    );
  }

  const payload = await response.json();

  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];

  const options = rawList
    .map((entry) => ({
      pincode: clean(entry?.pincode) || normalized,
      city: clean(entry?.city),
      state: clean(entry?.state),
      district: clean(entry?.district),
      taluk: clean(entry?.taluk),
    }))
    .filter((entry) => entry.city || entry.district || entry.taluk);

  if (!options.length) {
    throw new Error("No records found for this pincode.");
  }

  const best = options.reduce((a, b) =>
    completeness(b) > completeness(a) ? b : a
  );

  return {
    ...best,
    country: "India",
    options,
  };
}
