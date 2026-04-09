# Compiler

TypeGo compiler pipeline:

1. Read `*.controller.ts`
2. Parse decorators with `ast-parser`
3. Transform to intermediate representation
4. Generate `generated/go/main.go`

Configuration:

- Reads `typego.config.ts` (`srcDir`, `outDir`, `runtime`, `envFile`, `port`)
- Loads environment values from configured `envFile` before compilation
- Emits Go server code that uses `PORT` env with config/default fallback

Current parser is intentionally minimal and focused on bootstrap workflows.

