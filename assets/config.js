/* ============================================================
   MOONLIT FOUNDATION — config.js
   Single place to point the static site at the admin API.
   Auto-detects local dev vs the deployed Render backend so the
   same file works in both places with no manual toggling. If you
   rename the Render services, update PROD_API_BASE below to match.
   ============================================================ */
(function () {
  var PROD_API_BASE = "https://moonlit-website-api.onrender.com/api";
  var LOCAL_API_BASE = "http://localhost:4000/api";
  var isLocal = ["localhost", "127.0.0.1", ""].indexOf(window.location.hostname) !== -1;
  window.MF_API_BASE = window.MF_API_BASE || (isLocal ? LOCAL_API_BASE : PROD_API_BASE);
})();
