# System Overview

## Architecture Summary

The product family is intentionally split into separate systems with explicit contracts. The system is execution intelligence infrastructure, not a visualization application.

```text
  +-------------+    +----------+    +-----------+
  | Prism (UI)  |    | Pulse    |    | Vector    |
  | Viz Platform|    | IDE      |    | SDK       |
  +------+------+    +----+-----+    +-----+-----+
         |                |                |
         +--------+-------+-------+--------+
                  |               |
           consumes UEF    consumes UGF
                  |               |
         +--------+------+  +----+----------+
         | Trace Store   |  | Graph Store   |
         | (Nerva)       |  | (Nerva)       |
         +--------+------+  +----+----------+
                  ^               ^
                  |               |
      +---------+--+    +-------+--------+
      | CSE         |    | Repo Analyzer  |
      | Execution   |    | Static         |
      | Recording   |    | Analyzer       |
      +------+------+    +-------+--------+
             ^                     ^
             |                     |
      language adapters      language analyzers
      (launch + attach)
             ^                     ^
             |                     |
   Java -> Python -> JS    Java -> Python -> JS
```

Key architectural shift: CSE produces persistent traces stored in Nerva's trace store. Consumers (Prism, Pulse, Vector, AI) query persisted traces. Execution data outlives the session that created it.

## Product Boundaries

### CSE

Owns:

- execution (sandbox mode: launch and control)
- observation (attach mode: record running processes)
- runtime capture at configurable fidelity
- real-time event streaming to live consumers
- state normalization
- timeline generation
- `UEF` production

Does not own:

- trace storage and indexing (Nerva owns this)
- animation and visualization
- teaching UX
- static repository graphs
- IDE presentation
- AI intelligence logic (produces data; intelligence layer consumes it)

### Visualization Platform

Owns:

- user interaction
- playback controls
- render models
- educational views
- debugging views
- cross-linking runtime and structural information

Does not own:

- low-level execution capture
- language-specific runtime instrumentation logic
- raw repository parsing

### Repo Analyzer

Owns:

- parsing repositories
- extracting symbol relationships
- building architecture graphs
- `UGF`

Does not own:

- live execution
- runtime timelines
- stack and heap modeling

### SDK

Owns:

- public developer access
- stable typed clients
- integration ergonomics

### IDE Plugin

Owns:

- editor workflows
- code actions
- inline surfaces
- session launch and navigation from IDE context

## Core Contracts

Two core contracts keep the architecture clean:

### `UEF`

Runtime state timeline from `CSE`. Persistent, queryable, replayable.

Use cases:

- step execution and replay
- debugger-style state inspection
- production execution recording and replay
- persistent trace storage and historical querying
- execution diffing and regression detection
- real-time execution streaming
- distributed execution correlation
- learning visualizations
- trace-based AI explanation and reasoning
- CI/CD test trace capture

### `UGF`

Static structure graph from `Repo Analyzer`.

Use cases:

- module maps
- call graphs
- dependency graphs
- architecture overviews

## End-to-End Flows

### Runtime Trace Flow (Sandbox)

1. User submits code snippet or runnable project slice
2. `CSE` compiles or prepares the code through a language adapter
3. Execution is captured through adapter-specific runtime hooks
4. Raw runtime signals are normalized into `UEF`
5. Events are streamed to live consumers AND persisted to trace store simultaneously
6. Visualization Platform loads persisted `UEF` into render models
7. User explores steps, memory, flow, and explanations

### Runtime Recording Flow (Production)

1. Recording agent attaches to a running process with configured recording strategy
2. Execution events are captured selectively (method boundaries, breakpoints, filtered events)
3. Raw signals are normalized into `UEF` with recording context metadata
4. Events are streamed to live consumers AND persisted to trace store
5. Agent detaches from target process
6. Persisted trace is available for replay, diffing, AI analysis, and visualization

### Repository Visualization Flow

1. User submits a repository or selected project scope
2. Source connector resolves repository input from either local workspace access or GitHub-connected access
3. `Repo Analyzer` parses code and project metadata
4. Structural relationships are normalized into `UGF`
5. Visualization Platform converts `UGF` into graph views
6. User explores modules, dependencies, call paths, and architecture

## Interoperability

The runtime and static systems stay independent but can be correlated through shared source anchors.

Examples:

- click a method in the repo graph and open related runtime traces
- compare static call relationships with actual runtime paths
- move from a stack frame to its declaring file or class in the architecture view

## Key Architectural Rules

### Rule 1: The visualizer is a consumer, not the owner, of intelligence.

That means:

- `CSE` can exist without the visualizer
- `Repo Analyzer` can exist without the visualizer
- the visualizer can evolve its UX without destabilizing core engine contracts

### Rule 2: Execution traces are persistent infrastructure, not ephemeral output.

That means:

- traces outlive the execution session that created them
- traces are stored, indexed, and queryable in the trace store
- multiple consumers can access the same trace at different times
- traces are addressable by stable URI for sharing and deep linking

### Rule 3: The system supports both creation and observation of execution.

That means:

- sandbox mode for controlled execution (snippets, learning, testing)
- attach mode for production recording (real services, debugging, monitoring)
- the same UEF contract serves both modes
- recording context metadata distinguishes how the trace was produced
