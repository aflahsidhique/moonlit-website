import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../lib/api";
import { getAdminAuth, setAdminAuth } from "../lib/adminAuth";
import "../../styles/admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getAdminAuth()) navigate("/admin", { replace: true });
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json().catch(() => ({})).then((body) => {
        if (!res.ok) throw new Error(body.error || "Login failed.");
        setAdminAuth(body);
        navigate("/admin", { replace: true });
      }))
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(115deg,var(--mf-navy) 0%,var(--mf-navy-2) 55%,#183a7e 100%)" }}>
      <div className="mf-form-card w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-11 h-11 rounded-full border-2 border-[#14338C] flex items-center justify-center relative flex-shrink-0">
            <i className="fa-solid fa-fire-flame-curved text-[#14338C] text-lg"></i>
          </span>
          <span className="leading-tight">
            <span className="block font-bold text-[#0A1F44] tracking-wide">MOONLIT</span>
            <span className="block text-[9px] tracking-[.35em] text-[#4B5563]">ADMIN PANEL</span>
          </span>
        </div>
        <h1 className="text-xl mb-1">Admin Login</h1>
        <p className="text-[13px] text-[#4B5563] mb-6">Sign in to review volunteers, blood requests, messages and manage events.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mf-label" htmlFor="l-email">Email</label>
            <input className="mf-input" id="l-email" type="email" required placeholder="admin@moonlitfoundation.org" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="mf-label" htmlFor="l-password">Password</label>
            <input className="mf-input" id="l-password" type="password" required placeholder="••••••••" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="mf-error-msg mb-2" style={{ display: "block" }}>{error}</p>}
          <button className="mf-btn mf-btn-primary w-full justify-center mt-4" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : <>Log In <i className="fa-solid fa-arrow-right"></i></>}
          </button>
        </form>
      </div>
    </div>
  );
}
