# JDI Adapter

The JDI adapter is the Java-specific runtime layer of Tracium Engine.

It is responsible for turning a live JVM into structured execution data.

## What It Contains

The Java adapter module currently includes:

- `JavaJdiAdapter`
- `JavaCompiler`
- `JdiExecutionEngine`
- `JdiAttachEngine`
- `JdiForkEngine`
- `BudgetedStateCapture`
- `EventRingBuffer`
- `SandboxPolicy`

## What JDI Gives Tracium

JDI provides access to:

- stack frames
- local variables
- method entry and exit events
- step events
- exceptions
- object references and fields
- array elements

That is what makes debugger-grade state capture possible in Java.

## Launch Mode

In launch mode, the adapter:

1. compiles user code
2. launches a JVM under a JDI connector
3. captures events
4. converts state into UEF-compatible models

This is the most complete capture path.

## Attach Mode

In attach mode, the adapter:

1. connects to a running JVM
2. installs event requests based on strategy
3. captures bounded state through `BudgetedStateCapture`
4. produces an observed-mode trace

This is the path used by the attach REST endpoint and the standalone agent.

## Fork Mode

The adapter also supports real re-execution forks through `JdiForkEngine`.

That flow:

- relaunches the code
- pauses at the fork point
- injects modified values
- captures the divergent path

## Value Conversion

The adapter maps JDI values into Tracium values such as:

- primitive values
- null values
- reference values

Heap objects and arrays are stored separately in the trace heap map.

## Object Identity

The adapter preserves runtime identity by mapping JDI object IDs to stable Tracium object IDs like `obj_1`.

## Budgeted Capture

Attach mode uses:

- `CaptureBudget`
- `BudgetedStateCapture`

to limit:

- frames
- object depth
- object count
- array elements
- fields per object

This keeps attach-mode recording bounded on real applications.

## Ring Buffer and High-Throughput Support

The module also includes `EventRingBuffer` for decoupled event receipt and processing in higher-throughput capture scenarios.

This is part of the advanced capture story, but not the default path for all service workflows today.

## Sandbox Policy

Launch-mode execution uses `SandboxPolicy` to control:

- heap size
- timeout behavior
- network access
- file-write access

## Caveats

- Java is the only language adapter today
- launch mode is the most mature path
- attach and real fork are real features, but operational hardening is still ongoing
