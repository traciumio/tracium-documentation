# Ecosystem Component Map

## Purpose

This document defines the classification system for every part of the ecosystem.

It exists so the team can answer questions like:

- is this a library or a service
- should this be deployable
- should this be a separate repo
- what tech stack belongs here

## Component Tags

Use these tags as the official classification set:

- `WORKSPACE`
- `SPEC`
- `LIB`
- `SERVICE`
- `WORKER`
- `APP`
- `SDK`
- `PLUGIN`
- `CONNECTOR`
- `SHARED`

## Meaning Of Each Tag

### `WORKSPACE`

Umbrella folder for strategy, docs, and multiple product repos or projects.

### `SPEC`

Canonical contract and schema definitions used across the ecosystem.

### `LIB`

Reusable package with no required network boundary.

### `SERVICE`

Deployable backend with an API or job boundary.

### `WORKER`

Background execution unit for heavy or long-running tasks.

### `APP`

User-facing product surface.

### `SDK`

Client library for developers integrating with the ecosystem.

### `PLUGIN`

Tool-specific extension, such as a VS Code extension.

### `CONNECTOR`

Integration unit responsible for external systems such as GitHub.

### `SHARED`

Reusable component that does not own a product surface and is intended for multiple consumers.

## Naming Convention

The repo and component names are now locked to the Tracium brand:

- `quanta`
- `tracium-engine`
- `atlas`
- `nerva`
- `prism`
- `vector`
- `pulse`

Internal modules should still make their role obvious without opening the codebase.

## Primary Component Map

| Name | Tag | Purpose | Deployable |
|---|---|---|---|
| `Tracium` | `WORKSPACE` | umbrella ecosystem workspace | no |
| `quanta` | `SPEC` | canonical schemas and contracts | no |
| `engine-core` | `LIB` | runtime normalization, state engine, timeline engine | no |
| `engine-java-jdi-adapter` | `LIB` | Java runtime capture adapter for Tracium Engine | no |
| `tracium-engine` | `SERVICE` | deployable runtime execution service repo | yes |
| `atlas-core` | `LIB` | graph and analysis core for repository intelligence | no |
| `atlas-java-analyzer` | `LIB` | Java parser and Java-specific repository analysis | no |
| `atlas` | `SERVICE` | deployable repository analysis service repo | yes |
| `nerva` | `SERVICE` | orchestration, auth, sessions, client-facing backend APIs | yes |
| `prism` | `APP` | user-facing runtime and architecture visualization product | yes |
| `vector` | `SDK` | TypeScript client library for the platform | no |
| `pulse` | `PLUGIN` | VS Code integration | yes |
| `github-connector` | `CONNECTOR` | GitHub access and private repo ingestion support | no initially |

## Ownership Pattern For Engines

For both `CSE` and `Repo Analyzer`, the preferred pattern is:

`Core Library -> Language Adapter Library -> Service`

### Why This Pattern Matters

It gives:

- reusable core logic
- clean tests
- easier future multi-language expansion
- option to embed the engine without deploying the service
- cleaner separation between logic and delivery

## Technology Direction By Component Type

### `SPEC`

- JSON Schema
- OpenAPI where relevant
- Markdown documentation

### `LIB` For Engines

- Java 21
- Gradle

### `SERVICE`

- Java for engine-backed execution and analysis services
- TypeScript for orchestration and integration-heavy services

### `APP`

- React
- TypeScript

### `SDK`

- TypeScript first

### `PLUGIN`

- VS Code Extension API
- TypeScript

### `CONNECTOR`

- TypeScript first, usually attached to the platform layer initially

## Repo Guidance

A component should become its own repo when at least one of these becomes true:

- it has a distinct release cadence
- it has a distinct consumer audience
- it needs a different visibility model
- it has a separate deployment lifecycle

## Immediate Architectural Conclusion

The ecosystem should be described as:

- one umbrella workspace
- multiple product repos over time
- shared canonical specs
- engine libraries separated from delivery services

That is the classification model the rest of the architecture should follow.
