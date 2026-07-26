/* ============================================================
   CONSULTATION FORM — multi-step, validated, accessible
   ============================================================ */
(function () {
  "use strict";
  var form = document.querySelector("[data-consultation-form]");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var progressSteps = document.querySelectorAll(".progress-track .step");
  var progressLabels = document.querySelectorAll(".progress-labels span");
  var current = 0;

  function showStep(index) {
    steps.forEach(function (s, i) { s.hidden = i !== index; });
    progressSteps.forEach(function (s, i) {
      s.classList.toggle("is-done", i < index);
      s.classList.toggle("is-active", i === index);
    });
    progressLabels.forEach(function (l, i) { l.classList.toggle("is-active", i === index); });
    steps[index].querySelector("input, select, textarea, button")?.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (index === steps.length - 1) buildReview();
  }

  function validateStep(index) {
    var fields = steps[index].querySelectorAll("[required]");
    var valid = true;
    fields.forEach(function (field) {
      var group = field.closest(".form-group");
      var isValid = field.checkValidity();
      if (field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) isValid = false;
      if (field.type === "tel" && field.value && field.value.replace(/\D/g, "").length < 7) isValid = false;
      if (group) group.classList.toggle("has-error", !isValid);
      if (!isValid) valid = false;
    });
    return valid;
  }

  form.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!validateStep(current)) return;
      current = Math.min(current + 1, steps.length - 1);
      showStep(current);
    });
  });
  form.querySelectorAll("[data-back]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      current = Math.max(current - 1, 0);
      showStep(current);
    });
  });

  /* Phone auto-format: (123) 456-7890 */
  var phoneField = form.querySelector('input[type="tel"]');
  if (phoneField) {
    phoneField.addEventListener("input", function () {
      var digits = phoneField.value.replace(/\D/g, "").slice(0, 10);
      var out = digits;
      if (digits.length > 6) out = "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
      else if (digits.length > 3) out = "(" + digits.slice(0, 3) + ") " + digits.slice(3);
      phoneField.value = out;
    });
  }

  function buildReview() {
    var reviewEl = form.querySelector("[data-review]");
    if (!reviewEl) return;
    var data = new FormData(form);
    var rows = [
      ["Full Name", data.get("fullName")],
      ["Email", data.get("email")],
      ["Phone", data.get("phone")],
      ["Organization", data.get("organization") || "—"],
      ["Practice Area", data.get("practiceArea")],
      ["Preferred Attorney", data.get("attorney") || "No preference"],
      ["Consultation Type", data.get("consultType")],
      ["Preferred Date", data.get("prefDate") || "—"],
      ["Office Location", data.get("officeLocation") || "—"]
    ];
    reviewEl.innerHTML = rows.map(function (r) {
      return '<div class="flex-between" style="padding:10px 0; border-bottom:1px solid var(--color-line);"><span class="muted" style="font-size:var(--fs-small);">' + r[0] + '</span><strong style="font-size:var(--fs-small); text-align:right;">' + (r[1] || "—") + "</strong></div>";
    }).join("");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(current)) return;
    var consent = form.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      consent.closest(".form-group").classList.add("has-error");
      return;
    }
    current = steps.length; // move past all
    steps.forEach(function (s) { s.hidden = true; });
    document.querySelector(".progress-track").style.display = "none";
    document.querySelector(".progress-labels").style.display = "none";
    var confirmation = form.querySelector("[data-confirmation]");
    if (confirmation) confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  showStep(0);
})();

/* ---------- Simple contact form validation ---------- */
(function () {
  "use strict";
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll("[required]").forEach(function (field) {
      var group = field.closest(".form-group");
      var ok = field.checkValidity();
      if (field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) ok = false;
      if (group) group.classList.toggle("has-error", !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;
    var confirmation = form.querySelector("[data-form-confirmation]");
    form.hidden = true;
    if (confirmation) confirmation.hidden = false;
    if (window.SBShowToast) window.SBShowToast("Your message has been sent.");
  });
})();
