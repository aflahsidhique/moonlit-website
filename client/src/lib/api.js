// Mirrors the legacy static site's assets/config.js — auto-detects local
// dev vs the deployed Render backend so no manual env swapping is needed.
// If you rename the Render API service, update PROD_API_BASE to match.
const PROD_API_BASE = "https://moonlit-website-api.onrender.com/api";
const LOCAL_API_BASE = "http://localhost:4000/api";

const isLocal = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
export const API_BASE = import.meta.env.VITE_API_BASE || (isLocal ? LOCAL_API_BASE : PROD_API_BASE);

// POSTs a plain object as JSON to `${API_BASE}${path}`, throwing an Error
// with the server's message (or a generic fallback) on non-2xx responses.
export async function apiPost(path, payload) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
  return body;
}

// Same as apiPost, but sends a FormData body (file uploads) — leaves
// Content-Type unset so the browser adds the correct multipart boundary.
export async function apiPostForm(path, formData) {
  const res = await fetch(API_BASE + path, { method: "POST", body: formData });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
  return body;
}

export async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed.");
  return body;
}
