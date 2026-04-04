# State Engine

## Role

The state engine is the core intellectual center of `CSE`.

Its job is to transform raw runtime signals into a clean, consistent model of program state.

This is where the engine becomes more than a debugger hook.

## Core Responsibilities

The state engine must:

- model stack frames
- model heap objects
- preserve object identity
- represent references explicitly
- normalize primitive and composite values
- classify runtime events
- attach source anchors and metadata

## Truth-First State Model

The state engine should represent program truth, not a teaching abstraction.

That means:

- aliasing must be visible
- the same object referenced by two variables must remain one object
- nullability must be explicit
- frame boundaries must be preserved

Educational or simplified views can be derived later, but not stored as the primary engine truth.

## Normalized Concepts

### Frames

A frame represents a callable execution context.

Minimum fields:

- frame ID
- function or method name
- source anchor
- local variables
- parameters
- return target metadata

### Values

Values should be normalized into categories:

- primitive
- null
- reference
- collection
- array
- object
- enum or symbolic value

### Heap Entities

Heap entities represent allocated identity-bearing runtime objects.

Minimum fields:

- object ID
- runtime type
- fields or elements
- ownership or reference metadata

### References

References are not visual hints. They are actual links between state elements.

Every reference should:

- point to a stable object ID
- preserve shared identity
- allow traversal from frame to heap and between heap objects

## Snapshot vs Delta Strategy

The engine should internally support both:

- `delta events`: what changed at this step
- `materialized views`: what the full state looks like at this step

Recommended approach:

- store event deltas for efficiency
- create checkpoints at intervals
- generate full state views on demand

## Object Identity Rules

These rules are mandatory:

- object IDs remain stable within a session
- two references to the same runtime object must share the same object ID
- destroyed or out-of-scope bindings do not destroy heap identity immediately unless runtime semantics require it

## Event Categories

Core event categories should include:

- session started
- line changed
- method entered
- method exited
- variable assigned
- object allocated
- field updated
- array element updated
- exception thrown
- exception caught
- session finished

## Derived Semantic Layers

The state engine may later derive higher-level semantic hints from raw events.

Examples:

- array swap
- linked-list insertion
- recursion expansion
- map put

These should be additive metadata, not replacements for low-level truth.

## Persistence-Aware Design

The state engine must produce output suitable for durable storage, not just ephemeral visualization:

- all state must be serializable to JSON without loss
- object IDs must be stable and reusable across persistence boundaries
- checkpoints must be independently loadable (not dependent on replaying from step 0)
- deltas must be self-describing (include enough context to understand the change without full state)

This enables:

- efficient trace storage (deltas + periodic checkpoints)
- partial trace loading (jump to any checkpoint without loading entire trace)
- trace querying (find steps where specific variables have specific values)
- AI windowing (load relevant segments without full trace)

## Queryable State Model

The state model must support future querying operations:

- find all steps where variable X was assigned
- find all steps where object Y was modified
- find all steps within method Z
- find the state at step N without loading steps 1 through N-1

These queries are served by the trace store (Nerva), but the state engine must produce data structured to support them.

## Engine Outputs

The state engine emits normalized data that the timeline engine can order and serialize into `UEF`.

The final consumer should not need debugger-specific runtime knowledge to understand the state.

Outputs flow to multiple destinations simultaneously:

- timeline engine (for ordering and serialization)
- event stream (for real-time delivery to live consumers)
- trace store (for persistence and querying)
