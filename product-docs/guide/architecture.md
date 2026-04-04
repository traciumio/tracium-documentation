# Architecture

Tracium is an ecosystem of cooperating products, not a single application.

## System Diagram

```
  Prism (UI)     Pulse (IDE)     Vector (SDK)
       \              |              /
        \             |             /
         +---- Nerva (API) -------+
               /           \
              /             \
    Tracium Engine        Atlas
    (execution)        (static analysis)
              \             /
               \           /
            Quanta (shared contracts)
```

## Products

| Product | Purpose | Tech |
|---------|---------|------|
| **Tracium Engine** | Execution recording | Java 26, JDI, Spring Boot |
| **Nerva** | Orchestration + trace store | TypeScript, Fastify |
| **Prism** | Visualization | React, TypeScript |
| **Atlas** | Repository analysis | Java, AST parsing |
| **Vector** | Client SDK | TypeScript |
| **Pulse** | IDE plugin | VS Code Extension API |
| **Quanta** | Shared schemas | JSON Schema |

## Data Flow

1. Client submits code to **Nerva** (port 4000)
2. Nerva forwards to **Tracium Engine** (port 8080)
3. Engine compiles, executes via JDI, captures state
4. Engine returns UEF trace
5. Nerva **persists trace to disk** and returns result
6. Consumers (Prism, Pulse, Vector) query persisted traces from Nerva

## Key Rules

1. **Engine is headless** — no UI, produces data only
2. **Traces are persistent** — stored on disk, queryable
3. **Contracts are sacred** — UEF is the shared language
4. **Consumers are independent** — Prism, Pulse, Vector can evolve separately
