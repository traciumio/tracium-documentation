# Phase 1: CSE Foundation + Trace Persistence (Tracium Engine + Nerva)

**Status:** NEXT
**Products Involved:** Tracium Engine, Nerva (trace store), Quanta
**Tech Stack:** Java 21, JDI, Gradle, TypeScript
**Depends On:** Phase 0

---

## Objective

Build the headless execution recording engine that can execute Java code, capture runtime state through JDI, normalize it into clean state models, emit UEF-compliant output, and persist traces to a durable store. From day one, traces are persistent queryable artifacts, not ephemeral output.

---

## Sub-Tasks Breakdown

### 1.1 Project Scaffolding & Build System

- [ ] Set up Gradle multi-module build (`engine-core`, `engine-java-jdi-adapter`, `engine-service`)
- [ ] Configure Java 21 compiler settings
- [ ] Set up dependency management (JDI, logging, JSON serialization)
- [ ] Configure unit test framework (JUnit 5)
- [ ] Set up integration test infrastructure
- [ ] Create CI build pipeline configuration

### 1.2 Quanta Integration - UEF Models (Including Recording & Correlation Context)

- [ ] Implement Java data classes for UEF session model (including recording context and correlation fields)
- [ ] Implement Java data classes for UEF step model
- [ ] Implement Java data classes for UEF state model (frames, heap, globals)
- [ ] Implement Java data classes for UEF value kinds (primitive, null, reference, object, array)
- [ ] Implement Java data classes for UEF delta model
- [ ] Implement Java data classes for UEF event types
- [ ] Implement UEF JSON serializer
- [ ] Implement UEF JSON deserializer
- [ ] Write schema validation tests against `quanta/schemas/`
- [ ] Verify round-trip serialization (serialize -> deserialize -> compare)

### 1.3 Execution Layer

- [ ] Define `ExecutionRequest` model (language, code, entrypoint, limits)
- [ ] Define `ExecutionAdapter` interface (language-agnostic)
- [ ] Implement code preparation pipeline (source staging, temp directory management)
- [ ] Implement compilation step for Java sources
- [ ] Implement execution sandbox constraints:
  - [ ] CPU timeout enforcement
  - [ ] Memory limit enforcement
  - [ ] Filesystem restriction (read-only or no access)
  - [ ] Network restriction
- [ ] Support input types:
  - [ ] Single snippet execution
  - [ ] Runnable file execution
  - [ ] Project entrypoint execution
  - [ ] Test case execution
- [ ] Implement execution lifecycle (prepare -> compile -> execute -> capture -> cleanup)

### 1.4 JDI Adapter (Java Debugger Interface)

- [ ] Initialize JDI connection to target JVM
- [ ] Configure JDI event requests:
  - [ ] Method entry events
  - [ ] Method exit events
  - [ ] Step events (line-level)
  - [ ] Exception events
  - [ ] Thread start/death events
- [ ] Implement variable inspection through JDI:
  - [ ] Local variable reading
  - [ ] Field reading
  - [ ] Array element reading
  - [ ] Object reference traversal
- [ ] Implement stack frame inspection:
  - [ ] Frame enumeration
  - [ ] Frame local variables
  - [ ] Frame `this` reference
- [ ] Implement heap object inspection:
  - [ ] Object field enumeration
  - [ ] Array element enumeration
  - [ ] Object identity tracking (stable IDs)
  - [ ] Reference graph traversal
- [ ] Handle JDI edge cases:
  - [ ] Uninitialized variables
  - [ ] Optimized-out variables
  - [ ] Native method frames
  - [ ] Thread synchronization
- [ ] Implement JDI event stream to raw event conversion

### 1.5 Runtime Capture Layer

- [ ] Define raw event model (method entry, variable mutation, object creation, exception)
- [ ] Implement event stream from JDI adapter
- [ ] Implement event filtering (exclude JDK internals, noise)
- [ ] Implement event buffering and ordering
- [ ] Implement event-to-state-engine pipeline
- [ ] Add capture metrics (events/sec, total events, dropped events)

### 1.6 State Engine (Core)

- [ ] Implement stack model:
  - [ ] Frame creation on method entry
  - [ ] Frame destruction on method exit
  - [ ] Frame local variable tracking
  - [ ] Frame parameter tracking
- [ ] Implement heap model:
  - [ ] Object allocation tracking
  - [ ] Object identity (stable `obj_xxx` IDs)
  - [ ] Field mutation tracking
  - [ ] Array element mutation tracking
  - [ ] Reference graph maintenance
- [ ] Implement state normalization:
  - [ ] Convert raw JDI types to UEF value kinds
  - [ ] Normalize object references to heap IDs
  - [ ] Preserve aliasing truthfully
  - [ ] Preserve null visibility
  - [ ] Preserve frame boundaries
- [ ] Implement event classification:
  - [ ] Map raw events to UEF event types
  - [ ] Attach source anchors (file, symbol, line, column)
- [ ] Implement state materialization:
  - [ ] Full state snapshot at each step
  - [ ] Delta computation between steps
- [ ] Truth-first validation:
  - [ ] Verify aliased references resolve correctly
  - [ ] Verify null values are explicit
  - [ ] Verify frame stack matches actual execution

### 1.7 Timeline Engine

- [ ] Implement ordered step sequence (monotonic step numbers)
- [ ] Implement step model construction:
  - [ ] Step number assignment
  - [ ] Event type attachment
  - [ ] Source anchor attachment
  - [ ] State delta attachment
  - [ ] Materialized state attachment
- [ ] Implement checkpoint system:
  - [ ] Periodic full-state snapshots (every N steps)
  - [ ] Efficient backward navigation using checkpoints
- [ ] Implement timeline navigation API:
  - [ ] `nextStep()` / `previousStep()`
  - [ ] `jumpToStep(n)`
  - [ ] `jumpToCheckpoint(n)`
  - [ ] `getStepRange(from, to)`
- [ ] Implement timeline metadata:
  - [ ] Total step count
  - [ ] Checkpoint positions
  - [ ] Event type histogram

### 1.8 UEF Serialization & Output

- [ ] Implement full session serialization to UEF JSON
- [ ] Implement streaming serialization (step-by-step append)
- [ ] Implement UEF version stamping
- [ ] Implement diagnostics attachment:
  - [ ] Unsupported feature warnings
  - [ ] Partial capture warnings
  - [ ] Adapter timeouts
  - [ ] Compile errors
- [ ] Validate output against UEF JSON Schema
- [ ] Write golden-file tests (known input -> expected UEF output)

### 1.9 Engine Service Layer

- [ ] Implement session management (create, query, destroy)
- [ ] Implement request validation
- [ ] Implement async execution (non-blocking session start)
- [ ] Implement session status tracking (PENDING, RUNNING, COMPLETE, FAILED)
- [ ] Implement result retrieval API
- [ ] Implement health check endpoint
- [ ] Implement basic logging and error reporting

### 1.10 Trace Persistence (Nerva Trace Store - Foundation)

- [ ] Set up Nerva project scaffolding (TypeScript, basic HTTP server)
- [ ] Implement trace store interface (write, read, query, delete)
- [ ] Implement file-based trace storage (initial, upgradeable to database later)
- [ ] Index traces by: session ID, language, entrypoint, timestamps, tags
- [ ] Implement trace retrieval by session ID
- [ ] Implement trace query by filter (language, entrypoint, time range, tags)
- [ ] Implement step-range retrieval (partial trace loading)
- [ ] Implement trace tagging (add/update tags on persisted traces)
- [ ] Implement basic retention policy (time-based auto-cleanup)
- [ ] Implement trace URI scheme (`tracium://traces/{sessionId}`)
- [ ] Connect engine output to trace store (engine -> Nerva -> persist)
- [ ] Implement health check endpoint

### 1.11 Testing & Validation

- [ ] Unit tests for UEF model serialization
- [ ] Unit tests for state engine operations
- [ ] Unit tests for timeline engine
- [ ] Integration tests: simple Java programs through full pipeline
  - [ ] Hello World (basic flow)
  - [ ] Variable assignment and mutation
  - [ ] Array operations
  - [ ] Object creation and field access
  - [ ] Method calls and returns
  - [ ] Recursion (factorial, fibonacci)
  - [ ] Exception throw and catch
  - [ ] Linked list operations
  - [ ] Null reference handling
- [ ] Trace persistence tests: execute -> persist -> retrieve -> verify
- [ ] Trace query tests: filter by language, entrypoint, time range
- [ ] Performance tests: step count limits, execution timeouts
- [ ] Golden file tests: known programs produce expected UEF

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Debugger API | JDI | Official Java debug interface, full state access, supports launch + attach |
| Serialization | Jackson JSON | Industry standard, schema-friendly |
| Build System | Gradle Kotlin DSL | Multi-module support, Java 21 |
| Test Framework | JUnit 5 | Modern, parameterized tests |
| State Snapshots | Full materialization | Simpler timeline navigation |
| Trace Storage | File-based (Phase 1) | Simple start, upgradeable to DB later |
| Trace Persistence | From Day 1 | Infrastructure-first: traces are durable artifacts |

---

## Exit Criteria

- Headless engine can execute Java snippets and emit valid UEF
- UEF includes recording context and correlation fields (even if empty for sandbox)
- Traces are persisted to Nerva trace store and retrievable by session ID
- Trace query by filter returns correct results
- Timeline supports forward/backward navigation
- State engine correctly models stack, heap, and references
- At least 10 golden-file integration tests pass
- Persisted traces match golden files exactly
- No visualization dependency exists in engine code
