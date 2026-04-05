# State Engine

## Role

The state engine turns raw runtime information into a stable, serializable model of execution state.

In the current repository, this logic lives mostly in `engine-core` and is populated by the JDI adapter.

## Core Model

The current state model is built from these types:

- `ExecutionState`
- `StackFrame`
- `HeapObject`
- `Value`
- `StateDelta`
- `EventType`
- `SourceAnchor`
- `RecordingContext`
- `CorrelationContext`
- `Diagnostic`

## Current `ExecutionState`

`ExecutionState` contains:

- `frames`
- `heap`
- `globals`
- `stdout`
- `stderr`

This matters because the current engine is not only recording variables and heap changes. It also carries process output streams into the state model.

## Frames

Each `StackFrame` currently records:

- frame ID
- method / function name
- declaring type
- source anchor
- locals
- parameters
- status

Frame status is used to distinguish active and returned frames.

## Values

The normalized `Value` model supports:

- primitive values
- null values
- reference values
- inline object values
- inline array values
- symbolic values

The adapter most often uses primitive, null, and reference values for persisted execution state, while object and array structure is represented in the heap map.

## Heap Entities

The current heap model supports:

- `HeapObject.ObjectInstance`
- `HeapObject.ArrayInstance`

References in stack frames point to stable object IDs in the heap map.

## Truth-First Rules

The engine treats these rules as mandatory:

- aliasing must remain visible
- null must remain explicit
- stack frames must remain distinct
- object identity must stay stable within a session
- source anchors must preserve where capture occurred

Consumers may simplify the view, but they should never need to reconstruct truth that the engine failed to record.

## Snapshot and Delta Semantics

Each step can carry both:

- a full materialized state snapshot
- a `StateDelta` showing what changed at that step

`StateDelta` currently contains:

- frame changes
- heap changes

This dual model is important because:

- UI replay prefers snapshots
- query and comparison engines benefit from deltas
- root-cause and fork reasoning often uses both

## Event Classification

The current event taxonomy includes:

- `SESSION_STARTED`
- `SESSION_FINISHED`
- `METHOD_ENTERED`
- `METHOD_EXITED`
- `VARIABLE_ASSIGNED`
- `OBJECT_ALLOCATED`
- `FIELD_UPDATED`
- `ARRAY_ELEMENT_UPDATED`
- `EXCEPTION_THROWN`
- `EXCEPTION_CAUGHT`
- `LINE_CHANGED`
- output-related events in the model, even if not all producers emit them yet

## Object Identity

The Java adapter maps JDI object identity to stable Tracium object IDs such as `obj_1`, `obj_2`, and so on.

There are two relevant identity paths today:

- `JdiExecutionEngine` uses an LRU-backed object ID map for sandbox capture
- `BudgetedStateCapture` uses a bounded LRU object map for attach capture

That identity preservation is required for:

- heap mutation tracking
- aliasing visibility
- AI object-focused views
- causality and simulation helpers

## Capture Budgets and Truncation

Production recording no longer assumes unbounded heap capture.

`CaptureBudget` and `BudgetedStateCapture` add explicit caps for:

- max stack frames
- max object depth
- max objects per capture
- max array elements
- max fields per object
- excluded type prefixes

This lets the engine record real applications without trying to walk the entire heap every time.

Important consequence: attach-mode snapshots may be intentionally partial, but they should still be well-formed.

## Queryability

The state model is designed to support:

- find steps where a variable exists
- find steps where a variable equals a value
- find steps within a method
- find steps by event type
- find branches where a condition becomes true

Those operations are powered by:

- `ExecutionTimeline` over a single trace
- `TraciumDB` indexes across many traces

## Persistence

The current persistence story is:

- state and deltas are serialized into UEF
- UEF traces are stored in TraciumDB
- metadata, step content, and fork relations are indexed separately

This is no longer a generic external trace-store concept. The engine repository owns the embedded persistence path directly.

## Consumers

The state engine feeds:

- time-machine features
- diffing
- causality helpers
- simulation helpers
- AI compression and narrative helpers
- SSE streaming payload generation
- TraciumDB indexing
- the embedded UI

## Caveats

- Launch-mode capture is the most complete path
- Attach-mode capture is intentionally budgeted
- The core model includes more concepts than every producer currently emits
- Some advanced analysis layers are heuristic and should be documented as such rather than treated as bytecode-precise program analysis
