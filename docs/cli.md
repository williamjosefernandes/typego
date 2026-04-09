# CLI

## Commands

- `typego create <name>`: create a new project from templates
- `typego new <name>`: alias for create
- `typego build`: parse TypeScript controllers and emit Go source (uses `typego.config.ts`)
- `typego dev`: build and watch configured `srcDir`
- `typego start`: run generated Go output from configured `outDir`
- `typego generate <kind> <name> [feature]`: scaffold files in architecture folders

Generator output layout:

- `controller`: `src/modules/<feature>/presentation/<name>.controller.ts`
- `service`: `src/modules/<feature>/application/<name>.service.ts`
- `module`: creates `application`, `presentation`, `<feature>.module.ts`, and `index.ts`
- `middleware`: `src/shared/middleware/<name>.middleware.ts`

`build`, `dev`, and `start` also load environment variables from `envFile` in `typego.config.ts` (default `.env`).

