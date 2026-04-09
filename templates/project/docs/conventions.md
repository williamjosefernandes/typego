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

