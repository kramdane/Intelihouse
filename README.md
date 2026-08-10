# IntelliHouse — site statique bilingue avec catalogue produits

Site vitrine domotique et catalogue technique. HTML statique : aucun build,
aucune dépendance, les fichiers se servent tels quels.

**En ligne :** https://kramdane.github.io/Intelihouse/

## Pages

| Français | Darija (RTL) | Rôle |
|---|---|---|
| `index.html` | `index-ar.html` | Accueil |
| `catalogue.html` | `catalogue-ar.html` | 18 familles de produits |
| `categorie.html?c=slug` | `categorie-ar.html?c=slug` | Produits d'une famille |
| `produit.html?p=slug` | `produit-ar.html?p=slug` | Fiche produit |

## Données

`assets/produits.json` (113 Ko) — 260 produits, 86 catégories sur 5 niveaux.
`assets/descriptions.json` (604 Ko) — descriptions techniques, chargé
uniquement par les fiches produit.

**Mise à jour :** réexporter depuis WooCommerce et régénérer ces deux
fichiers. Aucune page HTML n'est à modifier.

⚠️ L'export WooCommerce place la description longue dans la colonne
**« Description courte »** et laisse **« Description »** vide.

## Photos produits

`images/produits/` contient 255 fichiers WebP. Si un fichier manque, la page
bascule automatiquement sur la photo hébergée par `intellihouse.ma` — le site
reste fonctionnel mais dépend alors du site source.

## ⚠️ Ajouter des classes Tailwind

`assets/style.css` est un build Tailwind **purgé** : il ne contient que les
classes utilisées par la page d'accueil d'origine. Une classe nouvelle
(`py-20`, `z-[60]`, `xl:grid-cols-4`…) **n'y existe pas** et n'aura aucun effet.
Ajouter la règle dans `assets/extra.css`.

Points de rupture : `sm` 40rem · `md` 48rem · `lg` 64rem · `xl` 80rem · `2xl` 96rem

## Contact

Les boutons « Demander un devis » et « En savoir plus » ouvrent WhatsApp
(`wa.me/212605747417`) dans un nouvel onglet. Les fiches produit pré-remplissent
le message avec le nom et la référence.

Pour changer le numéro : rechercher `wa.me/212605747417` dans les pages HTML
et dans `assets/app*.js`.

## Déploiement

GitHub Pages est câblé via `.github/workflows/pages.yml`.
Après le premier push : **Settings → Pages → Source : GitHub Actions**.

## Reste à brancher

- **Formulaire de contact** (`index.html`) : simulé côté client.
  Brancher [Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com).
