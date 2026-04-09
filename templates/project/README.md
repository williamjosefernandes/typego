# TypeGo App Template

## Architecture

This template uses a feature-first and layered structure:

- `src/app`: application bootstrap and root module
- `src/modules`: business features (`application`, `presentation`)
- `src/shared`: cross-cutting concerns (middlewares, helpers)

## First Run

1. Install dependencies
2. Run development mode

```bash
npm install
npm run dev
```

The default health endpoint is `GET /health/`.

## Generate Components

```bash
typego generate module users
typego generate service users users
typego generate controller users users
typego generate middleware auth
```

