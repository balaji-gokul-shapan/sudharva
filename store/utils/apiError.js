const HTML_SNIPPET_PATTERN = /<\s*(!doctype|html|head|body|script|style|div|span|p|br|img|meta|title)\b/i;
const STATUS_ONLY_PATTERN = /^request failed with status code\s+\d{3}$/i;

const getFirstStringFromUnknown = (value) => {
  if (typeof value === "string" && value.trim()) return value;

  if (Array.isArray(value)) {
    for (const item of value) {
      const text = getFirstStringFromUnknown(item);
      if (text) return text;
    }
  }

  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      const text = getFirstStringFromUnknown(value[key]);
      if (text) return text;
    }
  }

  return "";
};

const isLikelyHtml = (value) => {
  if (typeof value !== "string") return false;
  const text = value.trim();
  if (!text) return false;
  return HTML_SNIPPET_PATTERN.test(text);
};

const sanitizeMessage = (
  value,
  {
    fallback = "Something went wrong",
    htmlFallback = "Something went wrong",
  } = {},
) => {
  const text = String(value || "").trim();
  if (!text) return fallback;
  if (isLikelyHtml(text)) return htmlFallback;
  if (STATUS_ONLY_PATTERN.test(text)) return fallback;

  return text;
};

const toHumanFieldLabel = (fieldName = "") => {
  const normalized = String(fieldName || "")
    .replace(/_/g, " ")
    .trim();

  if (!normalized) return "Field";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const collectStrings = (value) => {
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings).filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings).filter(Boolean);
  }

  return [];
};

const getFieldValidationMessage = (responseData) => {
  if (!responseData || typeof responseData !== "object") return "";

  const reservedKeys = new Set(["message", "error", "detail"]);

  const messages = Object.entries(responseData)
    .flatMap(([field, value]) => {
      if (reservedKeys.has(field)) return [];

      const parts = collectStrings(value)
        .map((part) => sanitizeMessage(part, { fallback: "", htmlFallback: "" }))
        .filter(Boolean);

      if (!parts.length) return [];

      if (field === "non_field_errors") {
        return parts;
      }

      const label = toHumanFieldLabel(field);
      return parts.map((part) => `${label}: ${part}`);
    })
    .filter(Boolean);

  return messages.join(" ").trim();
};

export const extractApiErrorMessage = (
  error,
  {
    fallback = "Something went wrong",
    htmlFallback = "Something went wrong",
  } = {},
) => {
  const responseData = error?.response?.data;

  const directMessage =
    responseData?.message ||
    responseData?.error ||
    responseData?.detail ||
    responseData?.non_field_errors;

  const directText = getFirstStringFromUnknown(directMessage);
  if (directText) {
    return sanitizeMessage(directText, { fallback, htmlFallback });
  }

  const fieldValidationMessage = getFieldValidationMessage(responseData);
  if (fieldValidationMessage) {
    return sanitizeMessage(fieldValidationMessage, { fallback, htmlFallback });
  }

  const nestedText = getFirstStringFromUnknown(responseData);
  if (nestedText) {
    return sanitizeMessage(nestedText, { fallback, htmlFallback });
  }

  const genericText = getFirstStringFromUnknown(error?.message);
  if (genericText) {
    return sanitizeMessage(genericText, { fallback, htmlFallback });
  }

  return fallback;
};
