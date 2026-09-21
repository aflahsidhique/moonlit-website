import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ports the legacy site's assets/scroll-fx.js into a per-page React hook.
// Every effect is opt-in via the same class hooks used across all pages
// (mf-fade, mf-card, mf-band, mf-blob, mf-timeline, mf-btn, mf-gal-item,
// [data-count]) — page components don't need any extra markup, just the
// same classes the original HTML already used.
//
// Scoped with gsap.context(fn, containerRef) so every tween/ScrollTrigger/
// listener created inside is automatically torn down when the page
// unmounts (route change) — the same lifecycle main.js/scroll-fx.js got
// for free from being a full page (re)load on a static site.
export function useScrollFx(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      /* ---------- Hero (first section) — own entrance timeline ---------- */
      const hero = container.querySelector(":scope > section:first-of-type");
      const heroFadeEls = hero ? gsap.utils.toArray(hero.querySelectorAll(".mf-fade")) : [];
      heroFadeEls.forEach((el) => el.classList.add("in-view"));

      if (hero && !reduce) {
        const h1 = hero.querySelector("h1");
        const eyebrow = hero.querySelector(".mf-eyebrow");
        const crumb = hero.querySelector(".mf-crumb");
        const divider = hero.querySelector(".mf-divider");
        const paras = hero.querySelectorAll(".max-w-xl,.max-w-md,.max-w-sm");
        const btns = hero.querySelectorAll(".mf-btn");
        const blobFrame = hero.querySelector(".mf-blob-frame");
        const badge = hero.querySelector(".mf-badge-circle");
        const trustRow = hero.querySelector(".mt-9");

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (crumb) tl.from(crumb, { autoAlpha: 0, y: -10, duration: 0.5 }, 0);
        if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, x: -18, duration: 0.6 }, 0.05);
        if (h1) tl.from(h1, { autoAlpha: 0, y: 32, duration: 0.85 }, 0.15);
        if (divider) tl.from(divider, { scaleX: 0, transformOrigin: "left center", duration: 0.5 }, 0.5);
        if (paras.length) tl.from(paras, { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.08 }, 0.55);
        if (btns.length) tl.from(btns, { autoAlpha: 0, y: 16, scale: 0.92, duration: 0.55, stagger: 0.1 }, 0.68);
        if (trustRow) tl.from(trustRow, { autoAlpha: 0, y: 12, duration: 0.5 }, 0.85);
        if (blobFrame) tl.from(blobFrame, { autoAlpha: 0, scale: 0.88, rotate: -3, duration: 1, ease: "back.out(1.4)" }, 0.3);
        if (badge) tl.from(badge, { autoAlpha: 0, scale: 0.5, duration: 0.6, ease: "back.out(2)" }, 0.95);
      }

      /* ---------- Generic scroll reveal for every other .mf-fade ---------- */
      const faders = gsap.utils.toArray(container.querySelectorAll(".mf-fade")).filter((el) => heroFadeEls.indexOf(el) === -1);
      if (faders.length) {
        if (reduce) {
          gsap.set(faders, { autoAlpha: 1, y: 0, scale: 1 });
        } else {
          gsap.set(faders, { autoAlpha: 0, y: 36, scale: 0.96 });
          ScrollTrigger.batch(faders, {
            start: "top 87%",
            onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
          });
        }
      }

      /* ---------- Hash-anchor jumps shouldn't leave content stuck invisible ---------- */
      function revealHashTarget() {
        const hash = window.location.hash;
        if (!hash) return;
        let target;
        try { target = container.querySelector(hash); } catch { return; }
        if (!target) return;
        const els = target.matches(".mf-fade") ? [target] : target.querySelectorAll(".mf-fade");
        if (els.length) gsap.set(els, { autoAlpha: 1, y: 0, scale: 1, overwrite: true });
      }
      revealHashTarget();
      window.addEventListener("hashchange", revealHashTarget);

      /* ---------- Stat counters ([data-count]) ---------- */
      gsap.utils.toArray(container.querySelectorAll("[data-count]")).forEach((el) => {
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "+";
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: reduce ? 0 : 1.8,
              ease: "power2.out",
              onUpdate: () => { el.textContent = Math.round(obj.val).toLocaleString("en-IN"); },
              onComplete: () => { el.textContent = target.toLocaleString("en-IN") + suffix; },
            });
          },
        });
      });

      /* ---------- Blob: idle breathing morph + scroll parallax ---------- */
      gsap.utils.toArray(container.querySelectorAll(".mf-blob")).forEach((blob) => {
        if (!reduce) {
          gsap.to(blob, { borderRadius: "46% 54% 54% 46% / 46% 46% 54% 54%", duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
        }
        const img = blob.querySelector("img");
        if (img && !reduce) {
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: blob, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        }
      });

      /* ---------- Timeline scroll-progress fill (About page) ---------- */
      const timeline = container.querySelector(".mf-timeline");
      if (timeline && !reduce) {
        const progress = document.createElement("div");
        progress.className = "mf-timeline-progress";
        progress.setAttribute("aria-hidden", "true");
        timeline.appendChild(progress);
        gsap.fromTo(progress, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: timeline, start: "top 65%", end: "bottom 85%", scrub: 0.6 } });
      }

      /* ---------- Cursor-follow spotlight glow in the hero ---------- */
      if (hero && fine && !reduce) {
        hero.style.position = "relative";
        const wrap = hero.querySelector(".max-w-7xl");
        if (wrap) { wrap.style.position = "relative"; wrap.style.zIndex = "1"; }
        const glow = document.createElement("div");
        glow.className = "mf-spotlight";
        glow.setAttribute("aria-hidden", "true");
        hero.appendChild(glow);
        const gx = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3" });
        const gy = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3" });
        hero.addEventListener("mousemove", (e) => {
          const r = hero.getBoundingClientRect();
          gx(e.clientX - r.left);
          gy(e.clientY - r.top);
        });
      }

      /* ---------- Magnetic buttons ---------- */
      if (fine && !reduce) {
        gsap.utils.toArray(container.querySelectorAll(".mf-btn")).forEach((btn) => {
          const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
          const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
          btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.3);
            yTo((e.clientY - r.top - r.height / 2) * 0.5 - 3);
          });
          btn.addEventListener("mouseenter", () => yTo(-3));
          btn.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
        });
      }

      /* ---------- Subtle tilt on gallery items ---------- */
      if (fine && !reduce) {
        gsap.utils.toArray(container.querySelectorAll(".mf-gal-item")).forEach((item) => {
          gsap.set(item, { transformPerspective: 700 });
          const rx = gsap.quickTo(item, "rotationX", { duration: 0.5, ease: "power3" });
          const ry = gsap.quickTo(item, "rotationY", { duration: 0.5, ease: "power3" });
          item.addEventListener("mousemove", (e) => {
            const r = item.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rx(py * -8);
            ry(px * 10);
          });
          item.addEventListener("mouseleave", () => { rx(0); ry(0); });
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => window.removeEventListener("hashchange", revealHashTarget);
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
