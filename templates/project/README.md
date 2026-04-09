# TypeGo App Template

## Architecture

This template uses a feature-first and layered structure:

- `src/app`: application bootstrap and root module
- `src/config`: application settings and defaults
- `src/modules`: business features (`application`, `presentation`)
- `src/shared`: cross-cutting concerns (middlewares, providers)
- `prisma`: Prisma schema and migrations

## First Run

1. Copy `.env.example` to `.env` and fill in your database credentials
2. Install dependencies
3. Generate Prisma client
4. Run development mode

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

The default health endpoint is `GET /health/`.

## Environment Variables

| Variable              | Description                       | Default    |
|-----------------------|-----------------------------------|------------|
| `PORT`                | HTTP server port                  | `3000`     |
| `NODE_ENV`            | Runtime environment               | `development` |
| `DATABASE_URL`        | Full database connection URL      | —          |
| `DB_RELATIONAL_DRIVER`| Prisma datasource provider        | `postgres` |

## Database

This template uses [Prisma](https://www.prisma.io/) as the ORM.

- Schema: `prisma/schema.prisma`
- The `DB_RELATIONAL_DRIVER` env var maps to the Prisma `datasource.provider` field.
- The `DATABASE_URL` env var maps to the Prisma `datasource.url` field.

Run migrations:

```bash
npm run prisma:migrate
```

## Generate Components

```bash
typego generate module users
typego generate service users users
typego generate controller users users
typego generate middleware auth
```


