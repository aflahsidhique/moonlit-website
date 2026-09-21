import { useEffect, useState } from "react";
import AdminModal from "./AdminModal";
import { adminFetch } from "../lib/adminApi";

const CATEGORIES = ["Blood Donation", "Community Welfare", "Disaster Relief", "Environment", "Youth Development"];

const BLANK = { title: "", category: CATEGORIES[0], status: "draft", description: "", location: "", eventDate: "", capacity: "", startTime: "", endTime: "", durationHours: "", imageUrl: "", photoAlbumUrl: "" };

export default function EventFormModal({ open, event, onClose, onSaved }) {
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (event) {
      setForm({
        title: event.title, category: event.category, status: event.status, description: event.description,
        location: event.location, eventDate: new Date(event.eventDate).toISOString().slice(0, 10),
        capacity: event.capacity || "", startTime: event.startTime, endTime: event.endTime,
        durationHours: event.durationHours || "", imageUrl: event.imageUrl || "", photoAlbumUrl: event.photoAlbumUrl || "",
      });
    } else {
      setForm(BLANK);
    }
    setError("");
  }, [open, event]);

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = {
      title: form.title.trim(), category: form.category, status: form.status, description: form.description.trim(),
      location: form.location.trim(), eventDate: form.eventDate, capacity: form.capacity || null,
      startTime: form.startTime.trim(), endTime: form.endTime.trim(), durationHours: form.durationHours || null,
      imageUrl: form.imageUrl.trim() || null, photoAlbumUrl: form.photoAlbumUrl.trim() || null,
    };
    setSaving(true);
    const req = event ? adminFetch(`/events/${event.id}`, { method: "PUT", body: JSON.stringify(payload) }) : adminFetch("/events", { method: "POST", body: JSON.stringify(payload) });
    req.then(() => onSaved(event ? "Event updated." : "Event created."))
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false));
  }

  return (
    <AdminModal open={open} onClose={onClose} title={event ? "Edit Event" : "New Event"}>
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="mf-label" htmlFor="ef-title">Title *</label><input className="mf-input" id="ef-title" required placeholder="Mega Blood Donation Camp" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div>
            <label className="mf-label" htmlFor="ef-category">Category *</label>
            <select className="mf-input" id="ef-category" required value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mf-label" htmlFor="ef-status">Status</label>
            <select className="mf-input" id="ef-status" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Draft</option><option value="published">Published</option>
            </select>
          </div>
          <div className="sm:col-span-2"><label className="mf-label" htmlFor="ef-description">Description *</label><textarea className="mf-input" id="ef-description" rows={3} required placeholder="What is this event about?" value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="mf-label" htmlFor="ef-location">Location *</label><input className="mf-input" id="ef-location" required placeholder="Govt. Medical College, Kozhikode" value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
          <div><label className="mf-label" htmlFor="ef-date">Date *</label><input className="mf-input" id="ef-date" type="date" required value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} /></div>
          <div><label className="mf-label" htmlFor="ef-capacity">Capacity</label><input className="mf-input" id="ef-capacity" type="number" min="1" placeholder="Optional" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} /></div>
          <div><label className="mf-label" htmlFor="ef-start">Start Time *</label><input className="mf-input" id="ef-start" required placeholder="9:00 AM" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} /></div>
          <div><label className="mf-label" htmlFor="ef-end">End Time *</label><input className="mf-input" id="ef-end" required placeholder="4:00 PM" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} /></div>
          <div><label className="mf-label" htmlFor="ef-duration">Hours Credited <span className="text-[#9CA3AF] font-normal">(for attendance)</span></label><input className="mf-input" id="ef-duration" type="number" min="0" step="0.5" placeholder="e.g. 4" value={form.durationHours} onChange={(e) => set("durationHours", e.target.value)} /></div>
          <div><label className="mf-label" htmlFor="ef-image">Image URL</label><input className="mf-input" id="ef-image" type="url" placeholder="Optional — https://..." value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="mf-label" htmlFor="ef-album">Photo Album Link <span className="text-[#9CA3AF] font-normal">(optional — e.g. a Google Drive folder)</span></label><input className="mf-input" id="ef-album" type="url" placeholder="https://drive.google.com/drive/folders/..." value={form.photoAlbumUrl} onChange={(e) => set("photoAlbumUrl", e.target.value)} /></div>
        </div>
        {error && <p className="mf-error-msg mt-3" style={{ display: "block" }}>{error}</p>}
        <div className="flex gap-3 mt-6">
          <button type="submit" className="mf-btn mf-btn-primary flex-1 justify-center" disabled={saving}>Save Event</button>
          <button type="button" className="mf-btn mf-btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </AdminModal>
  );
}
