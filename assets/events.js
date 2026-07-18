/* ============================================================
   MOONLIT FOUNDATION — events.js (events.html only)
   Fetches published events from the admin API and renders them
   into #mfUpcomingList / #mfPastList, replacing the static sample
   cards already in the HTML. If the API is unreachable (server
   not running, offline), the fetch silently fails and the static
   sample cards stay exactly as they were — the page never breaks.

   Only API-backed events get a working "Register Now" (they have
   a real database id); the static fallback cards keep their
   original link to the general volunteer form.
   ============================================================ */
(function () {
  "use strict";

  var apiBase = window.MF_API_BASE || "http://localhost:4000/api";
  var upcomingList = document.getElementById("mfUpcomingList");
  var pastList = document.getElementById("mfPastList");
  if (!upcomingList || !pastList) return;

  var CATEGORY_STYLE = {
    "Blood Donation": "bg-acc-red",
    "Community Welfare": "bg-acc-green",
    "Disaster Relief": "bg-acc-blue",
    "Environment": "bg-acc-yellow !text-[#0A1F44]",
    "Youth Development": "bg-acc-purple"
  };

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function dateBadge(dateObj) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { d: String(dateObj.getDate()).padStart(2, "0"), m: months[dateObj.getMonth()] };
  }

  function upcomingCardHtml(ev) {
    var d = new Date(ev.eventDate);
    var badge = dateBadge(d);
    var chipClass = CATEGORY_STYLE[ev.category] || "bg-acc-blue";
    var spotsLeft = ev.capacity ? Math.max(ev.capacity - (ev._count ? ev._count.registrations : 0), 0) : null;
    var capacityNote = spotsLeft !== null
      ? '<p class="text-[12px] mt-2 ' + (spotsLeft === 0 ? "text-[#DC2626] font-semibold" : "text-[#4B5563]") + '">' +
        (spotsLeft === 0 ? "Fully booked" : spotsLeft + " spot" + (spotsLeft === 1 ? "" : "s") + " left") + "</p>"
      : "";
    return (
      '<article class="mf-card grid md:grid-cols-[38%_1fr] mf-fade" data-cat="upcoming">' +
      '<div class="relative">' +
      '<img class="w-full h-56 md:h-full object-cover" src="' + esc(ev.imageUrl || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80") + '" alt="' + esc(ev.title) + '">' +
      '<span class="mf-date-badge"><span class="d">' + badge.d + '</span><span class="m">' + badge.m + '</span></span>' +
      "</div>" +
      '<div class="p-7">' +
      '<span class="mf-chip ' + chipClass + ' mb-3 inline-block">' + esc(ev.category) + "</span>" +
      '<h3 class="text-xl mb-2">' + esc(ev.title) + "</h3>" +
      '<p class="text-[13px] flex flex-wrap gap-x-5 gap-y-1 mb-3">' +
      '<span><i class="fa-solid fa-location-dot text-[#F5B921] mr-1.5"></i>' + esc(ev.location) + "</span>" +
      '<span><i class="fa-solid fa-clock text-[#F5B921] mr-1.5"></i>' + esc(ev.startTime) + " – " + esc(ev.endTime) + "</span>" +
      "</p>" +
      '<p class="text-[14px] leading-relaxed mb-2">' + esc(ev.description) + "</p>" +
      capacityNote +
      '<button type="button" class="mf-btn mf-btn-primary mt-3 mf-event-register" data-event-id="' + esc(ev.id) + '" data-event-title="' + esc(ev.title) + '"' +
      (spotsLeft === 0 ? " disabled" : "") +
      ">" + (spotsLeft === 0 ? "Fully Booked" : "Register Now") + ' <i class="fa-solid fa-arrow-right"></i></button>' +
      (ev.photoAlbumUrl ? '<a href="' + esc(ev.photoAlbumUrl) + '" target="_blank" rel="noopener" class="text-[13px] font-semibold ml-3" style="color:var(--mf-blue)"><i class="fa-solid fa-images mr-1"></i>View Photos</a>' : "") +
      "</div>" +
      "</article>"
    );
  }

  function pastCardHtml(ev) {
    var d = new Date(ev.eventDate);
    var monthYear = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    var desc = ev.description.length > 110 ? ev.description.slice(0, 108) + "…" : ev.description;
    var photoLink = ev.photoAlbumUrl ? '<a href="' + esc(ev.photoAlbumUrl) + '" target="_blank" rel="noopener" class="text-[12px] font-semibold" style="color:var(--mf-blue)"><i class="fa-solid fa-images mr-1"></i>View Photos</a>' : "<span></span>";
    return (
      '<article class="mf-card p-3 mf-fade" data-cat="past">' +
      '<div class="relative"><img class="mf-card-img" src="' + esc(ev.imageUrl || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80") + '" alt="' + esc(ev.title) + '"><span class="mf-chip bg-acc-green absolute top-3 right-3">Completed</span></div>' +
      '<div class="p-3"><p class="text-xs text-[#14338C] font-semibold mb-1">' + esc(monthYear) + "</p><h4 class=\"mb-1\">" + esc(ev.title) + "</h4><p class=\"text-[13px] mb-3\">" + esc(desc) + "</p>" +
      '<div class="flex items-center justify-between gap-2 flex-wrap">' + photoLink +
      '<button type="button" class="mf-event-feedback text-[12px] font-semibold" style="color:var(--mf-blue)" data-event-id="' + esc(ev.id) + '" data-event-title="' + esc(ev.title) + '"><i class="fa-solid fa-star mr-1"></i>Give Feedback</button>' +
      "</div></div>" +
      "</article>"
    );
  }

  function emptyState(msg) {
    return '<p class="text-[14px] text-[#4B5563] py-4">' + esc(msg) + "</p>";
  }

  function revealStagger(container) {
    var cards = container.querySelectorAll(".mf-fade");
    cards.forEach(function (el, i) {
      setTimeout(function () { el.classList.add("in-view"); }, i * 90);
    });
  }

  fetch(apiBase + "/events")
    .then(function (res) {
      if (!res.ok) throw new Error("Events request failed");
      return res.json();
    })
    .then(function (body) {
      var events = body.events || [];
      var now = new Date();
      var upcoming = events.filter(function (ev) { return new Date(ev.eventDate) >= now; })
        .sort(function (a, b) { return new Date(a.eventDate) - new Date(b.eventDate); });
      var past = events.filter(function (ev) { return new Date(ev.eventDate) < now; })
        .sort(function (a, b) { return new Date(b.eventDate) - new Date(a.eventDate); });

      upcomingList.innerHTML = upcoming.length
        ? upcoming.map(upcomingCardHtml).join("")
        : emptyState("No upcoming events right now — check back soon, or follow our newsletter below.");
      pastList.innerHTML = past.length
        ? past.map(pastCardHtml).join("")
        : emptyState("No past events on record yet.");

      revealStagger(upcomingList);
      revealStagger(pastList);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    })
    .catch(function () {
      // API unreachable — leave the static sample cards already in the HTML.
    });

  /* ---------- Registration modal (delegated, since cards are re-rendered) ---------- */
  var modal = document.getElementById("mfEventModal");
  var modalForm = document.getElementById("mfEventModalForm");
  var modalTitle = document.getElementById("mfEventModalTitle");
  var modalSub = document.getElementById("mfEventModalSub");
  var modalClose = document.getElementById("mfEventModalClose");
  var toast = document.getElementById("mfToast");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 3400);
  }

  function openModal(eventId, eventTitle) {
    modalForm.dataset.eventId = eventId;
    modalTitle.textContent = "Register — " + eventTitle;
    modalSub.textContent = "We'll email you a confirmation once you submit.";
    modalForm.reset();
    modalForm.querySelectorAll(".is-error").forEach(function (el) { el.classList.remove("is-error"); });
    modal.classList.add("open");
    var firstField = modalForm.querySelector("input");
    if (firstField) firstField.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".mf-event-register");
    if (btn && !btn.disabled) openModal(btn.dataset.eventId, btn.dataset.eventTitle);
  });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      modalForm.querySelectorAll("[required]").forEach(function (field) {
        var bad = !field.value.trim() || (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value));
        field.classList.toggle("is-error", bad);
        var msg = field.parentElement.querySelector(".mf-error-msg");
        if (msg) msg.style.display = bad ? "block" : "none";
        if (bad) ok = false;
      });
      if (!ok) return;

      var eventId = modalForm.dataset.eventId;
      var btn = modalForm.querySelector("button");
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Sending…";

      var data = new FormData(modalForm);
      fetch(apiBase + "/events/" + eventId + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), phone: data.get("phone") })
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok) throw new Error(body.error || "Couldn't register — please try again.");
            closeModal();
            showToast("You're registered! We'll be in touch with details.");
          });
        })
        .catch(function (err) {
          showToast(err.message || "Couldn't reach the server — please try again shortly.");
        })
        .finally(function () {
          btn.disabled = false;
          btn.innerHTML = original;
        });
    });
  }

  /* ---------- Feedback modal (past events only, delegated like the registration modal) ---------- */
  var fbModal = document.getElementById("mfFeedbackModal");
  var fbForm = document.getElementById("mfFeedbackModalForm");
  var fbTitle = document.getElementById("mfFeedbackModalTitle");
  var fbSub = document.getElementById("mfFeedbackModalSub");
  var fbClose = document.getElementById("mfFeedbackModalClose");
  var fbRatingError = document.getElementById("fb-rating-error");

  function openFeedbackModal(eventId, eventTitle) {
    fbForm.dataset.eventId = eventId;
    fbTitle.textContent = "Feedback — " + eventTitle;
    fbSub.textContent = "Tell us how it went — it helps us plan the next one.";
    fbForm.reset();
    fbForm.querySelectorAll(".is-error").forEach(function (el) { el.classList.remove("is-error"); });
    fbRatingError.style.display = "none";
    fbModal.classList.add("open");
  }
  function closeFeedbackModal() { fbModal.classList.remove("open"); }

  document.addEventListener("click", function (e) {
    var fbBtn = e.target.closest(".mf-event-feedback");
    if (fbBtn) openFeedbackModal(fbBtn.dataset.eventId, fbBtn.dataset.eventTitle);
  });
  if (fbClose) fbClose.addEventListener("click", closeFeedbackModal);
  if (fbModal) fbModal.addEventListener("click", function (e) { if (e.target === fbModal) closeFeedbackModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && fbModal && fbModal.classList.contains("open")) closeFeedbackModal();
  });

  if (fbForm) {
    fbForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      fbForm.querySelectorAll("[required]").forEach(function (field) {
        var bad = !field.value.trim() || (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value));
        field.classList.toggle("is-error", bad);
        var msg = field.parentElement.querySelector(".mf-error-msg");
        if (msg) msg.style.display = bad ? "block" : "none";
        if (bad) ok = false;
      });
      var ratingEl = fbForm.querySelector('input[name="rating"]:checked');
      fbRatingError.style.display = ratingEl ? "none" : "block";
      if (!ratingEl) ok = false;
      if (!ok) return;

      var eventId = fbForm.dataset.eventId;
      var btn = fbForm.querySelector("button");
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Sending…";

      var data = new FormData(fbForm);
      fetch(apiBase + "/events/" + eventId + "/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), rating: Number(ratingEl.value), comment: data.get("comment") })
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok) throw new Error(body.error || "Couldn't submit feedback — please try again.");
            closeFeedbackModal();
            showToast("Thanks for your feedback!");
          });
        })
        .catch(function (err) {
          showToast(err.message || "Couldn't reach the server — please try again shortly.");
        })
        .finally(function () {
          btn.disabled = false;
          btn.innerHTML = original;
        });
    });
  }
})();
