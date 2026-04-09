# Conventions

## Design Rules

- Keep controllers thin: orchestrate requests, avoid business logic.
- Put business logic in services under `application`.
- Register dependencies in each feature module.
- Prefer explicit DI with `static inject` for controllers/services that require dependencies.
- Keep cross-cutting concerns in `src/shared`.

## Naming

- `*.controller.ts` for HTTP entry points
- `*.service.ts` for application services
- `*.module.ts` for module composition
- `*.middleware.ts` for middleware functions/classes
- `*.repository.ts` for data-access objects

## Database / Prisma

- Use only `DATABASE_URL` and `DB_RELATIONAL_DRIVER` as database environment variables.
- `DATABASE_URL`: full connection string (e.g. `postgresql://user:pass@host:5432/db`).
- `DB_RELATIONAL_DRIVER`: Prisma provider name (e.g. `postgres`, `mysql`, `sqlite`).
- Inject `TOKENS.PRISMA_CLIENT` into repositories via factory provider in `infrastructure.providers.ts`.
- Do **not** use `DB_RELATIONAL_URL`, `DB_NOSQL_DRIVER`, or `DB_NOSQL_URL`.

