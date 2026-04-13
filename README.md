# byop - Build Your Own Portfolio

## DevfolioX

DevfolioX is a production-ready multi-user portfolio generator platform built with Next.js App Router.

Users sign in with GitHub, edit their profile and projects, and publish a public portfolio route at:

- https://portfolio.tinobritty.me/[username]

This repository is free-tier friendly and designed for student scale.

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn-style UI components
- Neon PostgreSQL (serverless)
- NextAuth (GitHub OAuth)
- Framer Motion
- Vercel deployment target

## Features

- GitHub OAuth only authentication
- Dashboard with sections:
  - Profile
  - Projects
  - Themes
  - Deploy
  - Resume
  - Analytics
- GitHub repository import flow
- Portfolio publish toggle
- Dynamic public portfolio route at /[username]
- Light and dark mode support
- Analytics via portfolio view counter
- SEO metadata for public portfolio pages

## Folder Structure

```text
.
├── db/
│   └── schema.sql
├── src/
│   ├── app/
│   │   ├── [username]/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── github/repos/route.ts
│   │   │   └── portfolio/[username]/view/route.ts
│   │   ├── dashboard/
│   │   │   ├── analytics/page.tsx
│   │   │   ├── deploy/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── resume/page.tsx
│   │   │   ├── themes/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/github-signin-button.tsx
│   │   ├── dashboard/
│   │   ├── layout/dashboard-sidebar.tsx
│   │   ├── portfolio/view-tracker.tsx
│   │   ├── providers/app-providers.tsx
│   │   ├── shared/
│   │   └── ui/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── repositories.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   └── types/
│       ├── db.ts
│       └── next-auth.d.ts
├── .env.example
├── .eslintrc.json
├── .gitignore
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── prettier.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Database Schema

This project includes a hardened database layer:

- Singleton Neon client in the app runtime
- One-time schema validation before queries
- Clear startup/runtime logs if required tables are missing

Required core tables:

- users
- portfolios
- projects

Additional table:

- portfolio_views

## Neon Setup and Migrations

1. Create a Neon project and database.
2. Copy your pooled connection string into DATABASE_URL in .env.local.
3. Run schema setup from VS Code terminal:

```bash
npm run db:setup
```

4. Verify schema:

```bash
npm run db:check
```

5. Optional manual check in Neon SQL editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

If setup is incomplete, auth callback logs a clear error and redirects users to a friendly error page instead of crashing.

## Environment Variables

Copy .env.example to .env.local and fill values:

```bash
cp .env.example .env.local
```

Required:

- NEXTAUTH_URL
- NEXTAUTH_SECRET
- GITHUB_ID
- GITHUB_SECRET
- DATABASE_URL

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Configure GitHub OAuth app.
	- Homepage URL: http://localhost:3000
	- Callback URL: http://localhost:3000/api/auth/callback/github

3. Initialize Neon schema.

```bash
npm run db:setup
npm run db:check
```

4. Start development server.

```bash
npm run dev
```

5. Open:
	- Landing page: http://localhost:3000
	- Dashboard: http://localhost:3000/dashboard
	- Public portfolio: http://localhost:3000/[username]

## Security

- Dashboard routes are protected with NextAuth middleware.
- Server actions check authenticated user ownership before writes.
- Input validation uses Zod schemas.
- Public route renders only published portfolios.

## Deploy to Vercel + Neon

1. Push repository to GitHub.
2. Import project into Vercel.
3. Set environment variables in Vercel project settings.
4. Ensure GitHub OAuth production callback URL:
	- https://your-domain/api/auth/callback/github
5. Run migrations on Neon production database.

```bash
npm run db:setup
npm run db:check
```
6. Deploy.

After deployment:

- Dashboard remains private behind auth.
- Public portfolios resolve at /[username] only when published.

## Open Source Notes

- ESLint and Prettier are configured.
- Codebase is organized by app/features for contributor clarity.
- PRs should include at least one manual test scenario in description.