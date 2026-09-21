import { useEffect, useState } from "react";
import { portalFetch } from "../lib/portalApi";
import { fmtDate } from "../lib/format";
import StatusBadge from "../components/StatusBadge";

function RegistrationRows({ list, emptyMsg }) {
  if (!list.length) return <p className="text-[14px] text-[#9CA3AF]">{emptyMsg}</p>;
  return list.map((r) => (
    <div key={r.id} className="mf-portal-row">
      <div>
        <p className="title">{r.event.title}</p>
        <p className="meta">{fmtDate(r.event.eventDate)} · {r.event.location}</p>
      </div>
      <StatusBadge status={r.status} />
    </div>
  ));
}

export default function PortalEvents() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    portalFetch("/volunteer-auth/events")
      .then((body) => setState({ status: "ok", upcoming: body.upcoming, past: body.past }))
      .catch((err) => setState({ status: "error", message: err.message }));
  }, []);

  if (state.status === "loading") return <p className="text-[14px] text-[#4B5563]">Loading…</p>;
  if (state.status === "error") return <p className="text-[14px] text-[#DC2626]">{state.message}</p>;

  return (
    <>
      <p className="mf-pf-section" style={{ marginTop: 0 }}>Upcoming</p>
      <RegistrationRows list={state.upcoming} emptyMsg="No upcoming events registered." />
      <p className="mf-pf-section">Past</p>
      <RegistrationRows list={state.past} emptyMsg="No past events on record." />
    </>
  );
}
