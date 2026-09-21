import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAdminAuth, clearAdminAuth } from "../lib/adminAuth";
import "../../styles/admin.css";

export const NAV_ITEMS = [
  { path: "", end: true, label: "Overview", icon: "gauge-high", title: "Overview", subtitle: "A snapshot of everything coming through the site." },
  { path: "volunteers", label: "Volunteers", icon: "users", countKey: "volunteers", title: "Volunteers", subtitle: "Review and approve volunteer registrations." },
  { path: "blood-requests", label: "Blood Requests", icon: "droplet", countKey: "blood", title: "Blood Requests", subtitle: "Track requests through to fulfilment." },
  { path: "partners", label: "Partners", icon: "handshake", countKey: "partners", title: "Partner Inquiries", subtitle: "CSR, campus and NGO partnership requests." },
  { path: "messages", label: "Messages", icon: "envelope", countKey: "messages", title: "Contact Messages", subtitle: "General enquiries from the contact form." },
  { path: "newsletter", label: "Newsletter", icon: "paper-plane", title: "Newsletter Subscribers", subtitle: "Everyone who's signed up from the footer form." },
  { path: "events", label: "Events", icon: "calendar-days", title: "Events", subtitle: "Create, publish and manage events shown on the public site." },
  { path: "registrations", label: "Event Registrations", icon: "ticket", title: "Event Registrations", subtitle: "Everyone registered across every event." },
  { path: "checkin", label: "Check-in Scanner", icon: "qrcode", title: "Check-in Scanner", subtitle: "Scan a volunteer's ID-card QR code to mark them present and credit hours." },
  { path: "feedback", label: "Event Feedback", icon: "star", title: "Event Feedback", subtitle: "Ratings and comments left on past events." },
  { path: "notifications", label: "Notifications", icon: "bullhorn", title: "Notifications", subtitle: "Broadcast to every volunteer, or message one directly." },
];

export default function AdminLayout() {
  const auth = getAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({});

  const current = NAV_ITEMS.find((n) => {
    const full = "/admin/" + n.path;
    return n.end ? location.pathname === "/admin" || location.pathname === "/admin/" : location.pathname.startsWith(full);
  }) || NAV_ITEMS[0];

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
  }, [sidebarOpen]);

  useEffect(() => {
    function onKeydown(e) { if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false); }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [sidebarOpen]);

  function setCount(key, n) {
    setCounts((c) => ({ ...c, [key]: n }));
  }
  function setManyCounts(obj) {
    setCounts((c) => ({ ...c, ...obj }));
  }

  function logout() {
    clearAdminAuth();
    navigate("/admin/login", { replace: true });
  }

  return (
    <>
      <div className="mf-admin-mobile-topbar">
        <button className="mf-admin-menu-btn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><i className="fa-solid fa-bars"></i></button>
        <span className="leading-tight">
          <span className="block font-bold text-white tracking-wide text-sm">MOONLIT</span>
          <span className="block text-[9px] tracking-[.3em] text-[#B9C6E2]">ADMIN PANEL</span>
        </span>
        <span className="w-8"></span>
      </div>
      <div className={"mf-drawer-backdrop" + (sidebarOpen ? " open" : "")} onClick={() => setSidebarOpen(false)} />

      <div className="mf-admin-shell">
        <aside className={"mf-admin-sidebar" + (sidebarOpen ? " open" : "")}>
          <div className="mf-admin-brand">
            <span className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-fire-flame-curved text-white"></i>
            </span>
            <span className="leading-tight">
              <span className="block font-bold text-white tracking-wide text-sm">MOONLIT</span>
              <span className="block text-[9px] tracking-[.3em] text-[#B9C6E2]">ADMIN PANEL</span>
            </span>
            <button className="mf-admin-sidebar-close" aria-label="Close menu" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <nav className="mf-admin-nav">
            {NAV_ITEMS.map((n) => (
              <NavLink
                key={n.path}
                to={n.path ? `/admin/${n.path}` : "/admin"}
                end={n.end}
                className={({ isActive }) => "mf-admin-nav-link" + (isActive ? " is-active" : "")}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`fa-solid fa-${n.icon}`}></i> {n.label}
                {n.countKey && counts[n.countKey] > 0 && <span className="mf-admin-count">{counts[n.countKey]}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="mf-admin-sidebar-footer">
            <p className="text-white">{auth?.admin?.name}</p>
            <button onClick={logout} className="text-[#F5B921] mt-1" style={{ textDecoration: "underline" }}>Log out</button>
          </div>
        </aside>

        <main className="mf-admin-main">
          <div className="mf-admin-topbar">
            <div>
              <p className="mf-admin-title">{current.title}</p>
              <p className="mf-admin-subtitle">{current.subtitle}</p>
            </div>
          </div>
          <Outlet context={{ setCount, setManyCounts }} />
        </main>
      </div>
    </>
  );
}
