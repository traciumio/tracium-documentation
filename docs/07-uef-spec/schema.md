# UEF Schema

## Purpose

`UEF` (`Universal Execution Format`) is the canonical runtime contract emitted by `CSE`.

UEF traces are persistent, queryable, replayable artifacts. They are the execution equivalent of Kafka's event log: append-only, durable, structured data that any consumer can process.

Its goals are:

- language-agnostic structure
- faithful runtime representation
- stable downstream consumption
- support for persistence, querying, and comparison
- support for debugging, learning, AI reasoning, and monitoring experiences
- support for streaming (incremental append during capture)

## Design Rules

`UEF` must be:

- explicit rather than magical
- serializable and persistable
- versioned
- appendable across time (supports streaming emission)
- independent of any specific renderer
- queryable (structured for indexing and search)
- diffable (structured for trace comparison)
- segmentable (supports partial loading and AI context windowing)

## Top-Level Model

```json
{
  "uefVersion": "0.1.0",
  "session": {
    "id": "sess_001",
    "language": "java",
    "adapter": "jdi",
    "runtimeVersion": "21",
    "entrypoint": "Main.main",
    "startedAt": "2026-04-04T10:15:00Z",
    "completedAt": "2026-04-04T10:15:03Z"
  },
  "recording": {
    "mode": "sandbox",
    "fidelity": "full",
    "samplingStrategy": "none",
    "environment": "development"
  },
  "correlation": {
    "correlationId": null,
    "parentSessionId": null,
    "serviceName": null,
    "tags": {}
  },
  "steps": [],
  "diagnostics": []
}
```

### Recording Context

The `recording` block captures how the trace was produced:

- `mode`: `sandbox` (engine launched execution), `observed` (engine attached to running process), `replayed` (re-execution from stored trace)
- `fidelity`: `full`, `sampled`, `selective`, `minimal`
- `samplingStrategy`: `none`, `method-boundary`, `breakpoint`, `event-filter`
- `environment`: `development`, `staging`, `production`

### Correlation Context

The `correlation` block enables distributed trace assembly:

- `correlationId`: shared ID across all traces in a distributed request
- `parentSessionId`: the session that triggered this one
- `serviceName`: which service produced this trace
- `tags`: user-defined metadata for querying and comparison (code version, branch, build number, etc.)

## Step Model

Each step represents one ordered execution unit.

```json
{
  "step": 12,
  "event": "VARIABLE_ASSIGNED",
  "threadId": "main",
  "source": {
    "file": "src/Main.java",
    "symbol": "Main.main",
    "line": 14
  },
  "delta": {},
  "state": {},
  "metadata": {}
}
```

## Required Step Fields

- `step`: monotonic integer within session
- `event`: normalized event type
- `threadId`: execution thread identifier
- `source`: source anchor when available
- `delta`: what changed at this step
- `state`: materialized state or state slice
- `metadata`: non-core annotations

## Source Anchor

```json
{
  "file": "src/Main.java",
  "symbol": "Main.main",
  "line": 14,
  "column": 1
}
```

Source anchors should be stable enough to correlate:

- runtime events
- static graph nodes
- IDE navigation

## State Model

```json
{
  "frames": [],
  "heap": {},
  "globals": {},
  "stdout": [],
  "stderr": []
}
```

## Frame Model

```json
{
  "id": "frame_main_1",
  "name": "main",
  "declaringType": "Main",
  "source": {
    "file": "src/Main.java",
    "symbol": "Main.main",
    "line": 14
  },
  "locals": {
    "arr": {
      "kind": "reference",
      "ref": "obj_1"
    },
    "i": {
      "kind": "primitive",
      "type": "int",
      "value": 2
    }
  },
  "parameters": {},
  "status": "active"
}
```

## Heap Model

Heap is keyed by stable object IDs.

```json
{
  "obj_1": {
    "kind": "array",
    "type": "int[]",
    "elements": [
      {
        "kind": "primitive",
        "type": "int",
        "value": 5
      },
      {
        "kind": "primitive",
        "type": "int",
        "value": 9
      }
    ]
  },
  "obj_2": {
    "kind": "object",
    "type": "Node",
    "fields": {
      "value": {
        "kind": "primitive",
        "type": "int",
        "value": 10
      },
      "next": {
        "kind": "reference",
        "ref": "obj_3"
      }
    }
  }
}
```

## Value Model

Every value should normalize into one of these kinds:

- `primitive`
- `null`
- `reference`
- `object`
- `array`
- `collection`
- `symbolic`

Examples:

```json
{ "kind": "primitive", "type": "boolean", "value": true }
```

```json
{ "kind": "null" }
```

```json
{ "kind": "reference", "ref": "obj_2" }
```

## Delta Model

The delta should describe what changed at the current step.

```json
{
  "frameChanges": [
    {
      "frameId": "frame_main_1",
      "local": "i",
      "before": { "kind": "primitive", "type": "int", "value": 1 },
      "after": { "kind": "primitive", "type": "int", "value": 2 }
    }
  ],
  "heapChanges": [
    {
      "objectId": "obj_1",
      "path": "elements[0]",
      "before": { "kind": "primitive", "type": "int", "value": 1 },
      "after": { "kind": "primitive", "type": "int", "value": 5 }
    }
  ]
}
```

## Event Types

Core runtime events:

- `SESSION_STARTED`
- `LINE_CHANGED`
- `METHOD_ENTERED`
- `METHOD_EXITED`
- `VARIABLE_ASSIGNED`
- `OBJECT_ALLOCATED`
- `FIELD_UPDATED`
- `ARRAY_ELEMENT_UPDATED`
- `EXCEPTION_THROWN`
- `EXCEPTION_CAUGHT`
- `STDOUT_APPENDED`
- `STDERR_APPENDED`
- `SESSION_FINISHED`

Optional semantic events added later:

- `ARRAY_SWAP`
- `NODE_LINKED`
- `RECURSION_EXPANDED`

Semantic events must not replace the underlying low-level truth.

## Diagnostics

Steps or sessions may include diagnostics.

Examples:

- unsupported feature warning
- partial heap capture warning
- adapter timeout
- compile error

## Minimal Example

```json
{
  "uefVersion": "0.1.0",
  "session": {
    "id": "sess_001",
    "language": "java",
    "adapter": "jdi",
    "runtimeVersion": "21",
    "entrypoint": "Main.main"
  },
  "steps": [
    {
      "step": 1,
      "event": "SESSION_STARTED",
      "threadId": "main",
      "source": {
        "file": "src/Main.java",
        "symbol": "Main.main",
        "line": 3
      },
      "delta": {},
      "state": {
        "frames": [
          {
            "id": "frame_main_1",
            "name": "main",
            "declaringType": "Main",
            "source": {
              "file": "src/Main.java",
              "symbol": "Main.main",
              "line": 3
            },
            "locals": {},
            "parameters": {},
            "status": "active"
          }
        ],
        "heap": {},
        "globals": {},
        "stdout": [],
        "stderr": []
      },
      "metadata": {}
    }
  ]
}
```

## Versioning Policy

`UEF` must use explicit semantic versioning.

Compatibility rules:

- patch releases: non-breaking clarifications
- minor releases: additive fields or event types
- major releases: breaking structural changes

## Persistence and Addressability

Every UEF trace is addressable by stable URI:

```
tracium://traces/{sessionId}
tracium://traces/{sessionId}/step/{stepNumber}
tracium://traces/{sessionId}/checkpoint/{checkpointNumber}
```

These URIs enable deep linking from IDE, Prism, documentation, external tools, and AI references.

## AI-Friendly Segmentation

UEF traces support segmentation for AI context window management:

- traces can be divided into checkpoint-bounded segments
- each segment includes enough context (active method, call stack, key variables) to be understood independently
- summarization layers can collapse step ranges into semantic descriptions
- focused views can extract only steps relevant to a specific variable, method, or exception

See [AI Consumption Model](../02-cse-engine/ai-consumption.md) for full details.

## What Does Not Belong in UEF

The following do not belong in the core schema:

- pixel positions
- animation timing curves
- UI labels tied to one application
- renderer-specific color choices
- storage-layer indexing metadata (belongs in trace store)
- AI-generated explanations (belong in intelligence layer)

Those belong in transformation layers after `UEF`.
