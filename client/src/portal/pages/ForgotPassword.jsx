import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../lib/api";
import "../../styles/portal.css";

export default function ForgotPassword() {
  const [volunteerId, setVolunteerId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    fetch(API_BASE + "/volunteer-auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteerId: volunteerId.trim() }),
    })
      .then((res) => res.json().catch(() => ({})).then((body) => {
        if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
        setSuccess(body.message);
        setVolunteerId("");
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
        <h1 className="text-xl mb-1">Forgot Password</h1>
        <p className="text-[13px] text-[#4B5563] mb-6">Enter your Volunteer ID and we'll email a reset link to the address on file.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mf-label" htmlFor="f-vid">Volunteer ID</label>
            <input className="mf-input" id="f-vid" required placeholder="MLF202500001" autoComplete="username" value={volunteerId} onChange={(e) => setVolunteerId(e.target.value)} />
          </div>
          {error && <p className="mf-error-msg mb-2" style={{ display: "block" }}>{error}</p>}
          {success && <p className="text-[13px] mb-2" style={{ color: "#065F46" }}>{success}</p>}
          <button className="mf-btn mf-btn-primary w-full justify-center mt-2" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : <>Send Reset Link <i className="fa-solid fa-paper-plane"></i></>}
          </button>
        </form>
        <p className="text-[13px] mt-5"><Link to="/portal/login" className="text-[#14338C] underline"><i className="fa-solid fa-arrow-left mr-1"></i>Back to login</Link></p>
      </div>
    </div>
  );
}
