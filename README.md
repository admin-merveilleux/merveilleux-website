# merveilleUX — Refonte Site Web (Backend & CMS)

Ce dépôt contient le socle technique et backend du site **merveilleUX** ([merveilleux.design](https://www.merveilleux.design)), développé avec **Next.js 16**, **Payload CMS v4 (Beta)** et **PostgreSQL (Neon)**.

---

## 🛠️ Stack Technique

- **Framework Web :** [Next.js 16](https://nextjs.org/) (App Router, React Server Components)
- **CMS Headless :** [Payload CMS v4 Beta](https://payloadcms.com/)
- **Base de données :** PostgreSQL hébergé sur [Neon](https://neon.tech)
- **Éditeur de texte :** Lexical RichText
- **Gestionnaire de médias :** Sharp (optimisation d'images multi-résolutions)
- **SEO & Métadonnées :** `@payloadcms/plugin-seo` + redirections 301 permanentes configurées dans `next.config.mjs`

---

## 📁 Structure du Projet

```
merveilleux-redesign/
├── payload.config.ts             # Configuration principale de Payload CMS v4
├── next.config.mjs               # Configuration Next.js & Redirections SEO
├── tsconfig.json                 # Configuration TypeScript
├── .env.example                  # Modèle des variables d'environnement
├── .env.local                    # Variables locales (clés secrètes & DATABASE_URI)
├── public/                       # Fichiers publics & médias (/public/media)
└── src/
    ├── access/                   # Règles de sécurité & permissions (RBAC)
    ├── collections/              # Collections de données Payload CMS
    │   ├── Articles.ts           # Articles de blog (funnel TOFU/MOFU/BOFU, SEO, H1)
    │   ├── Authors.ts            # Auteurs (Jessy, Célestin...)
    │   ├── CaseStudies.ts        # Études de cas Portfolio (Hoko, Knight App...)
    │   ├── Categories.ts         # Catégories d'articles
    │   ├── Media.ts              # Médiathèque & Uploads
    │   ├── Pages.ts              # Pages de contenu marketing
    │   ├── Services.ts           # Services agence (Audit UX, Maquettes, Design System...)
    │   ├── Tags.ts               # Tags
    │   └── Users.ts              # Administrateurs et rédacteurs
    ├── globals/                  # Données globales du site
    │   ├── Footer.ts             # Pied de page (avec lien discret vers le Blog)
    │   ├── Navigation.ts         # Menu Header (Services, Tarifs, Portfolio, Agence, Contact)
    │   └── SiteSettings.ts       # Informations agence, coordonnées & liens
    └── app/
        ├── (frontend)/           # Pages frontend Next.js
        └── (payload)/            # Routes d'administration et API de Payload
            ├── admin/            # Interface /admin
            └── api/              # Endpoints REST & GraphQL (/api, /api/graphql)
```

---

## 🎯 Préservation du SEO & Structure d'URLs

Pour conserver l'intégralité du trafic organique et du référencement historique du site :

1. **Articles de Blog :**
   - Pattern d'URL : `/{lang}/blog/article/{slug}`
   - Français : `/fr/blog/article/{slug}`
   - Anglais : `/en/blog/article/{slug}`
   - Balise `H1` personnalisable indépendamment du `Title` SEO.
   - Classification par funnel marketing (`tofu`, `mofu`, `bofu`) pour conserver la logique de conversion et de recommandation.
2. **Redirections 301 historiques :**
   - `/audit` → `/services/audit-ux`
   - `/maquettes` → `/services/maquettes`
   - `/design-system` → `/services/design-system`
   - `/gamification` → `/services/gamification`
3. **Mise en avant du Blog :**
   - Conformément aux consignes, le blog n'est plus en page d'accueil ni dans le menu principal (Header), mais reste accessible via le lien dans le **Footer** (`/blog`) afin de préserver l'indexation par Google.

---

## 🚀 Démarrage Rapide

### 1. Variables d'environnement

Renseignez votre chaîne de connexion Neon dans `.env.local` :

```env
DATABASE_URI=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
PAYLOAD_SECRET=votre_cle_secrete_generee
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

- **Frontend :** [http://localhost:3000](http://localhost:3000)
- **Panel d'administration CMS :** [http://localhost:3000/admin](http://localhost:3000/admin)

Lors du premier accès à `/admin`, vous serez invité à créer le compte administrateur initial.
