# Mimiversaire 🎂

Un quiz anniversaire style Kahoot pour fêter l'anniv de Mimi en stream. Solo, 3 questions (extensible), clips vidéos sur bonne réponse, texte roast sur mauvaise.

## Stack

- **Next.js 16** — App Router, PPR, Server Actions
- **React 19** + TypeScript strict
- **Tailwind CSS v4** + Framer Motion + shadcn/ui
- **Zustand** (state client, persist sessionStorage)
- **Drizzle ORM** + **Neon PostgreSQL** (serverless)
- **Zod** (validation serveur)
- **Vitest** + Testing Library

## Setup

### 1. Installer les dépendances

```bash
pnpm install
```

### 2. Variables d'environnement

Copie `.env.example` en `.env.local` et remplis les valeurs :

```bash
cp .env.example .env.local
```

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
ADMIN_PASSWORD=ton-mot-de-passe-admin
```

`DATABASE_URL` → connection string Neon (onglet "Connection string" sur neon.tech)

### 3. Créer les tables

```bash
pnpm db:push
```

### 4. Insérer les questions

```bash
pnpm db:seed
```

> Les questions sont définies dans `src/lib/db/seed.ts`. Pour modifier les questions, édite ce fichier puis relance `pnpm db:seed`.

### 5. Lancer en dev

```bash
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Commande | Description |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production |
| `pnpm test` | Tests Vitest |
| `pnpm db:push` | Push du schéma vers Neon |
| `pnpm db:seed` | Insère les 3 questions de test |
| `pnpm db:studio` | Interface Drizzle Studio |

---

## Variables d'environnement

| Variable | Description | Requis |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | Oui |
| `ADMIN_PASSWORD` | Mot de passe page admin | Oui |

---

## Flow du jeu

```
/ (accueil)
  → clic "Démarrer" → createSession() en DB
    → /quiz
      → Question 1..N (timer 20s)
          → Bonne réponse → ClipPlayer (vidéo R2)
          → Mauvaise réponse → RoastDisplay (texte)
      → Fin → ScoreBoard (score + verdict + replay)
```

---

## Page admin

`/admin` — ajouter / supprimer des questions.

- Protégé par `ADMIN_PASSWORD` (cookie httpOnly, 8h)
- Accès : `/admin` → redirige vers `/admin/login` si non authentifié

---

## Ajouter des questions

Option A — via la page admin `/admin`

Option B — éditer `src/lib/db/seed.ts` et relancer `pnpm db:seed`

Format d'une question :

```ts
{
  order: 4,                    // ordre d'apparition
  text: "Ma question ?",
  options: [
    { label: "A", text: "Réponse A" },
    { label: "B", text: "Réponse B" },
    { label: "C", text: "Réponse C" },
    { label: "D", text: "Réponse D" },
  ],
  correctIndex: 2,             // 0=A, 1=B, 2=C, 3=D
  clipUrl: "https://pub-xxx.r2.dev/clips/mon-clip.mp4",  // ou null
  roastText: "T'as raté ça vraiment ?",
}
```

---

## Déploiement Vercel

1. Push le repo sur GitHub
2. Importe le projet sur [vercel.com](https://vercel.com)
3. Ajoute les variables d'environnement dans Settings → Environment Variables
4. Deploy

Vercel détecte automatiquement Next.js. Neon + Vercel fonctionnent sans configuration supplémentaire.
