# CLODIA — Webapp client (Next.js)

Site et espace client de Clodia : repas du jour livrés dans les frigos des services hospitaliers (CHU de Limoges d'abord). Menus plat + dessert (déclinaison végétarienne) qui changent chaque jour ; formules abonnement / à l'unité / commande groupée (B2B). Déployé sur Vercel (https://clodia.vercel.app, déploiement fait par l'associé de François — rien n'est en ligne tant qu'il n'a pas redéployé).

## Stack et commandes

- Next.js 16 (app router), React 19, TypeScript, Tailwind 4, Supabase (`@supabase/ssr`), Stripe (mode test).
- Dev : `npm run dev`. **Si Turbopack plante** (panics en boucle) : supprimer le dossier `.next` puis `npx next dev --webpack`. Port habituel de François : 3001.
- Vérifier avant de rendre la main : `npx tsc --noEmit` (une erreur `apiVersion` dans `lib/stripe.ts` peut exister selon la version du paquet : ne pas la « corriger » sans en parler).
- Variables d'environnement (noms seulement, valeurs dans `.env.local`, jamais lues ni committées) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, optionnelle `IP_HASH_SALT`.

## Structure

- `app/` : pages publiques (accueil, formules, qui-sommes-nous, faq, nous-contacter, mentions-legales, confidentialite), parcours `commander` → `checkout` → `confirmation`, comptes (`connexion`, `inscription`, `mot-de-passe-oublie`, `reinitialiser-mot-de-passe`, `auth`), `espace-client/` (accueil, commandes en cours, historique, programmation, profil).
- `app/api/` : `checkout` (création des commandes + session Stripe), `webhook/stripe`, `tickets` (demandes SAV), `auth/telephone`, `compte/supprimer`.
- `lib/` : `supabase.ts` (navigateur), `supabase-server.ts` (serveur, cookies), `supabase-admin.ts` (service_role, **serveur seulement**), `menus.ts` (semaines, slots, tarifs, points de livraison), `stripe.ts` (initialisation paresseuse), `rate-limit.ts`, `utils.ts` (téléphone, prix), `data.ts` (FAQ, contenus).
- `components/` : Header, Footer, FAQSection/FAQAccordion, ContactForm, DemandeCommande, PointLivraisonSelector, MenuCarousel, CookieBanner.
- `proxy.ts` : rafraîchit la session Supabase (équivalent du middleware de Next 16).

## Conventions et pièges propres à cette application

- **Pas de `select('*')` ni de `any`** ; `try/catch` sur les appels réseau ; garde anti-double soumission sur les actions de paiement ; pas de désaccord d'hydratation (pas de `Date.now()`/`Math.random()` dans le rendu serveur).
- Lecture d'une ligne facultative : `.maybeSingle()` et non `.single()` (sinon HTTP 406 quand la ligne n'existe pas).
- **Session** : côté serveur, c'est `getUserFromCookies()` qui fait foi ; la session du navigateur (`getSession()`) peut diverger → message « Votre session a expiré ». Une session sans fiche `clients` (compte orphelin) est traitée comme *invité* au paiement et renvoie vers `/connexion` dans l'espace client.
- **Parcours invité** (commande sans compte, identifiée par téléphone) : décision de conserver. Le point de livraison est repris du panier (`sessionStorage` : `clodia-point`, `clodia-hopital`, `clodia-batiment`, `clodia-service`) ; ne pas casser cette restauration dans `commander` et `checkout`.
- **Tickets** (`/api/tickets`, table `tickets_sav`, accès service_role uniquement) : champ piège `website` (honeypot), limite 5/heure par empreinte `sha256(ip|IP_HASH_SALT)`, contrôle d'origine, message ≤ 2000 caractères. Types : `annulation`, `remboursement`, `probleme_livraison`, `nouveau_point`, `autre`. Le client ne peut PAS annuler lui-même : bouton « Modifier ou annuler » (commande active) ou « Faire une demande » (autres) qui crée un ticket ; sur une commande passée, le client choisit « Signaler un problème » / « Autre question » (jamais de proposition de remboursement côté client).
- **Reçu Stripe** : un bouton « Reçu » (`components/LienRecu.tsx`) par *commande* `confirme` ayant un `stripe_id`, dans « Commandes en cours » (menus à venir) comme dans l'historique (menus passés). Les commandes d'un même paiement (même `stripe_id`, une Checkout Session par panier) ouvrent le même reçu Stripe ; aucun regroupement ni aucun montant affiché (le total Stripe ne tient pas compte des remboursements). Lien → `GET /api/espace-client/recu?ref=<stripe_id>` (session Supabase + commande du client avec ce stripe_id, sinon 404 uniforme) → redirection 302 vers le `receipt_url` de la charge Stripe.
- Le reçu est récupéré à la demande chez Stripe : aucun stockage en base, aucune URL ni clé journalisée. Une commande `annule` peut être une session expirée (jamais payée) : seul un `confirme` affiche le bouton.
- Test du webhook en local sans Stripe CLI (bloquée par la stratégie Windows) : `node scripts/simuler-webhook.mjs [cs_test_… [port]]` (nécessite une valeur quelconque dans `STRIPE_WEBHOOK_SECRET`, ex. `whsec_local_test`).
- Marque : bordeaux `#4D0F1F`, jaune-vert `#EAFF33`, cyan `#00CCCC`, rose `#FD3D68`/`#FD3D6B`, orange `#FF9933` ; police Chillax.
- Chantiers connus non faits (ne pas les « corriger » en passant) : CGV, médiateur et données société définitives, connexion Google/Facebook, e-mails de confirmation (SMTP), filtre des points inactifs, mise à jour RGPD.


## Contrats partagés entre les applications (à respecter, à tenir à jour dans les DEUX CLAUDE.md)

Clodia = 3 applications sur UN SEUL projet Supabase (`lbowahtxqsglljuqbfup`, région Frankfurt) : le bot WhatsApp (Node/Railway), la webapp client (Next.js/Vercel), le back office (Next.js/Railway). Une modification de schéma ou de règle métier a donc presque toujours un impact sur les autres applications : **ne pas la faire dans ce dépôt seul, la signaler à François** (qui en décide avec Claude dans le chat du projet).

- **Tables « clients »** (webapp + bot) : `clients`, `commandes`, `menus`, `slots_unite`, `points_livraison`, `client_points_livraison` (jonction, remplace l'ancienne colonne `clients.point_livraison`), `programmations`, `tarifs`, `ratings`, `logs`, `tickets_sav`. Tables **du back office** : `bo_staff`, `bo_droits`, `bo_journal`, `bo_remboursements`, `bo_annulations`, `bo_notes_client`, `tournees`. Les tables `bo_*` sont en RLS sans policy : seul le serveur du back office (service_role) y accède.
- **Statuts de commande** (`commandes.statut`) : `en_attente` (paiement non confirmé) → `confirme` → `annule`. Une commande n'est « active/modifiable » que si `confirme`, non livrée (`livre_le` nul) et `menus.date_livraison` strictement postérieure à aujourd'hui (heure de Paris). La commande du jour n'est plus modifiable.
- **Deux types de commande** : *précommande* (semaine suivante, jusqu'au mercredi 23h59 de la semaine précédente, tarif préférentiel, ne touche JAMAIS aux slots) et *à l'unité* (semaine en cours, dates > aujourd'hui, jusqu'à la veille 23h59, places limitées dans `slots_unite`). Logique de semaines : jeudi–dimanche → S+2 précommande / S+1 à l'unité ; lundi–mercredi → S+1 / S0. Heure limite affichée partout : **23h59** (jamais « minuit »).
- **Slots** : réservation atomique via la RPC `reserver_slots(p_reservations jsonb)` (verrou `FOR UPDATE`) ; paiement confirmé → `incrementer_confirmes_slot` ; expiration → `decrementer_reserves_slot`. Ne jamais modifier `slots_unite` par des `update` directs.
- **Annulation** : uniquement par le SAV du back office (RPC `bo_annuler_commande`, effets `slot_libere` / `slots_augmentes` / `aucun_fenetre` / `aucun_passe`). Le site client ne permet pas d'annuler : il crée un *ticket* (`tickets_sav`).
- **Remboursements** (`bo_remboursements`) : statuts `en_attente` → `valide` → `rembourse` | `refuse` | `annule`. Validation directe si l'utilisateur a l'écriture sur `sav.remboursements`, sinon un valideur décide. Remboursement Stripe via l'API (clé restreinte, clé d'idempotence `bo-remb-<id>`). Restant remboursable = montant payé à l'origine − remboursements actifs.
- **Stripe** : un seul webhook (`/api/webhook/stripe` côté webapp) pour `checkout.session.completed` / `expired`. Les Checkout Sessions portent `metadata.source` = `'site'` (webapp) ou `'bot'` (bot) : le webhook de la webapp **ignore** `source === 'bot'`. Mode test pour l'instant.
- **Clés** : la clé `service_role` n'existe que côté serveur (jamais `NEXT_PUBLIC_*`, jamais dans le navigateur, jamais dans un log). Les colonnes sensibles de `points_livraison` (ex. `acces_livreur`, codes d'accès) ne sont JAMAIS lisibles avec la clé anon : toute lecture publique de cette table nomme ses colonnes (pas de `select('*')`).
- **Téléphone** : format E.164 français `+33XXXXXXXXX` (`normaliserTelephone`, `REGEX_TELEPHONE` dans la webapp). La commande « invité » (sans compte) est identifiée par le numéro.
- **Points de livraison** : désactivés dans le back office via `actif=false` ; la webapp et le bot ne filtrent pas encore (`.eq('actif', true)` à ajouter, chantier noté).
- **Heure** : toujours le fuseau Europe/Paris pour les jours, limites et filtres de dates.

## Règles de travail avec François (prioritaires)

- **Réponses et textes d'interface en français.** Ton sobre, professionnel.
- **Reformule avant de coder** toute nouvelle fonctionnalité ou tout changement de comportement, puis attends son « go » (sauf s'il l'a déjà donné). Après coup, dis simplement ce qui a été fait.
- **Étape par étape**, sans refactoring non demandé. Respecte les conventions existantes (nommage, style, structure) ; cite explicitement ce que tu ne touches pas.
- **Fichiers complets** : il préfère recevoir des fichiers réécrits en entier plutôt que des morceaux, pour ce qu'il doit relire.
- **Pas de contournement** : si une solution propre est possible, ne propose pas un bricolage ; explique le raisonnement technique avant d'implémenter.
- **Base de données** : ne jamais modifier la base. Tout changement de schéma = un fichier `.sql` versionné (dans `sql/` si le dossier existe) que François exécute lui-même dans le SQL Editor de Supabase ; mentionne les effets sur le bot / l'autre application.
- **Secrets** : ne jamais lire, afficher, committer ni demander `.env*`, la clé `service_role`, les clés Stripe (`sk_`/`rk_`/`whsec_`). Utiliser les noms de variables uniquement. Les `NEXT_PUBLIC_*` sont les seuls à pouvoir arriver côté navigateur.
- **Données personnelles (RGPD)** : ne jamais mettre de contenu de message, téléphone, e-mail ou nom dans les logs/journaux sans nécessité ; données de santé hors périmètre.
