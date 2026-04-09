# 🚀 TypeGo

**TypeGo** é um framework backend moderno onde você escreve em **TypeScript** e o **TypeGo compila automaticamente para Go**, gerando aplicações **extremamente rápidas, leves e escaláveis**.

TypeGo combina:

* 🧠 Produtividade do TypeScript
* ⚡ Performance do Go
* ☁️ Arquitetura escalável
* 🔥 Baixo consumo de recursos

---

# ✨ Por que TypeGo?

Frameworks tradicionais são produtivos, mas podem apresentar:

* Alto consumo de memória
* Performance limitada em alta escala
* Dependência de runtime pesado

O **TypeGo** resolve isso:

Você escreve em TypeScript → TypeGo converte para Go → Gera binário nativo ultra rápido.

---

# ⚡ Como Funciona

```text
TypeScript → TypeGo Compiler → Go → Binary
```

Exemplo de Controller:

```typescript
@Controller('/users')
export class UsersController {

  @Get()
  getUsers() {
    return [{ name: "William" }]
  }

}
```

TypeGo gera:

```go
func GetUsers(ctx *fasthttp.RequestCtx) {
  ctx.Write([]byte(`[{"name":"William"}]`))
}
```

Resultado:

* ⚡ Sem runtime pesado
* ⚡ Sem overhead
* ⚡ Performance extrema

---

# 🚀 Recursos

* TypeScript-first
* Compilação TypeScript → Go
* Alta performance
* Arquitetura modular
* Dependency Injection
* Controllers e Services
* Middleware
* Microservices
* REST API
* WebSocket
* gRPC
* Cache nativo
* ORM integrado
* CLI poderosa
* Hot Reload
* Build ultra rápido

---

# ⚡ Performance

| Framework      | Linguagem       | Performance |
| -------------- | --------------- | ----------- |
| NestJS         | Node.js         | ⭐⭐⭐         |
| Spring Boot    | Java            | ⭐⭐⭐⭐        |
| Go (Gin/Fiber) | Go              | ⭐⭐⭐⭐⭐       |
| TypeGo         | TypeScript → Go | 🔥🔥🔥🔥🔥  |

---

# 📋 Pré-requisitos

Antes de utilizar o **TypeGo**, instale:

### Obrigatórios

* Node.js >= 20.x
* npm >= 9.x (ou pnpm / yarn)
* Go >= 1.24
* TypeScript >= 5.x

### Recomendados

* Git
* VS Code
* Docker (para builds isolados)

Verifique:

```bash
node -v
npm -v
go version
```

---

# 📦 Instalação

```bash
npm install -g typego
```

Criar projeto:

```bash
typego new app
```

Rodar projeto:

```bash
typego dev
```

Build produção:

```bash
typego build
```

---

# 📁 Estrutura do Projeto

```
typego-app/
├── src/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│
├── typego.config.ts
├── generated/
│   └── go/
└── dist/
```

---

# 🧠 Exemplo

## Controller

```typescript
@Controller('/hello')
export class HelloController {

  @Get()
  hello() {
    return { message: "Hello TypeGo" }
  }

}
```

## Dependency Injection

```typescript
@Injectable()
export class UsersService {

  findAll() {
    return []
  }

}

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}
}
```

---

# 🚀 CLI

```bash
typego new app
typego dev
typego build
typego generate controller users
typego generate service users
typego generate module users
typego generate middleware auth
```

---

# 🗺️ Roadmap Completo

## V1 - Essentials

* Compiler TypeScript → Go
* HTTP Server
* Controllers
* CLI
* Modules
* Decorators (@Controller, @Service, @Module, @Injectable)
* Routing básico

## V2 - Core Features

* Dependency Injection avançado
* Middleware global e por rota
* Services e Providers
* Configuration Module
* Environment management
* Logger integrado

## V3 - Database & Auth

* ORM integrado (relacional e NoSQL)
* Authentication & Authorization (JWT, OAuth2)
* Cache nativo
* Validation pipe
* Exception filters

## V4 - Microservices & Protocols

* gRPC
* Event-based Queue
* Pub/Sub messaging
* Microservices architecture support
* Async communication patterns

## V5 - Web & Realtime

* WebSocket server e client
* Real-time events
* Broadcasting
* Server-sent events

## V6 - Advanced

* GraphQL support
* Jobs & Scheduling
* Advanced metrics & Monitoring
* Swagger/OpenAPI documentation generator
* Testing utilities (unit, integration, e2e)

---

# 🤝 Contribuição

1. Fork do projeto
2. Crie sua branch
3. Commit suas alterações
4. Pull Request

---

# 📄 Licença

MIT License

---

# 🚀 TypeGo

**Write in TypeScript. Run in Go. Scale without limits.**
