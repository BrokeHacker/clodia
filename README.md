# Clodia — Repas gastronomiques en milieu hospitalier

Service de livraison de repas gastronomiques pour le personnel soignant du CHU et des cliniques de Limoges. Menus élaborés par un chef récompensé Gault & Millau, livrés avant 12h en véhicule électrique.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript |
| Styles | Tailwind CSS v4 |
| Font | Chillax (Fontshare CDN) |
| Paiement | Stripe *(à brancher)* |
| Base de données | Supabase *(à brancher)* |
| Déploiement | Vercel |

---

## Structure des dossiers

```
clodia/
├── app/
│   ├── layout.tsx              # Layout racine — font, Header, Footer
│   ├── globals.css             # Design system (couleurs, animations)
│   ├── page.tsx                # Landing page (/)
│   ├── comment-ca-marche/      # Page "Comment ça marche"
│   ├── nos-engagements/        # Page "Nos engagements"
│   ├── formules/               # Page "Formules & tarifs"
│   ├── commander/              # Page commande interactive
│   ├── faq/                    # FAQ complète
│   └── mentions-legales/       # Mentions légales
│
├── components/
│   ├── Header.tsx              # Navigation fixe + menu mobile
│   ├── Footer.tsx              # Footer avec plan du site
│   ├── MenuCard.tsx            # Carte menu (photo, plat, prix)
│   └── FAQAccordion.tsx        # Accordéon FAQ (client component)
│
└── lib/
    └── data.ts                 # Données fictives — menus, formules, FAQ…
```

### Palette de couleurs

| Token | Valeur | Usage |
|---|---|---|
| `wine` | `#4D0F1F` | Fond sombre, logo |
| `lemon` | `#EAFF33` | Badges, marquee, accents |
| `punch` | `#FD3D6B` | CTA principal "Commander" |
| `cobalt` | `#007FFF` | Liens, sections bleues |
| `jade` | `#00CCCC` | Section livraison |
| `tiger` | `#FF9933` | Prix, icônes |

---

## Commandes

```bash
npm install       # Installer les dépendances
npm run dev       # Lancer le serveur local → http://localhost:3000
npm run build     # Build de production
npm run start     # Démarrer le build de production
```

---

## À brancher

### Supabase
Toutes les données sont actuellement en dur dans `lib/data.ts`. Pour connecter Supabase :
1. Ajouter les variables d'environnement dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
2. Installer le client : `npm install @supabase/supabase-js @supabase/ssr`
3. Remplacer les imports `lib/data.ts` par des fetch Supabase dans les Server Components

### Stripe
Le bouton "Procéder au paiement" dans `/commander` affiche actuellement une alerte. Pour activer :
1. Ajouter `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans `.env.local`
2. Créer une Route Handler `app/api/checkout/route.ts`
3. Installer : `npm install stripe @stripe/stripe-js`

---

## Déploiement Vercel

Le projet est connecté à Vercel via GitHub. Chaque push sur `main` déclenche un déploiement automatique.
