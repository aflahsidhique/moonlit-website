/* ============================================================
   MOONLIT FOUNDATION — admin.js
   Drives both admin/index.html (login) and admin/dashboard.html
   (everything else). Plain vanilla JS + fetch, same conventions
   as the public site's assets/main.js — no build step, no
   framework, single JWT stored in localStorage.
   ============================================================ */
(function () {
  "use strict";

  var API = window.MF_API_BASE || "http://localhost:4000/api";
  var AUTH_KEY = "mfAdminAuth";

  function getAuth() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch (e) { return null; }
  }
  function setAuth(auth) { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); }
  function clearAuth() { localStorage.removeItem(AUTH_KEY); }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function apiFetch(path, options) {
    options = options || {};
    var auth = getAuth();
    var headers = { "Content-Type": "application/json" };
    for (var k in options.headers || {}) headers[k] = options.headers[k];
    if (auth && auth.token) headers.Authorization = "Bearer " + auth.token;
    return fetch(API + path, {
      method: options.method || "GET",
      headers: headers,
      body: options.body
    }).then(function (res) {
      if (res.status === 401) {
        clearAuth();
        window.location.href = "/admin/index.html";
        throw new Error("Session expired — please log in again.");
      }
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok) throw new Error(body.error || "Request failed (" + res.status + ").");
        return body;
      });
    });
  }

  /* ================= LOGIN PAGE ================= */
  var loginForm = document.getElementById("mfLoginForm");
  if (loginForm) {
    if (getAuth()) { window.location.href = "/admin/dashboard.html"; return; }
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("l-email").value.trim();
      var password = document.getElementById("l-password").value;
      var errorEl = document.getElementById("mfLoginError");
      errorEl.style.display = "none";
      var btn = loginForm.querySelector("button[type=submit]");
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Signing in…";

      fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok) throw new Error(body.error || "Login failed.");
            setAuth(body);
            window.location.href = "/admin/dashboard.html";
          });
        })
        .catch(function (err) {
          errorEl.textContent = err.message;
          errorEl.style.display = "block";
        })
        .finally(function () {
          btn.disabled = false;
          btn.innerHTML = original;
        });
    });
    return;
  }

  /* ================= DASHBOARD PAGE ================= */
  var content = document.getElementById("mfAdminContent");
  if (!content) return;

  var auth = getAuth();
  if (!auth) { window.location.href = "/admin/index.html"; return; }
  document.getElementById("mfAdminName").textContent = auth.admin.name;
  document.getElementById("mfAdminLogout").addEventListener("click", function () {
    clearAuth();
    window.location.href = "/admin/index.html";
  });

  /* ---------- mobile sidebar (hamburger) ---------- */
  var sidebar = document.getElementById("mfAdminSidebar");
  var sidebarBackdrop = document.getElementById("mfAdminSidebarBackdrop");
  var menuBtn = document.getElementById("mfAdminMenuBtn");
  var sidebarCloseBtn = document.getElementById("mfAdminSidebarClose");
  function setSidebarOpen(open) {
    sidebar.classList.toggle("open", open);
    sidebarBackdrop.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { setSidebarOpen(true); });
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", function () { setSidebarOpen(false); });
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", function () { setSidebarOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("open")) setSidebarOpen(false);
  });

  var toast = document.getElementById("mfToast");
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 3400);
  }
  function handleErr(err) {
    content.innerHTML = '<p class="mf-admin-empty">' + esc(err.message) + "</p>";
  }

  function statusBadge(status) {
    return '<span class="mf-status-badge mf-status-' + status + '">' + esc(status.replace("_", " ")) + "</span>";
  }
  function statusSelect(row, resource, statuses) {
    return (
      '<select class="mf-admin-select-status" data-resource="' + resource + '" data-id="' + row.id + '">' +
      statuses.map(function (s) {
        return '<option value="' + s + '"' + (s === row.status ? " selected" : "") + ">" + s.replace("_", " ") + "</option>";
      }).join("") +
      "</select>"
    );
  }
  function approveRejectButtons(row, resource) {
    var html = "";
    if (row.status === "pending") {
      html += '<button class="mf-admin-btn mf-admin-btn-approve" data-action="approve" data-resource="' + resource + '" data-id="' + row.id + '"><i class="fa-solid fa-check"></i> Approve</button>';
      html += '<button class="mf-admin-btn mf-admin-btn-reject" data-action="reject" data-resource="' + resource + '" data-id="' + row.id + '"><i class="fa-solid fa-xmark"></i> Reject</button>';
    }
    html += '<button class="mf-admin-btn mf-admin-btn-danger" data-action="delete" data-resource="' + resource + '" data-id="' + row.id + '"><i class="fa-solid fa-trash"></i></button>';
    return html;
  }
  function deleteButton(row, resource) {
    return '<button class="mf-admin-btn mf-admin-btn-danger" data-action="delete" data-resource="' + resource + '" data-id="' + row.id + '"><i class="fa-solid fa-trash"></i></button>';
  }
  // Volunteer approve/resend responses include a volunteerId + notifications
  // {email, sms} pair — surface delivery failures instead of a bare "Updated."
  function approvalToastMessage(body) {
    if (!body || !body.volunteer || !body.notifications) return "Updated.";
    var n = body.notifications, failed = [];
    if (n.email && n.email !== "sent") failed.push("email " + n.email);
    if (n.sms && n.sms !== "sent") failed.push("SMS " + n.sms);
    var base = "Approved — ID " + body.volunteer.volunteerId + ".";
    return failed.length ? base + " " + failed.join("; ") : base + " Email + SMS sent.";
  }

  // cardConfig(row) is optional — when given, it returns { photo, icon,
  // title, subtitle, badge, action, id } describing a compact mobile card
  // (photo/icon + name + id only) that replaces the table below 900px.
  // Tapping the card reuses the same data-action delegation as the
  // table's own buttons, so it opens whatever detail modal already exists.
  function renderTable(rows, columns, cardConfig) {
    if (!rows.length) return '<p class="mf-admin-empty">Nothing here yet.</p>';
    var thead = "<tr>" + columns.map(function (c) { return "<th>" + esc(c.label) + "</th>"; }).join("") + "</tr>";
    var tbody = rows.map(function (row) {
      return "<tr>" + columns.map(function (c) {
        return '<td class="' + (c.cls || "") + '">' + c.render(row) + "</td>";
      }).join("") + "</tr>";
    }).join("");
    var tableHtml = '<div class="mf-admin-table-wrap' + (cardConfig ? " mf-has-cards" : "") + '"><table class="mf-admin-table"><thead>' + thead + "</thead><tbody>" + tbody + "</tbody></table></div>";

    if (!cardConfig) return tableHtml;

    // Reuse the table's own "Actions" column for the card footer, so
    // mobile cards never drift out of sync with what the desktop row offers.
    var actionsCol = columns.filter(function (c) { return c.cls === "mf-admin-actions"; })[0];

    var cardsHtml = '<div class="mf-admin-card-grid">' + rows.map(function (row) {
      var c = cardConfig(row);
      return (
        '<div class="mf-admin-card" data-action="' + esc(c.action) + '" data-id="' + esc(c.id) + '">' +
        (c.photo
          ? '<img class="mf-admin-card-photo" src="' + esc(c.photo) + '" alt="">'
          : '<div class="mf-admin-card-photo mf-admin-card-photo-ph"><i class="fa-solid fa-' + esc(c.icon || "user") + '"></i></div>') +
        '<p class="mf-admin-card-title">' + esc(c.title) + "</p>" +
        (c.subtitle ? '<p class="mf-admin-card-subtitle">' + esc(c.subtitle) + "</p>" : "") +
        (c.badge || "") +
        (actionsCol ? '<div class="mf-admin-card-actions">' + actionsCol.render(row) + "</div>" : "") +
        "</div>"
      );
    }).join("") + "</div>";

    return tableHtml + cardsHtml;
  }

  /* ---------- section registry + nav ---------- */
  var currentSection = "overview";
  var SECTIONS = {
    overview: { title: "Overview", subtitle: "A snapshot of everything coming through the site.", render: renderOverview },
    volunteers: { title: "Volunteers", subtitle: "Review and approve volunteer registrations.", render: renderVolunteers },
    blood: { title: "Blood Requests", subtitle: "Track requests through to fulfilment.", render: renderBloodRequests },
    partners: { title: "Partner Inquiries", subtitle: "CSR, campus and NGO partnership requests.", render: renderPartners },
    messages: { title: "Contact Messages", subtitle: "General enquiries from the contact form.", render: renderMessages },
    newsletter: { title: "Newsletter Subscribers", subtitle: "Everyone who's signed up from the footer form.", render: renderNewsletter },
    events: { title: "Events", subtitle: "Create, publish and manage events shown on the public site.", render: renderEvents },
    registrations: { title: "Event Registrations", subtitle: "Everyone registered across every event.", render: renderRegistrations },
    checkin: { title: "Check-in Scanner", subtitle: "Scan a volunteer's ID-card QR code to mark them present and credit hours.", render: renderCheckin },
    feedback: { title: "Event Feedback", subtitle: "Ratings and comments left on past events.", render: renderEventFeedback },
    notifications: { title: "Notifications", subtitle: "Broadcast to every volunteer, or message one directly.", render: renderNotifications }
  };

  var newEventBtn = document.getElementById("mfNewEventBtn");
  var newNotifBtn = document.getElementById("mfNewNotifBtn");

  function switchSection(name) {
    stopScanner();
    currentSection = name;
    document.querySelectorAll(".mf-admin-nav-link").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.section === name);
    });
    var s = SECTIONS[name];
    document.getElementById("mfSectionTitle").textContent = s.title;
    document.getElementById("mfSectionSubtitle").textContent = s.subtitle;
    newEventBtn.style.display = name === "events" ? "inline-flex" : "none";
    newNotifBtn.style.display = name === "notifications" ? "inline-flex" : "none";
    content.innerHTML = '<p class="mf-admin-empty">Loading…</p>';
    s.render();
  }
  document.querySelectorAll(".mf-admin-nav-link").forEach(function (el) {
    el.addEventListener("click", function () { switchSection(el.dataset.section); setSidebarOpen(false); });
  });

  function updateNavCounts(counts) {
    Object.keys(counts).forEach(function (k) {
      var el = document.querySelector('[data-count-for="' + k + '"]');
      if (!el) return;
      el.textContent = counts[k];
      el.style.display = counts[k] > 0 ? "inline-block" : "none";
    });
  }

  /* ---------- delegated row actions (approve/reject/delete/status-select) ---------- */
  content.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.dataset.action, resource = btn.dataset.resource, id = btn.dataset.id;

    if (action === "delete") {
      if (!window.confirm("Delete this entry? This can't be undone.")) return;
      apiFetch("/" + resource + "/" + id, { method: "DELETE" })
        .then(function () { showToast("Deleted."); SECTIONS[currentSection].render(); })
        .catch(function (err) { showToast(err.message); });
      return;
    }
    if (action === "approve" || action === "reject") {
      apiFetch("/" + resource + "/" + id, { method: "PATCH", body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }) })
        .then(function (body) { showToast(approvalToastMessage(body)); SECTIONS[currentSection].render(); })
        .catch(function (err) { showToast(err.message); });
      return;
    }
    if (action === "resend-credentials") {
      if (!window.confirm("Generate a new password and resend the volunteer's ID + password by email/SMS? Their old password will stop working.")) return;
      apiFetch("/volunteers/" + id + "/resend-credentials", { method: "POST" })
        .then(function (body) { showToast(approvalToastMessage(body)); })
        .catch(function (err) { showToast(err.message); });
      return;
    }
    if (action === "view-volunteer") { openVolunteerDetail(id); return; }
    if (action === "view-blood") { openBloodDetail(id); return; }
    if (action === "edit-event") { openEventForm(id); return; }
    if (action === "toggle-publish") {
      apiFetch("/events/" + id + "/status", { method: "PATCH", body: JSON.stringify({ status: btn.dataset.next }) })
        .then(function () { showToast("Event updated."); renderEvents(); })
        .catch(function (err) { showToast(err.message); });
      return;
    }
    if (action === "toggle-certificate") {
      var issued = btn.dataset.issued === "1";
      apiFetch("/attendance/" + id + "/certificate", { method: "PATCH", body: JSON.stringify({ issued: issued }) })
        .then(function () { showToast(issued ? "Certificate issued." : "Certificate revoked."); loadCheckinList(scannerEventId); })
        .catch(function (err) { showToast(err.message); });
    }
  });
  content.addEventListener("change", function (e) {
    var sel = e.target.closest(".mf-admin-select-status");
    if (!sel) return;
    apiFetch("/" + sel.dataset.resource + "/" + sel.dataset.id, { method: "PATCH", body: JSON.stringify({ status: sel.value }) })
      .then(function () { showToast("Status updated."); if (currentSection === "overview") renderOverview(); })
      .catch(function (err) { showToast(err.message); SECTIONS[currentSection].render(); });
  });

  /* ---------- overview ---------- */
  function renderOverview() {
    Promise.all([
      apiFetch("/volunteers?status=pending"),
      apiFetch("/blood-requests?status=pending"),
      apiFetch("/partners?status=pending"),
      apiFetch("/contact?status=unread"),
      apiFetch("/newsletter"),
      apiFetch("/events/admin"),
      apiFetch("/event-registrations?status=pending")
    ]).then(function (r) {
      updateNavCounts({ volunteers: r[0].volunteers.length, blood: r[1].bloodRequests.length, partners: r[2].partners.length, messages: r[3].messages.length });
      var cards = [
        { n: r[0].volunteers.length, label: "Pending Volunteers", section: "volunteers" },
        { n: r[1].bloodRequests.length, label: "Pending Blood Requests", section: "blood" },
        { n: r[2].partners.length, label: "Pending Partner Inquiries", section: "partners" },
        { n: r[3].messages.length, label: "Unread Messages", section: "messages" },
        { n: r[4].subscribers.length, label: "Newsletter Subscribers", section: "newsletter" },
        { n: r[5].events.filter(function (e) { return e.status === "published"; }).length, label: "Published Events", section: "events" },
        { n: r[6].registrations.length, label: "Pending Event Registrations", section: "registrations" }
      ];
      content.innerHTML = '<div class="mf-admin-stats-row">' + cards.map(function (c) {
        return '<div class="mf-admin-stat-card" style="cursor:pointer" data-goto="' + c.section + '"><p class="mf-admin-stat-num">' + c.n + '</p><p class="mf-admin-stat-label">' + esc(c.label) + "</p></div>";
      }).join("") + "</div>";
      content.querySelectorAll("[data-goto]").forEach(function (el) {
        el.addEventListener("click", function () { switchSection(el.dataset.goto); });
      });
    }).catch(handleErr);
  }

  /* ---------- volunteers ---------- */
  var volunteersCache = {};
  function renderVolunteers() {
    apiFetch("/volunteers").then(function (body) {
      volunteersCache = {};
      body.volunteers.forEach(function (v) { volunteersCache[v.id] = v; });
      updateNavCounts({ volunteers: body.volunteers.filter(function (v) { return v.status === "pending"; }).length });
      content.innerHTML = renderTable(body.volunteers, [
        { label: "Volunteer", render: function (v) {
          return "<strong>" + esc(v.fullName) + "</strong>" + (v.volunteerId ? " <span class='text-xs text-[#4B5563]'>(" + esc(v.volunteerId) + ")</span>" : "") +
            "<br><span class='text-xs text-[#4B5563]'>" + esc(v.district) + "</span>";
        } },
        { label: "Contact", render: function (v) { return esc(v.mobile) + "<br>" + esc(v.email); } },
        { label: "Blood", render: function (v) { return v.bloodGroup ? esc(v.bloodGroup) + (v.isBloodDonor ? " · Donor" : "") : "<span class='text-[#9CA3AF]'>—</span>"; } },
        { label: "Submitted", render: function (v) { return fmtDate(v.createdAt); } },
        { label: "Status", render: function (v) { return statusBadge(v.status); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (v) {
          var resend = v.status === "approved" ? '<button class="mf-admin-btn mf-admin-btn-neutral" data-action="resend-credentials" data-id="' + v.id + '"><i class="fa-solid fa-paper-plane"></i> Resend Credentials</button>' : "";
          return '<button class="mf-admin-btn mf-admin-btn-neutral" data-action="view-volunteer" data-id="' + v.id + '"><i class="fa-solid fa-eye"></i> View</button>' + resend + approveRejectButtons(v, "volunteers");
        } }
      ], function (v) {
        return {
          photo: v.photoUrl ? resolveFileUrl(v.photoUrl) : null,
          icon: "user",
          title: v.fullName,
          subtitle: v.volunteerId || "Pending",
          badge: statusBadge(v.status),
          action: "view-volunteer",
          id: v.id
        };
      });
    }).catch(handleErr);
  }

  var volunteerDetailBackdrop = document.getElementById("mfVolunteerDetailBackdrop");
  var volunteerDetailBody = document.getElementById("mfVolunteerDetailBody");
  // Cloudinary URLs are already absolute; anything else (legacy local
  // uploads, pre-Cloudinary) is treated as relative to the API origin.
  function resolveFileUrl(url) {
    return /^https?:\/\//.test(url) ? url : API.replace(/\/api$/, "") + url;
  }
  function fileLink(url, label) {
    if (!url) return "<span class='text-[#9CA3AF]'>Not provided</span>";
    return '<a class="mf-vd-file-link" href="' + esc(resolveFileUrl(url)) + '" target="_blank" rel="noopener">' + esc(label) + " <i class='fa-solid fa-up-right-from-square text-[11px]'></i></a>";
  }
  function chipList(csv) {
    var items = (csv || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!items.length) return "<span class='text-[#9CA3AF]'>None selected</span>";
    return items.map(function (i) { return '<span class="mf-vd-chip">' + esc(i) + "</span>"; }).join("");
  }
  function openVolunteerDetail(id) {
    var v = volunteersCache[id];
    if (!v) return;
    volunteerDetailBody.innerHTML =
      '<div class="mf-vd-header">' +
      (v.photoUrl ? '<img class="mf-vd-photo" src="' + esc(resolveFileUrl(v.photoUrl)) + '" alt="">' : '<div class="mf-vd-photo flex items-center justify-center text-[#9CA3AF]"><i class="fa-solid fa-user"></i></div>') +
      '<div><p class="text-lg font-bold">' + esc(v.fullName) + (v.volunteerId ? ' <span class="text-sm font-normal text-[#4B5563]">(' + esc(v.volunteerId) + ')</span>' : "") + "</p>" +
      "<p class='mt-1'>" + statusBadge(v.status) + "</p></div></div>" +

      '<p class="mf-vd-section">Personal Details</p>' +
      '<dl class="mf-vd-grid">' +
      "<div><dt>Date of Birth</dt><dd>" + fmtDate(v.dob) + "</dd></div>" +
      "<div><dt>Gender</dt><dd>" + esc(v.gender) + "</dd></div>" +
      "<div><dt>Aadhaar</dt><dd>" + esc(v.aadhaar || "—") + "</dd></div>" +
      "<div><dt>Mobile</dt><dd>" + esc(v.mobile) + "</dd></div>" +
      "<div><dt>WhatsApp</dt><dd>" + esc(v.whatsapp || "—") + "</dd></div>" +
      "<div><dt>Email</dt><dd>" + esc(v.email) + "</dd></div>" +
      "<div><dt>Photo</dt><dd>" + fileLink(v.photoUrl, "View photo") + "</dd></div>" +
      "</dl>" +

      '<p class="mf-vd-section">Address</p>' +
      '<dl class="mf-vd-grid">' +
      "<div><dt>House / Street</dt><dd>" + esc(v.address) + "</dd></div>" +
      "<div><dt>State</dt><dd>" + esc(v.state) + "</dd></div>" +
      "<div><dt>District</dt><dd>" + esc(v.district) + "</dd></div>" +
      "<div><dt>Taluk</dt><dd>" + esc(v.taluk) + "</dd></div>" +
      "<div><dt>Panchayat</dt><dd>" + esc(v.panchayat) + "</dd></div>" +
      "<div><dt>Ward</dt><dd>" + esc(v.ward) + "</dd></div>" +
      "<div><dt>PIN</dt><dd>" + esc(v.pin) + "</dd></div>" +
      "</dl>" +

      '<p class="mf-vd-section">Emergency Contact</p>' +
      '<dl class="mf-vd-grid">' +
      "<div><dt>Name</dt><dd>" + esc(v.emergencyName) + "</dd></div>" +
      "<div><dt>Relationship</dt><dd>" + esc(v.emergencyRelationship) + "</dd></div>" +
      "<div><dt>Phone</dt><dd>" + esc(v.emergencyPhone) + "</dd></div>" +
      "</dl>" +

      '<p class="mf-vd-section">Skills</p>' + chipList(v.skills) +
      '<p class="mf-vd-section">Available Time</p>' + chipList(v.availableTime) +

      '<p class="mf-vd-section">Blood Donation</p>' +
      '<dl class="mf-vd-grid">' +
      "<div><dt>Blood Group</dt><dd>" + esc(v.bloodGroup || "—") + "</dd></div>" +
      "<div><dt>Donor?</dt><dd>" + (v.isBloodDonor ? "Yes" : "No") + "</dd></div>" +
      "<div><dt>Availability</dt><dd>" + (v.bloodDonationAvailable ? "Available" : "Unavailable") + "</dd></div>" +
      "<div><dt>Eligible Now?</dt><dd>" + (v.eligible ? "Yes" : "No") + "</dd></div>" +
      "<div><dt>Donations Logged</dt><dd>" + (v.donationCount || 0) + "</dd></div>" +
      "<div><dt>Last Donation</dt><dd>" + (v.lastDonationDate ? fmtDate(v.lastDonationDate) : "—") + "</dd></div>" +
      "<div><dt>Next Eligible</dt><dd>" + (v.nextEligibleDate ? fmtDate(v.nextEligibleDate) : "—") + "</dd></div>" +
      "<div><dt>Weight</dt><dd>" + (v.weight ? v.weight + " kg" : "—") + "</dd></div>" +
      "</dl>" +
      (v.bloodDonations && v.bloodDonations.length
        ? '<p class="mf-vd-section">Donation History</p>' + v.bloodDonations.map(function (d) {
            return "<p class='text-[13px]'>" + fmtDate(d.donationDate) + (d.location ? " — " + esc(d.location) : "") + "</p>";
          }).join("")
        : "") +
      (v.medicalConditions ? '<p class="mf-vd-section">Medical Conditions</p><p class="text-[13px]">' + esc(v.medicalConditions) + "</p>" : "") +

      '<p class="mf-vd-section">Social Media</p>' +
      '<dl class="mf-vd-grid">' +
      "<div><dt>Instagram</dt><dd>" + esc(v.instagram || "—") + "</dd></div>" +
      "<div><dt>Facebook</dt><dd>" + esc(v.facebook || "—") + "</dd></div>" +
      "<div><dt>LinkedIn</dt><dd>" + esc(v.linkedin || "—") + "</dd></div>" +
      "</dl>" +

      '<p class="mf-vd-section">ID Verification</p>' +
      '<dl class="mf-vd-grid">' +
      "<div><dt>ID Type</dt><dd>" + esc(v.idType || "—") + "</dd></div>" +
      "<div><dt>Document</dt><dd>" + fileLink(v.idUploadUrl, "View document") + "</dd></div>" +
      "</dl>" +

      (v.message ? '<p class="mf-vd-section">Message</p><p class="text-[13px]">' + esc(v.message) + "</p>" : "");

    volunteerDetailBackdrop.classList.add("open");
  }
  document.getElementById("mfVolunteerDetailClose").addEventListener("click", function () { volunteerDetailBackdrop.classList.remove("open"); });
  volunteerDetailBackdrop.addEventListener("click", function (e) { if (e.target === volunteerDetailBackdrop) volunteerDetailBackdrop.classList.remove("open"); });

  /* ---------- blood requests ---------- */
  var bloodRequestsCache = {};
  var RESPONSE_STATUSES = ["notified", "accepted", "declined", "unavailable", "reached_hospital", "completed"];

  function renderBloodRequests() {
    apiFetch("/blood-requests").then(function (body) {
      bloodRequestsCache = {};
      body.bloodRequests.forEach(function (b) { bloodRequestsCache[b.id] = b; });
      updateNavCounts({ blood: body.bloodRequests.filter(function (b) { return b.status === "pending"; }).length });
      content.innerHTML = renderTable(body.bloodRequests, [
        { label: "Patient", render: function (b) { return "<strong>" + esc(b.patientName) + "</strong><br><span class='text-xs'>" + esc(b.bloodGroup) + " · " + b.units + " unit(s) · " + esc(b.urgency) + "</span>"; } },
        { label: "Hospital / District", render: function (b) { return esc(b.hospital) + "<br><span class='text-xs text-[#4B5563]'>" + esc(b.district) + " · " + esc(b.location) + "</span>"; } },
        { label: "Contact", render: function (b) { return esc(b.phone) + (b.doctorName ? "<br><span class='text-xs text-[#4B5563]'>Dr. " + esc(b.doctorName) + "</span>" : ""); } },
        { label: "Notified", render: function (b) { return b._count.responses + " volunteer(s)"; } },
        { label: "Submitted", render: function (b) { return fmtDate(b.createdAt); } },
        { label: "Status", render: function (b) { return statusBadge(b.status); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (b) {
          return '<button class="mf-admin-btn mf-admin-btn-neutral" data-action="view-blood" data-id="' + b.id + '"><i class="fa-solid fa-eye"></i> View</button>' + deleteButton(b, "blood-requests");
        } }
      ], function (b) {
        return {
          photo: null,
          icon: "droplet",
          title: b.patientName,
          subtitle: b.bloodGroup + " · " + b.units + " unit(s)",
          badge: statusBadge(b.status),
          action: "view-blood",
          id: b.id
        };
      });
    }).catch(handleErr);
  }

  function bloodDocLinks(csv) {
    var urls = (csv || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!urls.length) return "<span class='text-[#9CA3AF]'>None uploaded</span>";
    return urls.map(function (u, i) { return fileLink(u, "Document " + (i + 1)); }).join("<br>");
  }

  function renderBloodResponsesTable(responses) {
    if (!responses.length) return "<p class='text-[13px] text-[#9CA3AF]'>No volunteers notified yet.</p>";
    return renderTable(responses, [
      { label: "Volunteer", render: function (r) { return "<strong>" + esc(r.volunteer.fullName) + "</strong><br><span class='text-xs text-[#4B5563]'>" + esc(r.volunteer.volunteerId) + " · " + esc(r.volunteer.bloodGroup || "—") + "</span>"; } },
      { label: "Contact", render: function (r) { return esc(r.volunteer.mobile); } },
      { label: "Response", render: function (r) { return r.response ? esc(r.response.replace(/_/g, " ")) : "<span class='text-[#9CA3AF]'>Awaiting</span>"; } },
      { label: "Status", render: function (r) {
        return '<select class="mf-admin-select-status mf-blood-response-status" data-response-id="' + r.id + '">' +
          RESPONSE_STATUSES.map(function (s) { return '<option value="' + s + '"' + (s === r.status ? " selected" : "") + ">" + s.replace(/_/g, " ") + "</option>"; }).join("") +
          "</select>";
      } }
    ]);
  }

  function loadBloodResponses(id) {
    var wrap = document.getElementById("mfBloodResponsesWrap");
    if (!wrap) return;
    apiFetch("/blood-requests/" + id + "/responses").then(function (body) {
      wrap.innerHTML = renderBloodResponsesTable(body.responses);
    }).catch(function (err) { wrap.innerHTML = "<p class='text-[13px]'>" + esc(err.message) + "</p>"; });
  }

  var bloodDetailBackdrop = document.getElementById("mfBloodDetailBackdrop");
  var bloodDetailBody = document.getElementById("mfBloodDetailBody");

  function openBloodDetail(id) {
    var b = bloodRequestsCache[id];
    if (!b) return;
    var canNotify = b.status === "approved";

    bloodDetailBody.innerHTML =
      '<div class="mf-vd-header"><div><p class="text-lg font-bold">' + esc(b.patientName) + '</p><p class="mt-1">' + statusBadge(b.status) + "</p></div></div>" +

      '<p class="mf-vd-section">Request Details</p><dl class="mf-vd-grid">' +
      "<div><dt>Blood Group</dt><dd>" + esc(b.bloodGroup) + "</dd></div>" +
      "<div><dt>Units Needed</dt><dd>" + b.units + "</dd></div>" +
      "<div><dt>Emergency Level</dt><dd>" + esc(b.urgency) + "</dd></div>" +
      "<div><dt>Hospital</dt><dd>" + esc(b.hospital) + "</dd></div>" +
      "<div><dt>District</dt><dd>" + esc(b.district) + "</dd></div>" +
      "<div><dt>Location</dt><dd>" + esc(b.location) + "</dd></div>" +
      "<div><dt>Doctor</dt><dd>" + esc(b.doctorName || "—") + "</dd></div>" +
      "<div><dt>Contact Number</dt><dd>" + esc(b.phone) + "</dd></div>" +
      "<div><dt>Submitted</dt><dd>" + fmtDate(b.createdAt) + "</dd></div>" +
      "</dl>" +

      '<p class="mf-vd-section">Documents</p>' + bloodDocLinks(b.documentUrls) +

      '<p class="mf-vd-section">Admin Note</p>' +
      '<textarea class="mf-input" id="mfBloodNote" rows="2" placeholder="Optional note — e.g. what info is missing">' + esc(b.adminNote || "") + "</textarea>" +

      '<div class="flex flex-wrap gap-2 mt-3">' +
      '<button class="mf-admin-btn mf-admin-btn-approve" data-action="blood-status" data-status="approved" data-id="' + b.id + '"><i class="fa-solid fa-check"></i> Approve</button>' +
      '<button class="mf-admin-btn mf-admin-btn-neutral" data-action="blood-status" data-status="needs_info" data-id="' + b.id + '"><i class="fa-solid fa-circle-question"></i> Need More Info</button>' +
      '<button class="mf-admin-btn mf-admin-btn-reject" data-action="blood-status" data-status="rejected" data-id="' + b.id + '"><i class="fa-solid fa-xmark"></i> Reject</button>' +
      (b.status === "approved" ? '<button class="mf-admin-btn mf-admin-btn-neutral" data-action="blood-status" data-status="closed" data-id="' + b.id + '"><i class="fa-solid fa-box-archive"></i> Close</button>' : "") +
      "</div>" +

      '<p class="mf-vd-section">Notify Volunteers</p>' +
      (canNotify
        ? '<div class="flex flex-wrap items-end gap-2">' +
          '<div><label class="mf-label" for="mfNotifyStrategy">Target</label><select class="mf-input" id="mfNotifyStrategy">' +
          '<option value="all">All blood-donor volunteers</option>' +
          "<option value=\"blood_group\">Only " + esc(b.bloodGroup) + " donors</option>" +
          '<option value="nearby">Nearby (within radius)</option>' +
          "</select></div>" +
          '<div id="mfNotifyRadiusWrap" style="display:none"><label class="mf-label" for="mfNotifyRadius">Radius</label><select class="mf-input" id="mfNotifyRadius"><option value="20">20 km</option><option value="50">50 km</option><option value="100">100 km</option></select></div>' +
          '<button class="mf-btn mf-btn-primary" data-action="blood-notify" data-id="' + b.id + '"><i class="fa-solid fa-paper-plane"></i> Notify</button>' +
          "</div>"
        : "<p class='text-[13px] text-[#9CA3AF]'>Approve the request first to notify volunteers.</p>") +

      '<p class="mf-vd-section">Response Pipeline</p>' +
      '<div id="mfBloodResponsesWrap"><p class="text-[13px] text-[#9CA3AF]">Loading…</p></div>';

    bloodDetailBackdrop.classList.add("open");

    var strategySelect = document.getElementById("mfNotifyStrategy");
    if (strategySelect) {
      strategySelect.addEventListener("change", function () {
        document.getElementById("mfNotifyRadiusWrap").style.display = strategySelect.value === "nearby" ? "block" : "none";
      });
    }
    loadBloodResponses(id);
  }

  document.getElementById("mfBloodDetailClose").addEventListener("click", function () { bloodDetailBackdrop.classList.remove("open"); });
  bloodDetailBackdrop.addEventListener("click", function (e) {
    if (e.target === bloodDetailBackdrop) { bloodDetailBackdrop.classList.remove("open"); return; }
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.dataset.action, id = btn.dataset.id;

    if (action === "blood-status") {
      var note = document.getElementById("mfBloodNote").value.trim();
      apiFetch("/blood-requests/" + id, { method: "PATCH", body: JSON.stringify({ status: btn.dataset.status, adminNote: note }) })
        .then(function (body) {
          bloodRequestsCache[id] = Object.assign({}, bloodRequestsCache[id], body.bloodRequest);
          showToast("Blood request " + body.bloodRequest.status.replace("_", " ") + ".");
          openBloodDetail(id);
          if (currentSection === "blood") renderBloodRequests();
        })
        .catch(function (err) { showToast(err.message); });
      return;
    }
    if (action === "blood-notify") {
      var strategy = document.getElementById("mfNotifyStrategy").value;
      var payload = { strategy: strategy };
      if (strategy === "nearby") payload.radiusKm = Number(document.getElementById("mfNotifyRadius").value);
      btn.disabled = true;
      apiFetch("/blood-requests/" + id + "/notify", { method: "POST", body: JSON.stringify(payload) })
        .then(function (body) {
          var s = body.summary;
          showToast("Notified " + s.targeted + " volunteer(s) — SMS " + s.sms.sent + "/" + (s.sms.sent + s.sms.failed) + ", Email " + s.email.sent + "/" + (s.email.sent + s.email.failed) + ".");
          loadBloodResponses(id);
        })
        .catch(function (err) { showToast(err.message); })
        .finally(function () { btn.disabled = false; });
    }
  });
  bloodDetailBackdrop.addEventListener("change", function (e) {
    var sel = e.target.closest(".mf-blood-response-status");
    if (!sel) return;
    apiFetch("/blood-requests/responses/" + sel.dataset.responseId, { method: "PATCH", body: JSON.stringify({ status: sel.value }) })
      .then(function () { showToast("Response updated."); })
      .catch(function (err) { showToast(err.message); });
  });

  /* ---------- partners ---------- */
  function renderPartners() {
    apiFetch("/partners").then(function (body) {
      updateNavCounts({ partners: body.partners.filter(function (p) { return p.status === "pending"; }).length });
      content.innerHTML = renderTable(body.partners, [
        { label: "Organization", render: function (p) { return "<strong>" + esc(p.organization) + "</strong>"; } },
        { label: "Contact", render: function (p) { return esc(p.contactPerson) + "<br>" + esc(p.email); } },
        { label: "Message", render: function (p) { return esc(p.message); } },
        { label: "Submitted", render: function (p) { return fmtDate(p.createdAt); } },
        { label: "Status", render: function (p) { return statusBadge(p.status); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (p) { return approveRejectButtons(p, "partners"); } }
      ]);
    }).catch(handleErr);
  }

  /* ---------- contact messages ---------- */
  function renderMessages() {
    apiFetch("/contact").then(function (body) {
      updateNavCounts({ messages: body.messages.filter(function (m) { return m.status === "unread"; }).length });
      content.innerHTML = renderTable(body.messages, [
        { label: "From", render: function (m) { return "<strong>" + esc(m.name) + "</strong><br><span class='text-xs text-[#4B5563]'>" + esc(m.email) + "</span>"; } },
        { label: "Subject", render: function (m) { return esc(m.subject); } },
        { label: "Message", render: function (m) { return esc(m.message); } },
        { label: "Submitted", render: function (m) { return fmtDate(m.createdAt); } },
        { label: "Status", render: function (m) { return statusSelect(m, "contact", ["unread", "read", "replied"]); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (m) { return deleteButton(m, "contact"); } }
      ]);
    }).catch(handleErr);
  }

  /* ---------- newsletter ---------- */
  function renderNewsletter() {
    apiFetch("/newsletter").then(function (body) {
      content.innerHTML = renderTable(body.subscribers, [
        { label: "Email", render: function (s) { return esc(s.email); } },
        { label: "Subscribed", render: function (s) { return fmtDate(s.createdAt); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (s) { return deleteButton(s, "newsletter"); } }
      ]);
    }).catch(handleErr);
  }

  /* ---------- events ---------- */
  function renderEvents() {
    apiFetch("/events/admin").then(function (body) {
      content.innerHTML = renderTable(body.events, [
        { label: "Title", render: function (ev) { return "<strong>" + esc(ev.title) + "</strong><br><span class='text-xs text-[#4B5563]'>" + esc(ev.category) + "</span>"; } },
        { label: "When", render: function (ev) { return fmtDate(ev.eventDate) + "<br><span class='text-xs text-[#4B5563]'>" + esc(ev.startTime) + " – " + esc(ev.endTime) + "</span>"; } },
        { label: "Location", render: function (ev) { return esc(ev.location); } },
        { label: "Registrations", render: function (ev) { return ev._count.registrations + (ev.capacity ? " / " + ev.capacity : ""); } },
        { label: "Status", render: function (ev) { return statusBadge(ev.status); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (ev) {
          var next = ev.status === "published" ? "draft" : "published";
          var label = ev.status === "published" ? "Unpublish" : "Publish";
          return (
            '<button class="mf-admin-btn mf-admin-btn-neutral" data-action="edit-event" data-id="' + ev.id + '"><i class="fa-solid fa-pen"></i> Edit</button>' +
            '<button class="mf-admin-btn mf-admin-btn-approve" data-action="toggle-publish" data-id="' + ev.id + '" data-next="' + next + '"><i class="fa-solid fa-bullhorn"></i> ' + label + "</button>" +
            deleteButton(ev, "events")
          );
        } }
      ], function (ev) {
        return {
          photo: ev.imageUrl || null,
          icon: "calendar-days",
          title: ev.title,
          subtitle: fmtDate(ev.eventDate),
          badge: statusBadge(ev.status),
          action: "edit-event",
          id: ev.id
        };
      });
    }).catch(handleErr);
  }

  /* ---------- event registrations (flat, across all events) ---------- */
  function renderRegistrations() {
    apiFetch("/event-registrations").then(function (body) {
      content.innerHTML = renderTable(body.registrations, [
        { label: "Event", render: function (r) { return esc(r.event.title) + "<br><span class='text-xs text-[#4B5563]'>" + fmtDate(r.event.eventDate) + "</span>"; } },
        { label: "Registrant", render: function (r) { return "<strong>" + esc(r.name) + "</strong><br><span class='text-xs'>" + esc(r.email) + "</span>"; } },
        { label: "Phone", render: function (r) { return esc(r.phone); } },
        { label: "Submitted", render: function (r) { return fmtDate(r.createdAt); } },
        { label: "Status", render: function (r) { return statusSelect(r, "event-registrations", ["pending", "confirmed", "cancelled"]); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (r) { return deleteButton(r, "event-registrations"); } }
      ]);
    }).catch(handleErr);
  }

  /* ---------- event create/edit modal ---------- */
  var eventBackdrop = document.getElementById("mfEventFormBackdrop");
  var eventForm = document.getElementById("mfEventForm");
  var eventFormError = document.getElementById("mfEventFormError");
  var eventsCache = null;

  function openEventForm(id) {
    eventForm.reset();
    eventFormError.style.display = "none";
    document.getElementById("ef-id").value = id || "";
    document.getElementById("mfEventFormTitle").textContent = id ? "Edit Event" : "New Event";

    var fill = function (ev) {
      document.getElementById("ef-title").value = ev.title;
      document.getElementById("ef-category").value = ev.category;
      document.getElementById("ef-status").value = ev.status;
      document.getElementById("ef-description").value = ev.description;
      document.getElementById("ef-location").value = ev.location;
      document.getElementById("ef-date").value = new Date(ev.eventDate).toISOString().slice(0, 10);
      document.getElementById("ef-capacity").value = ev.capacity || "";
      document.getElementById("ef-start").value = ev.startTime;
      document.getElementById("ef-end").value = ev.endTime;
      document.getElementById("ef-duration").value = ev.durationHours || "";
      document.getElementById("ef-image").value = ev.imageUrl || "";
      document.getElementById("ef-album").value = ev.photoAlbumUrl || "";
    };

    if (id) {
      var cached = eventsCache && eventsCache.find(function (e) { return e.id === id; });
      if (cached) fill(cached);
      else apiFetch("/events/admin").then(function (body) { eventsCache = body.events; fill(body.events.find(function (e) { return e.id === id; })); });
    }
    eventBackdrop.classList.add("open");
  }
  function closeEventForm() { eventBackdrop.classList.remove("open"); }

  newEventBtn.addEventListener("click", function () { openEventForm(null); });
  document.getElementById("mfEventFormClose").addEventListener("click", closeEventForm);
  document.getElementById("mfEventFormCancel").addEventListener("click", closeEventForm);
  eventBackdrop.addEventListener("click", function (e) { if (e.target === eventBackdrop) closeEventForm(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (eventBackdrop.classList.contains("open")) closeEventForm();
    if (volunteerDetailBackdrop.classList.contains("open")) volunteerDetailBackdrop.classList.remove("open");
    if (bloodDetailBackdrop.classList.contains("open")) bloodDetailBackdrop.classList.remove("open");
  });

  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    eventFormError.style.display = "none";
    var id = document.getElementById("ef-id").value;
    var payload = {
      title: document.getElementById("ef-title").value.trim(),
      category: document.getElementById("ef-category").value,
      status: document.getElementById("ef-status").value,
      description: document.getElementById("ef-description").value.trim(),
      location: document.getElementById("ef-location").value.trim(),
      eventDate: document.getElementById("ef-date").value,
      capacity: document.getElementById("ef-capacity").value || null,
      startTime: document.getElementById("ef-start").value.trim(),
      endTime: document.getElementById("ef-end").value.trim(),
      durationHours: document.getElementById("ef-duration").value || null,
      imageUrl: document.getElementById("ef-image").value.trim() || null,
      photoAlbumUrl: document.getElementById("ef-album").value.trim() || null
    };
    var req = id
      ? apiFetch("/events/" + id, { method: "PUT", body: JSON.stringify(payload) })
      : apiFetch("/events", { method: "POST", body: JSON.stringify(payload) });

    req.then(function () {
      closeEventForm();
      showToast(id ? "Event updated." : "Event created.");
      eventsCache = null;
      if (currentSection === "events") renderEvents();
    }).catch(function (err) {
      eventFormError.textContent = err.message;
      eventFormError.style.display = "block";
    });
  });

  /* ---------- check-in scanner ---------- */
  var scannerStream = null, scannerRAF = null, scannerEventId = null;

  function stopScanner() {
    if (scannerRAF) { cancelAnimationFrame(scannerRAF); scannerRAF = null; }
    if (scannerStream) { scannerStream.getTracks().forEach(function (t) { t.stop(); }); scannerStream = null; }
  }

  function doCheckIn(eventId, volunteerId, resultEl) {
    apiFetch("/attendance/check-in", { method: "POST", body: JSON.stringify({ eventId: eventId, volunteerId: volunteerId }) })
      .then(function (body) {
        var msg = (body.alreadyCheckedIn ? "Already checked in: " : "Checked in: ") + body.volunteer.fullName + " (" + body.volunteer.volunteerId + ")";
        showToast(msg);
        if (resultEl) { resultEl.textContent = msg; resultEl.style.color = "#065F46"; }
        loadCheckinList(eventId);
      })
      .catch(function (err) {
        showToast(err.message);
        if (resultEl) { resultEl.textContent = err.message; resultEl.style.color = "#991B1B"; }
      });
  }

  function loadCheckinList(eventId) {
    var listEl = document.getElementById("mfCheckinList");
    if (!listEl) return;
    apiFetch("/attendance/event/" + eventId).then(function (body) {
      listEl.innerHTML = body.attendances.length
        ? body.attendances.map(function (a) {
            return '<div class="flex items-center justify-between py-2 border-b border-[#EEF2FA] text-[13px]">' +
              "<span>" + esc(a.volunteer.fullName) + " (" + esc(a.volunteer.volunteerId) + ")</span>" +
              '<span class="flex items-center gap-3">' +
              '<span class="text-[#4B5563]">' + a.hoursCredited + "h</span>" +
              '<button class="mf-admin-btn ' + (a.certificateIssued ? "mf-admin-btn-danger" : "mf-admin-btn-approve") + '" data-action="toggle-certificate" data-id="' + a.id + '" data-issued="' + (a.certificateIssued ? "0" : "1") + '">' +
              (a.certificateIssued ? "Revoke Certificate" : "Issue Certificate") +
              "</button></span></div>";
          }).join("")
        : "<p class='text-[13px] text-[#9CA3AF]'>No one checked in yet.</p>";
    });
  }

  function renderCheckin() {
    apiFetch("/events/admin").then(function (body) {
      var events = body.events;
      if (!events.length) {
        content.innerHTML = '<p class="mf-admin-empty">Create an event first.</p>';
        return;
      }
      content.innerHTML =
        '<div class="mf-form-card" style="max-width:520px">' +
        '<label class="mf-label" for="mfCheckinEvent">Event</label>' +
        '<select class="mf-input mb-4" id="mfCheckinEvent">' +
        events.map(function (e) { return '<option value="' + e.id + '">' + esc(e.title) + " — " + fmtDate(e.eventDate) + "</option>"; }).join("") +
        "</select>" +
        '<div id="mfScannerArea"></div>' +
        '<div class="mt-5"><p class="mf-label">Manual check-in (fallback)</p>' +
        '<div class="flex gap-2"><input class="mf-input" id="mfManualVid" placeholder="MLF202500001"><button class="mf-btn mf-btn-primary" id="mfManualCheckinBtn">Check In</button></div>' +
        '<p id="mfCheckinResult" class="text-[13px] mt-2"></p></div>' +
        '<p class="mf-admin-subtitle mt-6" style="margin:0 0 .5rem">Checked in so far</p>' +
        '<div id="mfCheckinList"></div>' +
        "</div>";

      var select = document.getElementById("mfCheckinEvent");
      scannerEventId = select.value;
      loadCheckinList(scannerEventId);
      startScanner(scannerEventId);

      select.addEventListener("change", function () {
        stopScanner();
        scannerEventId = select.value;
        loadCheckinList(scannerEventId);
        startScanner(scannerEventId);
      });

      document.getElementById("mfManualCheckinBtn").addEventListener("click", function () {
        var vid = document.getElementById("mfManualVid").value.trim();
        if (!vid) return;
        doCheckIn(scannerEventId, vid, document.getElementById("mfCheckinResult"));
        document.getElementById("mfManualVid").value = "";
      });
    }).catch(handleErr);
  }

  // Prefers the native BarcodeDetector API (fast, hardware-backed where
  // available — mainly Chrome/Edge on Android and desktop). Most other
  // browsers, notably iOS/mobile Safari, don't implement it at all, so we
  // fall back to jsQR (pure-JS, sampled off a downscaled canvas frame) —
  // that combination gets live scanning working everywhere getUserMedia
  // does, rather than just wherever BarcodeDetector happens to exist.
  function startScanner(eventId) {
    var area = document.getElementById("mfScannerArea");
    if (!area) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      area.innerHTML = '<p class="text-[13px] text-[#9CA3AF]">Camera access isn\'t available — use manual check-in below.</p>';
      return;
    }
    if (!("BarcodeDetector" in window) && !window.jsQR) {
      area.innerHTML = '<p class="text-[13px] text-[#9CA3AF]">Live camera scanning couldn\'t load in this browser — use manual check-in below.</p>';
      return;
    }

    area.innerHTML = '<video id="mfScannerVideo" playsinline muted style="width:100%;border-radius:12px;background:#000"></video>';
    var video = document.getElementById("mfScannerVideo");
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { willReadFrequently: true });

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        scannerStream = stream;
        video.srcObject = stream;
        video.play();

        var detector = ("BarcodeDetector" in window) ? new window.BarcodeDetector({ formats: ["qr_code"] }) : null;
        var lastAttempt = 0, lastMatchedAt = 0;

        function handleDecoded(text) {
          var match = text && text.match(/MLF\d+/);
          var now = Date.now();
          if (match && now - lastMatchedAt > 1500) {
            lastMatchedAt = now;
            doCheckIn(eventId, match[0], document.getElementById("mfCheckinResult"));
          }
        }

        function scanWithCanvas() {
          var maxDim = 640;
          var scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
          canvas.width = Math.round(video.videoWidth * scale);
          canvas.height = Math.round(video.videoHeight * scale);
          if (!canvas.width || !canvas.height) return;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var code = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          if (code && code.data) handleDecoded(code.data);
        }

        var tick = function () {
          if (!scannerStream) return; // stopped
          var now = Date.now();
          if (video.readyState >= 2 && now - lastAttempt > 300) {
            lastAttempt = now;
            if (detector) {
              detector.detect(video).then(function (codes) {
                if (codes.length) handleDecoded(codes[0].rawValue);
              }).catch(function () {});
            } else {
              try { scanWithCanvas(); } catch (e) {}
            }
          }
          scannerRAF = requestAnimationFrame(tick);
        };
        scannerRAF = requestAnimationFrame(tick);
      })
      .catch(function () {
        area.innerHTML = '<p class="text-[13px] text-[#9CA3AF]">Camera permission denied — use manual check-in below.</p>';
      });
  }

  /* ---------- event feedback ---------- */
  function starRating(n) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += '<i class="fa-solid fa-star" style="color:' + (i <= n ? "#F5B921" : "#E3E9F5") + '"></i>';
    return out;
  }

  function renderEventFeedback() {
    apiFetch("/event-feedback").then(function (body) {
      content.innerHTML = renderTable(body.feedback, [
        { label: "Event", render: function (f) { return "<strong>" + esc(f.event.title) + "</strong><br><span class='text-xs text-[#4B5563]'>" + fmtDate(f.event.eventDate) + "</span>"; } },
        { label: "From", render: function (f) { return esc(f.name) + "<br><span class='text-xs text-[#4B5563]'>" + esc(f.email) + "</span>"; } },
        { label: "Rating", render: function (f) { return starRating(f.rating); } },
        { label: "Comment", render: function (f) { return f.comment ? esc(f.comment) : "<span class='text-[#9CA3AF]'>—</span>"; } },
        { label: "Submitted", render: function (f) { return fmtDate(f.createdAt); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (f) { return deleteButton(f, "event-feedback"); } }
      ]);
    }).catch(handleErr);
  }

  /* ---------- notifications ---------- */
  function renderNotifications() {
    apiFetch("/notifications").then(function (body) {
      content.innerHTML = renderTable(body.notifications, [
        { label: "Title / Message", render: function (n) { return "<strong>" + esc(n.title) + "</strong><br><span class='text-xs text-[#4B5563]'>" + esc(n.message) + "</span>"; } },
        { label: "Audience", render: function (n) { return n.audience === "all" ? "All volunteers" : "1 volunteer: " + esc(n.volunteer ? n.volunteer.fullName + " (" + n.volunteer.volunteerId + ")" : "—"); } },
        { label: "Sent", render: function (n) { return fmtDate(n.createdAt); } },
        { label: "Actions", cls: "mf-admin-actions", render: function (n) { return deleteButton(n, "notifications"); } }
      ]);
    }).catch(handleErr);
  }

  var notifBackdrop = document.getElementById("mfNotifFormBackdrop");
  var notifForm = document.getElementById("mfNotifForm");
  var notifFormError = document.getElementById("mfNotifFormError");
  var notifAudience = document.getElementById("nf-audience");

  notifAudience.addEventListener("change", function () {
    document.getElementById("nf-vid-wrap").style.display = notifAudience.value === "volunteer" ? "block" : "none";
  });
  newNotifBtn.addEventListener("click", function () {
    notifForm.reset();
    notifFormError.style.display = "none";
    document.getElementById("nf-vid-wrap").style.display = "none";
    notifBackdrop.classList.add("open");
  });
  document.getElementById("mfNotifFormClose").addEventListener("click", function () { notifBackdrop.classList.remove("open"); });
  document.getElementById("mfNotifFormCancel").addEventListener("click", function () { notifBackdrop.classList.remove("open"); });
  notifBackdrop.addEventListener("click", function (e) { if (e.target === notifBackdrop) notifBackdrop.classList.remove("open"); });

  notifForm.addEventListener("submit", function (e) {
    e.preventDefault();
    notifFormError.style.display = "none";
    var payload = {
      title: document.getElementById("nf-title").value.trim(),
      message: document.getElementById("nf-message").value.trim()
    };
    if (notifAudience.value === "volunteer") {
      payload.volunteerId = document.getElementById("nf-vid").value.trim();
    }
    apiFetch("/notifications", { method: "POST", body: JSON.stringify(payload) })
      .then(function () {
        notifBackdrop.classList.remove("open");
        showToast("Notification sent.");
        if (currentSection === "notifications") renderNotifications();
      })
      .catch(function (err) {
        notifFormError.textContent = err.message;
        notifFormError.style.display = "block";
      });
  });

  /* ---------- boot ---------- */
  switchSection("overview");
})();
