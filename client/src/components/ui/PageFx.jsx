import { useRef } from "react";
import { useScrollFx } from "../../hooks/useScrollFx";

// Wraps a page's sections in the ref useScrollFx needs, and re-runs the
// GSAP scroll-reveal/hero/parallax setup (scoped + auto-cleaned-up) on
// every route change. Every page component's default export should return
// <PageFx>...its <section>s...</PageFx>.
export default function PageFx({ children }) {
  const ref = useRef(null);
  useScrollFx(ref);
  return <div ref={ref}>{children}</div>;
}
