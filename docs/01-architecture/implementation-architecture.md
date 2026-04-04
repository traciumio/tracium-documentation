# Implementation Architecture

## Goal

Turn the product vision into a buildable system with clear ownership and a sane development order.

Important scope note:

This document describes implementation architecture and service interactions.
It does not override the repo-topology decision that `Tracium` is the umbrella workspace and that major products may live in separate repositories over time.

## Chosen Architecture

The implementation architecture is a modular polyglot ecosystem.

Why this shape:

- Java is the best fit for the first `CSE` runtime engine because of `JDI`
- Java is also a strong fit for Java-first repository analysis
- TypeScript is the best fit for the web platform, SDK, VS Code plugin, and GitHub integration surfaces
- a shared architecture workspace keeps contracts aligned while the system is still evolving

## Top-Level System

```text
Visualization Platform
        |
        v
   Platform API
    /       \
   v         v
CSE       Repo Analyzer
   \         /
    \       /
   Shared Contracts
```

## Runtime Track

### `services/cse-engine-java`

Role:

- compile or prepare Java inputs
- execute them using `JDI`
- capture runtime signals
- normalize them into `UEF`

Internal modules to implement next:

- execution adapter
- runtime event collector
- state normalizer
- timeline builder
- `UEF` serializer

### `services/platform-api`

Role:

- create and manage runtime sessions
- route execution requests to `CSE`
- expose runtime session APIs to UI, SDK, and plugin clients

It should not reimplement runtime capture logic.

### `apps/visualization-platform`

Role:

- create runtime sessions through the API
- render `UEF`
- provide learning mode and debugging mode views

## Repository Track

### `services/repo-analyzer-java`

Role:

- analyze repositories from normalized snapshots
- extract symbols, dependencies, and call graphs
- emit `UGF`

Internal modules to implement next:

- source ingestion boundary
- parser pipeline
- symbol inventory
- dependency resolver
- graph builder
- `UGF` serializer

### Repo Access Strategy

Repo access is not the analyzer itself.

It is an ingestion concern handled by the platform layer:

- local workspace connector
- GitHub connector for authorized repositories, including private repos

Both feed the same analyzer core.

## Shared Middle Layer

### `packages/shared-contracts`

This package is the source of truth for:

- `UEF` schema
- `UGF` schema
- contract versions
- sample payloads

Rule:

no UI assumptions and no engine-specific implementation details in the contracts package.

## Ecosystem Layer

### `packages/sdk-typescript`

Role:

- typed client access to the Platform API
- stable request and response wrappers
- future helper utilities for session polling and graph retrieval

### `apps/ide-plugin-vscode`

Role:

- create analysis sessions from the editor
- deep-link editor context to runtime and repo insights
- surface lightweight inline actions and panels

## Why Platform API Exists

The Platform API is the orchestration layer that keeps frontends and integrations simple.

It should own:

- session lifecycle
- authentication and authorization
- GitHub connection flow
- connector orchestration
- response shaping for clients

It should not own:

- low-level execution internals
- low-level parser internals

## Development Principle

We will build this as vertical slices, not isolated silos.

Each slice should ideally touch:

- contract
- service
- consumer

That keeps us honest and prevents engine work from drifting away from actual product usage.

## Initial Build Order

### Slice 1

- workspace scaffold
- shared contract package
- platform API health and session skeleton

### Slice 2

- `CSE` Java skeleton
- mocked or minimal `UEF` flow through Platform API
- visualizer shell that can render session status

### Slice 3

- real Java execution session start in `CSE`
- initial stack-frame and line events
- visual timeline view

### Slice 4

- repo analyzer skeleton
- local repo ingestion
- first `UGF` graph rendered in visualizer

### Slice 5

- GitHub connector
- authorized private repo analysis
- SDK and plugin hookups

## Key Constraint

The system must stay contract-first:

- frontends consume contracts
- engines emit contracts
- orchestration passes contracts

That is how the ecosystem stays extensible instead of becoming a tightly coupled app.
