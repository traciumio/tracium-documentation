# Distributed Execution Model

## Purpose

This document describes the distributed-execution capabilities that currently exist in the codebase and clearly separates them from future platform ambitions.

## Current Reality

The repository contains distributed-execution building blocks in `engine-core`, but not a full end-to-end distributed product flow in `engine-service`.

What exists today:

- `CorrelationContext` on traces
- `DistributedTraceAssembler`
- sampling propagation support through `SamplingHeaderCodec`
- optional correlation ID input on attach requests

What does not yet exist as a full product path:

- automatic multi-service trace collection in `engine-service`
- distributed assembly endpoints
- automatic HTTP / gRPC / Kafka extraction in the service
- OpenTelemetry bridge endpoints

## Current Correlation Model

`CorrelationContext` currently contains:

- `correlationId`
- `parentSessionId`
- `serviceName`
- `tags`

This is narrower than some earlier design drafts. There is no first-class `serviceVersion` or `correlationGroup` field in the current core model.

## Current Assembly Layer

`DistributedTraceAssembler` can assemble multiple service traces into:

- a `DistributedTimeline`
- a `ServiceTopology`
- interleaved steps
- a distributed summary
- cross-service state snapshots

This is a reusable library layer. It assumes the caller already has the relevant service traces in hand.

## Sampling Propagation

`SamplingHeaderCodec` defines `X-Tracium-Sample` for propagated sampling decisions across services.

Current note:

- this is a sampling propagation feature
- it is not the same thing as automatic correlation extraction
- the default engine-service controllers do not currently manage cross-service propagation on behalf of user applications

## Current Use Cases

Today these building blocks are best understood as:

- data-model support for future distributed execution features
- reusable library support for assembling already-collected traces
- a place to keep correlation metadata on traces that come from external systems or agents

## Recommended Documentation Language

Use phrases like:

- "supports correlation metadata on traces"
- "contains a distributed trace assembler in core"
- "provides building blocks for future multi-service execution views"

Avoid claiming:

- automatic distributed capture
- live topology assembly in the service
- production-ready OpenTelemetry integration

## Relationship to Agents and Service APIs

The standalone agent and attach APIs can carry correlation IDs into produced traces, but they do not yet provide a full distributed-control plane.

## Caveats

- distributed execution is currently a core capability layer, not a complete product workflow
- timestamps and interleaving are still simplified relative to real production distributed tracing systems
