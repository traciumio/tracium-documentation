# Changelog

## v0.2.0 (2026-04-05)

### State Time Machine Engine
- **Time Machine** — root cause analysis, divergence detection, execution queries
- **Timeline Fork (prediction)** — "what if X was 0?" with predicted divergences
- **Real Re-execution Fork** — actual JDI state injection via `StackFrame.setValue()`
- **Checkpoint + Delta Storage** — scalable trace navigation with forward/reverse replay
- **Fork Tree** — persistent branched timelines with shared prefix deduplication

### AI Consumption
- **Trace Compression** — 4 summarization levels (step, method, phase, key-events)
- **Focused Views** — variable, method, exception, object focus extractors
- **Natural Language Converter** — step narrative, range explanation, narrative summary

### Execution Diffing
- **4 alignment strategies** — step-number, source-anchor, method-boundary, LCS event-sequence
- **Behavioral equivalence detection** — "did the refactor change behavior?"
- **Regression fingerprinting** — hash-based diff detection for CI

### Causality Engine
- **Data Dependency Graph** — trace which values contributed to a result
- **Control Dependency Graph** — trace which branch conditions led to this path
- **Taint Tracking** — follow a value from source through all assignments
- **Dynamic Program Slicing** — minimal steps that affect the target

### Simulation Engine
- **Probability Exploration** — auto-suggest values, explore all outcomes
- **Chaos Injection** — generate failure scenarios for any method
- **Prophecy Mode** — predict what happens next based on current state
- **Counterfactual Queries** — "in how many branches does X become negative?"

### Infrastructure
- **TraciumDB** — embedded file-based storage engine (replaces PostgreSQL/H2)
- **JDI Attach Mode** — connect to running JVMs for production recording
- **Real-time SSE Streaming** — steps emitted from inside JDI event loop
- **Sandbox Security** — -Xmx memory limits, watchdog process kill, -Xint determinism
- **Capture Metrics** — events/sec, dropped events, peak rate tracking
- **Event Filter** — throttling and event type filtering for streaming
- **Execution Journal (WAL)** — hash-chained, disk-persisted write-ahead log
- **Distributed Trace Assembler** — cross-service correlation model

### Engine Explorer (Embedded UI)
- **8-tab interface** — Execute, Trace Viewer, Time Machine, AI Studio, Causality, Simulation, Diff Lab, TraciumDB
- **Embedded in engine** — served from same port, no separate process
- **30+ API endpoints** accessible from the UI

### Production Readiness
- **Spring Security** — API key authentication (opt-in)
- **Global Error Handling** — structured error responses, no stack trace leaks
- **Request Logging** — correlation ID per request, duration tracking
- **Logback** — structured JSON logging (prod), colored console (dev)
- **Prometheus Metrics** — actuator + micrometer integration
- **Swagger UI** — OpenAPI documentation at /swagger-ui.html
- **Docker** — Dockerfile + docker-compose.yml (no database container needed)
- **244 tests** across 3 modules, 0 failures

### Documentation
- TraciumDB spec added to internal docs
- Design decisions #15 (TraciumDB) and #16 (Embedded UI) documented
- Product docs updated: engine overview, REST API (30+ endpoints), getting started
- Production roadmap v2 with honest assessment
- ASSESSMENT.md with per-component confidence ratings
- USER_MANUAL.md with curl examples for every feature

---

## v0.1.0 (2026-04-04)

### Tracium Engine
- Java compilation via `javax.tools.JavaCompiler`
- JDI launch mode with full state capture
- Line-level stepping with variable-level deltas
- Event classification: SESSION_STARTED, METHOD_ENTERED/EXITED, LINE_CHANGED, VARIABLE_ASSIGNED, OBJECT_ALLOCATED, FIELD_UPDATED, ARRAY_ELEMENT_UPDATED
- Heap tracking with object identity preservation
- Stdout/stderr capture from target JVM
- REST API (Spring Boot 4.0.5, Java 26)
- Tested: variables, arrays, recursion, objects, field mutation, exceptions

### Nerva
- Fastify REST API
- Engine proxy (forward execution requests)
- File-based trace store with JSON persistence
- Trace query API (filter by language, entrypoint, tags)
- Step range retrieval
- CORS support for Prism

### Prism
- React + TypeScript + Vite
- Runtime Studio and Architecture Lens surfaces
- Debug Truth and Learning Lens modes
- API client wired to Nerva

### Documentation
- 43 internal architecture docs
- VitePress product documentation site
- 8 sample HTML previews
