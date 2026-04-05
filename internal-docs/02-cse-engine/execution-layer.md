# Execution Layer

## Role

The execution layer is the boundary between user input and runtime capture.

In the current engine it is responsible for:

- accepting execution requests
- selecting an `ExecutionAdapter`
- launching or attaching to JVMs
- enforcing execution limits
- producing captured steps and final traces
- feeding streaming listeners during execution when requested

## Concrete Interfaces

The current implementation uses the following core types:

- `ExecutionAdapter`
- `RuntimeSessionRequest`
- `AttachRequest`
- `ForkRequest`
- `ExecutionLimits`
- `StepListener`
- `EngineRuntimeService`

`ExecutionAdapter` is the stable adapter boundary used by `engine-service` and reusable command-line tooling.

## Module Ownership

- `engine-core` defines the requests, adapter contracts, limits, and trace models
- `engine-java-jdi-adapter` implements the Java adapter
- `engine-service` exposes launch, streaming, attach, fork, and analysis endpoints
- `engine-agent` provides a standalone production-facing attach entrypoint

## Current Adapter Surface

The Java adapter currently supports:

- `execute(RuntimeSessionRequest request)`
- `execute(RuntimeSessionRequest request, String sessionId, StepListener listener)`
- `forkExecute(ForkRequest request)`
- `attach(AttachRequest request)`

This gives the repository one adapter with four practical operating modes:

- sandbox launch
- sandbox launch with live step callbacks
- real re-execution fork
- attach / observed execution

## Launch Mode Pipeline

Sandbox execution currently works like this:

1. `RuntimeController` accepts a `RuntimeSessionRequest`
2. `EngineRuntimeService` selects the adapter by language
3. `JavaJdiAdapter` compiles the submitted code with `JavaCompiler`
4. `JdiExecutionEngine` launches a JVM with JDI attached
5. JDI events are captured and turned into normalized `CapturedStep` values
6. The adapter assembles a `UefTrace`
7. `SessionStore` persists the trace to TraciumDB

## Attach Mode Pipeline

Observed execution currently works like this:

1. `AttachController` or `TraciumAgent` builds an `AttachRequest`
2. `JdiAttachEngine` connects via `AttachingConnector`
3. Event requests are installed based on recording strategy
4. `BudgetedStateCapture` materializes bounded state snapshots
5. The adapter assembles an observed-mode `UefTrace`
6. The trace is persisted to TraciumDB

## Fork / Re-Execution Pipeline

Real fork execution uses:

1. the original request context
2. a `ForkRequest` describing the fork step and variable overrides
3. `JdiForkEngine` to relaunch the program
4. JDI variable injection at the target point
5. trace capture of the new execution path

This is distinct from predictive forking in `TimelineFork`, which only models divergence over an existing trace.

## Streaming Pipeline

When `StreamingController` is used:

1. a session ID is created immediately
2. the adapter executes asynchronously
3. `JdiExecutionEngine` emits `UefStep` values to a `StepListener`
4. the controller forwards those steps to an SSE emitter
5. when execution completes, the full trace is stored in TraciumDB

This means live delivery and final persistence are related but separate.

## Execution Limits

`ExecutionLimits` currently supports:

- `timeoutMs`
- `maxSteps`
- `maxHeapMb`
- `allowNetwork`
- `allowFileWrite`

Defaults are conservative and aimed at sandbox safety:

- 5000 ms timeout
- 1000 max steps
- 64 MB max heap
- network disabled
- file writes disabled

## Sandbox Policy

`SandboxPolicy` is applied to launched JVMs, not attached JVMs.

Current launch-time protections include:

- process timeout watchdog
- `-Xmx` memory control
- interpreter mode (`-Xint`) for more predictable stepping
- disallowing network and file-write capabilities through policy-driven JVM options

Attach mode does not sandbox the target JVM; it only constrains what Tracium captures.

## Recording Strategies and Fidelity

Attach mode currently exposes four strategies:

| Strategy | Intended Use | Trace Fidelity | Effective Budget |
| --- | --- | --- | --- |
| `FULL_CAPTURE` | small or controlled workloads | `full` | `CaptureBudget.full()` |
| `METHOD_BOUNDARY` | production-oriented observation | `sampled` | `CaptureBudget.production()` |
| `BREAKPOINT` | targeted observation | `selective` | `CaptureBudget.production()` |
| `EVENT_FILTER` | low-overhead monitoring | `minimal` | `CaptureBudget.minimal()` |

## Enterprise-Scale Components in Source

The execution layer now contains several scaling-oriented components:

- `CaptureBudget` and `BudgetedStateCapture` for bounded snapshots
- `EventRingBuffer` for decoupling JDI receipt from heavier processing
- `SamplingEngine` and `SamplingHeaderCodec` for request-level sampling and propagation
- `CircuitBreaker` for automatic capture degradation
- `TraciumAgent` for standalone capture

Current status:

- capture budgets are actively used by attach mode
- the standalone agent is active and usable
- sampling, ring buffering, and circuit breaker are available in code but are not yet fully wired into the default `engine-service` capture loop

## Diagnostics

The execution layer must surface structured failure states, including:

- compile failures
- launch failures
- timeout termination
- unsupported language selection
- attach failures
- capture warnings and diagnostics in traces

Current controllers expose most of these through HTTP error responses or trace diagnostics.

## Operational Caveats

- Only Java is currently supported by a real adapter
- attach mode is real code, but its operational hardening is still behind the sandbox path
- fork re-execution relies on runtime step counting and variable injection and should be treated as advanced behavior
- the source contains scaling primitives beyond what `engine-service` wires by default today
