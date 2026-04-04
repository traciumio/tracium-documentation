# Execution Layer

## Role

The execution layer is the boundary between source code and runtime capture.

Its job is to:

- prepare source inputs
- launch execution safely
- attach observation mechanisms
- stream raw runtime signals to the state engine

## Adapter Model

Each language uses a dedicated adapter that supports two execution modes.

Example interface:

```java
public interface LanguageExecutionAdapter {
    // Sandbox mode: engine launches and controls execution
    ExecutionSession launch(ExecutionRequest request);

    // Observation mode: engine attaches to running process
    ExecutionSession attach(AttachRequest request);

    void stop(String sessionId);
    AdapterCapabilities capabilities();
}
```

The adapter is responsible for language-specific behavior, not the shared state model. Each adapter declares which modes it supports (launch, attach, or both).

## Java-First Strategy

The first implementation should use `JDI` for Java execution capture.

Why `JDI` first:

- mature debugger integration
- direct access to stack frames and variables
- good fit for truth-first execution modeling
- supports both launch mode and attach mode natively

What `JDI` can support early:

- method entry and exit
- line stepping
- local variable inspection
- object reference inspection
- exception events

### JDI Launch Mode (Sandbox)

Engine creates a new JVM process, attaches JDI, captures with full fidelity.

### JDI Attach Mode (Production Recording)

Engine connects to a running JVM via `AttachingConnector` (socket or shared memory). Target JVM must be started with: `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005`. Capture is selective (method boundaries, breakpoints) to minimize overhead. See [Production Recording](production-recording.md) for full details.

## Execution Pipeline

### Sandbox Pipeline (Launch Mode)

1. Receive code or project execution request
2. Prepare source files and dependencies
3. Compile if required
4. Launch target runtime in an instrumentable mode
5. Subscribe to runtime events
6. Stream events to state normalization AND to live consumers simultaneously
7. Persist finalized trace to trace store
8. Emit session completion metadata

### Observation Pipeline (Attach Mode)

1. Receive attach request with target process details and recording strategy
2. Connect to running process via language-specific attach mechanism
3. Apply recording strategy (scope filters, fidelity level, breakpoints)
4. Capture events selectively per configured strategy
5. Stream events to state normalization AND to live consumers simultaneously
6. Persist captured trace to trace store
7. Detach cleanly from target process

## Input Types

The execution layer should support multiple inputs over time:

- single snippet
- runnable file
- selected project entrypoint
- test case

Each request should declare:

- language
- runtime version
- entrypoint
- input arguments
- execution limits

## Session Controls

Each execution session should support:

- start
- step
- continue
- pause
- stop
- timeout

Not all languages or runtimes will support every control mode equally at first, so capabilities must be explicit.

## Security and Sandboxing

Because arbitrary code execution is dangerous, the execution layer must be designed around isolation.

Baseline requirements:

- bounded CPU and memory
- restricted filesystem access
- restricted network access
- execution timeouts
- session cleanup

Recommended long-term strategy:

- dedicated worker runtime or container per execution session
- policy-driven capability matrix by language and input type

## Determinism

Deterministic playback is important for meaningful visualization.

The execution layer should capture enough metadata to explain nondeterministic behavior when it occurs.

Sources of nondeterminism include:

- time
- random values
- concurrency
- external I/O

Initial recommendation:

- focus on single-threaded deterministic scenarios first
- explicitly mark unsupported or partially supported cases

## Capture Fidelity Levels

Not all recording contexts require the same detail level:

- `full`: every step captured, complete heap snapshots (sandbox mode default)
- `sampled`: periodic sampling, some steps skipped (production method-boundary)
- `selective`: only specific methods or regions captured (production breakpoint)
- `minimal`: entry/exit events only, no heap detail (production monitoring)

Each trace carries its fidelity level in metadata so consumers understand capture completeness.

## Errors and Diagnostics

The execution layer must emit structured diagnostics for:

- compile failures
- runtime exceptions
- unsupported language features
- sandbox policy violations
- session timeouts
- attach failures (target unreachable, permissions)
- capture fidelity warnings (events dropped due to backpressure)

Diagnostics should be first-class outputs, not only logs.
