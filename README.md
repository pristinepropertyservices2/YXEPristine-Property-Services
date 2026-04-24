# YXE Pristine Property Services

Full-stack cleaning services web application built with Next.js, Prisma, PostgreSQL, and NextAuth.

## Features

- Marketing website with dedicated pages: Home, Services, About, Pricing, Contact
- Customer authentication and booking flow
- Multi-step booking wizard with service/add-on selection
- Stripe Checkout and PayPal payment integration
- Customer dashboard to track booking status
- Admin dashboard to view/update bookings and assign cleaner names
- Responsive global navbar, smooth scrolling, and scroll-to-top button

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM
- PostgreSQL
- NextAuth
- Stripe + PayPal APIs

## Prerequisites

- Node.js 18+ (or Bun as configured)
- npm
- Docker + Docker Compose (for local PostgreSQL)

## Environment Setup

1. Copy environment template and update values:

```bash
cp postgres.env.example .env
```

2. Ensure at minimum these variables are set in `.env`:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL (Docker):

```bash
npm run docker:up
```

3. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

4. Seed database (admin user + services/add-ons):

```bash
npm run db:seed
```

5. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Server Deployment (PM2 + PostgreSQL)

Use this quick flow for a VPS/Ubuntu server.

1) Install runtime tools (once):

```bash
sudo apt update
sudo npm install -g pm2
```

2) Clone app, install deps, and set env:

```bash
git clone <your-repo-url>
cd YXEPristine-Property-Services
npm install
cp postgres.env.example .env
```

Update `.env` with production values (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, Stripe/PayPal keys, etc.).

3) Prepare database and build app:

```bash
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run build
```

4) Run app with PM2:

```bash
pm2 start npm --name yxe-pristine -- run start
pm2 save
pm2 startup
```

5) Open required firewall ports:

- App: `3000`
- Postgres: your DB port (keep closed publicly unless needed)

### Update / redeploy

```bash
git pull
npm install
npm run db:generate
npx prisma migrate deploy
npm run build
pm2 restart yxe-pristine
```

### Rollback deployment

#### 1) App rollback (fast)

If a release is bad, switch to a previous commit and restart PM2:

```bash
git log --oneline -n 10
git checkout <previous-good-commit>
npm install
npm run build
pm2 restart yxe-pristine
```

Then create a rollback branch/tag from that commit before the next deploy.

#### 2) Database rollback (important)

`prisma migrate deploy` is forward-only in production. For rollbacks:

- Prefer a new "fix" migration instead of trying to reverse history.
- If you must fully revert data/schema, restore from backup (below).

#### 3) Postgres backup before deploy

```bash
mkdir -p backups
pg_dump "$DATABASE_URL" > backups/pre_deploy_$(date +%F_%H-%M-%S).sql
```

#### 4) Postgres restore (if needed)

```bash
psql "$DATABASE_URL" < backups/<backup-file>.sql
```

After restore:

```bash
npm run db:generate
npm run build
pm2 restart yxe-pristine
```

### Useful checks

```bash
pm2 status
pm2 logs yxe-pristine
```

### GitHub Actions deployment to VPS

This repo includes `.github/workflows/deploy-vps.yml`.

It runs on push to `main` (and manual trigger), then on your VPS it:

1. Pulls latest code
2. Installs dependencies (`npm ci`)
3. Runs Prisma deploy migrations
4. Builds app
5. Restarts PM2 app (`nextjs-app`)

Set these GitHub repository secrets before using it:

- `VPS_HOST` - Server IP/domain
- `VPS_PORT` - SSH port (usually `22`)
- `VPS_USER` - SSH user
- `VPS_SSH_KEY` - Private SSH key for that user
- `VPS_APP_DIR` - App directory on server (example: `/var/www/YXEPristine-Property-Services`)
- `VPS_NODE_BIN` *(optional)* - Directory containing `node` and `npm` if deploy fails with `npm: command not found` (see below)

#### If deploy fails with `npm: command not found`

GitHub Actions uses a **non-interactive** SSH session, so it does not load `~/.bashrc` (where **nvm** / **fnm** often add Node to `PATH`).

The workflow tries to load nvm, fnm, and asdf automatically. If it still fails:

1. On the server, find where `npm` lives: `command -v npm` (while logged in interactively).
2. Add the **parent directory** of `npm` as repo secret `VPS_NODE_BIN` (for example `/home/deploy/.nvm/versions/node/v20.10.0/bin`).

Or install Node so it is on the default non-interactive path (for example system Node from your OS, or export `PATH` in `~/.profile` for the deploy user).

## Useful Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed database
- `npm run db:reset` - Reset database
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container

## Notes

- If OAuth providers are not configured locally, email verification can be relaxed for development.
- Keep secrets and real API keys out of git. Do not commit your `.env` file.
