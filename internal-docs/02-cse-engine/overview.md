# CSE Overview

## Purpose

The Code State Engine (CSE) is the execution-recording core inside the Tracium Engine repository.

Its job is to turn running code into structured execution data:

`Code -> Runtime events -> Normalized state -> Timeline -> UEF trace -> TraciumDB`

In the current repository, this is no longer just a conceptual engine. It is a concrete 4-module system with:

- `engine-core`
- `engine-java-jdi-adapter`
- `engine-service`
- `engine-agent`

At the time of this document, the engine contains 89 Java source files across those four modules.

## Current Scope

The current Tracium Engine implements or exposes:

- sandbox execution for Java snippets and entrypoints
- JDI attach mode for observing running JVMs
- time-machine operations over recorded traces
- execution diffing
- AI-oriented trace compression and explanation helpers
- causality and program slicing helpers
- simulation and fork-tree helpers
- SSE-based execution streaming
- TraciumDB embedded persistence
- an embedded browser UI served by `engine-service`
- a standalone attach agent in `engine-agent`

It also contains enterprise-scaling components in source:

- `CaptureBudget`
- `BudgetedStateCapture`
- `EventRingBuffer`
- `SamplingEngine`
- `SamplingConfig`
- `SamplingDecision`
- `SamplingHeaderCodec`
- `CircuitBreaker`
- `AsyncWriteQueue`
- `RetentionPolicy`
- `TraciumAgent`
- `AgentConfig`

Some of these are already part of active execution paths, and some are currently reusable building blocks that still need end-to-end wiring in the default service path. Documentation must distinguish those two states clearly.

## Responsibilities

CSE is responsible for:

- executing code through language adapters
- observing live JVMs through JDI attach mode
- capturing runtime events and execution state
- normalizing stack, heap, deltas, source anchors, and recording metadata
- building ordered timelines over captured steps
- serializing traces to UEF
- storing traces in TraciumDB
- exposing traces to REST, SSE, UI, and agent consumers
- supporting time-machine, diffing, AI, causality, and simulation features over stored traces

## Non-Responsibilities

CSE does not currently try to be:

- a generic distributed-tracing platform by itself
- a general-purpose database
- a language-agnostic orchestration layer across the whole Tracium ecosystem
- a full static-analysis engine
- a hosted cloud service

Related ecosystem products may still exist, but the engine repository now owns its own embedded persistence and browser UI.

## Design Principles

### Execution Is Data

The primary output is a durable execution artifact, not a temporary debugger session.

### Truth First

The engine prefers faithful runtime state over simplified educational abstractions.

### Stable Contracts

The core contract is the UEF trace plus stable REST and storage behavior, even if the internal capture pipeline evolves.

### Sandbox and Observation Are Both First-Class

The engine supports both launching code and attaching to already-running JVMs.

### Storage Is Embedded

The engine persists to TraciumDB locally. It does not require PostgreSQL, MongoDB, Redis, or a separate trace-store process.

### UI Is Embedded, Not Required

The engine now serves an embedded UI through `engine-service`, but the UI remains a consumer of engine data rather than the source of truth.

## Module Layout

### 1. `engine-core`

Language-agnostic domain and storage layer.

Owns:

- UEF models: `UefTrace`, `UefStep`, `UefSession`
- state model: `ExecutionState`, `StackFrame`, `HeapObject`, `Value`, `StateDelta`
- time-machine logic: `ExecutionTimeline`, `RootCauseLocator`, `TimelineFork`, `ForkTree`, `CheckpointStore`
- diffing: `ExecutionDiff`, `DiffResult`, `StepDiff`, `AlignmentStrategy`
- AI helpers: `TraceCompressor`, `TraceFocuser`, `NaturalLanguageConverter`
- causality: `CausalGraph`
- simulation: `SimulationEngine`
- distributed assembly: `DistributedTraceAssembler`
- persistence: `TraciumDB`, `TraceStore`, `MetadataIndex`, `StepIndex`, `ForkStore`
- scaling primitives: sampling, retention, async storage, circuit breaker

### 2. `engine-java-jdi-adapter`

Java runtime adapter.

Owns:

- source compilation
- launch-mode capture through JDI
- attach-mode capture through JDI
- fork / re-execution support
- budgeted capture for production recording
- event ring buffer implementation for async attach pipelines
- sandbox policy for launched JVMs

### 3. `engine-service`

Deployable Spring Boot application.

Owns:

- REST endpoints
- SSE streaming endpoints
- TraciumDB-backed session persistence through `SessionStore`
- embedded static UI serving
- API key authentication support
- actuator and swagger integration

### 4. `engine-agent`

Standalone command-line attach agent.

Owns:

- CLI parsing and defaults
- reconnect loop for long-running observation
- local TraciumDB output
- production-oriented attach workflow without Spring Boot

## Primary Flows

### Sandbox Runtime Flow

1. `RuntimeController` receives `RuntimeSessionRequest`
2. `EngineRuntimeService` selects `ExecutionAdapter`
3. `JavaJdiAdapter` compiles and launches code
4. `JdiExecutionEngine` captures steps
5. `engine-core` normalizes the trace to UEF
6. `SessionStore` persists the trace to TraciumDB
7. `engine-service` exposes the result through REST, UI, and optional SSE

### Attach / Production Recording Flow

1. `AttachController` or `TraciumAgent` builds `AttachRequest`
2. `JdiAttachEngine` connects to a running JVM
3. `BudgetedStateCapture` bounds stack, object depth, fields, arrays, and heap size
4. The adapter assembles an observed-mode UEF trace
5. The trace is persisted to TraciumDB

### Trace Analysis Flow

Once a trace exists, `engine-core` powers:

- root-cause analysis
- divergence detection
- predictive fork analysis
- real fork re-execution
- diffing
- causality analysis
- simulation helpers
- AI-friendly compression and narrative generation
- TraciumDB search and fork-tree navigation

## Current Capability Notes

The engine has a broad feature surface, but not all subsystems are equally mature.

Important examples:

- TraciumDB is active and used by `SessionStore`
- attach mode is exposed through REST and the standalone agent
- capture budgets are wired into attach-mode capture
- sampling, circuit breaker, async storage, and retention exist in core but are not yet the default `engine-service` persistence path
- distributed execution is currently a core-library model, not a full end-to-end product flow

## Output Contract

The primary artifact is a `UefTrace` containing:

- session metadata
- recording context
- correlation context
- ordered steps
- normalized state and deltas
- diagnostics

The engine also produces:

- TraciumDB metadata for storage and search
- REST responses for runtime and analysis endpoints
- SSE step messages for live consumers

## Related Documents

- [Execution Layer](execution-layer.md)
- [State Engine](state-engine.md)
- [Streaming Model](streaming-model.md)
- [Production Recording](production-recording.md)
- [Execution Diffing](execution-diffing.md)
- [Distributed Execution](distributed-execution.md)
- [AI Consumption](ai-consumption.md)
- [TraciumDB](traciumdb.md)
- [Timeline](timeline.md)
