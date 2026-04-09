# Compiler

TypeGo compiler pipeline:

1. Read `*.controller.ts`
2. Parse decorators with `ast-parser`
3. Transform to intermediate representation
4. Generate `generated/go/main.go`

Current parser is intentionally minimal and focused on bootstrap workflows.

