# CSE Overview

## Purpose

`CSE` (`Code State Engine`) is the execution recording and intelligence core of the ecosystem.

Its purpose is to turn program execution into a structured, persistent, queryable, replayable, language-agnostic state timeline.

The core abstraction is:

`Code -> Execution -> Runtime Signals -> Normalized State -> Timeline -> Persistent UEF`

The positioning:

> CSE is to execution what Kafka is to events: it captures, structures, persists, and makes execution data available to any consumer.

## Responsibilities

`CSE` is responsible for:

- launching execution through language-specific adapters (sandbox mode)
- observing running processes through attach-mode instrumentation (production recording mode)
- capturing runtime events at configurable fidelity levels
- streaming events in real-time to live consumers
- modeling stack, heap, references, and source location
- normalizing execution into stable contracts
- producing persistent UEF traces that outlive the execution session
- supporting execution comparison and diffing
- carrying correlation IDs for distributed execution

## Non-Responsibilities

`CSE` does not:

- render UI
- decide final educational animation styles
- infer repository-wide architecture from static code alone
- store product-specific user settings
- own trace storage (Nerva owns the trace store; CSE produces traces)
- own AI intelligence logic (CSE produces AI-consumable data; intelligence layer consumes it)

## Design Principles

### Headless by Default

`CSE` must work without a frontend. If the UI disappears, the engine still produces valid outputs. It is infrastructure, not an application.

### Truth First

The engine models execution faithfully. Simplification happens in visualization layers, not in the engine core.

### Execution Is Data

Execution traces are durable artifacts, not ephemeral visualizations. They are stored, queried, compared, and consumed by AI. The engine produces data that compounds in value over time.

### Record, Don't Just Execute

The engine supports both launching execution (sandbox) and observing execution (attach mode). Production recording is a first-class capability, not an afterthought.

### Stream, Don't Just Batch

Events are available in real-time during capture, not only as a completed document after execution ends.

### Language Adapters at the Edge

Language-specific complexity belongs in adapters. The core state model should stay stable.

### Stable Contracts Over Clever Internals

The engine can evolve internally, but `UEF` must remain intentional and versioned.

## Internal Modules

### 1. Execution Layer

Starts (sandbox mode) or attaches to (observation mode) code execution through a language adapter.

### 2. Runtime Capture Layer

Collects raw events such as method entry, variable mutation, object creation, and exceptions. Supports configurable capture fidelity (full, sampled, selective, minimal).

### 3. State Engine

Transforms raw runtime signals into normalized state objects. The intellectual core of the engine.

### 4. Timeline Engine

Builds ordered steps, checkpoints, and playback metadata. Supports streaming emission during capture.

### 5. UEF Serializer

Exports runtime state into a stable wire format for other products.

### 6. Event Stream

Emits execution events in real-time to live consumers via WebSocket/SSE. Runs in parallel with serialization.

Detailed documentation for infrastructure capabilities:

- [Execution Persistence Model](execution-persistence.md) - trace storage, indexing, querying
- [Streaming Model](streaming-model.md) - real-time event delivery
- [Production Recording](production-recording.md) - attach mode, recording agents
- [Execution Diffing](execution-diffing.md) - trace comparison and regression detection
- [Distributed Execution](distributed-execution.md) - cross-service correlation
- [AI Consumption](ai-consumption.md) - LLM-friendly trace representations

## Supported Use Cases

`CSE` should eventually support:

- snippet execution visualization and step-by-step replay
- debugging-accurate state inspection with full stack and heap
- production execution recording (attach to running JVM)
- persistent trace storage and historical querying
- real-time execution streaming to live consumers
- execution diffing and regression detection across code versions
- distributed execution correlation across services
- trace-based AI explanation and reasoning
- CI/CD trace capture for test execution
- object graph inspection and aliasing verification
- recursion understanding and algorithm analysis

## Initial Language Strategy

The architecture is multi-language, but implementation begins with Java.

Recommended order:

1. Java
2. Python
3. JavaScript
4. C++

The first production-quality adapter should be Java because:

- the runtime model is rich and explicit
- stack and heap concepts are clear
- debugger integrations are mature

## Output Contract

The primary output of `CSE` is `UEF`.

UEF traces are persistent, queryable artifacts that outlive the execution session. They are stored in the trace store (owned by Nerva) and addressable by stable URI.

Consumers include:

- Trace Store (Nerva) - persistence and indexing
- Visualization Platform (Prism) - interactive replay and visualization
- SDK (Vector) - programmatic access, CI/CD integration
- IDE Plugin (Pulse) - inline execution state in editor
- AI and analytics layers - reasoning over real execution data
- Comparison engine - execution diffing and regression detection
- Monitoring dashboards - real-time execution streaming
