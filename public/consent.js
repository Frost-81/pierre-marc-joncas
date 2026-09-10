/* ============================================================
   Consentement — Loi 25 (Québec)
   Principe : rien de facultatif ne se charge tant que la personne
   n'a pas donné un consentement libre, éclairé et explicite.
   Le refus est aussi simple que l'acceptation, et révocable en tout temps.
   ============================================================ */
(function (window, document) {
  "use strict";

  var CLE = "pmj-consent";
  var VERSION = 1;
  var VALIDITE_MOIS = 12; // au-delà, on redemande

  /* ---- Lecture / écriture du choix ----------------------- */
  function lire() {
    try {
      var brut = localStorage.getItem(CLE);
      if (!brut) return null;
      var etat = JSON.parse(brut);
      if (etat.version !== VERSION) return null;

      var limite = new Date(etat.date);
      limite.setMonth(limite.getMonth() + VALIDITE_MOIS);
      if (new Date() > limite) return null;

      return etat;
    } catch (e) {
      return null;
    }
  }

  function ecrire(choix) {
    var etat = { version: VERSION, choix: choix, date: new Date().toISOString() };
    try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {}
    return etat;
  }

  /* ---- Nettoyage en cas de refus ou de retrait ------------ */
  function purger() {
    // Supprime les témoins de mesure d'audience éventuellement déposés
    // avant un retrait de consentement (Google Analytics : _ga, _gid…).
    document.cookie.split(";").forEach(function (paire) {
      var nom = paire.split("=")[0].trim();
      if (!/^_ga|^_gid|^_gat|^_fbp$/.test(nom)) return;
      var expire = "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = nom + expire;
      document.cookie = nom + expire + "; domain=." + location.hostname;
    });
  }

  /* ---- Diffusion de l'état ------------------------------- */
  function diffuser(choix) {
    window.dispatchEvent(new CustomEvent("pmj:consent", { detail: { choix: choix } }));
  }

  /* ---- Bandeau ------------------------------------------- */
  var bandeau = document.getElementById("consent");

  function afficher() {
    if (!bandeau) return;
    bandeau.hidden = false;
    // Laisse un cycle de rendu pour que la transition d'entrée s'applique.
    requestAnimationFrame(function () { bandeau.classList.add("is-in"); });
  }

  function masquer() {
    if (!bandeau) return;
    bandeau.classList.remove("is-in");
    window.setTimeout(function () { bandeau.hidden = true; }, 300);
  }

  function decider(choix) {
    ecrire(choix);
    if (choix !== "all") purger();
    masquer();
    diffuser(choix);
  }

  if (bandeau) {
    bandeau.addEventListener("click", function (event) {
      var bouton = event.target.closest("[data-consent]");
      if (bouton) decider(bouton.getAttribute("data-consent"));
    });
  }

  /* Rouvrir depuis le pied de page (retrait du consentement) */
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-consent-open]")) afficher();
  });

  /* ---- API publique --------------------------------------
     Pour brancher un outil de mesure plus tard :

       window.addEventListener("pmj:consent", function (e) {
         if (e.detail.choix === "all") chargerAnalytique();
       });
       if (window.pmjConsent.mesureAutorisee()) chargerAnalytique();
  --------------------------------------------------------- */
  var etatInitial = lire();

  window.pmjConsent = {
    etat: function () { return lire(); },
    mesureAutorisee: function () {
      var e = lire();
      return !!e && e.choix === "all";
    },
    ouvrir: afficher,
    retirer: function () { decider("essential"); }
  };

  /* Aucun choix valide en mémoire : on demande. Par défaut, rien n'est autorisé. */
  if (!etatInitial) {
    afficher();
  } else {
    diffuser(etatInitial.choix);
  }
})(window, document);
