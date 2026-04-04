# Product Roadmap - Tracium Ecosystem

## Roadmap Philosophy

The goal is not to ship a throwaway MVP. The goal is not to build a visualizer.

The goal is to build **execution intelligence infrastructure** -- a system that turns program execution into queryable, replayable, persistent data. The Kafka of execution state.

Build a final-quality foundation with careful contracts, then grow capabilities in a deliberate order that always serves the infrastructure vision.

## One-Line Positioning

> Tracium turns program execution into a queryable, replayable data model.

## Ecosystem Overview

Tracium is delivered through **7 cooperating products**:

| # | Product | Codename | Type | Tech |
|---|---------|----------|------|------|
| 1 | Shared Specs & Contracts | **Quanta** | SPEC | JSON Schema, Markdown |
| 2 | Execution Recording Engine | **Tracium Engine** | SERVICE | Java 21, JDI, Gradle |
| 3 | Repository Analyzer | **Atlas** | SERVICE | Java 21, Gradle |
| 4 | Orchestration + Trace Store | **Nerva** | SERVICE | TypeScript |
| 5 | Visualization Platform | **Prism** | APP | React, TypeScript |
| 6 | Client SDK | **Vector** | SDK | TypeScript |
| 7 | IDE Plugin | **Pulse** | PLUGIN | TypeScript, VS Code API |

## Phase Summary

| Phase | Name | Status | Detailed Plan |
|-------|------|--------|---------------|
| 0 | Documentation & Contracts | COMPLETE | [phase-0-contracts.md](phase-0-contracts.md) |
| 1 | CSE Foundation + Trace Persistence | NEXT | [phase-1-cse-foundation.md](phase-1-cse-foundation.md) |
| 2 | Visualization Platform Foundation | PLANNED | [phase-2-visualization.md](phase-2-visualization.md) |
| 3 | Repo Analyzer First-Class Track | PLANNED | [phase-3-repo-analyzer.md](phase-3-repo-analyzer.md) |
| 4 | GitHub-Connected Repository Access | PLANNED | [phase-4-github-access.md](phase-4-github-access.md) |
| 5 | IDE Plugin | PLANNED | [phase-5-ide-plugin.md](phase-5-ide-plugin.md) |
| 6 | API & SDK | PLANNED | [phase-6-api-sdk.md](phase-6-api-sdk.md) |
| 7 | Production Recording & Streaming | PLANNED | [phase-7-production-streaming.md](phase-7-production-streaming.md) |
| 8 | Multi-Language Expansion | FUTURE | [phase-8-multi-language.md](phase-8-multi-language.md) |
| 9 | Distributed Execution & Diffing | FUTURE | [phase-9-distributed-diffing.md](phase-9-distributed-diffing.md) |
| 10 | Intelligence Layer | FUTURE | [phase-10-intelligence.md](phase-10-intelligence.md) |

## Infrastructure Capabilities by Phase

| Capability | Introduced | Matured |
|-----------|-----------|---------|
| Sandbox execution (launch mode) | Phase 1 | Phase 1 |
| UEF trace production | Phase 1 | Phase 1 |
| Trace persistence & querying | Phase 1 | Phase 6 |
| Trace replay & visualization | Phase 2 | Phase 2 |
| Static architecture analysis | Phase 3 | Phase 3 |
| Real-time event streaming | Phase 7 | Phase 7 |
| Production recording (attach mode) | Phase 7 | Phase 7 |
| Execution diffing & comparison | Phase 9 | Phase 9 |
| Distributed trace correlation | Phase 9 | Phase 9 |
| AI reasoning over traces | Phase 10 | Phase 10 |

## Priority Order

1. Contract foundation (Quanta) -- the shared language
2. CSE + Trace Persistence (Tracium Engine + Nerva) -- execution becomes data
3. Visualization Platform (Prism) -- make the data visible
4. Repo Analyzer (Atlas) -- structural intelligence
5. IDE Plugin (Pulse) -- bring it to the workflow
6. API and SDK (Vector) -- make it embeddable
7. Production Recording & Streaming -- make it real-world
8. Multi-language expansion -- broaden reach
9. Distributed Execution & Diffing -- enterprise-grade
10. Intelligence Layer -- AI-powered understanding

This order keeps the infrastructure core strong: execution recording + persistence comes BEFORE visualization, ensuring we build infrastructure, not a visualizer.

## Dependency Graph

```
Phase 0 (Contracts/Quanta)
    |
    v
Phase 1 (CSE + Trace Persistence) --------+
    |                                       |
    v                                       v
Phase 2 (Prism Visualization)    Phase 3 (Atlas Repo Analyzer)
    |                                       |
    +---------------------------------------+
    |
    v
Phase 4 (GitHub Access via Nerva)
    |
    +-------------------+
    |                   |
    v                   v
Phase 5 (Pulse)    Phase 6 (Vector SDK)
    |                   |
    +-------------------+
    |
    v
Phase 7 (Production Recording + Streaming)
    |
    v
Phase 8 (Multi-Language)
    |
    v
Phase 9 (Distributed + Diffing) --> Phase 10 (Intelligence Layer)
```

## Guiding Principles

1. **Infrastructure first, UI second.** CSE and trace persistence are the foundation. Prism is a consumer.
2. **Execution is data.** Every trace is a persistent, queryable artifact. Not ephemeral visualization input.
3. **Record, don't just execute.** Support both sandbox (launch) and production (attach) modes.
4. **Stream, don't just batch.** Live event delivery during capture, not only post-hoc analysis.
5. **Contracts are sacred.** UEF and UGF are the shared language. Everything flows through them.
6. **AI is a first-class consumer.** Every design decision considers how AI will consume the data.
