# Repository Strategy

## Goal

Keep product boundaries clear without confusing the umbrella workspace with the actual product topology.

## Tracium First

`Tracium` should be treated first as the umbrella workspace for:

- product docs
- architecture docs
- standards and specs
- references to separate product repos over time

It should not be mistaken for the final single-repo structure of the ecosystem.

## Logical Separation

At minimum, the ecosystem must stay logically separated into these units:

- `quanta`
- `tracium-engine`
- `atlas`
- `nerva`
- `prism`
- `vector`
- `pulse`

## Recommended Phased Structure

### Phase 1

Use `Tracium` mainly as the architecture and documentation workspace.

### Phase 2

Create separate core product repositories as boundaries stabilize.

Recommended first product repos:

- `quanta`
- `tracium-engine`
- `atlas`
- `nerva`
- `prism`

### Phase 3

Add supporting ecosystem repos:

- `vector`
- `pulse`

## Temporary Local Aggregation

For exploration, prototypes, or internal spikes, it is acceptable to keep multiple components in one local umbrella folder.

That convenience should not be treated as the final repo topology.

## Example Ecosystem View

Example:

```text
Tracium/
  docs/
  quanta/
  tracium-engine/
  atlas/
  nerva/
  prism/
  vector/
  pulse/
```

Why this is the right direction:

- product boundaries stay explicit
- each major product can evolve independently
- open-source and commercial choices remain flexible
- deployment and repo decisions do not get mixed together

## Future Split Strategy

The long-term default should be separate repositories for major products, not one giant codebase.

Conditions that justify a physical split:

- distinct release cadence
- independent contributor communities
- public open-source engine with private commercial app layers
- separate deployment or compliance requirements

## Shared Contracts Package

A shared specs product should own:

- `UEF` schemas
- `UGF` schemas
- common source-anchor models
- shared IDs and metadata conventions

This package must avoid product-specific UI concerns.

## What Must Never Be Coupled

The following coupling is explicitly discouraged:

- embedding renderer-specific assumptions inside `CSE`
- forcing `Repo Analyzer` to emit UI-ready graph layouts
- tying IDE plugin behavior directly to raw engine internals
- duplicating shared contracts across projects

## Immediate Recommendation

Treat `Tracium` as the umbrella workspace and treat `CSE`, `Repo Analyzer`, `Platform API`, and the `Visualization Platform` as separate products from day one.

If temporary local aggregation is used for convenience, document it as a development shortcut rather than the final architecture.
