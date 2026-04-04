# Development Flow

## How We Are Building This

We are not building every product fully in isolation and hoping they connect later.

We are building in layered vertical slices with strict boundaries.

## Phase-by-Phase Development Flow

### Phase 1: Foundation

Deliver:

- workspace structure
- shared contracts package
- platform API skeleton
- Java service skeletons

Purpose:

- make the repo real
- establish package boundaries
- prepare the system for actual engine code

### Phase 2: Runtime Path First

Deliver:

- initial `CSE` execution path
- session creation through Platform API
- first `UEF` payloads
- basic runtime view in the Visualization Platform

Purpose:

- validate the end-to-end runtime pipeline early

### Phase 3: Static Path Next

Deliver:

- initial repo analysis path
- local repository ingestion
- first `UGF` payloads
- first architecture graph view

Purpose:

- validate the end-to-end static-analysis pipeline early

### Phase 4: Remote Repo Access

Deliver:

- GitHub connector
- authorized private repo analysis
- remote session handling

Purpose:

- unlock real-world repository workflows

### Phase 5: Ecosystem Expansion

Deliver:

- SDK access
- VS Code plugin
- better client ergonomics

Purpose:

- turn the system into a platform

## Team Rule For Every Milestone

Each milestone should answer these questions:

- what contract changed
- what backend emits or consumes it
- what client proves it works

## Immediate Next Implementation Target

The best first coding milestone is:

- `shared-contracts` package
- `platform-api` health endpoint and runtime session placeholder
- `cse-engine-java` service shell
- basic `visualization-platform` shell

That gives us a runnable backbone before we start `JDI` work.
