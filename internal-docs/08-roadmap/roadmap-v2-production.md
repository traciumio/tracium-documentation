# Tracium Engine — Production Roadmap v2

**Based on:** Honest assessment of current implementation (2026-04-05)
**Current state:** ~40-45% production-ready, 80 Java files, 244 tests
**Goal:** Ship-ready execution intelligence infrastructure

---

## Phase Summary (Updated)

| Phase | Name | Status | Target |
|-------|------|--------|--------|
| 0 | Documentation & Contracts | **COMPLETE** | - |
| 1A | CSE Core (sandbox execution) | **85% DONE** | Harden what works |
| 1B | CSE Hardening (make it real) | **NEW** | Fix the shallow parts |
| 2 | Production Infrastructure | **NEW** | Database, auth, logging, Docker |
| 3 | Visualization Platform (Prism) | PLANNED | Integrate engine features |
| 4 | Repo Analyzer (Atlas) | PLANNED | Static analysis track |
| 5 | Production Recording | **25% DONE** | Real attach mode |
| 6 | Advanced Analysis | **30% DONE** | Real causality, diffing, AI |
| 7 | Streaming & Real-time | **30% DONE** | True real-time streaming |
| 8 | Simulation & Time Machine | **20% DONE** | Real fork execution, prophecy |
| 9 | Distributed Execution | **15% DONE** | Cross-service correlation |
| 10 | Multi-Language | NOT STARTED | Python, JavaScript, C++ |
| 11 | Intelligence Layer | NOT STARTED | ML-powered analysis |

---

## Phase 1A: CSE Core Hardening (Current → Solid)

**Status:** 85% done. Harden what already works.
**Effort:** 1-2 weeks
**Goal:** The core execution pipeline is bulletproof.

### What's already done:
- [x] Gradle multi-module build (engine-core, engine-java-jdi-adapter, engine-service)
- [x] UEF data models (Value, ExecutionState, StackFrame, HeapObject, StateDelta, etc.)
- [x] JDI execution engine (launch, step, capture state)
- [x] JavaCompiler (source → .class)
- [x] State engine (stack, heap, references, deltas)
- [x] Timeline engine (checkpoints, navigation, queries)
- [x] UEF serializer (Jackson JSON)
- [x] Spring Boot service layer (28 endpoints)
- [x] Sandbox policy (-Xmx, -Xint, watchdog kill)
- [x] Embedded UI (Engine Explorer)
- [x] 244 passing tests

### What needs hardening:
- [ ] **UEF Deserializer round-trip verification** — serialize a trace, deserialize it, compare field by field. Fix edge cases.
- [ ] **JDI edge case handling** — test with: multi-threaded programs, deeply nested recursion (>50 frames), large arrays (>10K elements), circular object references, enums, inner classes, lambdas, generics
- [ ] **Execution timeout enforcement** — verify the watchdog actually kills stuck JVMs within 2s. Test with `Thread.sleep(Long.MAX_VALUE)` and `while(true){}`
- [ ] **Memory limit verification** — test that `-Xmx64m` actually prevents OOM from killing the engine process
- [ ] **Error handling in all controllers** — wrap every endpoint in try/catch, return structured error responses, never expose stack traces
- [ ] **Input validation** — validate code length limits, entrypoint format, step number ranges, variable name format

### Exit criteria:
- All 244 existing tests pass
- 15+ new edge case tests pass
- Zero uncaught exceptions from any endpoint with malformed input
- Engine survives: infinite loop, OOM attempt, fork bomb, 100K-step program

---

## Phase 1B: Fix the Shallow Parts

**Status:** NEW. The features that compile but don't really work yet.
**Effort:** 3-4 weeks
**Goal:** Every feature does what it claims.

### 1B.1 Real-time Streaming (currently: batch-then-emit)
- [ ] Refactor `JdiExecutionEngine` to accept a `StepListener` callback
- [ ] Emit steps from INSIDE the JDI event loop, not after
- [ ] Each step → listener.onStep() → SSE/WebSocket immediately
- [ ] Add backpressure: bounded queue, drop LINE_CHANGED events when full
- [ ] Wire `EventFilter` into the JDI capture loop (not just the SSE emitter)
- [ ] **Test:** start streaming session, verify first step arrives before execution finishes

### 1B.2 Real Fork Execution (currently: crude step counting)
- [ ] Replace step counter with source-anchor matching: fork at "Main.java:line 7" not "step 5"
- [ ] Track method call depth for recursive code
- [ ] Use JDI breakpoints instead of step counting: set breakpoint at fork line, inject values when hit
- [ ] **Test:** fork `factorial(5)` at the 3rd recursive call, inject n=0, verify early return

### 1B.3 Causal Graph (currently: heuristic, not data flow)
- [ ] Parse Java bytecode instructions at each step using JDI's `Method.bytecodes()`
- [ ] For `result = a + b`: identify ILOAD instructions to find actual operands
- [ ] Build real data dependency edges: `result` depends on `a` and `b` because they're loaded before IADD
- [ ] Control dependency: track JDI's conditional branch events (IF_ICMPGT, etc.)
- [ ] Taint analysis: propagate taint through actual data flow, not scope heuristics
- [ ] **Test:** `result = a + b`, verify graph shows result → a AND result → b

### 1B.4 Execution Diffing (currently: untested with real traces)
- [ ] Run 10 diff scenarios with real JDI traces (same code/same input, same code/different input, different code/same input)
- [ ] Fix LCS alignment edge cases
- [ ] Test behavioral equivalence detection: refactored code that produces same output
- [ ] Add heap-level diffing (not just locals)

### 1B.5 AI Consumption (currently: works on model, untested with real JDI)
- [ ] Run all 4 summarization levels on 5 real JDI traces
- [ ] Verify focused views produce useful output for LLM prompting
- [ ] Test natural language converter output quality
- [ ] Add token count estimation for LLM context window planning

### Exit criteria:
- Streaming delivers first step within 100ms of execution starting
- Fork correctly injects at the right line in recursive code
- Causal graph identifies actual operands for `a + b` expressions
- Diff produces meaningful results comparing two real traces
- AI summarization at method-level fits in 4K tokens for a 500-step trace

---

## Phase 2: Production Infrastructure

**Status:** NOT STARTED. Nothing here exists yet.
**Effort:** 3-4 weeks
**Goal:** The engine runs in production, persists data, and is observable.

### 2.1 Database Persistence
- [ ] Replace `ConcurrentHashMap<String, EngineRuntimeSession>` with real database
- [ ] Choose: PostgreSQL (traces as JSONB) or SQLite (embedded, zero-config)
- [ ] Schema: sessions table, traces table (JSONB), trace_metadata table (indexed)
- [ ] Migrate SessionStore to JPA/JDBC
- [ ] Implement retention policies (time-based, size-based auto-cleanup)
- [ ] Add database migrations (Flyway or Liquibase)

### 2.2 WAL Persistence
- [ ] Write ExecutionJournal entries to disk (append-only file per session)
- [ ] Recovery: if engine crashes mid-execution, replay journal to reconstruct trace
- [ ] Compaction: merge old journal segments
- [ ] Format: one JSON line per entry, newline-delimited

### 2.3 Authentication & Authorization
- [ ] API key authentication for engine endpoints
- [ ] Role-based: admin (all endpoints), user (execute + read), readonly (read only)
- [ ] Rate limiting per API key
- [ ] CORS configuration for allowed origins

### 2.4 Logging & Observability
- [ ] Configure SLF4J + Logback with structured JSON logging
- [ ] Log every request: method, path, sessionId, duration, status code
- [ ] Log JDI events: capture count, dropped count, errors
- [ ] Prometheus metrics endpoint: `/metrics`
  - `tracium_executions_total` (counter)
  - `tracium_execution_duration_seconds` (histogram)
  - `tracium_active_sessions` (gauge)
  - `tracium_jdi_events_captured_total` (counter)
  - `tracium_jdi_events_dropped_total` (counter)
- [ ] Health check endpoint with dependency status (DB, JDI availability)

### 2.5 API Documentation
- [ ] Add SpringDoc OpenAPI (Swagger UI at `/swagger-ui`)
- [ ] Document all 28 endpoints with request/response schemas
- [ ] Add example requests for each endpoint
- [ ] Version the API: `/v1/...`

### 2.6 Docker & Deployment
- [ ] Dockerfile (multi-stage: build + runtime)
- [ ] docker-compose.yml (engine + postgres)
- [ ] Environment variable configuration (DB URL, port, max sessions, etc.)
- [ ] Graceful shutdown (finish active sessions before stopping)
- [ ] Health check for container orchestration

### 2.7 CI/CD Pipeline
- [ ] GitHub Actions workflow: build → test → docker build → push
- [ ] Run all 244+ tests on every PR
- [ ] Build Docker image on merge to main
- [ ] Publish to container registry

### Exit criteria:
- Engine restarts without losing sessions/traces
- API key required for all mutations
- Swagger UI shows all 28 endpoints with schemas
- `docker compose up` starts the engine with database
- CI pipeline runs tests and builds Docker image

---

## Phase 3: Visualization Platform (Prism Integration)

**Status:** Prism exists with basic trace playback. Needs engine feature integration.
**Effort:** 4-6 weeks
**Depends on:** Phase 1B, Phase 2

### 3.1 Connect Prism to Engine Features
- [ ] Time Machine panel: root cause, fork, query UI
- [ ] AI panel: summarize, focus, narrative UI
- [ ] Causality panel: dependency graph visualization (D3.js or vis.js)
- [ ] Simulation panel: explore, chaos, predict UI
- [ ] Diff panel: side-by-side trace comparison

### 3.2 Visual Enhancements
- [ ] Code editor with syntax highlighting (Monaco or CodeMirror)
- [ ] Interactive causal graph (node/edge visualization)
- [ ] Side-by-side diff viewer (like GitHub's diff)
- [ ] Timeline with zoom and filter
- [ ] Heap object graph visualization

### 3.3 Prism → Engine Data Flow
- [ ] Update Nerva to proxy all new engine endpoints
- [ ] Or: Prism talks directly to engine for Time Machine / AI / Causality
- [ ] WebSocket integration for real-time streaming in Prism

---

## Phase 4: Repository Analyzer (Atlas)

**Status:** Scaffolding only (3 placeholder Java files)
**Effort:** 4-6 weeks
**Depends on:** Phase 2

- [ ] Java source parser (using Eclipse JDT or JavaParser)
- [ ] Call graph construction
- [ ] UGF output (Unified Graph Format)
- [ ] REST API for repository analysis
- [ ] Integration with Prism Architecture Lens

---

## Phase 5: Production Recording (Attach Mode)

**Status:** 25% done (JdiAttachEngine exists, never tested)
**Effort:** 3-4 weeks
**Depends on:** Phase 1B, Phase 2

### 5.1 Validate Attach Mode
- [ ] Test against a real Spring Boot application running on port 5005
- [ ] Verify method-boundary strategy captures entry/exit with parameters
- [ ] Verify breakpoint strategy captures state at specific lines
- [ ] Verify event-filter strategy captures only exceptions
- [ ] Measure overhead: <5% for method-boundary, <1% for breakpoint

### 5.2 Recording Agent
- [ ] Standalone agent JAR that can be deployed alongside target JVM
- [ ] Agent configuration: scope, strategy, Nerva URL, correlation ID
- [ ] Auto-reconnect on connection loss
- [ ] Circuit breaker: reduce capture scope if overhead exceeds threshold

### 5.3 Correlation ID Propagation
- [ ] Extract correlation ID from HTTP headers (X-Correlation-ID, traceparent)
- [ ] Inject correlation ID into UEF session metadata
- [ ] Query traces by correlation ID in Nerva

---

## Phase 6: Advanced Analysis (Deep Causality + AI)

**Status:** 30% done (heuristic implementations exist)
**Effort:** 4-6 weeks
**Depends on:** Phase 1B

### 6.1 Bytecode-Level Causal Graph
- [ ] Integrate ASM or BCEL for bytecode analysis
- [ ] For each JDI step, analyze the bytecode instruction(s) executed
- [ ] Build precise data dependency: which variables are loaded/stored
- [ ] Build control dependency: which branch condition was evaluated
- [ ] Dynamic program slicing with instruction-level precision

### 6.2 AI-Powered Analysis
- [ ] LLM integration (Claude API) for trace explanation
- [ ] Feed compressed trace to LLM, get natural language explanation
- [ ] "Ask about trace" endpoint: user asks question, LLM answers grounded in trace
- [ ] Auto-detect bugs: feed trace to LLM, ask "is there a bug?"
- [ ] Training data export pipeline (traces → anonymized dataset)

---

## Phase 7: Streaming & Real-time

**Status:** 30% done (SSE exists but batch-then-emit)
**Effort:** 2-3 weeks
**Depends on:** Phase 1B

- [ ] True real-time streaming from JDI event loop
- [ ] WebSocket endpoint (bidirectional: client can send pause/resume/filter)
- [ ] Server-Sent Events with proper backpressure
- [ ] Progressive loading in UI (show steps as they arrive)
- [ ] Live monitoring dashboard (event-driven, auto-refresh)

---

## Phase 8: Simulation & Time Machine (Full Vision)

**Status:** 20% done (generates scenarios, doesn't execute most)
**Effort:** 4-6 weeks
**Depends on:** Phase 1B, Phase 5

### 8.1 Real Multi-Fork Execution
- [ ] Execute all scenarios from `simExplore()` via actual JDI forks
- [ ] Store all branches in ForkTree with real deduplication
- [ ] Compare all branches automatically

### 8.2 Prophecy Mode (Real Prediction)
- [ ] Static analysis: parse the code paths ahead of current step
- [ ] Branch prediction: given current variable values, which branches will be taken?
- [ ] Use historical traces: "last 10 times this code ran, what happened next?"

### 8.3 Chaos Engineering
- [ ] Actually execute chaos scenarios (null returns, exceptions, timeouts)
- [ ] Cascade analysis: inject failure in service A, trace impact through B, C, D
- [ ] Resilience scoring: how many chaos scenarios cause unhandled failures?

---

## Phase 9: Distributed Execution

**Status:** 15% done (model only)
**Effort:** 4-6 weeks
**Depends on:** Phase 5, Phase 7

- [ ] Recording agent deployed to multiple services
- [ ] Correlation ID propagation across HTTP, gRPC, message queues
- [ ] Distributed trace assembly in Nerva
- [ ] Interleaved timeline view in Prism
- [ ] Cross-service state inspection
- [ ] OpenTelemetry integration (link Tracium traces to OTel spans)

---

## Phase 10: Multi-Language Expansion

**Status:** NOT STARTED
**Effort:** 6-8 weeks per language
**Depends on:** Phase 6

### 10.1 Python Adapter
- [ ] `debugpy` or `sys.monitoring` based adapter
- [ ] Python value model mapping to UEF
- [ ] Test with: Flask, Django request handlers

### 10.2 JavaScript/TypeScript Adapter
- [ ] Chrome DevTools Protocol (CDP) based adapter
- [ ] Node.js Inspector API integration
- [ ] Test with: Express, Next.js request handlers

### 10.3 C++ Adapter (Future)
- [ ] LLDB/GDB remote attach
- [ ] Memory model mapping (pointers, manual allocation)

---

## Phase 11: Intelligence Layer

**Status:** NOT STARTED
**Effort:** 6-8 weeks
**Depends on:** Phase 6, Phase 9

- [ ] Semantic event enrichment (detect patterns: sort, search, cache miss)
- [ ] Anomaly detection (this trace is unusual compared to historical)
- [ ] Auto-root-cause for production incidents
- [ ] Performance regression detection (this version takes 30% more steps)
- [ ] Code review with execution context ("this change causes 3 new execution paths")
- [ ] Execution-aware code generation (AI sees how code runs, not just reads)

---

## Priority Order for Ship-Readiness

```
NOW         Phase 1A: Harden core (1-2 weeks)
            Phase 1B: Fix shallow parts (3-4 weeks)
NEXT        Phase 2:  Production infra (3-4 weeks)
            Phase 3:  Prism integration (4-6 weeks)
THEN        Phase 5:  Production recording (3-4 weeks)
            Phase 7:  Real-time streaming (2-3 weeks)
AFTER       Phase 6:  Advanced analysis (4-6 weeks)
            Phase 8:  Full simulation (4-6 weeks)
LATER       Phase 4:  Atlas repo analyzer (4-6 weeks)
            Phase 9:  Distributed (4-6 weeks)
FUTURE      Phase 10: Multi-language (6-8 weeks per lang)
            Phase 11: Intelligence layer (6-8 weeks)
```

---

## What "Production Ready" Means

**Minimum Viable Production (Phases 1A + 1B + 2):**
- Execute Java code → get real execution trace
- All features do what they claim (no shallow implementations)
- Data persists across restarts
- API is authenticated and documented
- Runs in Docker
- CI/CD pipeline exists

**Full Product (Phases 1-8):**
- Production recording (attach to running JVMs)
- Real-time streaming
- Visual UI (Prism) with all features
- Bytecode-level causal analysis
- AI-powered explanations
- Multi-fork simulation
- Execution diffing for regression detection

**Platform (Phases 1-11):**
- Multi-language (Java + Python + JavaScript)
- Distributed trace correlation
- ML-powered anomaly detection
- The complete "Kafka of execution state" vision
