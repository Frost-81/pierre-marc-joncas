# Pierre-Marc Joncas — site de coaching

Site vitrine statique (une seule page, orientée conversion) pour Pierre-Marc Joncas,
coach professionnel à Québec. Aucun framework, aucune dépendance à installer.

## Structure

```
public/
  index.html      Page complète (HTML5 sémantique : header, nav, main, section, footer)
  styles.css      Design system : variables CSS, typographie fluide (clamp), grid/flex, mode sombre
  main.js         Menu mobile, thème clair/sombre, apparitions au défilement, année du footer
  consent.js      Bandeau de consentement Loi 25 + passerelle pour un futur outil de mesure
  politique-confidentialite.html   Politique de confidentialité (Loi 25)
  assets/         Favicon + images
firebase.json     Configuration Firebase Hosting
.firebaserc       Projet Firebase : pierre-marc-joncas
```

## Développement local

```bash
npx serve public          # ou : python -m http.server 8000 --directory public
```

## Déploiement

```bash
npx firebase-tools deploy --only hosting
```

## Parcours de conversion

Chaque section pousse vers une seule action : réserver 30 min.

1. **Héros** — promesse, format, preuve sociale (5,0 ★ · 17 avis) + double CTA
2. **Thèmes** — les six terrains (couple, entreprise, finances, confiance, décision, changement)
3. **Méthode** — écouter → clarifier → recadrer → activer
4. **Offre + prix** — ce qui est inclus, et la levée d'objection « vous décidez du montant »
5. **À propos** — crédibilité et posture
6. **Témoignages** — six avis Google réels
7. **FAQ** — six objections traitées
8. **CTA finale** — dernier appel + barre d'action fixe sur mobile

Un seul appel à l'action dans le corps de page (Calendly). Le SMS est le second canal,
présent une seule fois, en bouton dans la barre horizontale du footer.

## Conformité Loi 25

Le bandeau (`public/consent.js`) applique la confidentialité par défaut : aucun suivi facultatif
n'est autorisé tant que la personne n'a pas cliqué « Accepter ». « Refuser » a le même poids visuel
que « Accepter », le choix est mémorisé 12 mois, puis redemandé. Il est révocable en tout temps par
« Gérer mes préférences », dans le pied de page et dans la politique.

Pour brancher un outil de mesure plus tard, ne le chargez jamais directement — passez par la
passerelle :

```js
function chargerAnalytique() { /* injecte le script ici */ }

if (window.pmjConsent.mesureAutorisee()) chargerAnalytique();
window.addEventListener("pmj:consent", function (e) {
  if (e.detail.choix === "all") chargerAnalytique();
});
```

**Statut** — la politique est complète, sans mention à compléter. Coordonnées du responsable :
téléphone et courriel (l'adresse postale a été retirée à la demande du client). Conservation :
aucun dossier client n'est tenu; seules subsistent les traces des outils utilisés (Calendly,
messagerie, journaux d'hébergement), supprimées au plus tard 12 mois après le dernier contact.
Ce fichier n'est pas un avis juridique : faire relire la politique par une personne qualifiée.
Le site est fonctionnellement conforme, mais la politique doit être relue par une personne qualifiée :
ce fichier n'est pas un avis juridique.

## Points de contenu à vérifier / compléter

- **Photo** : en place (`public/assets/photo-pierre-marc.jpg`, 1954 × 1954, 284 ko). Optionnel : produire
  une version ~900 px pour alléger le chargement (aucun outil de redimensionnement n'est installé ici).
- **Image de partage** : `og:image` pointe pour l'instant sur le portrait carré. Un visuel dédié
  en 1200 × 630 donnerait un meilleur aperçu de lien sur Messenger et Facebook.
- **Lien Messenger** : `https://m.me/pierremarcjoncas` est une supposition — à confirmer et corriger
  dans le footer (`public/index.html`).
- **Domaine** : les balises `canonical` et `og:url` pointent vers `https://pierremarcjoncas.com/` — ajuster
  si le domaine final diffère.
- **Google Fonts** : les polices sont chargées depuis les serveurs de Google, ce qui transmet l'adresse IP
  du visiteur à un tiers hors Québec. C'est déclaré dans la politique; pour l'éviter complètement,
  héberger les fichiers `.woff2` dans `public/assets/` et remplacer le `<link>` par un `@font-face`.
- **Avis** : le compteur « 17 avis » et la note 5,0 apparaissent dans le héros, les témoignages et le
  JSON-LD (`aggregateRating`) — à mettre à jour ensemble quand le nombre change.

## Accessibilité et performance

- Structure sémantique, un seul `<h1>`, hiérarchie de titres continue
- Lien d'évitement, `aria-expanded` sur le menu, focus visible partout
- `prefers-reduced-motion` et `prefers-color-scheme` respectés
- Aucune dépendance JS externe ; seules les polices Google sont chargées à distance
