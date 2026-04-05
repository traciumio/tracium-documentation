# Timeline Engine

## Role

The timeline layer turns captured execution into a navigable history.

In the current engine this responsibility is spread across several `engine-core` classes rather than a single monolithic "timeline engine".

## Current Core Classes

- `ExecutionTimeline`
- `CheckpointStore`
- `RootCauseLocator`
- `TimelineFork`
- `ForkTree`

Together they provide the time-machine behavior exposed by the service.

## What a Timeline Represents

A timeline is an ordered sequence of `UefStep` values within a `UefTrace`.

Each step may include:

- step number
- event type
- source anchor
- state delta
- full materialized state

## `ExecutionTimeline`

`ExecutionTimeline` provides:

- step lookup
- state lookup
- variable queries
- event queries
- method queries
- line queries
- checkpoint generation

The default checkpoint interval in the current implementation is 10 steps.

## `RootCauseLocator`

`RootCauseLocator` walks backward through deltas and visible state to build a causal chain for a variable.

This powers:

- root-cause analysis
- divergence detection
- first-occurrence discovery

It is useful and real, but it should still be documented as trace-driven reasoning rather than full compiler-grade data-flow analysis.

## `TimelineFork`

`TimelineFork` is the predictive fork layer.

It:

- takes the state at a chosen step
- applies modifications
- predicts likely divergence points

This is separate from adapter-backed real re-execution forks.

## `ForkTree`

`ForkTree` tracks branch relationships and supports:

- root branch registration
- child branch attachment
- branch summaries
- counterfactual queries
- reconstructed full timelines

Its job is to organize alternate timelines once they exist.

## Relationship to Real Re-Execution

There are two different fork concepts in the repo:

### Predictive Fork

- owned by `TimelineFork`
- stays inside `engine-core`
- works over an existing trace

### Real Fork

- owned by `JdiForkEngine` and surfaced by `TimeMachineController`
- relaunches code and injects values at runtime
- produces a new trace

Docs should keep these separate.

## Persistence Relationship

Timelines are stored as traces in TraciumDB.

That allows:

- replay after restart
- root-cause and divergence over stored sessions
- fork-tree browsing
- cross-session comparison

## Current Caveats

- checkpoints are simple periodic snapshots, not a specialized high-compression storage layer
- predictive forking is heuristic
- real re-execution is more advanced but also more operationally fragile than pure trace navigation
- timeline analysis is strongest when the trace contains rich state and accurate deltas
