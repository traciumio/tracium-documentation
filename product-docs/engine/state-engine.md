# State Engine

The state engine transforms raw JDI events into a clean, consistent model of program state. It's the intellectual core of Tracium.

## Responsibilities

- Model stack frames with locals and parameters
- Model heap objects with fields and elements
- Preserve object identity (aliasing)
- Normalize all values to UEF value kinds
- Compute deltas between steps
- Classify events by what changed

## Truth-First

The state engine represents **program truth**, not a teaching abstraction:

- Aliasing is visible — two variables referencing the same object share one heap ID
- Null is explicit — never hidden or simplified away
- Frame boundaries are preserved — each method call has its own scope
- References are real — `{ "kind": "reference", "ref": "obj_1" }` points to an actual heap object

## Immutable State

Every `ExecutionState` is immutable. State transitions produce new instances:

```java
// Push a new frame
state = state.withFramePushed(newFrame);

// Update a local variable
frame = frame.withLocal("x", Value.ofInt(5));
state = state.withTopFrameUpdated(frame);

// Add a heap object
state = state.withHeapObject(arrayInstance);
```

## Delta Computation

The engine tracks previous state and computes deltas:

- **New variable**: `before: null, after: { value: 5 }`
- **Changed variable**: `before: { value: 5 }, after: { value: 10 }`
- **Changed field**: `objectId: "obj_1", path: "x", before: 3, after: 10`
- **Changed array element**: `objectId: "obj_1", path: "elements[0]", before: 3, after: 1`
