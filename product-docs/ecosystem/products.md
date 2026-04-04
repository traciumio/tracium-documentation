# Tracium Ecosystem

Tracium is not one application. It's an ecosystem of products that share the same execution data through UEF contracts.

## Products

| Product | Codename | What It Does | Status |
|---------|----------|-------------|--------|
| **Tracium Engine** | CSE | Executes code via JDI, captures state, produces UEF | ✅ Working |
| **Nerva** | — | Orchestrates sessions, persists traces, serves API | ✅ Working |
| **Prism** | — | Visualizes traces with step-by-step playback | 🔄 In Progress |
| **Atlas** | — | Analyzes repository structure, produces UGF | Planned |
| **Vector** | — | TypeScript SDK for programmatic access | Planned |
| **Pulse** | — | VS Code / JetBrains IDE integration | Planned |
| **Quanta** | — | Shared schemas (UEF, UGF) | ✅ Defined |

## How They Connect

```
User → Prism (or Pulse, or Vector)
         ↓
       Nerva (API + trace store)
       ↙         ↘
Tracium Engine    Atlas
  (runtime)     (static)
       ↘         ↙
      Quanta (contracts)
```

## Shared Contracts

- **UEF** — Universal Execution Format. Runtime traces.
- **UGF** — Unified Graph Format. Architecture graphs.

Every product reads or writes these formats. No product owns execution logic except Engine. No product owns analysis logic except Atlas.
