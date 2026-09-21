import { useState } from "react";
import { useAdminList } from "../hooks/useAdminList";
import { adminFetch } from "../lib/adminApi";
import { useToast } from "../../hooks/useToast";
import AdminDataTable from "../components/AdminDataTable";
import StatusBadge from "../components/StatusBadge";
import { AdminBtn, DeleteButton } from "../components/AdminButtons";
import EventFormModal from "../components/EventFormModal";
import { fmtDate } from "../lib/format";

export default function Events() {
  const showToast = useToast();
  const { rows, loading, error, refresh } = useAdminList("/events/admin", "events");
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  function remove(id) {
    if (!window.confirm("Delete this entry? This can't be undone.")) return;
    adminFetch(`/events/${id}`, { method: "DELETE" }).then(() => { showToast("Deleted."); refresh(); }).catch((err) => showToast(err.message));
  }
  function togglePublish(ev) {
    const next = ev.status === "published" ? "draft" : "published";
    adminFetch(`/events/${ev.id}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) })
      .then(() => { showToast("Event updated."); refresh(); })
      .catch((err) => showToast(err.message));
  }
  function openEdit(id) { setEditId(id); setFormOpen(true); }
  function openNew() { setEditId(null); setFormOpen(true); }

  if (error) return <p className="mf-admin-empty">{error.message}</p>;
  if (loading) return <p className="mf-admin-empty">Loading…</p>;

  const editing = rows.find((e) => e.id === editId) || null;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="mf-btn mf-btn-primary" onClick={openNew}><i className="fa-solid fa-plus"></i> New Event</button>
      </div>
      <AdminDataTable
        rows={rows}
        columns={[
          { label: "Title", render: (ev) => <><strong>{ev.title}</strong><br /><span className="text-xs text-[#4B5563]">{ev.category}</span></> },
          { label: "When", render: (ev) => <>{fmtDate(ev.eventDate)}<br /><span className="text-xs text-[#4B5563]">{ev.startTime} – {ev.endTime}</span></> },
          { label: "Location", render: (ev) => ev.location },
          { label: "Registrations", render: (ev) => ev._count.registrations + (ev.capacity ? ` / ${ev.capacity}` : "") },
          { label: "Status", render: (ev) => <StatusBadge status={ev.status} /> },
          { label: "Actions", isActions: true, render: (ev) => (
            <>
              <AdminBtn variant="neutral" icon="pen" onClick={() => openEdit(ev.id)}>Edit</AdminBtn>
              <AdminBtn variant="approve" icon="bullhorn" onClick={() => togglePublish(ev)}>{ev.status === "published" ? "Unpublish" : "Publish"}</AdminBtn>
              <DeleteButton onDelete={() => remove(ev.id)} />
            </>
          ) },
        ]}
        cardConfig={(ev) => ({
          photo: ev.imageUrl || null,
          icon: "calendar-days",
          title: ev.title,
          subtitle: fmtDate(ev.eventDate),
          badge: <StatusBadge status={ev.status} />,
          onClick: () => openEdit(ev.id),
        })}
      />
      <EventFormModal
        open={formOpen}
        event={editing}
        onClose={() => setFormOpen(false)}
        onSaved={(msg) => { setFormOpen(false); showToast(msg); refresh(); }}
      />
    </>
  );
}
