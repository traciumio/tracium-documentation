# Call Graph Model

## Purpose

The call graph represents invocation relationships discovered from repository analysis.

It is one graph layer within `Repo Analyzer`, not the entire architecture model.

## Node Types

Recommended node kinds:

- repository
- module
- package or namespace
- class or type
- method or function

## Edge Types

Recommended edge kinds:

- `DECLARES`
- `IMPORTS`
- `DEPENDS_ON`
- `CALLS`
- `IMPLEMENTS`
- `EXTENDS`
- `OWNS`

## Static Analysis Reality

Static call graphs are useful but imperfect.

Limitations may include:

- dynamic dispatch ambiguity
- reflection
- dependency injection
- higher-order functions
- generated code

The analyzer should annotate confidence and origin where possible.

## Graph Construction Layers

Recommended construction stages:

1. Parse syntax trees
2. Build symbol inventory
3. Resolve references
4. Build direct call edges
5. Add architecture groupings
6. Mark uncertain edges

## Use in Visualization

Call graphs should support:

- scope filtering
- expansion by depth
- highlighting entrypoints
- hotspot detection
- navigation back to source anchors

## Future Extensions

Future graph enrichments may include:

- runtime overlay from `CSE`
- frequency weighting from observed traces
- ownership and team annotations
- architectural rule violations
