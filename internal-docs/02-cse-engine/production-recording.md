# Production Recording Model

## Purpose

This document describes how the current engine records execution from already-running JVMs and how the standalone agent fits into that model.

Production recording in this repository is centered on:

- `AttachController`
- `AttachRequest`
- `JdiAttachEngine`
- `BudgetedStateCapture`
- `TraciumAgent`

## Two Recording Contexts

### 1. Launch / Sandbox Recording

The engine launches the target JVM and captures execution under tighter control.

This is the most complete and most deterministic path.

### 2. Attach / Observed Recording

The engine attaches to an already-running JVM through JDI and records selected events with bounded state capture.

This is the production-oriented path.

## Current Entry Points

The current codebase exposes observed recording in two ways:

### REST Service

`POST /v1/sessions/attach`

### Standalone Agent

`engine-agent` builds `tracium-agent.jar`, which attaches directly and writes traces to a local TraciumDB directory.

## `AttachRequest`

The current attach request model contains:

- target host
- target port
- transport
- recording strategy
- included packages
- excluded packages
- execution limits
- optional correlation ID
- optional explicit capture budget

If no explicit budget is supplied, the engine derives one from the selected recording strategy.

## Strategies and Effective Budgets

| Strategy | Main Event Style | Recording Context | Effective Budget |
| --- | --- | --- | --- |
| `FULL_CAPTURE` | richest capture | `full` | `CaptureBudget.full()` |
| `METHOD_BOUNDARY` | method entry / exit | `sampled` | `CaptureBudget.production()` |
| `BREAKPOINT` | targeted capture | `selective` | `CaptureBudget.production()` |
| `EVENT_FILTER` | minimal exception / event capture | `minimal` | `CaptureBudget.minimal()` |

## Budgeted Capture

The most important production hardening change in the current engine is budgeted state capture.

`BudgetedStateCapture` applies limits from `CaptureBudget` to:

- max frames
- max object depth
- max objects per capture
- max array elements
- max fields per object
- excluded framework type prefixes

This is the core mechanism that makes attach-mode state capture bounded rather than heap-wide.

## Current Attach Flow

Observed recording currently works like this:

1. connect to the target JVM with `AttachingConnector`
2. configure event requests based on strategy
3. capture event-driven snapshots through `BudgetedStateCapture`
4. build an observed-mode `UefTrace`
5. store the trace in TraciumDB

## Standalone Agent

`engine-agent` provides a non-Spring, CLI-driven recording path.

### Core Components

- `TraciumAgent`
- `AgentConfig`

### Current Agent Behavior

- parses CLI arguments
- opens local TraciumDB output
- attaches to the target JVM
- records traces
- auto-reconnects after disconnect or failure

### Current CLI Options

- `--target HOST:PORT`
- `--packages PKG,PKG`
- `--exclude PKG,PKG`
- `--strategy method-boundary|full|breakpoint|event-filter`
- `--sample-rate N`
- `--output DIR`
- `--timeout MS`
- `--max-steps N`

## Enterprise-Scaling Components in Source

The source tree now includes the following production-scaling components:

- `CaptureBudget`
- `BudgetedStateCapture`
- `EventRingBuffer`
- `SamplingEngine`
- `SamplingConfig`
- `SamplingDecision`
- `SamplingHeaderCodec`
- `CircuitBreaker`
- `AsyncWriteQueue`
- `RetentionPolicy`

## Current Wiring Status

### Actively Used

- attach mode
- budgeted capture
- standalone agent
- TraciumDB persistence

### Present In Source But Not Yet the Default Service Path

- `EventRingBuffer`
- `SamplingEngine` and propagated sampling headers
- `CircuitBreaker`
- `AsyncWriteQueue`
- `RetentionPolicy`

These should be documented as available architecture and implementation pieces, not overstated as fully operational defaults across all capture paths.

## Sampling

The engine now has a dedicated request-level sampling model that supports:

- rate-based sampling
- error-biased promotion
- latency-biased promotion
- adaptive rate adjustment
- cross-service propagation through `X-Tracium-Sample`

This is implemented in `engine-core`, but the default service and agent attach flows do not yet expose a fully wired request-sampling control plane.

## Circuit Breaking

`CircuitBreaker` provides automatic degradation across capture levels:

- `FULL`
- `METHOD_BOUNDARY`
- `EVENT_FILTER`
- `OFF`

It maps capture level to effective capture budget, but it is not yet connected to a continuously running monitoring loop in `engine-service`.

## Async Storage and Retention

The storage layer contains:

- `AsyncWriteQueue` for non-blocking batched writes
- `RetentionPolicy` for deleting old traces while preserving exceptions

Current note:

- these are available in `engine-core`
- `SessionStore` still uses synchronous `db.put(...)` today

## Recording Context in UEF

Attach-produced traces include observed recording metadata, including:

- `mode = observed`
- fidelity derived from strategy
- sampling strategy name
- environment set to `production`

This metadata is important for consumers because attach traces may be selective and budgeted.

## Operational Caveats

- attach mode depends on the target JVM already exposing JDWP
- attach capture is bounded and intentionally partial in production-oriented strategies
- sampling, circuit breaking, and async persistence are not yet the default end-to-end path
- attach mode is real code and exposed in product APIs, but the sandbox launch path remains the most mature execution path
