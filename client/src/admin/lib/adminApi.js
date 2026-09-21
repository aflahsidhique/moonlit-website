import { API_BASE } from "../../lib/api";
import { getAdminAuth, clearAdminAuth } from "./adminAuth";

// Attaches the admin's Bearer token to every call; a 401 means the token's
// dead (expired/invalid), so it clears auth and hard-redirects to login —
// same behavior as the legacy admin.js (a full reload is fine here, there's
// no in-flight state worth preserving through an expired session).
export function adminFetch(path, options = {}) {
  const auth = getAdminAuth();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;

  return fetch(API_BASE + path, { method: options.method || "GET", headers, body: options.body }).then((res) => {
    if (res.status === 401) {
      clearAdminAuth();
      window.location.href = "/admin/login";
      throw new Error("Session expired — please log in again.");
    }
    return res.json().catch(() => ({})).then((body) => {
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status}).`);
      return body;
    });
  });
}
