# Execution Diffing and Comparison

## Purpose

Execution diffing answers a simple but high-value question:

"What changed between these two runs?"

In the current engine, diffing is implemented in `engine-core` and exposed by `DiffController`.

## Current Building Blocks

- `AlignmentStrategy`
- `DiffCategory`
- `StepDiff`
- `DiffResult`
- `ExecutionDiff`
- `DiffController`

## Supported Inputs

The current service compares two stored traces identified by session ID.

Typical sources are:

- two sandbox executions
- a baseline execution and a real fork
- two separate traces from different code or input versions

## Alignment Strategies

The current engine supports four alignment modes:

- `STEP_NUMBER`
- `SOURCE_ANCHOR`
- `METHOD_BOUNDARY`
- `EVENT_SEQUENCE`

Use them as follows:

- `STEP_NUMBER` for deterministic, same-shape runs
- `SOURCE_ANCHOR` when source location is the most stable anchor
- `METHOD_BOUNDARY` for coarser but robust comparisons
- `EVENT_SEQUENCE` for semantic pattern matching

## Difference Categories

The current diff categories are:

- `STEP_MATCHED`
- `STEP_CHANGED`
- `STEP_ADDED`
- `STEP_REMOVED`
- `PATH_DIVERGED`
- `EXCEPTION_DIFF`
- `LENGTH_DIFF`

## Current REST API

The current endpoints are:

- `POST /v1/comparisons`
- `GET /v1/comparisons/{comparisonId}`
- `GET /v1/comparisons/{comparisonId}/summary`

There is no standalone `/differences` endpoint today.

## Current Response Model

`DiffResult` contains:

- baseline session ID
- comparison session ID
- alignment
- summary
- detailed step differences

The summary includes:

- total baseline steps
- total comparison steps
- matched steps
- changed steps
- added steps
- removed steps
- path-diverged count
- `behaviorallyEquivalent`

The engine also computes:

- significant differences
- category counts
- a lightweight regression fingerprint

## Options

The current controller supports diff options such as:

- ignore line changes
- focus methods
- ignore variables

These options are translated into `ExecutionDiff.DiffOptions`.

## Storage Model

Comparisons are currently stored in-memory inside `DiffController`.

That means:

- comparison IDs are valid only for the running service instance
- they are not yet persisted in TraciumDB
- a restart clears comparison history

## Best-Fit Use Cases

The current diffing layer works best for:

- regression investigation
- comparing original vs real fork execution
- validating that refactors preserved behavior
- understanding how input changes alter step flow

## Out of Scope for Current Docs

Do not document the following as shipped product behavior:

- cross-service distributed diffing
- persisted comparison history
- branch-wide comparison dashboards

Those may be future uses, but they are not part of the current engine-service implementation.

## Caveats

- diff quality depends on alignment choice
- some advanced scenarios have limited real-world hardening
- comparison results are ephemeral service state today
