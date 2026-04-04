# Production Recording Model

## Purpose

This document defines how Tracium Engine attaches to and records execution from running systems, not just sandbox-executed snippets. Production recording is what makes Tracium relevant to backend teams, debugging workflows, and observability use cases.

## Core Principle

> The engine must observe, not just execute. Attaching to real systems is what makes this infrastructure.

## Two Execution Modes

### Mode 1: Sandbox Execution (Launch Mode)

The engine launches, controls, and terminates the target process.

```
Engine creates JVM -> attaches JDI -> captures -> terminates
```

Characteristics:

- full control over execution
- deterministic (single-threaded)
- complete capture (every step)
- safe (sandboxed environment)
- limited to snippet-level inputs

This is Phase 1 and the foundation.

### Mode 2: Observed Execution (Attach Mode)

The engine attaches to an already-running process and records execution.

```
Running JVM -> Engine attaches JDI -> captures selectively -> detaches
```

Characteristics:

- no control over execution flow
- nondeterministic (multi-threaded, real I/O)
- selective capture (instrumented regions only)
- requires careful performance management
- applicable to real services and applications

This is the mode that makes Tracium production-grade.

## JDI Attach Mode

Java supports JDI in attach mode through:

- `AttachingConnector`: connect to a running JVM via socket or shared memory
- requires target JVM started with debug agent: `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005`

### What Attach Mode Provides

- method entry/exit events (filtered by class/package)
- breakpoint events at specific locations
- variable inspection at breakpoints
- stack frame inspection
- object heap inspection
- exception events

### What Attach Mode Cannot Provide

- complete step-by-step line tracing (too expensive for production)
- full heap snapshots at every step
- deterministic ordering in multi-threaded contexts

### Mitigation Strategy

Use selective capture:

- instrument only specific packages or classes
- capture at method boundaries, not line-level
- take heap snapshots at breakpoints only
- sample rather than capture exhaustively

## Recording Strategies

### Strategy 1: Full Capture

- every line step, every variable, every heap change
- used for: sandbox execution, small programs, learning
- fidelity: `full`

### Strategy 2: Method Boundary Capture

- capture method entry/exit with parameter and return values
- skip line-level stepping
- used for: production profiling, call graph verification
- fidelity: `sampled`

### Strategy 3: Breakpoint Capture

- capture state only at specific breakpoints (user-defined or auto-placed)
- full heap snapshot at each breakpoint
- used for: targeted debugging, "what was the state when this line executed?"
- fidelity: `selective`

### Strategy 4: Event Filter Capture

- capture only specific event types (exceptions, specific method calls)
- used for: monitoring, alerting, incident investigation
- fidelity: `minimal`

## Recording Agent Model

For production use, the engine operates through a lightweight agent:

```
[Target JVM]
    |
    | JDI socket connection
    |
[Tracium Recording Agent]
    |
    | UEF stream
    |
[Nerva / Trace Store]
```

### Agent Responsibilities

- connect to target JVM via JDI
- apply configured recording strategy
- stream captured events as UEF
- manage connection lifecycle (attach, pause, detach)
- minimize performance impact on target

### Agent Configuration

```json
{
  "target": {
    "host": "localhost",
    "port": 5005,
    "transport": "dt_socket"
  },
  "strategy": "method-boundary",
  "scope": {
    "includePackages": ["com.myapp.service", "com.myapp.domain"],
    "excludePackages": ["com.myapp.generated"],
    "breakpoints": [
      { "class": "OrderService", "method": "processOrder", "line": 42 }
    ]
  },
  "limits": {
    "maxDurationMs": 60000,
    "maxSteps": 10000,
    "maxHeapSnapshotSize": "10MB"
  },
  "output": {
    "mode": "stream",
    "target": "nerva://traces"
  }
}
```

## Performance Impact

Production recording must have bounded performance impact.

### Overhead Budget

- method boundary capture: less than 5% overhead
- breakpoint capture: less than 1% overhead (inactive breakpoints are near-zero)
- full capture: NOT suitable for production (10x+ overhead)

### Safety Mechanisms

- automatic detach if target JVM becomes unresponsive
- capture rate limiting (max events per second)
- heap snapshot size limits
- recording duration limits
- circuit breaker: if overhead exceeds threshold, reduce capture scope

## Recording Context in UEF

Every trace from observed execution includes recording context:

```json
{
  "recordingMode": "observed",
  "captureFidelity": "sampled",
  "samplingStrategy": "method-boundary",
  "scope": {
    "includedPackages": ["com.myapp.service"],
    "breakpointCount": 3
  },
  "targetProcess": {
    "pid": 12345,
    "jvmVersion": "21.0.1",
    "startedAt": "2026-04-04T08:00:00Z"
  },
  "environment": "staging"
}
```

This context is critical for:

- understanding what was captured vs. what was missed
- comparing traces with different fidelity levels
- AI explanation accuracy (knowing capture limitations)

## Future Language Agents

The attach model extends to other languages:

| Language | Attach Mechanism |
|----------|-----------------|
| Java | JDI AttachingConnector |
| Python | debugpy attach, sys.monitoring |
| JavaScript | Chrome DevTools Protocol (CDP) remote attach |
| C++ | LLDB/GDB remote attach |

Each language adapter implements both launch mode and attach mode through the same `LanguageExecutionAdapter` interface, with capability declaration for what each mode supports.

## What This Enables

- debug production issues by recording the exact execution path
- replay incidents from staging or production traces
- understand real system behavior, not just toy examples
- capture execution during load tests for performance analysis
- record test execution in CI/CD for regression analysis
- onboard new developers by showing them real execution of the system they are joining
