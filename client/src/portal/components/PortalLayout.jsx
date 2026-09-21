import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearPortalAuth } from "../lib/portalAuth";
import { portalFetch } from "../lib/portalApi";
import "../../styles/portal.css";

export const NAV_ITEMS = [
  { path: "", end: true, label: "Overview", icon: "gauge-high", title: "Overview" },
  { path: "idcard", label: "Volunteer Card", icon: "id-card", title: "Volunteer Card" },
  { path: "events", label: "Upcoming Events", icon: "calendar-days", title: "Upcoming Events" },
  { path: "attendance", label: "Attendance & Hours", icon: "clipboard-check", title: "Attendance & Hours" },
  { path: "certificates", label: "Certificates", icon: "certificate", title: "Certificates" },
  { path: null, label: "Badges", icon: "award", soon: true },
  { path: "blood", label: "Blood Donor Status", icon: "droplet", title: "Blood Donor Status" },
  { path: "profile", label: "Profile", icon: "user", title: "Profile" },
  { path: "notifications", label: "Notifications", icon: "bell", title: "Notifications" },
  { path: "downloads", label: "Downloads", icon: "download", title: "Downloads" },
];

export default function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("—");

  const current = NAV_ITEMS.find((n) => {
    if (n.path == null) return false;
    const full = "/portal/" + n.path;
    return n.end ? location.pathname === "/portal" || location.pathname === "/portal/" : location.pathname.startsWith(full);
  }) || NAV_ITEMS[0];

  useEffect(() => {
    portalFetch("/volunteer-auth/me").then((r) => setName(r.volunteer.fullName)).catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
  }, [sidebarOpen]);

  useEffect(() => {
    function onKeydown(e) { if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false); }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [sidebarOpen]);

  function logout() {
    clearPortalAuth();
    navigate("/portal/login", { replace: true });
  }

  return (
    <>
      <div className="mf-portal-mobile-topbar">
        <button id="mfPortalMenuBtn" className="mf-portal-menu-btn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><i className="fa-solid fa-bars"></i></button>
        <span className="leading-tight">
          <span className="block font-bold text-white tracking-wide text-sm">MOONLIT</span>
          <span className="block text-[9px] tracking-[.3em] text-[#B9C6E2]">VOLUNTEER PORTAL</span>
        </span>
        <span className="w-8"></span>
      </div>
      <div className={"mf-drawer-backdrop" + (sidebarOpen ? " open" : "")} onClick={() => setSidebarOpen(false)} />

      <div className="mf-portal-shell">
        <aside className={"mf-portal-sidebar" + (sidebarOpen ? " open" : "")}>
          <div className="mf-portal-brand">
            <span className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-fire-flame-curved text-white"></i>
            </span>
            <span className="leading-tight">
              <span className="block font-bold text-white tracking-wide text-sm">MOONLIT</span>
              <span className="block text-[9px] tracking-[.3em] text-[#B9C6E2]">VOLUNTEER PORTAL</span>
            </span>
            <button className="mf-portal-sidebar-close" aria-label="Close menu" onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <nav className="mf-portal-nav">
            {NAV_ITEMS.map((n) =>
              n.path == null ? (
                <div key={n.label} className="mf-portal-nav-link is-disabled">
                  <i className={`fa-solid fa-${n.icon}`}></i> {n.label} <span className="mf-portal-soon">soon</span>
                </div>
              ) : (
                <NavLink
                  key={n.path}
                  to={n.path ? `/portal/${n.path}` : "/portal"}
                  end={n.end}
                  className={({ isActive }) => "mf-portal-nav-link" + (isActive ? " is-active" : "")}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`fa-solid fa-${n.icon}`}></i> {n.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="mf-portal-sidebar-footer">
            <p className="text-white">{name}</p>
            <button onClick={logout} className="text-[#F5B921] mt-1" style={{ textDecoration: "underline" }}>Log out</button>
          </div>
        </aside>

        <main className="mf-portal-main">
          <p className="mf-portal-section-title">{current.title}</p>
          <Outlet />
        </main>
      </div>
    </>
  );
}
