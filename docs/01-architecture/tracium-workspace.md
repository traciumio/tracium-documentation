# Tracium Workspace

## Purpose

`Tracium` is not the product itself and not the final source-control boundary for the ecosystem.

It is the umbrella workspace used to design, document, and coordinate the ecosystem.

## What Tracium Means

`Tracium` should contain:

- product vision and roadmap
- ecosystem architecture documentation
- shared standards and specifications
- design decisions
- references to separate product repositories over time

It may temporarily contain exploratory code or prototypes, but that does not define the final product topology.

## Core Design Principle

Design this system in the following order:

1. product ecosystem first
2. service boundaries second
3. deployment boundaries third

This matters because the project is not a single app with supporting modules.

It is an ecosystem of products that must evolve independently without losing contract compatibility.

## Product Ecosystem

The core ecosystem currently consists of:

- `CSE`
- `Repo Analyzer`
- `Visualization Platform`
- `Platform API`
- `SDK`
- `IDE Plugin`
- `Shared Specs`

## Questions Tracium Must Answer

Before major implementation work, `Tracium` must define:

- what each product owns
- what each canonical contract is
- what communicates with what
- which components are reusable libraries
- which components are deployable services
- which components deserve separate repositories

## Repo Strategy

The recommended repo strategy is phased.

### Phase 1

Use `Tracium` primarily as:

- architecture workspace
- documentation workspace
- standards workspace

### Phase 2

Split major product surfaces into separate repositories as boundaries stabilize.

Recommended primary repos:

- `quanta`
- `tracium-engine`
- `atlas`
- `nerva`
- `prism`

### Phase 3

Add ecosystem repos as needed:

- `vector`
- `pulse`

## Why Not One Giant Product Repo

A single product repo becomes misleading because:

- `CSE` and `Repo Analyzer` are real engines, not subfeatures
- the `Visualization Platform` is a consumer, not the system owner
- `SDK` and `IDE Plugin` have different release and adoption paths
- open-source and commercial boundaries may differ later

## Deployable Services vs Product Repos

A product repo is not automatically the same as a deployable service.

Examples:

- `tracium-engine` may contain reusable libraries and one deployable runtime service
- `atlas` may contain reusable libraries and one deployable analysis service
- `nerva` is primarily a service repo
- `prism` is primarily an app repo

## Practical Guidance

If a local umbrella folder contains multiple components during early design, treat that as a planning convenience, not a final architecture decision.

The architecture should still be documented as an ecosystem with explicit product boundaries.
