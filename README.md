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

Você escreve:

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

# 📦 Instalação (Em desenvolvimento)

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

Build para produção:

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
    return {
      message: "Hello TypeGo"
    }
  }

}
```

---

# 🧩 Dependency Injection

```typescript
@Injectable()
export class UsersService {

  findAll() {
    return []
  }

}
```

```typescript
@Controller('/users')
export class UsersController {

  constructor(
          private usersService: UsersService
  ) {}

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
```

---

# 🧠 Objetivo

O objetivo do **TypeGo** é criar:

* Backend extremamente rápido
* Baixo consumo de memória
* Alta escalabilidade
* Desenvolvimento simples

---

# 🌎 Casos de Uso

* APIs de alta performance
* Microservices
* SaaS escalável
* Backend para IA
* Sistemas corporativos
* Serverless

---

# 🗺️ Roadmap

## V1

* Compiler TypeScript → Go
* HTTP Server
* Controllers
* CLI

## V2

* Dependency Injection
* Middleware
* Services

## V3

* ORM
  * Auth
* Cache

## V4

* Microservices
* gRPC
* Queue

---

# 🤝 Contribuição

Contribuições são bem-vindas!

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
