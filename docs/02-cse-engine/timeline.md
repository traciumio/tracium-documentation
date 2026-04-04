# Timeline Engine

## Role

The timeline engine turns normalized state changes into an ordered execution history.

It exists so that runtime understanding is not limited to a single snapshot.

## What a Timeline Represents

A timeline is an immutable ordered series of execution steps inside a session.

Each step should include:

- step number
- event type
- source anchor
- state delta
- optional materialized state
- playback metadata

## Timeline Guarantees

The timeline must guarantee:

- stable ordering inside a session
- reproducible step identifiers
- clear session boundaries
- explicit distinction between observed and inferred events

## Checkpoints

To support efficient playback, the engine should create checkpoints.

Checkpoint purposes:

- fast seeking
- reverse navigation support
- partial state reconstruction

Recommended model:

- event deltas between checkpoints
- full or partial materialized snapshots at checkpoint intervals

## Playback Operations

The timeline should eventually support:

- next step
- previous step
- jump to step
- jump to checkpoint
- play
- pause

Future operations:

- branch comparison (diff two traces aligned by source anchors)
- time-travel debugging (navigate backward through persistent traces)
- alternate path replay if supported by deterministic re-execution
- cross-session navigation (jump between correlated distributed traces)
- trace search (find steps matching criteria across stored traces)

## Session Metadata

Each timeline should also retain:

- language
- adapter version
- runtime version
- execution limits
- diagnostics
- timestamps

## Long-Run Strategy

Large sessions can become expensive.

The timeline engine should be designed for:

- compression of repeated patterns
- lazy materialization
- step window retrieval
- partial loading for UI clients

## Streaming During Capture

The timeline supports two emission modes:

- `batch`: complete timeline available after execution finishes
- `streaming`: steps emitted to consumers as they are captured, timeline grows incrementally

In streaming mode, the timeline is append-only during capture. Steps are finalized as they arrive. Consumers can subscribe to live step emission via WebSocket or SSE.

See [Streaming Model](streaming-model.md) for full details.

## Execution Versioning

Timelines can carry version metadata for comparison:

- code version (commit hash, branch)
- build number
- environment (development, staging, production)
- user-defined tags

This enables execution diffing: compare the timeline from commit A against commit B for the same input. See [Execution Diffing](execution-diffing.md) for the comparison model.

## Relationship to Persistence

The timeline is not ephemeral. Once complete, it is persisted to the trace store as a durable artifact.

Persisted timelines can be:

- loaded and replayed days, weeks, or months later
- queried by metadata (language, entrypoint, tags, time range)
- compared with other timelines
- consumed by AI for explanation and reasoning
- shared via stable URI

See [Execution Persistence Model](execution-persistence.md) for storage and query details.

## Relationship to Visualization

The timeline is not a UI animation script.

It is a structured execution history from which different experiences can be derived.

Examples:

- a strict debugger-like stepper
- a simplified learner playback
- an AI explanation stream
- a monitoring dashboard fed by real-time events
- a regression detection pipeline comparing timelines across versions
- a CI/CD integration capturing test execution traces
