# Execution Persistence Model

## Purpose

This document defines how UEF traces are stored, indexed, queried, and managed as durable infrastructure artifacts.

Execution persistence is what transforms Tracium from a visualization tool into an execution intelligence platform. Without persistence, traces are ephemeral and provide no compounding value. With persistence, every execution becomes queryable data that can be replayed, compared, shared, and reasoned over.

## Core Principle

> Traces are the execution equivalent of Kafka's event log: append-only, durable, replayable, queryable.

## What Gets Persisted

### Full UEF Trace

The complete trace document including:

- session metadata (language, adapter, entrypoint, timestamps)
- all execution steps (events, deltas, states)
- diagnostics
- recording context metadata

### Trace Index Metadata

Lightweight metadata stored alongside the trace for fast querying without loading the full document:

- session ID
- language
- entrypoint symbol
- total step count
- event type histogram
- start time and end time
- recording mode (sandbox, observed, sampled)
- capture fidelity level
- user-defined tags
- correlation IDs (for distributed traces)
- source repository reference (if applicable)

### Checkpoints

Periodic full-state snapshots stored as addressable segments within a trace, enabling:

- fast seeking to arbitrary positions
- partial trace loading
- efficient AI windowing

## Storage Architecture

### Trace Store

Owned by Nerva. Responsibilities:

- write new traces (append-only)
- index traces by metadata fields
- retrieve traces by session ID
- query traces by filter criteria
- manage retention policies
- serve trace segments (partial loading)

### Storage Tiers

The trace store should support tiered storage:

- `hot`: recent traces, fast access, in primary datastore
- `warm`: older traces, queryable but slower, compressed storage
- `cold`: archived traces, retrievable on demand, object storage
- `deleted`: traces past retention, permanently removed

### Retention Policies

Configurable per workspace or per session:

- `time-based`: auto-archive or delete after N days
- `size-based`: cap total storage, evict oldest first
- `explicit-keep`: pinned traces never auto-deleted
- `tag-based`: traces matching certain tags get extended retention

## Query Model

### Query by Identity

- `GET /traces/{sessionId}` - retrieve specific trace
- `GET /traces/{sessionId}/steps?from=10&to=50` - retrieve step range

### Query by Filter

- `GET /traces?language=java` - filter by language
- `GET /traces?entrypoint=Main.main` - filter by symbol
- `GET /traces?tag=regression-test` - filter by tag
- `GET /traces?correlationId=req_123` - all traces in a distributed request
- `GET /traces?from=2026-04-01&to=2026-04-04` - time range
- `GET /traces?minSteps=100` - complexity filter

### Query by Content (Future)

- find traces where a specific variable reaches a specific value
- find traces where a specific exception was thrown
- find traces that exercised a specific method

Content-level querying requires step-level indexing and is a Phase 8+ capability.

## Trace Addressability

Every trace must be addressable by a stable URI:

```
tracium://traces/{sessionId}
tracium://traces/{sessionId}/step/{stepNumber}
tracium://traces/{sessionId}/checkpoint/{checkpointNumber}
```

These URIs enable:

- deep linking from IDE, Prism, documentation, or external tools
- sharing specific execution moments between developers
- AI referencing specific trace positions

## Recording Context

Every persisted trace must include recording context metadata:

```json
{
  "recordingMode": "sandbox",
  "captureFidelity": "full",
  "samplingStrategy": "none",
  "sourceOrigin": "direct-input",
  "environment": "development",
  "tags": ["tutorial", "bubble-sort"]
}
```

### Recording Modes

- `sandbox`: engine launched and controlled the execution (controlled environment)
- `observed`: engine attached to an already-running process (production-like)
- `replayed`: trace was re-executed from a previous recording

### Capture Fidelity Levels

- `full`: every step captured, complete heap snapshots
- `sampled`: periodic sampling, some steps skipped
- `selective`: only specific methods or regions captured
- `minimal`: entry/exit events only, no heap detail

## Relationship to Other Components

| Component | Role |
|-----------|------|
| Tracium Engine | Produces UEF traces |
| Nerva | Owns trace store, indexing, retention, query API |
| Prism | Reads persisted traces for visualization |
| Vector SDK | Exposes trace query and retrieval to external consumers |
| Pulse IDE | Links to persisted traces by URI |
| Atlas | Correlates persisted traces with architecture graph |

## What This Enables

- replay bugs days after they occurred
- compare traces across code versions
- share execution moments with teammates via URI
- build dashboards over execution patterns
- train AI on real execution data
- run regression analysis: "did this change affect execution behavior?"
