# Tracium Engine

Tracium Engine is the execution-recording core of Tracium. It captures running code, turns execution into structured traces, stores them locally in TraciumDB, and exposes analysis and live-debugging workflows through a REST API, SSE, an embedded UI, and a standalone agent.

## Current Repository Scope

The current engine repository contains 4 modules and 89 Java source files:

- `engine-core`
- `engine-java-jdi-adapter`
- `engine-service`
- `engine-agent`

## What It Does

The engine currently supports:

- sandbox execution of Java code
- JDI attach mode for running JVMs
- time-machine analysis
- real and predictive fork workflows
- execution diffing
- AI-oriented summaries and narratives
- causality and slicing helpers
- simulation helpers
- SSE streaming for runtime sessions
- TraciumDB embedded persistence
- embedded browser UI
- standalone attach agent

## Advanced Capture Features in Source

The codebase also includes enterprise-scaling components:

- capture budgets and budgeted state capture
- event ring buffer
- request-level sampling
- circuit breaker
- async write queue
- retention policy

Some of these are active defaults today, and some are currently reusable building blocks that are present in source but not yet the default service path.

## Architecture

```text
tracium-engine/
  engine-core/
    - UEF models
    - state model
    - timeline / time machine
    - diffing
    - AI helpers
    - causality
    - simulation
    - distributed assembly helpers
    - TraciumDB
    - sampling / retention / async storage primitives

  engine-java-jdi-adapter/
    - JavaCompiler
    - JdiExecutionEngine
    - JdiAttachEngine
    - JdiForkEngine
    - BudgetedStateCapture
    - EventRingBuffer
    - SandboxPolicy

  engine-service/
    - runtime API
    - attach API
    - time-machine API
    - diffing API
    - AI API
    - causality API
    - simulation API
    - TraciumDB API
    - SSE streaming
    - embedded UI
    - auth / metrics / swagger

  engine-agent/
    - TraciumAgent
    - AgentConfig
    - standalone attach workflow
```

## How It Runs

### Sandbox Mode

1. compile Java source
2. launch a JVM under JDI
3. capture steps, state, and deltas
4. assemble a UEF trace
5. persist the trace in TraciumDB

### Attach Mode

1. connect to a running JVM over JDWP / JDI
2. capture bounded state using a recording strategy
3. assemble an observed-mode UEF trace
4. persist the trace in TraciumDB

## Storage

TraciumDB stores:

- trace files
- metadata index
- variable/value search index
- fork relationships

No external database is required.

## User Interfaces

You can use the engine through:

- REST API
- Swagger UI
- SSE streaming endpoints
- embedded UI at `/`
- standalone `tracium-agent.jar`

## Current Caveats

- Java is the only real language adapter today
- sandbox execution is the most mature execution path
- attach mode is shipped and usable, but production hardening is still improving
- async storage, retention, circuit breaking, and full sampling control are present in source but not yet the default end-to-end service flow
