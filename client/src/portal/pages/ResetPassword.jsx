import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../../lib/api";
import "../../styles/portal.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }

    setSubmitting(true);
    fetch(API_BASE + "/volunteer-auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    })
      .then((res) => res.json().catch(() => ({})).then((body) => {
        if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
        setSuccessMsg(body.message);
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
            <span className="block text-[9px] tracking-[.35em] text-[#4B5563]">VOLUNTEER PORTAL</span>
          </span>
        </div>
        <h1 className="text-xl mb-1">Reset Password</h1>

        {!token ? (
          <p className="text-[13px] text-[#4B5563] mb-6">This reset link is missing its token — request a new one from the login page.</p>
        ) : successMsg ? (
          <p className="text-[13px] mb-6"><span style={{ color: "#065F46" }}>{successMsg}</span> — <Link to="/portal/login" className="text-[#14338C] underline">Log in now</Link></p>
        ) : (
          <>
            <p className="text-[13px] text-[#4B5563] mb-6">Choose a new password for your volunteer account.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mf-label" htmlFor="r-password">New Password</label>
                <input className="mf-input" id="r-password" type="password" required minLength={8} placeholder="At least 8 characters" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="mf-label" htmlFor="r-confirm">Confirm New Password</label>
                <input className="mf-input" id="r-confirm" type="password" required minLength={8} placeholder="Re-enter password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              {error && <p className="mf-error-msg mb-2" style={{ display: "block" }}>{error}</p>}
              <button className="mf-btn mf-btn-primary w-full justify-center mt-4" type="submit" disabled={submitting}>
                {submitting ? "Resetting…" : <>Reset Password <i className="fa-solid fa-check"></i></>}
              </button>
            </form>
          </>
        )}
        <p className="text-[13px] mt-5"><Link to="/portal/login" className="text-[#14338C] underline"><i className="fa-solid fa-arrow-left mr-1"></i>Back to login</Link></p>
      </div>
    </div>
  );
}
