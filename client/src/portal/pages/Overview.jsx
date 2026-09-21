import { useEffect, useState } from "react";
import { portalFetch } from "../lib/portalApi";
import { fmtDate } from "../lib/format";
import IdCardCard from "../components/IdCardCard";

export default function Overview() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    Promise.all([
      portalFetch("/volunteer-auth/me"),
      portalFetch("/volunteer-auth/attendance"),
      portalFetch("/volunteer-auth/events"),
      portalFetch("/volunteer-auth/notifications"),
    ]).then(([me, attendance, events, notifs]) => {
      setState({ status: "ok", v: me.volunteer, attendance, events, latest: notifs.notifications[0] });
    }).catch((err) => setState({ status: "error", message: err.message }));
  }, []);

  if (state.status === "loading") return <p className="text-[14px] text-[#4B5563]">Loading…</p>;
  if (state.status === "error") return <p className="text-[14px] text-[#DC2626]">{state.message}</p>;

  const { v, attendance, events, latest } = state;
  const cards = [
    { n: attendance.totalHours, label: "Hours Served" },
    { n: events.upcoming.length, label: "Upcoming Events" },
    { n: attendance.attendances.length, label: "Events Attended" },
    { n: v.isBloodDonor ? (v.bloodGroup || "Yes") : "No", label: "Blood Donor" },
  ];

  return (
    <>
      <div className="mf-portal-stats-row">
        {cards.map((c) => (
          <div key={c.label} className="mf-portal-stat-card">
            <p className="mf-portal-stat-num">{c.n}</p>
            <p className="mf-portal-stat-label">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-[300px_1fr] gap-6 items-start">
        <IdCardCard v={v} />
        <div>
          {latest ? (
            <div className="mf-notif-item">
              <p className="title">{latest.title}</p>
              <p className="meta">{fmtDate(latest.createdAt)}</p>
              <p className="msg">{latest.message}</p>
            </div>
          ) : <p className="text-[14px] text-[#9CA3AF]">No notifications yet.</p>}
        </div>
      </div>
    </>
  );
}
