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
