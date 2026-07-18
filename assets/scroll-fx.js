/* ============================================================
   MOONLIT FOUNDATION — scroll-fx.js
   GSAP + ScrollTrigger creative motion layer. Loads after the
   GSAP CDN scripts and before main.js.

   If GSAP/ScrollTrigger fail to load (CDN blocked, offline), this
   file exits immediately on the first line and main.js's plain
   CSS/IntersectionObserver reveal + rAF counters take over, so
   the site still works and still animates.

   Every effect here is opt-in via existing class hooks already
   present in the HTML (mf-fade, mf-card, mf-band, mf-blob,
   mf-timeline, mf-btn, mf-gal-item, [data-count]) — no per-page
   markup changes were needed.
   ============================================================ */
(function () {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  window.__mfGsap = true;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Hero / page-hero (first section) — own entrance timeline ---------- */
  var hero = document.querySelector("main > section:first-of-type");
  var heroFadeEls = hero ? gsap.utils.toArray(hero.querySelectorAll(".mf-fade")) : [];
  // The hero's own .mf-fade wrappers are choreographed individually below
  // instead of via the generic batch reveal, so just mark them visible.
  heroFadeEls.forEach(function (el) { el.classList.add("in-view"); });

  if (hero && !reduce) {
    var h1 = hero.querySelector("h1");
    var eyebrow = hero.querySelector(".mf-eyebrow");
    var crumb = hero.querySelector(".mf-crumb");
    var divider = hero.querySelector(".mf-divider");
    var paras = hero.querySelectorAll(".max-w-xl,.max-w-md,.max-w-sm");
    var btns = hero.querySelectorAll(".mf-btn");
    var blobFrame = hero.querySelector(".mf-blob-frame");
    var badge = hero.querySelector(".mf-badge-circle");
    var trustRow = hero.querySelector(".mt-9");

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (crumb) tl.from(crumb, { autoAlpha: 0, y: -10, duration: .5 }, 0);
    if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, x: -18, duration: .6 }, .05);
    if (h1) tl.from(h1, { autoAlpha: 0, y: 32, duration: .85 }, .15);
    if (divider) tl.from(divider, { scaleX: 0, transformOrigin: "left center", duration: .5 }, .5);
    if (paras.length) tl.from(paras, { autoAlpha: 0, y: 16, duration: .6, stagger: .08 }, .55);
    if (btns.length) tl.from(btns, { autoAlpha: 0, y: 16, scale: .92, duration: .55, stagger: .1 }, .68);
    if (trustRow) tl.from(trustRow, { autoAlpha: 0, y: 12, duration: .5 }, .85);
    if (blobFrame) tl.from(blobFrame, { autoAlpha: 0, scale: .88, rotate: -3, duration: 1, ease: "back.out(1.4)" }, .3);
    if (badge) tl.from(badge, { autoAlpha: 0, scale: .5, duration: .6, ease: "back.out(2)" }, .95);
  }

  /* ---------- Generic scroll reveal for every other .mf-fade ---------- */
  var faders = gsap.utils.toArray(".mf-fade").filter(function (el) {
    return heroFadeEls.indexOf(el) === -1;
  });
  if (faders.length) {
    if (reduce) {
      gsap.set(faders, { autoAlpha: 1, y: 0, scale: 1 });
    } else {
      gsap.set(faders, { autoAlpha: 0, y: 36, scale: .96 });
      ScrollTrigger.batch(faders, {
        start: "top 87%",
        onEnter: function (batch) {
          gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: .9, ease: "power3.out", stagger: .1, overwrite: true });
        }
      });
    }
  }

  /* ---------- Hash-anchor jumps must not leave content stuck invisible ----------
     Several pages link straight to an in-page anchor (get-involved.html's
     pathway cards -> #volunteer/#blood/#partner, programs.html's overview
     grid -> #blood/#welfare/#relief/#environment/#youth, footer links, etc).
     That's a teleport, not a scroll — ScrollTrigger's threshold-crossing
     detection can miss it entirely (a single instant jump doesn't reliably
     tick through the "top 87%" check the way gradual scrolling does), which
     would otherwise leave the section's .mf-fade content sitting at
     autoAlpha:0 (invisible AND unclickable) with no scroll trigger left to
     fire. A jump target should just appear instantly anyway — there's no
     reason to wait on an entrance animation for content the user teleported
     straight to. */
  function revealHashTarget() {
    var hash = window.location.hash;
    if (!hash) return;
    var target;
    try { target = document.querySelector(hash); } catch (e) { return; }
    if (!target) return;
    var els = target.matches(".mf-fade") ? [target] : target.querySelectorAll(".mf-fade");
    if (els.length) gsap.set(els, { autoAlpha: 1, y: 0, scale: 1, overwrite: true });
  }
  revealHashTarget();
  window.addEventListener("hashchange", revealHashTarget);

  /* ---------- Stat counters (data-count), replaces main.js's rAF version ---------- */
  gsap.utils.toArray("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "+";
    var obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: reduce ? 0 : 1.8,
          ease: "power2.out",
          onUpdate: function () { el.textContent = Math.round(obj.val).toLocaleString("en-IN"); },
          onComplete: function () { el.textContent = target.toLocaleString("en-IN") + suffix; }
        });
      }
    });
  });

  /* ---------- Blob: idle breathing morph + scroll parallax on the photo ---------- */
  gsap.utils.toArray(".mf-blob").forEach(function (blob) {
    if (!reduce) {
      gsap.to(blob, {
        borderRadius: "46% 54% 54% 46% / 46% 46% 54% 54%",
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }
    var img = blob.querySelector("img");
    if (img && !reduce) {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: blob, start: "top bottom", end: "bottom top", scrub: .8 }
      });
    }
  });

  /* ---------- Timeline scroll-progress fill (about.html) ---------- */
  var timeline = document.querySelector(".mf-timeline");
  if (timeline && !reduce) {
    var progress = document.createElement("div");
    progress.className = "mf-timeline-progress";
    progress.setAttribute("aria-hidden", "true");
    timeline.appendChild(progress);
    gsap.fromTo(progress, { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: timeline, start: "top 65%", end: "bottom 85%", scrub: .6 }
    });
  }

  /* ---------- Cursor-follow spotlight glow in the hero ---------- */
  if (hero && fine && !reduce) {
    hero.style.position = "relative";
    var wrap = hero.querySelector(".max-w-7xl");
    if (wrap) { wrap.style.position = "relative"; wrap.style.zIndex = "1"; }
    var glow = document.createElement("div");
    glow.className = "mf-spotlight";
    glow.setAttribute("aria-hidden", "true");
    hero.appendChild(glow);
    var gx = gsap.quickTo(glow, "x", { duration: .6, ease: "power3" });
    var gy = gsap.quickTo(glow, "y", { duration: .6, ease: "power3" });
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      gx(e.clientX - r.left);
      gy(e.clientY - r.top);
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) {
    gsap.utils.toArray(".mf-btn").forEach(function (btn) {
      var xTo = gsap.quickTo(btn, "x", { duration: .4, ease: "power3" });
      var yTo = gsap.quickTo(btn, "y", { duration: .4, ease: "power3" });
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .3);
        yTo((e.clientY - r.top - r.height / 2) * .5 - 3);
      });
      btn.addEventListener("mouseenter", function () { yTo(-3); });
      btn.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- Subtle tilt on gallery items ---------- */
  if (fine && !reduce) {
    gsap.utils.toArray(".mf-gal-item").forEach(function (item) {
      gsap.set(item, { transformPerspective: 700 });
      var rx = gsap.quickTo(item, "rotationX", { duration: .5, ease: "power3" });
      var ry = gsap.quickTo(item, "rotationY", { duration: .5, ease: "power3" });
      item.addEventListener("mousemove", function (e) {
        var r = item.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5;
        var py = (e.clientY - r.top) / r.height - .5;
        rx(py * -8);
        ry(px * 10);
      });
      item.addEventListener("mouseleave", function () { rx(0); ry(0); });
    });
  }

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
