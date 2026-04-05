# Streaming Model

## Purpose

This document describes the streaming model that currently exists in the Tracium Engine repository, not an aspirational transport design.

Today the engine exposes live execution streaming for sandbox runtime sessions through SSE.

## Current Scope

The active streaming path is owned by `engine-service` and uses:

- `StreamingController`
- `StepListener`
- `JavaJdiAdapter.execute(..., sessionId, listener)`
- `JdiExecutionEngine.emitToListener(...)`
- Spring `SseEmitter`

There is no public WebSocket streaming API in the current service.

## Public Endpoints

The current runtime streaming endpoints are:

- `POST /v1/sessions/runtime/stream`
- `GET /v1/sessions/runtime/{sessionId}/stream`

The first endpoint starts execution asynchronously and returns a session ID plus stream URL. The second endpoint opens the SSE channel.

## Delivery Model

The current stream is one-way and server-driven:

- execution starts in the background
- steps are emitted as they are captured
- the client receives SSE events
- the full trace is persisted after execution completes

This is live step delivery, but persistence still happens as a final session write.

## Event Types

The current SSE channel emits these event names:

- `connected`
- `step`
- `complete`
- `error`

### `connected`

Sent when the emitter is established.

Example payload:

```json
{ "type": "connected", "sessionId": "sess_stream_ab12cd34" }
```

### `step`

Sent for each emitted execution step.

Current payload fields:

- `type`
- `sessionId`
- `step`
- `event`
- `source`
- `threadId`

Example payload:

```json
{
  "type": "step",
  "sessionId": "sess_stream_ab12cd34",
  "step": 3,
  "event": "VARIABLE_ASSIGNED",
  "source": "Main.java:4",
  "threadId": "main"
}
```

### `complete`

Sent once execution finishes successfully.

Example payload:

```json
{
  "type": "session_finished",
  "sessionId": "sess_stream_ab12cd34",
  "totalSteps": 9
}
```

### `error`

Sent when async execution fails.

## Producer Path

The producer path for sandbox streaming is:

1. `StreamingController` receives the request
2. execution is submitted to a virtual-thread executor
3. the selected adapter executes with a `StepListener`
4. `JdiExecutionEngine` emits each captured step from inside the event loop
5. the controller converts step data into SSE events

This means the current streaming path is tied to launch-mode execution, not attach-mode observation.

## Filters and Throttling

The codebase includes an `EventFilter` model and per-session filter storage in `StreamingController`, but there is currently no public REST API to configure those filters dynamically.

What exists today:

- internal filter support in the controller
- default pass-through behavior
- step tracking for throttling logic

What does not exist yet:

- a public subscribe API with filter payloads
- watch subscriptions
- stream replay or catch-up windows

## Backpressure and Buffering

Two different ideas exist in the repository:

### Active runtime stream path

The live SSE stream relies on:

- `SseEmitter`
- controller-managed session maps
- best-effort emitter sends

### Scaling-oriented capture path

The source tree also contains `EventRingBuffer`, which is designed to decouple event receipt from heavier processing for attach / production workloads.

That component is an important scaling primitive, but it is not the default mechanism used by the current runtime SSE endpoint.

## Relationship to Persistence

Streaming and persistence are related but not identical in the current implementation.

Current behavior:

- steps are emitted live during execution
- the completed trace is stored in `SessionStore`
- `SessionStore` writes the final trace to TraciumDB

So the stream is live, while the durable write occurs at session completion rather than incrementally per streamed step.

## UI Relationship

The embedded UI at `/` uses the same engine service and can consume streaming sessions from the same process that owns persistence and analysis endpoints.

## Current Limitations

- SSE only, no WebSocket API
- only runtime sandbox sessions have a dedicated streaming endpoint today
- no public filtering API yet
- no replay / resume semantics on the stream endpoint
- very short sessions may finish before some clients attach to the stream

## Recommended Documentation Posture

When describing streaming externally:

- say "SSE live step streaming for runtime sessions"
- do not claim WebSocket support
- do not claim stream-time persistence of every step
- treat `EventRingBuffer` as an available scaling component, not the default product path
