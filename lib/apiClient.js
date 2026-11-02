import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const toApiPath = (path = "") => {
  const normalized = String(path).trim();

  if (!normalized) return "/";
  if (normalized.startsWith("/api/")) return normalized.replace(/^\/api/, "");
  if (normalized.startsWith("/")) return normalized;

  return `/${normalized}`;
};

export default apiClient;
