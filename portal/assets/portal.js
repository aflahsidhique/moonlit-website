/* ============================================================
   MOONLIT FOUNDATION — portal.js
   Drives both portal/index.html (login) and portal/dashboard.html
   (multi-section volunteer dashboard). Same conventions as
   admin/assets/admin.js — plain JS + fetch, JWT in localStorage,
   no framework.
   ============================================================ */
(function () {
  "use strict";

  var API = window.MF_API_BASE || "http://localhost:4000/api";
  var AUTH_KEY = "mfVolunteerAuth";

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
  function chipList(csv) {
    var items = (csv || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!items.length) return "<span class='text-[#9CA3AF]'>None selected</span>";
    return items.map(function (i) { return '<span class="mf-pf-chip">' + esc(i) + "</span>"; }).join("");
  }

  /* ================= LOGIN PAGE ================= */
  var loginForm = document.getElementById("mfPortalLoginForm");
  if (loginForm) {
    if (getAuth()) { window.location.href = "/portal/dashboard.html"; return; }
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var volunteerId = document.getElementById("l-vid").value.trim();
      var password = document.getElementById("l-password").value;
      var errorEl = document.getElementById("mfPortalLoginError");
      errorEl.style.display = "none";
      var btn = loginForm.querySelector("button[type=submit]");
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Signing in…";

      fetch(API + "/volunteer-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteerId: volunteerId, password: password })
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            if (!res.ok) throw new Error(body.error || "Login failed.");
            setAuth(body);
            window.location.href = "/portal/dashboard.html";
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
  var content = document.getElementById("mfPortalContent");
  if (!content) return;

  var auth = getAuth();
  if (!auth) { window.location.href = "/portal/index.html"; return; }

  var logoutBtn = document.getElementById("mfPortalLogout");
  if (logoutBtn) logoutBtn.addEventListener("click", function () { clearAuth(); window.location.href = "/portal/index.html"; });

  /* ---------- mobile sidebar (hamburger) ---------- */
  var sidebar = document.getElementById("mfPortalSidebar");
  var sidebarBackdrop = document.getElementById("mfPortalSidebarBackdrop");
  var menuBtn = document.getElementById("mfPortalMenuBtn");
  var sidebarCloseBtn = document.getElementById("mfPortalSidebarClose");
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
    content.innerHTML = '<p class="text-[14px] text-[#DC2626]">' + esc(err.message) + "</p>";
  }

  function apiFetch(path, options) {
    options = options || {};
    var headers = { Authorization: "Bearer " + auth.token };
    if (options.body) headers["Content-Type"] = "application/json";
    return fetch(API + path, { method: options.method || "GET", headers: headers, body: options.body }).then(function (res) {
      if (res.status === 401 || res.status === 403) {
        clearAuth();
        window.location.href = "/portal/index.html";
        throw new Error("Session expired");
      }
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok) throw new Error(body.error || "Request failed.");
        return body;
      });
    });
  }

  function qrUrl(volunteerId) {
    var verifyUrl = window.location.origin + "/portal/verify.html?id=" + encodeURIComponent(volunteerId);
    return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=" + encodeURIComponent(verifyUrl);
  }

  function idCardHtml(v) {
    return (
      '<div class="mf-id-card">' +
      '<div class="mf-id-card-header"><span class="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-fire-flame-curved text-white text-xs"></i></span><span class="name">MOONLIT FOUNDATION</span></div>' +
      '<div class="mf-id-card-body">' +
      (v.photoUrl ? '<img class="mf-id-card-photo" src="' + esc(v.photoUrl) + '" alt="">' : '<div class="mf-id-card-photo flex items-center justify-center text-[#9CA3AF]"><i class="fa-solid fa-user text-3xl"></i></div>') +
      '<p class="mf-id-card-vname">' + esc(v.fullName) + "</p>" +
      '<p class="mf-id-card-vid">' + esc(v.volunteerId) + "</p>" +
      '<div class="mf-id-card-row"><div><dt>Blood Group</dt><dd>' + esc(v.bloodGroup || "—") + "</dd></div></div>" +
      '<img class="mf-id-card-qr" src="' + qrUrl(v.volunteerId) + '" alt="QR code linking to this volunteer\'s verification page">' +
      '<div><span class="mf-id-card-status">ACTIVE</span></div>' +
      "</div>" +
      '<div class="mf-id-card-footer">QR code verifies the volunteer.</div>' +
      "</div>"
    );
  }

  /* ---------- section registry ---------- */
  var currentSection = "overview";
  var SECTIONS = {
    overview: { title: "Overview", render: renderOverview },
    idcard: { title: "Volunteer Card", render: renderIdCard },
    events: { title: "Upcoming Events", render: renderEvents },
    attendance: { title: "Attendance & Hours", render: renderAttendance },
    certificates: { title: "Certificates", render: renderCertificates },
    blood: { title: "Blood Donor Status", render: renderBlood },
    profile: { title: "Profile", render: renderProfile },
    notifications: { title: "Notifications", render: renderNotifications },
    downloads: { title: "Downloads", render: renderDownloads }
  };

  function switchSection(name) {
    if (!SECTIONS[name]) return;
    currentSection = name;
    document.querySelectorAll(".mf-portal-nav-link").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.section === name);
    });
    document.getElementById("mfPortalSectionTitle").textContent = SECTIONS[name].title;
    content.innerHTML = '<p class="text-[14px] text-[#4B5563]">Loading…</p>';
    SECTIONS[name].render();
  }
  document.querySelectorAll(".mf-portal-nav-link").forEach(function (el) {
    if (!el.dataset.section) return; // "coming soon" disabled items
    el.addEventListener("click", function () { switchSection(el.dataset.section); setSidebarOpen(false); });
  });

  /* ---------- overview ---------- */
  function renderOverview() {
    Promise.all([
      apiFetch("/volunteer-auth/me"),
      apiFetch("/volunteer-auth/attendance"),
      apiFetch("/volunteer-auth/events"),
      apiFetch("/volunteer-auth/notifications")
    ]).then(function (r) {
      var v = r[0].volunteer, attendance = r[1], events = r[2], notifs = r[3].notifications;
      document.getElementById("mfPortalName").textContent = v.fullName;

      var cards = [
        { n: attendance.totalHours, label: "Hours Served" },
        { n: events.upcoming.length, label: "Upcoming Events" },
        { n: attendance.attendances.length, label: "Events Attended" },
        { n: v.isBloodDonor ? (v.bloodGroup || "Yes") : "No", label: "Blood Donor" }
      ];
      var latest = notifs[0];

      content.innerHTML =
        '<div class="mf-portal-stats-row">' +
        cards.map(function (c) { return '<div class="mf-portal-stat-card"><p class="mf-portal-stat-num">' + esc(c.n) + '</p><p class="mf-portal-stat-label">' + esc(c.label) + "</p></div>"; }).join("") +
        "</div>" +
        '<div class="grid md:grid-cols-[300px_1fr] gap-6 items-start">' +
        idCardHtml(v) +
        '<div>' +
        (latest ? '<div class="mf-notif-item"><p class="title">' + esc(latest.title) + '</p><p class="meta">' + fmtDate(latest.createdAt) + '</p><p class="msg">' + esc(latest.message) + "</p></div>" : "<p class='text-[14px] text-[#9CA3AF]'>No notifications yet.</p>") +
        "</div></div>";
    }).catch(handleErr);
  }

  /* ---------- ID card ---------- */
  function renderIdCard() {
    apiFetch("/volunteer-auth/me").then(function (body) {
      content.innerHTML = idCardHtml(body.volunteer) + '<div class="text-center mt-5"><button id="mfDownloadIdBtn" class="mf-btn mf-btn-primary"><i class="fa-solid fa-download"></i> Download / Print</button></div>';
      document.getElementById("mfDownloadIdBtn").addEventListener("click", function () { window.print(); });
    }).catch(handleErr);
  }

  /* ---------- events ---------- */
  function renderEvents() {
    apiFetch("/volunteer-auth/events").then(function (body) {
      var rows = function (list, emptyMsg) {
        if (!list.length) return "<p class='text-[14px] text-[#9CA3AF]'>" + emptyMsg + "</p>";
        return list.map(function (r) {
          return '<div class="mf-portal-row"><div><p class="title">' + esc(r.event.title) + '</p><p class="meta">' + fmtDate(r.event.eventDate) + " · " + esc(r.event.location) + '</p></div><span class="mf-status-badge mf-status-' + esc(r.status) + '" style="display:inline-block;padding:.22rem .7rem;border-radius:99px;font-size:.72rem;font-weight:600">' + esc(r.status) + "</span></div>";
        }).join("");
      };
      content.innerHTML =
        '<p class="mf-pf-section" style="margin-top:0">Upcoming</p>' + rows(body.upcoming, "No upcoming events registered.") +
        '<p class="mf-pf-section">Past</p>' + rows(body.past, "No past events on record.");
    }).catch(handleErr);
  }

  /* ---------- attendance & hours ---------- */
  function renderAttendance() {
    apiFetch("/volunteer-auth/attendance").then(function (body) {
      content.innerHTML =
        '<div class="mf-portal-stats-row" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">' +
        '<div class="mf-portal-stat-card"><p class="mf-portal-stat-num">' + body.totalHours + '</p><p class="mf-portal-stat-label">Total Hours Served</p></div>' +
        '<div class="mf-portal-stat-card"><p class="mf-portal-stat-num">' + body.attendances.length + '</p><p class="mf-portal-stat-label">Events Attended</p></div>' +
        "</div>" +
        (body.attendances.length
          ? body.attendances.map(function (a) {
              return '<div class="mf-portal-row"><div><p class="title">' + esc(a.event.title) + '</p><p class="meta">' + fmtDate(a.event.eventDate) + " · Checked in " + fmtDate(a.checkedInAt) + '</p></div><span class="font-bold text-[#14338C]">' + a.hoursCredited + "h</span></div>";
            }).join("")
          : "<p class='text-[14px] text-[#9CA3AF]'>No check-ins yet — attendance is marked by an admin scanning your Volunteer Card QR code at an event.</p>");
    }).catch(handleErr);
  }

  /* ---------- certificates ---------- */
  function certVerifyUrl(attendanceId) {
    return window.location.origin + "/portal/certificate-verify.html?id=" + encodeURIComponent(attendanceId);
  }

  function certQrUrl(attendanceId) {
    return "https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=" + encodeURIComponent(certVerifyUrl(attendanceId));
  }

  function certificateHtml(volunteerName, cert) {
    return (
      '<div class="mf-cert-card">' +
      '<span class="w-10 h-10 rounded-full border-2 mx-auto flex items-center justify-center mb-3" style="border-color:var(--mf-navy)"><i class="fa-solid fa-fire-flame-curved" style="color:var(--mf-navy)"></i></span>' +
      '<p class="text-xs tracking-[.3em] font-bold" style="color:var(--mf-blue)">MOONLIT FOUNDATION</p>' +
      '<h2 class="text-2xl font-bold mt-3" style="color:var(--mf-dark)">Certificate of Participation</h2>' +
      '<p class="text-[14px] mt-4">This certifies that</p>' +
      '<p class="text-xl font-bold mt-1" style="color:var(--mf-navy)">' + esc(volunteerName) + "</p>" +
      '<p class="text-[14px] mt-3">volunteered at</p>' +
      '<p class="text-lg font-bold mt-1">' + esc(cert.event.title) + "</p>" +
      '<p class="text-[13px] text-[#4B5563] mt-1">' + fmtDate(cert.event.eventDate) + " · " + esc(cert.event.category) + "</p>" +
      '<p class="text-[13px] mt-3">contributing <strong>' + cert.hoursCredited + " hour(s)</strong> of service.</p>" +
      '<img class="mx-auto mt-5" style="width:120px;height:120px;border-radius:10px;border:1px solid #E3E9F5" src="' + certQrUrl(cert.id) + '" alt="Certificate verification QR code">' +
      '<p class="text-[11px] text-[#9CA3AF] mt-2">Certificate ID: ' + esc(cert.id) + "</p>" +
      '<p class="text-[11px] text-[#9CA3AF]">Issued ' + fmtDate(cert.certificateIssuedAt) + " · Scan to verify</p>" +
      "</div>"
    );
  }

  function renderCertificates() {
    Promise.all([apiFetch("/volunteer-auth/certificates"), apiFetch("/volunteer-auth/me")]).then(function (r) {
      var certs = r[0].certificates, volunteerName = r[1].volunteer.fullName;
      if (!certs.length) {
        content.innerHTML = "<p class='text-[14px] text-[#9CA3AF]'>No certificates yet — an admin issues these after you've attended an event.</p>";
        return;
      }
      content.innerHTML = certs.map(function (c) {
        return '<div class="mf-portal-row"><div><p class="title">' + esc(c.event.title) + '</p><p class="meta">' + fmtDate(c.event.eventDate) + " · " + c.hoursCredited + " hour(s)</p></div>" +
          '<button class="mf-btn mf-btn-outline" data-view-cert="' + c.id + '">View Certificate</button></div>';
      }).join("");

      content.querySelectorAll("[data-view-cert]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var cert = certs.find(function (c) { return c.id === btn.dataset.viewCert; });
          content.innerHTML = certificateHtml(volunteerName, cert) +
            '<div class="text-center mt-5 flex justify-center gap-3">' +
            '<button id="mfCertBack" class="mf-btn mf-btn-outline"><i class="fa-solid fa-arrow-left"></i> Back</button>' +
            '<button id="mfCertPrint" class="mf-btn mf-btn-primary"><i class="fa-solid fa-download"></i> Download / Print</button>' +
            "</div>";
          document.getElementById("mfCertBack").addEventListener("click", renderCertificates);
          document.getElementById("mfCertPrint").addEventListener("click", function () { window.print(); });
        });
      });
    }).catch(handleErr);
  }

  /* ---------- blood donor status ---------- */
  var BLOOD_RESPONSE_LABELS = { accept: "Accept", decline: "Decline", already_donated: "Already Donated", unavailable: "Unavailable" };

  function bloodStatusBadge(status) {
    return '<span class="mf-status-badge mf-status-' + esc(status) + '">' + esc(status.replace(/_/g, " ")) + "</span>";
  }

  function renderBloodRequestRow(r, showActions) {
    var b = r.bloodRequest;
    var actions = showActions
      ? '<div class="mf-blood-actions mt-3">' +
        Object.keys(BLOOD_RESPONSE_LABELS).map(function (key) {
          return '<button class="mf-btn mf-btn-outline" data-blood-respond="' + key + '" data-response-id="' + r.id + '">' + BLOOD_RESPONSE_LABELS[key] + "</button>";
        }).join("") +
        "</div>"
      : "";
    return (
      '<div class="mf-portal-row" style="flex-direction:column;align-items:stretch">' +
      '<div class="flex justify-between items-start flex-wrap gap-2">' +
      "<div><p class='title'>" + esc(b.bloodGroup) + " needed at " + esc(b.hospital) + '</p><p class="meta">' + esc(b.district) + " · " + esc(b.urgency) + " · " + b.units + " unit(s) · " + fmtDate(r.createdAt) + "</p></div>" +
      bloodStatusBadge(r.status) +
      "</div>" +
      actions +
      "</div>"
    );
  }

  function renderBlood() {
    Promise.all([apiFetch("/volunteer-auth/blood"), apiFetch("/volunteer-auth/blood-requests")]).then(function (r) {
      var b = r[0], requests = r[1].responses;
      var pending = requests.filter(function (x) { return x.status === "notified"; });
      var history = requests.filter(function (x) { return x.status !== "notified"; });

      content.innerHTML =
        '<dl class="mf-pf-grid mf-form-card">' +
        "<div><dt>Blood Group</dt><dd>" + esc(b.bloodGroup || "—") + "</dd></div>" +
        "<div><dt>Registered Donor?</dt><dd>" + (b.isBloodDonor ? "Yes" : "No") + "</dd></div>" +
        "<div><dt>Eligible Now?</dt><dd>" + (b.eligible ? "Yes" : "No") + "</dd></div>" +
        "<div><dt>Donations Logged</dt><dd>" + b.donationCount + "</dd></div>" +
        "<div><dt>Last Donation</dt><dd>" + (b.lastDonationDate ? fmtDate(b.lastDonationDate) : "No record on file") + "</dd></div>" +
        "<div><dt>Next Eligible</dt><dd>" + (b.nextEligibleDate ? fmtDate(b.nextEligibleDate) : "—") + "</dd></div>" +
        "</dl>" +

        (b.isBloodDonor
          ? '<div class="mf-form-card mt-4 flex items-center justify-between flex-wrap gap-3">' +
            "<div><p class='font-bold text-[15px]'>Availability for donation</p><p class='text-[13px] text-[#4B5563] mt-1'>" +
            (b.bloodDonationAvailable ? "You're marked available and may be contacted for urgent requests." : "You're marked unavailable — you won't be notified about new requests.") +
            "</p></div>" +
            '<button id="mfBloodAvailToggle" class="mf-btn ' + (b.bloodDonationAvailable ? "mf-btn-red" : "mf-btn-primary") + '" data-current="' + (b.bloodDonationAvailable ? "1" : "0") + '">' +
            (b.bloodDonationAvailable ? "Mark Unavailable" : "Mark Available") +
            "</button></div>"
          : "") +

        '<p class="mf-pf-section">Requests Needing Your Response</p>' +
        (pending.length ? pending.map(function (r) { return renderBloodRequestRow(r, true); }).join("") : "<p class='text-[14px] text-[#9CA3AF]'>Nothing waiting on you right now.</p>") +

        '<p class="mf-pf-section">Donation History</p>' +
        (b.donations.length
          ? b.donations.map(function (d) { return '<div class="mf-portal-row"><div><p class="title">' + fmtDate(d.donationDate) + '</p>' + (d.location ? '<p class="meta">' + esc(d.location) + "</p>" : "") + "</div></div>"; }).join("")
          : "<p class='text-[14px] text-[#9CA3AF]'>No donations logged yet.</p>") +

        (history.length ? '<p class="mf-pf-section">Past Alerts</p>' + history.map(function (r) { return renderBloodRequestRow(r, false); }).join("") : "");

      var toggleBtn = document.getElementById("mfBloodAvailToggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
          var next = toggleBtn.dataset.current !== "1";
          toggleBtn.disabled = true;
          apiFetch("/volunteer-auth/blood-availability", { method: "POST", body: JSON.stringify({ available: next }) })
            .then(function () { showToast(next ? "Marked available." : "Marked unavailable."); renderBlood(); })
            .catch(function (err) { showToast(err.message); toggleBtn.disabled = false; });
        });
      }
      content.querySelectorAll("[data-blood-respond]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var response = btn.dataset.bloodRespond, responseId = btn.dataset.responseId;
          content.querySelectorAll('[data-response-id="' + responseId + '"]').forEach(function (b2) { b2.disabled = true; });
          apiFetch("/volunteer-auth/blood-requests/" + responseId + "/respond", { method: "POST", body: JSON.stringify({ response: response }) })
            .then(function () { showToast("Response recorded — thank you."); renderBlood(); })
            .catch(function (err) { showToast(err.message); renderBlood(); });
        });
      });
    }).catch(handleErr);
  }

  /* ---------- profile (read-only) ---------- */
  function renderProfile() {
    apiFetch("/volunteer-auth/me").then(function (r) {
      var v = r.volunteer;
      content.innerHTML =
        '<div class="mf-form-card">' +
        '<div class="mf-pf-header">' +
        (v.photoUrl ? '<img class="mf-pf-photo" src="' + esc(v.photoUrl) + '" alt="">' : '<div class="mf-pf-photo flex items-center justify-center text-[#9CA3AF]"><i class="fa-solid fa-user text-2xl"></i></div>') +
        '<div><p class="text-xl font-bold">' + esc(v.fullName) + "</p>" +
        "<p class='text-sm text-[#4B5563] mt-1'>" + esc(v.volunteerId) + "</p></div></div>" +

        '<p class="mf-pf-section">Personal Details</p>' +
        '<dl class="mf-pf-grid">' +
        "<div><dt>Date of Birth</dt><dd>" + fmtDate(v.dob) + "</dd></div>" +
        "<div><dt>Gender</dt><dd>" + esc(v.gender) + "</dd></div>" +
        "<div><dt>Mobile</dt><dd>" + esc(v.mobile) + "</dd></div>" +
        "<div><dt>WhatsApp</dt><dd>" + esc(v.whatsapp || "—") + "</dd></div>" +
        "<div><dt>Email</dt><dd>" + esc(v.email) + "</dd></div>" +
        "</dl>" +

        '<p class="mf-pf-section">Address</p>' +
        '<dl class="mf-pf-grid">' +
        "<div><dt>House / Street</dt><dd>" + esc(v.address) + "</dd></div>" +
        "<div><dt>District</dt><dd>" + esc(v.district) + "</dd></div>" +
        "<div><dt>Taluk</dt><dd>" + esc(v.taluk) + "</dd></div>" +
        "<div><dt>Panchayat</dt><dd>" + esc(v.panchayat) + "</dd></div>" +
        "<div><dt>Ward</dt><dd>" + esc(v.ward) + "</dd></div>" +
        "<div><dt>PIN</dt><dd>" + esc(v.pin) + "</dd></div>" +
        "</dl>" +

        '<p class="mf-pf-section">Emergency Contact</p>' +
        '<dl class="mf-pf-grid">' +
        "<div><dt>Name</dt><dd>" + esc(v.emergencyName) + "</dd></div>" +
        "<div><dt>Relationship</dt><dd>" + esc(v.emergencyRelationship) + "</dd></div>" +
        "<div><dt>Phone</dt><dd>" + esc(v.emergencyPhone) + "</dd></div>" +
        "</dl>" +

        '<p class="mf-pf-section">Skills</p>' + chipList(v.skills) +
        '<p class="mf-pf-section">Available Time</p>' + chipList(v.availableTime) +
        "</div>" +

        '<div class="mf-form-card mt-4">' +
        '<p class="font-bold text-[15px] mb-1">Change Password</p>' +
        '<p class="text-[13px] text-[#4B5563] mb-4">Update the password you use to log into this portal.</p>' +
        '<form id="mfChangePasswordForm">' +
        '<div class="mb-3"><label class="mf-label" for="cp-current">Current Password</label><input class="mf-input" id="cp-current" type="password" required autocomplete="current-password"></div>' +
        '<div class="mb-3"><label class="mf-label" for="cp-new">New Password</label><input class="mf-input" id="cp-new" type="password" required minlength="8" placeholder="At least 8 characters" autocomplete="new-password"></div>' +
        '<div class="mb-3"><label class="mf-label" for="cp-confirm">Confirm New Password</label><input class="mf-input" id="cp-confirm" type="password" required minlength="8" autocomplete="new-password"></div>' +
        '<p id="mfChangePasswordError" class="mf-error-msg mb-2" style="display:none"></p>' +
        '<button class="mf-btn mf-btn-primary" type="submit">Update Password</button>' +
        "</form></div>";

      var pwForm = document.getElementById("mfChangePasswordForm");
      var pwError = document.getElementById("mfChangePasswordError");
      pwForm.addEventListener("submit", function (e) {
        e.preventDefault();
        pwError.style.display = "none";
        var current = document.getElementById("cp-current").value;
        var next = document.getElementById("cp-new").value;
        var confirm = document.getElementById("cp-confirm").value;

        if (next.length < 8) {
          pwError.textContent = "New password must be at least 8 characters.";
          pwError.style.display = "block";
          return;
        }
        if (next !== confirm) {
          pwError.textContent = "New passwords don't match.";
          pwError.style.display = "block";
          return;
        }

        var btn = pwForm.querySelector("button[type=submit]");
        var original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = "Updating…";

        apiFetch("/volunteer-auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword: current, newPassword: next }) })
          .then(function () { showToast("Password updated."); pwForm.reset(); })
          .catch(function (err) { pwError.textContent = err.message; pwError.style.display = "block"; })
          .finally(function () { btn.disabled = false; btn.innerHTML = original; });
      });
    }).catch(handleErr);
  }

  /* ---------- push notifications (opt-in) ---------- */
  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    var raw = window.atob(base64);
    var arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }

  function pushSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
  }

  function getPushSubscription() {
    return navigator.serviceWorker.register("/portal/sw.js").then(function (reg) {
      return reg.pushManager.getSubscription();
    });
  }

  function enablePush() {
    return fetch(API.replace(/\/api$/, "") + "/api/config")
      .then(function (res) { return res.json(); })
      .then(function (cfg) {
        if (!cfg.vapidPublicKey) throw new Error("Push notifications aren't configured on the server yet.");
        return Notification.requestPermission().then(function (perm) {
          if (perm !== "granted") throw new Error("Notification permission denied.");
          return navigator.serviceWorker.register("/portal/sw.js");
        }).then(function (reg) {
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(cfg.vapidPublicKey)
          });
        });
      })
      .then(function (sub) {
        var raw = sub.toJSON();
        return apiFetch("/volunteer-auth/push-subscribe", {
          method: "POST",
          body: JSON.stringify({ endpoint: raw.endpoint, p256dh: raw.keys.p256dh, auth: raw.keys.auth })
        });
      });
  }

  function disablePush() {
    return getPushSubscription().then(function (sub) {
      if (!sub) return;
      var endpoint = sub.endpoint;
      return sub.unsubscribe().then(function () {
        return apiFetch("/volunteer-auth/push-unsubscribe", { method: "POST", body: JSON.stringify({ endpoint: endpoint }) });
      });
    });
  }

  /* ---------- notifications ---------- */
  function renderNotifications() {
    apiFetch("/volunteer-auth/notifications").then(function (body) {
      var pushBlock = "";
      if (pushSupported()) {
        pushBlock =
          '<div class="mf-form-card mb-4 flex items-center justify-between flex-wrap gap-3">' +
          "<div><p class='font-bold text-[15px]'>Push notifications</p><p class='text-[13px] text-[#4B5563] mt-1'>Get an alert on this device for urgent blood requests and updates.</p></div>" +
          '<button id="mfPushToggle" class="mf-btn mf-btn-outline" disabled>Checking…</button>' +
          "</div>";
      }
      content.innerHTML = pushBlock + (body.notifications.length
        ? body.notifications.map(function (n) {
            return '<div class="mf-notif-item"><p class="title">' + esc(n.title) + '</p><p class="meta">' + fmtDate(n.createdAt) + '</p><p class="msg">' + esc(n.message) + "</p></div>";
          }).join("")
        : "<p class='text-[14px] text-[#9CA3AF]'>No notifications yet.</p>");

      var btn = document.getElementById("mfPushToggle");
      if (!btn) return;
      getPushSubscription().then(function (sub) {
        var subscribed = Boolean(sub);
        btn.disabled = false;
        btn.textContent = subscribed ? "Disable" : "Enable Push Notifications";
        btn.className = "mf-btn " + (subscribed ? "mf-btn-red" : "mf-btn-primary");
        btn.addEventListener("click", function () {
          btn.disabled = true;
          btn.textContent = "Working…";
          var action = subscribed ? disablePush() : enablePush();
          action
            .then(function () { showToast(subscribed ? "Push notifications disabled." : "Push notifications enabled."); renderNotifications(); })
            .catch(function (err) { showToast(err.message); btn.disabled = false; btn.textContent = subscribed ? "Disable" : "Enable Push Notifications"; });
        });
      }).catch(function () {
        btn.textContent = "Unavailable";
        btn.disabled = true;
      });
    }).catch(handleErr);
  }

  /* ---------- downloads ---------- */
  function renderDownloads() {
    content.innerHTML =
      '<div class="mf-form-card text-center">' +
      '<p class="text-[14px] mb-4">Your digital Volunteer ID card, ready to save or print.</p>' +
      '<button id="mfDownloadIdBtn2" class="mf-btn mf-btn-primary"><i class="fa-solid fa-download"></i> Download / Print ID Card</button>' +
      '<p class="text-[12px] text-[#9CA3AF] mt-4">Certificates will appear here once that feature ships.</p>' +
      "</div>";
    document.getElementById("mfDownloadIdBtn2").addEventListener("click", function () { switchSection("idcard"); setTimeout(function () { window.print(); }, 300); });
  }

  /* ---------- boot ---------- */
  apiFetch("/volunteer-auth/me").then(function (r) { document.getElementById("mfPortalName").textContent = r.volunteer.fullName; }).catch(function () {});
  switchSection("overview");
})();
