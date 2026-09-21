import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/programs", label: "Programs" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Contact" },
];

function navLinkClass({ isActive }) {
  return "mf-nav-link" + (isActive ? " is-active" : "");
}

export default function Header() {
  const [isStuck, setIsStuck] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsStuck(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  useEffect(() => {
    function onKeydown(e) {
      if (e.key === "Escape" && drawerOpen) setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [drawerOpen]);

  return (
    <>
      <header className={"mf-header" + (isStuck ? " is-stuck" : "")}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center gap-3">
            <img className="w-[70px] h-auto" src="/logo.png" alt="Moonlit Foundation logo" />
            <span className="leading-tight">
              <span className="block font-bold text-[#0A1F44] text-lg tracking-wide">MOONLIT</span>
              <span className="block text-[10px] tracking-[.35em] text-[#4B5563]">FOUNDATION</span>
            </span>
          </NavLink>
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <NavLink to="/contact" className="mf-btn mf-btn-donate hidden sm:inline-flex"><i className="fa-solid fa-heart"></i> Donate Now</NavLink>
            <button className="lg:hidden text-2xl text-[#14338C]" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      <div className={"mf-drawer-backdrop" + (drawerOpen ? " open" : "")} onClick={() => setDrawerOpen(false)} />
      <div className={"mf-drawer fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl p-8 flex flex-col gap-5 lg:hidden" + (drawerOpen ? " open" : "")}>
        <button className="self-end text-2xl text-[#14338C]" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {NAV_LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass} onClick={() => setDrawerOpen(false)}>{l.label}</NavLink>
        ))}
        <NavLink to="/contact" className="mf-btn mf-btn-donate mt-4" onClick={() => setDrawerOpen(false)}><i className="fa-solid fa-heart"></i> Donate Now</NavLink>
      </div>
    </>
  );
}
