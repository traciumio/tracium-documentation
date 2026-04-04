# Product Vision

## Working Direction

This ecosystem is not a clone of an existing code visualizer. It is not a debugger replacement. It is not a learning tool.

The goal is to build a new category of infrastructure:

`Code -> Execution -> State Timeline -> Queryable, Replayable, Persistent Intelligence`

The one-line positioning:

> Tracium turns program execution into a queryable, replayable data model.

This is the execution equivalent of what Kafka did for events: execution data becomes a first-class, durable, composable infrastructure primitive.

That category is delivered through multiple cooperating products rather than one tightly coupled application.

## Problem Statement

Developers struggle with two very different kinds of understanding:

- `Runtime understanding`: What is this code doing step by step right now? What was the state when it failed?
- `Structural understanding`: How is this repository organized as a system?

No system today answers: "What EXACTLY was the state of the program at every step, and can I replay it?"

Current tools solve only partial slices:

- Debuggers show truth but only in real-time, locally, ephemerally
- Visualizers simplify toy snippets but break down on real execution details
- Observability stacks (Prometheus, Grafana, Jaeger) show metrics and spans but not state
- Architecture tools show dependency graphs but not live state behavior
- Logs are partial, sampled, human-written, and lossy

The fundamental gap:

> Execution is invisible and ephemeral. Once a program runs, the state is gone forever.

The opportunity is to build infrastructure that makes execution a persistent, queryable data model:

- accurate runtime introspection and recording
- persistent, replayable execution traces
- queryable state-level observability
- static architecture intelligence
- AI reasoning over real execution data

## Product Vision

Build an execution intelligence infrastructure with a strong core engine and independent product surfaces.

The paradigm shift:

> Before Tracium: code executes, state disappears, we infer from logs.
> After Tracium: code executes, state becomes structured, replayable, queryable data.

The ecosystem has two primary intelligence tracks:

- `Dynamic track`: execute or observe code and transform runtime behavior into a persistent, queryable state timeline
- `Static track`: analyze repositories and transform structure into navigable architecture graphs

Those tracks remain separate at the engine level. Consumers (visualization, SDK, IDE, AI) access both through stable contracts.

## Products In Scope

### 1. CSE

`Code State Engine` is the headless execution recording and intelligence engine.

Its job is to:

- execute code through language-specific adapters (sandbox mode)
- observe running processes through attach-mode instrumentation (production recording mode)
- capture execution signals at configurable fidelity levels
- normalize those signals into `UEF`
- stream events in real-time to live consumers
- produce persistent, queryable execution traces

### 2. Visualization Platform

This is the product users directly interact with.

Its job is to:

- render runtime traces from `CSE`
- render structure graphs from `Repo Analyzer`
- present learning views and debugging-accurate views
- provide controls for exploration, playback, and explanation

### 3. Repo Analyzer

This is a separate static-analysis engine.

Its job is to:

- parse repositories
- extract modules, classes, methods, dependencies, and call relationships
- infer higher-level architecture signals
- emit `UGF` for visualization and platform integrations

### 4. SDK

This exposes the platform to external developers, CI/CD pipelines, and internal extensions.

Its job is to:

- provide stable programmatic access to execution recording, trace querying, and analysis capabilities
- support embedding in third-party tools, monitoring systems, and automation pipelines
- expose trace storage, retrieval, comparison, and AI-friendly endpoints
- make the ecosystem extensible

### 5. IDE Plugin

This brings the ecosystem into the development workflow.

Its job is to:

- send code or projects to the engine services
- surface runtime and architecture insights inside the editor
- reduce the distance between writing code and understanding it

## Runtime Learning Mode vs Debugging Mode

These are different experiences built on top of the same core data.

### Learning Mode

Purpose:

- make concepts intuitive
- simplify views
- highlight important structures
- reduce cognitive load

Examples:

- clean array animations
- recursion trees
- linked-list diagrams

### Debugging Mode

Purpose:

- show execution truth
- preserve references and identity
- reflect the actual memory model as closely as the adapter allows

Examples:

- stack frames with real variable bindings
- heap object identity
- shared references
- call-stack transitions

Core rule:

`CSE` captures truth-first execution. Simplified educational views are derived later by the visualization layer, not baked into the engine.

## Language Strategy

The platform goal is multi-language support.

Planned languages:

- Java
- Python
- JavaScript
- C++

Implementation order:

- `CSE v1`: Java-first
- later adapters: Python, JavaScript, C++

The visualization layer must remain language-agnostic even while engine adapters mature one by one.

## Non-Goals for Initial Foundation

The initial foundation does not aim to:

- perfectly understand any arbitrary production repository on day one
- replace full production debuggers immediately
- support every programming language at launch
- merge runtime execution and static architecture into one internal engine
- support full distributed tracing across microservices at launch
- provide production-grade recording agents at launch

Instead, the focus is to build final-quality contracts and engine boundaries that can grow safely. The architecture must support the full vision (production recording, persistence, streaming, distributed correlation, AI consumption) even if the initial implementation starts with sandbox execution.

## Success Criteria

The ecosystem is successful if it can eventually support all of the following from a shared set of contracts:

- snippet execution visualization and step-by-step playback
- debugging-accurate runtime introspection with full state
- production execution recording and replay
- persistent, queryable trace storage (the "execution log")
- execution diffing and regression detection
- real-time execution streaming
- distributed execution correlation across services
- repository architecture visualization
- IDE integrations with inline execution state
- external SDK and CI/CD pipeline usage
- AI reasoning and explanation built on top of real execution data
- state-level observability beyond logs and metrics
