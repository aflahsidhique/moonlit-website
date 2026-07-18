/* ============================================================
   MOONLIT FOUNDATION — main.js
   In WordPress: load via an HTML widget, a child theme, or a
   code-snippets plugin. Every behavior is opt-in via class /
   data-attribute, so it works with Elementor-generated markup.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".mf-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile drawer (backdrop injected here; click-outside + scroll lock) ---------- */
  var drawer = document.getElementById("mfDrawer");
  var openBtn = document.getElementById("mfDrawerOpen");
  var closeBtn = document.getElementById("mfDrawerClose");
  if (drawer && openBtn) {
    var backdrop = document.createElement("div");
    backdrop.className = "mf-drawer-backdrop";
    drawer.parentNode.insertBefore(backdrop, drawer);

    var setOpen = function (open) {
      drawer.classList.toggle("open", open);
      backdrop.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    openBtn.addEventListener("click", function () { setOpen(true); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setOpen(false); });
    backdrop.addEventListener("click", function () { setOpen(false); });
    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) setOpen(false);
    });
  }

  /* ---------- Scroll reveal (fallback only — scroll-fx.js/GSAP handles this when loaded) ---------- */
  if (!window.__mfGsap) {
    var faders = document.querySelectorAll(".mf-fade");
    if ("IntersectionObserver" in window && faders.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      faders.forEach(function (el) { io.observe(el); });
    } else {
      faders.forEach(function (el) { el.classList.add("in-view"); });
    }
  }

  /* ---------- Stat count-up (fallback only — scroll-fx.js/GSAP handles this when loaded) ---------- */
  if (!window.__mfGsap) {
    var counters = document.querySelectorAll("[data-count]");
    if ("IntersectionObserver" in window && counters.length) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target, target = parseInt(el.getAttribute("data-count"), 10);
          var suffix = el.getAttribute("data-suffix") || "+";
          var dur = 1600, start = null;
          var step = function (ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString("en-IN") + (p === 1 ? suffix : "");
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById("mfTestiTrack");
  if (track) {
    var prev = document.getElementById("mfTestiPrev");
    var next = document.getElementById("mfTestiNext");
    var scrollAmt = function () {
      var card = track.querySelector(".mf-card");
      return card ? card.offsetWidth + 24 : 320;
    };
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -scrollAmt(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: scrollAmt(), behavior: "smooth" }); });
  }

  /* ---------- Filter pills (gallery + events)
       .mf-pill[data-filter] toggles [data-cat] items in the
       container referenced by data-target ---------- */
  document.querySelectorAll("[data-filter]").forEach(function (pill) {
    pill.addEventListener("click", function () {
      var group = pill.closest("[data-filter-group]");
      var targetSel = group ? group.getAttribute("data-target") : null;
      var wrap = targetSel ? document.querySelector(targetSel) : null;
      if (!wrap) return;
      group.querySelectorAll(".mf-pill").forEach(function (p) { p.classList.remove("is-active"); });
      pill.classList.add("is-active");
      var f = pill.getAttribute("data-filter");
      wrap.querySelectorAll("[data-cat]").forEach(function (item) {
        var show = f === "all" || item.getAttribute("data-cat").split(" ").indexOf(f) !== -1;
        item.style.display = show ? "" : "none";
        // A newly-shown item may never have crossed its scroll-reveal trigger
        // while it was display:none — force it visible so it can't get stuck.
        if (show && window.gsap) window.gsap.to(item, { autoAlpha: 1, y: 0, scale: 1, duration: .5, overwrite: true });
      });
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lb = document.getElementById("mfLightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".mf-lb-cap");
    var items = Array.prototype.slice.call(document.querySelectorAll(".mf-gal-item"));
    var idx = 0;
    var visible = function () { return items.filter(function (i) { return i.style.display !== "none"; }); };
    var show = function (i) {
      var vis = visible(); if (!vis.length) return;
      idx = (i + vis.length) % vis.length;
      var el = vis[idx];
      lbImg.src = el.getAttribute("data-full") || el.querySelector("img").src;
      lbImg.alt = el.querySelector("img").alt || "";
      if (lbCap) lbCap.textContent = el.getAttribute("data-caption") || "";
      lb.classList.add("open");
    };
    items.forEach(function (el) {
      el.addEventListener("click", function () { show(visible().indexOf(el)); });
    });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.classList.remove("open"); });
    var lbPrev = lb.querySelector(".mf-lb-prev"), lbNext = lb.querySelector(".mf-lb-next"),
        lbClose = lb.querySelector(".mf-lb-close");
    if (lbPrev) lbPrev.addEventListener("click", function () { show(idx - 1); });
    if (lbNext) lbNext.addEventListener("click", function () { show(idx + 1); });
    if (lbClose) lbClose.addEventListener("click", function () { lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lb.classList.remove("open");
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Forms: validate, POST to the admin API, show toast ---------- */
  var toast = document.getElementById("mfToast");
  var showToast = function (msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 3400);
  };

  // Converts a <form> into a plain JSON-friendly object. Repeated fields
  // (e.g. the volunteer "interests" checkboxes) become arrays.
  var formToPayload = function (form) {
    var data = new FormData(form);
    var payload = {};
    data.forEach(function (value, key) {
      if (payload.hasOwnProperty(key)) {
        payload[key] = Array.isArray(payload[key]) ? payload[key].concat(value) : [payload[key], value];
      } else {
        payload[key] = value;
      }
    });
    return payload;
  };

  document.querySelectorAll("form.mf-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var bad = !field.value.trim() ||
          (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value));
        field.classList.toggle("is-error", bad);
        var msg = field.parentElement.querySelector(".mf-error-msg");
        if (msg) msg.style.display = bad ? "block" : "none";
        if (bad) ok = false;
      });
      if (!ok) return;

      var endpoint = form.getAttribute("data-api");
      var successMsg = form.getAttribute("data-success") || "Thank you! We will get back to you soon.";

      if (!endpoint) {
        form.reset();
        showToast(successMsg);
        return;
      }

      var submitBtn = form.querySelector("button[type=submit], button:not([type])");
      var originalBtnHtml = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "Sending…"; }

      // Forms with a file input (e.g. volunteer photo/ID upload) submit as
      // multipart/form-data — leave the Content-Type header unset so the
      // browser adds the correct boundary itself. Everything else submits
      // as JSON, same as before.
      var hasFile = !!form.querySelector('input[type="file"]');
      var apiBase = window.MF_API_BASE || "http://localhost:4000/api";
      fetch(apiBase + endpoint, hasFile
        ? { method: "POST", body: new FormData(form) }
        : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formToPayload(form)) }
      )
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
            form.reset();
            showToast(successMsg);
          });
        })
        .catch(function (err) {
          showToast(err.message || "Couldn't reach the server — please try again shortly.");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnHtml; }
        });
    });
  });

  /* ---------- Broken image fallback ---------- */
  document.querySelectorAll("img[data-fb]").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.dataset.done) return;
      img.dataset.done = "1";
      img.src = img.getAttribute("data-fb");
    });
  });
})();
