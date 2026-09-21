import { useEffect } from "react";

export default function AdminModal({ open, onClose, title, wide, children }) {
  useEffect(() => {
    if (!open) return;
    function onKeydown(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mf-admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mf-admin-modal" style={wide ? { maxWidth: 680 } : undefined}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg">{title}</h3>
          <button className="mf-car-arrow" aria-label="Close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        {children}
      </div>
    </div>
  );
}
