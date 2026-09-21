import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  // Scroll to top on route change, or to the hash target if one's present
  // (footer/hero links to e.g. /programs#blood) — mirrors normal multi-page
  // navigation behavior that a SPA doesn't get for free.
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
