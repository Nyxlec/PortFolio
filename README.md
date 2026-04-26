# Portfolio — Dorian Lecomte

Portfolio personnel de **Dorian Lecomte**, étudiant ingénieur en 2ᵉ année de cycle préparatoire intégré à **CESI École d'Ingénieurs**, orienté **Sciences du Numérique, Réseaux, Systèmes d'Information & Cybersécurité**.

🌐 **Site en ligne** : _ajouter l'URL après déploiement GitHub Pages_
🔗 **LinkedIn** : [dorian-lecomte](https://www.linkedin.com/in/dorian-lecomte-ab5159347/)
🐙 **GitHub** : [@Nyxlec](https://github.com/Nyxlec)
🔐 **TryHackMe** : [@NyxLec](https://tryhackme.com/p/NyxLec) · **Hack The Box** : [profil](https://app.hackthebox.com/users/2685592)

---

## ✨ Aperçu

Site dark, premium, inspiré des dashboards Linear / Stripe / Datadog / Cloudflare — pas de clichés "hacking", focus sur la rigueur et la lisibilité.

**Sections :**

- Hero deux colonnes (titre + introduction)
- À propos · profil construit avec méthode
- Parcours académique (timeline)
- Cyber lab personnel · stats TryHackMe & Hack The Box
- Diplômes & certifications (réseaux, programmation, gouvernance/RGPD)
- Projets personnels & académiques (avec pages détails)
- Formulaire de contact sécurisé + console admin privée

---

## 🛠 Stack

- **HTML / CSS / JavaScript vanilla** — zéro framework, zéro build step
- **Geist Sans** + **JetBrains Mono** (Google Fonts)
- **Canvas 2D** pour les particules animées en fond (avec `prefers-reduced-motion`)
- **Supabase** pour le backend du formulaire de contact et l'authentification du panel admin
- **GitHub Pages** pour l'hébergement statique

---

## 🔐 Sécurité

Le formulaire de contact stocke les messages dans une base PostgreSQL Supabase, consultables uniquement depuis une console privée authentifiée.

| Couche                     | Mesure                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| Authentification admin     | Supabase Auth (mot de passe hashé bcrypt côté serveur, **jamais** dans le code)                       |
| Lecture des messages       | Row Level Security (RLS) PostgreSQL — impossible sans JWT valide                                       |
| Insertion publique         | Limitée par RLS + checks SQL (longueur des champs, format)                                            |
| Anti-bot                   | Champ honeypot caché + rate limit côté client                                                          |
| URL du panel admin         | Slug aléatoire, `noindex/nofollow`, exclu via `robots.txt`, aucun lien public                          |
| Session                    | Pas de persistance (`persistSession: false`) — reconnexion à chaque visite                             |

> ⚠️ La clé `anon`/`publishable` Supabase exposée dans le code est **publique par design**. La sécurité repose sur les règles RLS, pas sur la confidentialité de cette clé.

---

## 📁 Structure du projet

```
portfolio/
├── index.html                        # Page principale
├── dl-console-jsvmtmyq8s5z.html      # Panel admin privé (URL secrète)
├── robots.txt                        # Exclusions des bots
├── SUPABASE_SETUP.sql                # Script de configuration Supabase
├── projets/                          # Pages détails des projets académiques
│   ├── funkytown.html
│   ├── airdata.html
│   ├── strongbox.html
│   ├── worldwide.html
│   └── game-of-life.html
└── assets/
    ├── style.css                     # Design system + composants
    ├── admin.css                     # Styles du panel admin
    ├── script.js                     # Logique principale (timeline, projets, particules)
    ├── contact.js                    # Formulaire de contact → Supabase
    ├── admin.js                      # Console admin (auth, liste, détail, suppression)
    ├── config.js                     # Données (parcours, certifs, projets, stats THM)
    └── supabase-config.js            # URL + publishable key Supabase
```

---

## 🚀 Déploiement (GitHub Pages)

1. **Créer un repo GitHub** :
   - Sur [github.com/new](https://github.com/new) → Nom : `portfolio` (ou ce que tu veux)
   - Public (nécessaire pour Pages gratuit) — ou Private avec un compte Pro
2. **Pousser le code** :
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial commit · portfolio v2.3"
   git branch -M main
   git remote add origin https://github.com/<ton-user>/<ton-repo>.git
   git push -u origin main
   ```
3. **Activer GitHub Pages** :
   - Repo → **Settings** → **Pages**
   - Source : `Deploy from a branch` → Branch : `main` → Folder : `/ (root)` → Save
   - Attendre 1-2 min, l'URL apparaît : `https://<ton-user>.github.io/<ton-repo>/`

---

## 🗄 Configuration Supabase

Le projet attend une instance Supabase configurée. Voir [`SUPABASE_SETUP.sql`](./SUPABASE_SETUP.sql) pour le schéma complet et les policies RLS.

**Étapes :**

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter `SUPABASE_SETUP.sql` dans **SQL Editor**
3. Créer un compte admin dans **Authentication → Users → Add user**
4. Désactiver les inscriptions publiques : **Authentication → Sign In / Providers → Email** → décocher _Allow new users to sign up_
5. Récupérer **Project URL** + **publishable key** dans **Project Settings → API Keys**
6. Coller dans `assets/supabase-config.js`

---

## 📜 Licence

Code personnel. Réutilisation du design ou du code interdite sans autorisation.
