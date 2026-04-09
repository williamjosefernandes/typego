# Runtime

TypeGo has two runtime layers:

- `src/runtime`: TypeScript runtime for local development and metadata integration
- `runtime-go`: Go runtime helpers for ultra-fast production handlers

The CLI build command emits Go code in `generated/go`.

Runtime TypeScript supports:

- DI resolution via `static inject` or `@Injectable({ inject: [...] })`
- Module bootstrap via `createTypeGoServer({ module: AppModule })`
- Middleware chain order: global -> controller (`@Use`) -> route (`@Use`)
- Provider styles: class providers, `useValue`, `useFactory`, `useClass`
- Module composition via `@Module({ imports: [...] })`
- Configuration module via `createConfigModule()` and `ConfigService`

