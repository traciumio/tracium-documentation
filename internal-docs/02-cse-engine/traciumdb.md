# TraciumDB

## Overview

TraciumDB is the engine's embedded storage layer for execution traces.

In the current repository it is a real, active persistence path used by `SessionStore`.

The important current distinction is:

- TraciumDB is actively used
- some additional storage features exist in source but are not yet wired into the default service path

## Core Responsibilities

TraciumDB currently provides:

- durable storage of UEF traces
- metadata indexing
- variable/value search indexing
- fork relationship storage
- session listing and query support
- stats for UI and API consumers

## Current File Layout

The active file layout is:

```text
{dataDir}/
  traces/
    {sessionId}.trace
  index.db
  steps.idx
  forks.db
  wal/
```

Current note:

- `traces/`, `index.db`, `steps.idx`, and `forks.db` are part of the active read/write path
- `wal/` is created by `TraciumDB`, but the current default write path does not yet stream writes through a live WAL-backed TraciumDB pipeline

## Active Storage Components

### `TraceStore`

- stores one `.trace` file per session
- writes atomically through temp file + rename
- reads the full JSON document back into `UefTrace`

### `MetadataIndex`

- stores lightweight session metadata
- supports list and query operations
- appends on write and flushes full state on close / flush

### `StepIndex`

- stores inverted entries for variable/value and event search
- supports cross-trace search such as "where did `x = 5` happen?"

### `ForkStore`

- stores parent/child session relationships for forked traces
- supports lineage lookup and fork tree browsing

## SessionStore Integration

`engine-service` uses TraciumDB through `SessionStore`.

Current behavior:

1. session is cached in an in-memory LRU map
2. if a trace exists, `TraceMetadata` is created
3. `db.put(...)` writes the trace and indexes synchronously

This is the current production path used by the service.

## Query Support

The current API surface over TraciumDB includes:

- list sessions
- query sessions by metadata
- get session metadata
- search by variable and value
- get fork info
- delete sessions
- get storage stats

## Embedded UI Support

The engine serves an embedded UI at `/`, and that UI uses TraciumDB-backed endpoints for storage browsing.

This means the engine is no longer "headless only" in the practical repository sense.

## Configuration

The main service currently exposes:

- `tracium.engine.data-dir`
- `tracium.engine.journal-dir`

Current note:

- `data-dir` is actively used by `SessionStore`
- `journal-dir` exists in configuration and aligns with journal concepts in core, but the default TraciumDB write path does not currently route writes through an active journal layer

## Additional Storage Components Present in Source

The repository also includes:

- `AsyncWriteQueue`
- `RetentionPolicy`
- `ExecutionJournal`
- `JournalSerializer`

These matter, but they must be documented accurately.

### `AsyncWriteQueue`

Implements bounded asynchronous storage operations and batched draining.

Current status:

- available in `engine-core`
- not yet the default `SessionStore` persistence path

### `RetentionPolicy`

Implements age and disk-based cleanup rules with support for preserving exception traces.

Current status:

- available in `engine-core`
- not yet scheduled or enforced by `engine-service` by default

### `ExecutionJournal`

Implements a journal / hash-chain model for append-only execution entries.

Current status:

- real reusable code
- not the active write path behind `SessionStore -> TraciumDB`

## Current Guarantees

TraciumDB can currently claim:

- embedded local persistence
- atomic trace-file writes
- restart-surviving stored traces
- searchable metadata and step content
- fork relationship persistence

It should not currently claim, without qualification:

- that all writes go through an active WAL-backed path
- that async write batching is the default
- that retention cleanup is automatically running

## Known Limitations

- indexes are in-memory structures backed by on-disk files
- concurrent multi-process writing to the same directory is not a documented safe mode
- the service path is synchronous by default
- metadata rebuilding from trace files is not currently an automatic first-class recovery feature

## Relationship to the Rest of the Engine

TraciumDB is the engine's local system of record for stored sessions in this repository.

Other ecosystem services may still consume or copy traces, but current engine documentation should treat TraciumDB as the active persistence layer inside this repo.
