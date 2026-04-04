# Tracium

**Tracium turns program execution into a queryable, replayable data model.**

Tracium is an execution intelligence infrastructure -- an ecosystem of cooperating products that captures, structures, persists, and makes program execution data available to any consumer.

## What Tracium Is

Tracium is not a debugger. Not a visualizer. Not a learning tool.

It is the **execution equivalent of Kafka** -- where Kafka turns events into a durable, replayable stream, Tracium turns program execution into a durable, queryable state timeline.

**Before Tracium:** Code executes, state disappears, we infer from logs.
**After Tracium:** Code executes, state becomes structured, replayable, queryable data.

## The Problem

No system today answers:

> "What EXACTLY was the state of the program at every step, and can I replay it?"

- Debuggers show truth but only in real-time, locally, ephemerally
- Observability stacks show metrics and spans but not state
- Logs are partial, sampled, lossy
- Once execution ends, the data is gone forever

## The Solution

Tracium captures execution at the state level and persists it as structured, queryable data:

```
Code -> Execution -> State Timeline -> Persistent, Queryable, Replayable Intelligence
```

## Ecosystem

| Product | Codename | Purpose |
|---------|----------|---------|
| **Tracium Engine** | CSE | Execution recording engine (sandbox + production) |
| **Atlas** | Repo Analyzer | Static code intelligence and architecture graphs |
| **Nerva** | Orchestration | API gateway, trace store, session management |
| **Prism** | Visualization | Interactive trace replay and architecture views |
| **Vector** | SDK | TypeScript client for programmatic access |
| **Pulse** | IDE Plugin | VS Code integration |
| **Quanta** | Specs | Shared contracts (UEF, UGF schemas) |

## Core Contracts

- **UEF** (Universal Execution Format) -- the canonical runtime trace format
- **UGF** (Unified Graph Format) -- the canonical architecture graph format

## Key Capabilities

- Sandbox execution with full state capture
- Production recording via JDI attach mode
- Persistent, queryable trace storage
- Real-time execution streaming
- Execution diffing and regression detection
- Distributed trace correlation across services
- AI-friendly trace representations
- Language-agnostic contracts (Java first, then Python, JS, C++)

## Local Layout

```
tracium/
  docs/               # Architecture, specs, roadmap, design decisions
  quanta/             # Shared schemas (UEF, UGF)
  tracium-engine/     # Runtime execution engine (Java 21, JDI)
  atlas/              # Repository analyzer (Java 21)
  nerva/              # Orchestration + trace store (TypeScript)
  prism/              # Visualization platform (React, TypeScript)
  vector/             # Client SDK (TypeScript)
  pulse/              # VS Code plugin (TypeScript)
  samples/            # Sample HTML previews of all products
```

## Documentation

| Document | Purpose |
|----------|---------|
| [Product Vision](./docs/00-overview/vision.md) | What Tracium is and why |
| [System Overview](./docs/01-architecture/system-overview.md) | Architecture and product boundaries |
| [Tracium Engine](./tracium-engine/docs/README.md) | CSE product documentation |
| [UEF Specification](./docs/07-uef-spec/schema.md) | Runtime trace format |
| [Design Decisions](./docs/09-design-decisions/decisions.md) | 14 core architectural decisions |
| [Roadmap](./docs/08-roadmap/roadmap.md) | 11-phase implementation plan |

## Design Principles

1. **Infrastructure first, UI second.** The engine and trace store are the foundation. Visualization is a consumer.
2. **Execution is data.** Every trace is a persistent, queryable artifact.
3. **Record, don't just execute.** Support both sandbox and production recording.
4. **Stream, don't just batch.** Live event delivery during capture.
5. **Contracts are sacred.** UEF and UGF are the shared language.
6. **AI is a first-class consumer.** Every design considers AI consumption.
