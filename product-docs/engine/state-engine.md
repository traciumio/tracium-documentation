# State Engine

The state engine is the part of Tracium that turns raw debugger information into a stable execution model.

## What It Models

At each step, Tracium can model:

- stack frames
- local variables
- method parameters
- heap objects
- references between values and objects
- source location
- state deltas
- stdout and stderr

## Why It Matters

Without normalization, raw debugger output is difficult to compare, store, stream, and analyze.

The state engine makes the rest of the product possible:

- time machine
- diffing
- AI summaries
- causality
- simulation
- TraciumDB indexing

## Truth-First Rules

The state engine keeps the runtime honest:

- two variables pointing at the same object still point at the same object
- null stays explicit
- frames stay separate
- heap mutations are visible as deltas

## Current Core Types

The most important types are:

- `ExecutionState`
- `StackFrame`
- `HeapObject`
- `Value`
- `StateDelta`

## Full State and Delta Together

Each step can carry:

- a materialized state snapshot
- a delta that says what changed

This is why Tracium can both replay execution and explain what changed between steps.

## Budgeted Attach Capture

Attach mode does not try to capture the entire heap forever.

Instead it can use bounded capture rules for:

- frame depth
- object depth
- object count
- field count
- array size

That keeps production-oriented recording practical while still producing valid traces.
