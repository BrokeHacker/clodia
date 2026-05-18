# Clodia — Base de travail

## Contexte projet
Service de livraison de repas gastronomiques pour le personnel hospitalier (CHU Limoges).
Les clients commandent via un **bot WhatsApp existant**. Cette webapp est le complément visuel.

## Stack
- **Next.js 16** (App Router) — attention : `middleware.ts` → `proxy.ts`, convention Next.js 16
- **Supabase** (base peuplée par le bot WhatsApp, ne pas modifier le schéma)
- **Tailwind CSS v4**
- **TypeScript**

## Commandes
```bash
npm run dev     # démarrer le serveur local → http://localhost:3000
npm run build   # vérifier que tout compile
```

---

## Architecture des fichiers

```
clodia/
├── proxy.ts                        # Protection des routes (Next.js 16 = middleware renommé)
├── .env.local                      # Variables Supabase (ne pas committer)
│
├── lib/
│   ├── types.ts                    # Toutes les interfaces TypeScript (Client, Commande, Menu…)
│   ├── supabase.ts                 # Client browser (composants "use client")
│   └── supabase-server.ts          # Client server (Server Components, Route Handlers)
│
├── components/
│   ├── Nav.tsx                     # Navigation sticky (client component)
│   ├── Hero.tsx                    # Hero plein écran avec image Unsplash
│   ├── Marquee.tsx                 # Bandeau défilant
│   ├── HowItWorks.tsx              # Section "Comment ça marche" (4 étapes)
│   ├── Formules.tsx                # Tarifs depuis Supabase (server component)
│   ├── PointsLivraison.tsx         # Points de livraison depuis Supabase (server component)
│   ├── CtaWhatsApp.tsx             # Section CTA finale avec QR code
│   ├── WhatsAppCTA.tsx             # Composant réutilisable : WhatsAppButton + WhatsAppQR
│   └── Footer.tsx                  # Footer simple
│
├── app/
│   ├── layout.tsx                  # Fonts (Playfair Display + Inter), metadata
│   ├── globals.css                 # Variables CSS, classes utilitaires (.btn-primary etc.)
│   ├── page.tsx                    # Landing page (/)
│   │
│   ├── auth/
│   │   ├── connexion/page.tsx      # Magic link email → /mon-compte
│   │   ├── admin/page.tsx          # Email + password → /admin
│   │   └── callback/route.ts       # Handler OAuth/magic link Supabase
│   │
│   ├── mon-compte/
│   │   ├── page.tsx                # Server Component : fetch user + data
│   │   └── MonCompteClient.tsx     # Client Component : tabs, logout, affichage
│   │
│   └── admin/
│       ├── layout.tsx              # Vérifie rôle admin côté serveur
│       ├── AdminSidebar.tsx        # Sidebar avec navigation
│       ├── page.tsx                # Dashboard (KPIs, commandes par statut)
│       ├── menus/
│       │   ├── page.tsx            # Liste menus groupés par semaine
│       │   └── MenusClient.tsx     # Édition inline, toggle publié, création
│       ├── clients/
│       │   ├── page.tsx            # Fetch clients + comptage commandes
│       │   └── ClientsTable.tsx    # Table filtrée, search, cards mobile
│       └── pipeline/
│           └── page.tsx            # Vue semaine, volume par variante, slots
```

---

## Supabase — Schéma (NE PAS MODIFIER)

| Table | Colonnes clés |
|---|---|
| `clients` | id, telephone, prenom, nom, email, point_livraison, created_at |
| `commandes` | id, ref_commande, client_id, menu_id, type, variante, quantite, prix_unitaire, prix_total, statut, stripe_id, reserve_jusqua, created_at, point_livraison |
| `menus` | id, date_livraison, semaine, annee, plat, plat_vege, dessert, publie, photo, created_at |
| `points_livraison` | id, hopital, batiment, service, service_desc, created_at |
| `slots_unite` | id, date_livraison, variante, total, reserves, confirmes |
| `tarifs` | id, type, repas_de, repas_a, prix_unitaire |
| `config` | id, cle, valeur, description |
| `logs` | id, telephone, role, message, created_at |

Valeurs de `commandes.statut` : `reserve` · `confirme` · `livre` · `annule`
Valeurs de `commandes.variante` : `plat` · `plat_vege`

---

## Design system

### Palette CSS (définie dans globals.css)
```css
--green:    #4A6741   /* CTA principal, accents verts */
--green-dk: #3a5233   /* Hover du vert */
--wa:       #25D366   /* Bouton WhatsApp uniquement */
--coral:    #F80F50   /* Erreurs, alertes */
--sand:     #F5F0E8   /* Background section CTA */
--gray-50:  #FAFAF9
--gray-100: #F3F2EF
--gray-200: #E5E3DE
--gray-400: #9CA3A0
--gray-600: #4B5563
--dark:     #1A1A1A
```

### Typographie
- **Titres** : `font-family: 'Playfair Display', serif` — chargé via Google Fonts dans layout.tsx
- **Corps** : `font-family: 'Inter', sans-serif`
- Taille hero : `clamp(40px, 6vw, 72px)`
- Sous-titres sections : `clamp(28px, 4vw, 42px)`

### Classes CSS utilitaires (globals.css)
```css
.btn-primary    /* fond vert, texte blanc, hover plus foncé */
.btn-secondary  /* bordure verte, fond transparent, hover inversé */
.card-hover     /* transition shadow au hover */
```

### Règle importante
Les `onMouseEnter` / `onMouseLeave` sont **interdits dans les Server Components**.
Utiliser les classes CSS `.btn-primary`, `.btn-secondary`, `.card-hover` à la place.

---

## Auth

### Espace client (/mon-compte)
- Magic link email via `supabase.auth.signInWithOtp()`
- Callback : `/auth/callback/route.ts` → `exchangeCodeForSession(code)`
- Matcher client : `SELECT * FROM clients WHERE email = user.email`

### Back-office (/admin)
- Email + password via `supabase.auth.signInWithPassword()`
- Vérification rôle : `user.app_metadata.role === 'admin'`
- Double protection : proxy.ts (edge) + layout admin (server)

### Créer les comptes test
**Client** :
1. Supabase Dashboard → Authentication → Users → Add user
   - Email : `client-test@clodia.fr` / Password : `Clodia2024!`
2. SQL Editor :
```sql
INSERT INTO clients (telephone, prenom, nom, email)
VALUES ('0600000001', 'Marie', 'Dupont', 'client-test@clodia.fr');
```

**Admin** :
1. Supabase Dashboard → Authentication → Users → Add user
   - Email : `admin@clodia.fr` / Password : `ClodiaAdmin2024!`
2. SQL Editor :
```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@clodia.fr';
```

---

## WhatsApp
```
Numéro  : +33 7 53 79 16 17
URL     : https://wa.me/33753791617?text=Bonjour%2C%20je%20souhaite%20commander%20avec%20Clodia%20%F0%9F%8D%BD%EF%B8%8F
```
Composant réutilisable : `components/WhatsAppCTA.tsx`
- `<WhatsAppButton />` — bouton vert avec icône SVG
- `<WhatsAppQR />` — QR code via `qrcode.react`

---

## Points d'attention Next.js 16

1. **proxy.ts** (pas middleware.ts) — la fonction exportée s'appelle `proxy`
2. **`await cookies()`** — les cookies sont asynchrones en Next.js 16
3. **Server Components** — pas d'event handlers inline (`onMouseEnter` etc.)
4. **`next/font/google`** — la font Chillax n'est pas disponible, utiliser Google Fonts via `<link>` dans layout.tsx
