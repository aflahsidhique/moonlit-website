import { API_BASE } from "../../lib/api";
import { getPortalAuth, clearPortalAuth } from "./portalAuth";

// Attaches the volunteer's Bearer token to every call; 401/403 means the
// session is dead, so it clears auth and hard-redirects to login — same
// behavior as the legacy portal.js (a full reload is fine, no in-flight
// state worth preserving through an expired session).
export function portalFetch(path, options = {}) {
  const auth = getPortalAuth();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;

  return fetch(API_BASE + path, { method: options.method || "GET", headers, body: options.body }).then((res) => {
    if (res.status === 401 || res.status === 403) {
      clearPortalAuth();
      window.location.href = "/portal/login";
      throw new Error("Session expired — please log in again.");
    }
    return res.json().catch(() => ({})).then((body) => {
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status}).`);
      return body;
    });
  });
}
