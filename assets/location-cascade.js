/* ============================================================
   MOONLIT FOUNDATION — location-cascade.js (get-involved.html only)
   Drives the volunteer form's District -> Taluk -> Panchayat/
   Municipality cascading selects from a bundled static dataset
   (assets/data/kerala-lsg.json), compiled from India's official
   Local Government Directory (lgdirectory.gov.in) open data plus
   Kerala's published municipality/corporation list. No external
   API calls — works offline, never breaks.
   ============================================================ */
(function () {
  "use strict";

  var districtEl = document.getElementById("v-district");
  var talukEl = document.getElementById("v-taluk");
  var panchayatEl = document.getElementById("v-panchayat");
  if (!districtEl || !talukEl || !panchayatEl) return;

  var data = null;

  function fillSelect(select, options, placeholder) {
    select.innerHTML = "";
    var ph = document.createElement("option");
    ph.value = "";
    ph.textContent = placeholder;
    select.appendChild(ph);
    options.forEach(function (opt) {
      var el = document.createElement("option");
      el.value = opt;
      el.textContent = opt;
      select.appendChild(el);
    });
  }

  function resetTaluk(placeholder) {
    fillSelect(talukEl, [], placeholder);
    talukEl.disabled = true;
  }
  function resetPanchayat(placeholder) {
    fillSelect(panchayatEl, [], placeholder);
    panchayatEl.disabled = true;
  }

  districtEl.addEventListener("change", function () {
    resetPanchayat("Select taluk first");
    if (!data || !districtEl.value || !data[districtEl.value]) {
      resetTaluk(data ? "Select district first" : "Loading…");
      return;
    }
    fillSelect(talukEl, Object.keys(data[districtEl.value]).sort(), "Select your taluk");
    talukEl.disabled = false;
  });

  talukEl.addEventListener("change", function () {
    var district = districtEl.value;
    var taluk = talukEl.value;
    if (!data || !district || !taluk || !data[district][taluk]) {
      resetPanchayat("Select taluk first");
      return;
    }
    fillSelect(panchayatEl, data[district][taluk], "Select your panchayat/municipality");
    panchayatEl.disabled = false;
  });

  resetTaluk("Loading…");
  resetPanchayat("Select taluk first");

  fetch("assets/data/kerala-lsg.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load location data");
      return res.json();
    })
    .then(function (json) {
      data = json;
      // If a district is already selected (e.g. browser autofill / back
      // navigation restored form state), populate taluk right away.
      if (districtEl.value) districtEl.dispatchEvent(new Event("change"));
      else resetTaluk("Select district first");
    })
    .catch(function () {
      // Falls back to a manual free-text feel: leave the selects showing
      // an explanatory placeholder rather than silently looking broken.
      resetTaluk("Couldn't load taluk list");
      resetPanchayat("Couldn't load panchayat list");
    });
})();
