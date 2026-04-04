# Streaming Model

## Purpose

This document defines how execution events flow in real-time from the engine to consumers during capture. Streaming is what makes Tracium usable for live debugging, real-time monitoring, and progressive loading, not just post-hoc analysis.

## Core Principle

> Execution is a stream. Consumers can subscribe to it live, not just download it after the fact.

## Two Delivery Modes

### Batch Mode

The trace is produced first, then consumed.

Flow:

```
Execute -> Capture -> Serialize -> Store -> Retrieve
```

Use cases:

- snippet execution in Prism
- CI/CD test trace capture
- background analysis

This is the simpler mode and the one implemented first.

### Streaming Mode

Events are pushed to consumers as they are captured.

Flow:

```
Execute -> Capture -> Stream event -> Consumer receives immediately
                   -> Store simultaneously
```

Use cases:

- live debugging (see state as it executes)
- real-time monitoring dashboards
- progressive UI loading (start rendering before execution finishes)
- event-driven pipelines (trigger alerts on specific events)

## Event Stream Model

### Stream Granularity

The stream emits one message per UEF step:

```json
{
  "type": "step",
  "sessionId": "sess_001",
  "step": 12,
  "event": "VARIABLE_ASSIGNED",
  "source": { "file": "Main.java", "line": 7 },
  "delta": { ... },
  "state": { ... }
}
```

### Stream Lifecycle Messages

In addition to steps, the stream emits lifecycle messages:

```json
{ "type": "session_started", "sessionId": "sess_001", "metadata": { ... } }
{ "type": "step", ... }
{ "type": "step", ... }
{ "type": "checkpoint", "sessionId": "sess_001", "checkpoint": 5, "stepRange": [1, 50] }
{ "type": "session_finished", "sessionId": "sess_001", "totalSteps": 47 }
```

### Error Messages

```json
{ "type": "error", "sessionId": "sess_001", "code": "COMPILE_FAILURE", "message": "..." }
{ "type": "error", "sessionId": "sess_001", "code": "TIMEOUT", "message": "..." }
```

## Transport Protocols

### WebSocket (Primary)

For real-time bidirectional communication:

```
ws://nerva/v1/sessions/{sessionId}/stream
```

Consumer connects, receives events as they are captured.

### Server-Sent Events (Fallback)

For simpler unidirectional streaming:

```
GET /v1/sessions/{sessionId}/stream
Accept: text/event-stream
```

### Polling (Lowest Common Denominator)

For environments where WebSocket or SSE are not available:

```
GET /v1/sessions/{sessionId}/steps?after=12
```

Returns new steps since the specified step number.

## Backpressure and Buffering

### Producer Side (Engine)

- engine captures events at execution speed
- events are buffered in a bounded queue
- if the queue fills, sampling kicks in (drop intermediate LINE_CHANGED events, keep METHOD_ENTERED/EXITED)
- session metadata tracks actual vs delivered event counts

### Consumer Side (Client)

- consumers can specify desired event filter at subscription time
- example: "only METHOD_ENTERED and EXCEPTION_THROWN events"
- this reduces bandwidth for monitoring use cases

## Stream Subscriptions

### Subscribe to Active Session

```json
{
  "action": "subscribe",
  "sessionId": "sess_001",
  "filter": {
    "events": ["METHOD_ENTERED", "METHOD_EXITED", "EXCEPTION_THROWN"],
    "minStepInterval": 100
  }
}
```

### Subscribe to Future Sessions (Watch)

```json
{
  "action": "watch",
  "filter": {
    "tags": ["production", "service-a"],
    "correlationId": "req_*"
  }
}
```

This enables monitoring dashboards that automatically pick up new traces.

## Relationship to Persistence

Streaming and persistence are complementary:

- events are streamed to live consumers AND written to the trace store simultaneously
- consumers that miss live events can replay from the persisted trace
- the trace store is the source of truth; the stream is a real-time projection

## What This Enables

- see execution as it happens (live debugging)
- build monitoring dashboards that react to execution events
- progressive loading in Prism (show steps as they arrive, not after completion)
- event-driven automation (trigger alert when specific pattern detected)
- CI/CD integration (stream test execution to trace store)
