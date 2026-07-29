/* ============================================================
   STERLING & BLACK — MAIN JS (nav, reveal, accordion, tabs, misc)
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky nav solidify ---------- */
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("is-static")) {
    var onScrollNav = function () {
      if (window.scrollY > 40) header.classList.add("is-solid");
      else header.classList.remove("is-solid");
    };
    window.addEventListener("scroll", onScrollNav, { passive: true });
    onScrollNav();
  }

  /* ---------- Mobile nav ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileClose = document.querySelector(".mobile-nav-close");
  function openMobileNav() {
    mobileNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
    menuToggle.setAttribute("aria-expanded", "true");
  }
  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
    menuToggle.setAttribute("aria-expanded", "false");
  }
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", openMobileNav);
    if (mobileClose) mobileClose.addEventListener("click", closeMobileNav);
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobileNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) closeMobileNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-counter]");
  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-counter"));
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1400;
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var val = Math.round(target * eased);
            el.textContent = val + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-counter") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.querySelector(".scroll-progress-bar");
  if (progressBar) {
    var updateProgress = function () {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ---------- Hero headline word-by-word reveal ---------- */
  document.querySelectorAll("[data-split-words]").forEach(function (el) {
    var text = el.textContent;
    var words = text.trim().split(/\s+/);
    el.innerHTML = words
      .map(function (w, i) {
        return '<span class="word" style="transition-delay:' + (i * 55) + 'ms">' + w + "</span>";
      })
      .join(" ");
    // Trigger on next frame so the transition actually runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add("is-revealed");
      });
    });
  });

  /* ---------- Hero parallax (minimal, disabled for reduced motion) ---------- */
  var parallaxEl = document.querySelector("[data-parallax]");
  if (parallaxEl && !reduceMotion) {
    var onParallax = function () {
      var offset = Math.min(window.scrollY * 0.15, 80);
      parallaxEl.style.transform = "translateY(" + offset + "px)";
    };
    window.addEventListener("scroll", onParallax, { passive: true });
    onParallax();
  }


  document.querySelectorAll(".accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      var parent = item.closest("[data-accordion-group]");
      if (parent) {
        parent.querySelectorAll(".accordion-item.is-open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            openItem.querySelector(".accordion-panel").style.maxHeight = null;
            openItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
          }
        });
      }
      if (isOpen) {
        item.classList.remove("is-open");
        panel.style.maxHeight = null;
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Tabs (practice area categories) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var buttons = group.querySelectorAll(".tab-btn");
    var panels = document.querySelectorAll('[data-tab-panel][data-tab-group="' + group.getAttribute("data-tabs") + '"]');
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");
        var target = btn.getAttribute("data-tab-target");
        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-tab-panel") !== target;
        });
      });
    });
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 700) backToTop.classList.add("is-visible");
        else backToTop.classList.remove("is-visible");
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Newsletter (footer) — simple client-side confirmation ---------- */
  document.querySelectorAll("[data-newsletter-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Thank you — you're subscribed to Legal Insights.");
      form.reset();
    });
  });

  /* ---------- Toast helper (exposed globally) ---------- */
  function showToast(message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="toast-msg"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector(".toast-msg").textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4200);
  }
  window.SBShowToast = showToast;

  /* ---------- Site search (basic client-side, demo dataset) ---------- */
  var searchTrigger = document.querySelector("[data-search-open]");
  var searchOverlay = document.querySelector("[data-search-overlay]");
  if (searchTrigger && searchOverlay) {
    var searchInput = searchOverlay.querySelector("input");
    var searchResults = searchOverlay.querySelector("[data-search-results]");
    var searchIndex = [
      { title: "Corporate & Business Law", url: "practice-area-detail.html", type: "Practice Area" },
      { title: "Commercial Litigation", url: "practice-areas.html", type: "Practice Area" },
      { title: "Real Estate Law", url: "practice-areas.html", type: "Practice Area" },
      { title: "Family Law", url: "practice-areas.html", type: "Practice Area" },
      { title: "Estate Planning", url: "practice-areas.html", type: "Practice Area" },
      { title: "Immigration Law", url: "practice-areas.html", type: "Practice Area" },
      { title: "Margaret Ellison Sterling, Managing Partner", url: "attorney-profile.html", type: "Attorney" },
      { title: "Daniel R. Voss, Senior Litigation Partner", url: "attorneys.html", type: "Attorney" },
      { title: "Schedule a Consultation", url: "schedule-consultation.html", type: "Page" },
      { title: "Frequently Asked Questions", url: "faq.html", type: "Page" },
      { title: "Careers at Sterling & Black", url: "careers.html", type: "Page" }
    ];
    function openSearch() {
      searchOverlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      setTimeout(function () { searchInput.focus(); }, 50);
    }
    function closeSearch() {
      searchOverlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    searchTrigger.addEventListener("click", openSearch);
    searchOverlay.querySelectorAll("[data-search-close]").forEach(function (btn) {
      btn.addEventListener("click", closeSearch);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && searchOverlay.classList.contains("is-open")) closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); openSearch(); }
    });
    searchInput.addEventListener("input", function () {
      var q = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = "";
      if (!q) return;
      var matches = searchIndex.filter(function (item) { return item.title.toLowerCase().indexOf(q) !== -1; });
      if (!matches.length) {
        searchResults.innerHTML = '<li class="search-empty">No results — try “Practice Areas,” “Attorneys,” or “Consultation.”</li>';
        return;
      }
      matches.forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML = '<a href="' + item.url + '"><span>' + item.title + "</span><em>" + item.type + "</em></a>";
        searchResults.appendChild(li);
      });
    });
  }
})();
