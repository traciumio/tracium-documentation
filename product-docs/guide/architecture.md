# Architecture

This guide focuses on the architecture of the current Tracium Engine repository.

## Repository Structure

```text
tracium-engine/
  engine-core/
  engine-java-jdi-adapter/
  engine-service/
  engine-agent/
```

## Module Responsibilities

### `engine-core`

Owns:

- UEF models
- state model
- time machine
- diffing
- AI helpers
- causality
- simulation
- distributed assembly helpers
- TraciumDB

### `engine-java-jdi-adapter`

Owns:

- Java compilation
- JDI launch capture
- JDI attach capture
- JDI fork execution
- budgeted capture
- sandbox policy

### `engine-service`

Owns:

- REST API
- SSE streaming
- TraciumDB-backed session storage
- embedded UI
- auth, metrics, swagger

### `engine-agent`

Owns:

- standalone CLI attach mode
- reconnect loop
- local TraciumDB output

## Runtime Flow

```text
Client / UI / curl
  -> engine-service
    -> engine-core contracts
    -> Java JDI adapter
      -> captured UEF trace
        -> TraciumDB
          -> APIs, UI, time machine, diffing, AI
```

## Storage Model

The engine persists locally through TraciumDB.

That means the engine is not dependent on Nerva or any external database to store its own sessions in this repository.

## UI Model

The engine serves an embedded UI from the same Spring Boot service that exposes the API.

So the current repository is:

- still API-first
- still usable without the UI
- but no longer "headless only" in the practical deployment sense

## Advanced Architecture Pieces

The codebase also contains:

- sampling support
- circuit-breaker support
- async write support
- retention support
- ring-buffer support

These are part of the architecture even where the default service path still uses simpler wiring.
