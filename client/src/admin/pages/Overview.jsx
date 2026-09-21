import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { adminFetch } from "../lib/adminApi";

export default function Overview() {
  const navigate = useNavigate();
  const { setManyCounts } = useOutletContext();
  const [cards, setCards] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      adminFetch("/volunteers?status=pending"),
      adminFetch("/blood-requests?status=pending"),
      adminFetch("/partners?status=pending"),
      adminFetch("/contact?status=unread"),
      adminFetch("/newsletter"),
      adminFetch("/events/admin"),
      adminFetch("/event-registrations?status=pending"),
    ])
      .then((r) => {
        setManyCounts({ volunteers: r[0].volunteers.length, blood: r[1].bloodRequests.length, partners: r[2].partners.length, messages: r[3].messages.length });
        setCards([
          { n: r[0].volunteers.length, label: "Pending Volunteers", to: "/admin/volunteers" },
          { n: r[1].bloodRequests.length, label: "Pending Blood Requests", to: "/admin/blood-requests" },
          { n: r[2].partners.length, label: "Pending Partner Inquiries", to: "/admin/partners" },
          { n: r[3].messages.length, label: "Unread Messages", to: "/admin/messages" },
          { n: r[4].subscribers.length, label: "Newsletter Subscribers", to: "/admin/newsletter" },
          { n: r[5].events.filter((e) => e.status === "published").length, label: "Published Events", to: "/admin/events" },
          { n: r[6].registrations.length, label: "Pending Event Registrations", to: "/admin/registrations" },
        ]);
      })
      .catch(setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <p className="mf-admin-empty">{error.message}</p>;
  if (!cards) return <p className="mf-admin-empty">Loading…</p>;

  return (
    <div className="mf-admin-stats-row">
      {cards.map((c) => (
        <div key={c.label} className="mf-admin-stat-card" style={{ cursor: "pointer" }} onClick={() => navigate(c.to)}>
          <p className="mf-admin-stat-num">{c.n}</p>
          <p className="mf-admin-stat-label">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
