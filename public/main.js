/* Pierre-Marc Joncas — interactions
   Tout est optionnel : sans JS, la page reste entièrement lisible et navigable. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- 1. Thème clair / sombre (mémorisé) ---------------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme") || (systemDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("pmj-theme", next); } catch (e) {}
    });
  }

  /* ---- 2. Menu mobile ------------------------------------ */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu");

  function closeMenu() {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ---- 3. Apparition progressive ------------------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".sec-head, .cards > li, .steps > li, .offre > *, .apropos > *, .quotes > li, .faq details, .finale > *"
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    targets.forEach(function (el, index) {
      el.setAttribute("data-reveal", "");
      el.style.transitionDelay = (index % 6) * 60 + "ms";
      observer.observe(el);
    });
  }

  /* ---- 4. Année courante --------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
