# How the Engine Works

## Core Pipeline

At a high level, the engine works like this:

`Request -> Execute or Attach -> Capture -> Normalize -> Persist -> Analyze or Stream`

## Sandbox Execution Flow

### 1. Receive a Runtime Request

`RuntimeController` accepts:

- language
- entrypoint
- code
- execution limits

### 2. Compile Java Code

`JavaJdiAdapter` uses `JavaCompiler` to compile the submitted source into temporary class files.

### 3. Launch a JVM Under JDI

`JdiExecutionEngine` starts a JVM with JDI attached and with sandbox-oriented limits applied through `SandboxPolicy`.

### 4. Subscribe to Runtime Events

The engine captures events such as:

- class preparation
- line steps
- method entry
- method exit
- exceptions

### 5. Capture and Normalize State

For each relevant event, the adapter converts runtime state into:

- stack frames
- heap objects
- reference identities
- source anchors
- state deltas

### 6. Assemble a UEF Trace

The final execution becomes a `UefTrace` containing:

- session metadata
- recording metadata
- correlation metadata
- ordered steps
- diagnostics

### 7. Persist to TraciumDB

`SessionStore` persists the completed trace to the embedded storage engine.

## Streaming Flow

If you call the runtime streaming endpoint:

1. the service creates a session ID immediately
2. execution runs asynchronously
3. each captured step is forwarded to a `StepListener`
4. `StreamingController` emits SSE messages
5. the completed trace is stored in TraciumDB

## Attach Flow

Attach mode uses a different path:

1. connect to a running JVM
2. apply a recording strategy
3. capture bounded state with `BudgetedStateCapture`
4. build an observed-mode UEF trace
5. persist the result in TraciumDB

## Fork Flow

The engine supports two fork styles:

- predictive fork over an existing trace through `TimelineFork`
- real re-execution fork through `JdiForkEngine`

## Analysis Flow

Once a trace exists, the engine can:

- query it through the time machine
- locate root causes
- compare traces
- compress and narrate traces for AI consumers
- build causality and simulation views
- browse and search stored sessions through TraciumDB

## Advanced Components

The repository also includes:

- capture budgets
- ring buffer support
- sampling support
- circuit breaker support
- async storage support
- retention-policy support
- standalone agent support

These are part of the engine story, but not every one of them is yet the default service path.
