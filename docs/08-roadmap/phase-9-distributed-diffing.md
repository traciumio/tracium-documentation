# Phase 9: Distributed Execution & Diffing

**Status:** FUTURE
**Products Involved:** All products
**Tech Stack:** OpenTelemetry integration, comparison engine
**Depends On:** Phase 8

---

## Objective

Enable correlation of execution traces across distributed services and implement execution diffing for regression detection, behavior verification, and version comparison.

---

## Sub-Tasks Breakdown

### 9.1 Distributed Trace Correlation

- [ ] Correlation ID field in UEF session model
- [ ] Parent session ID for call chain reconstruction
- [ ] Service name and version in session metadata
- [ ] Nerva indexes traces by correlation ID
- [ ] Query API: `GET /traces?correlationId=xxx` returns all correlated sessions
- [ ] Topology assembly from parent-child relationships

### 9.2 OpenTelemetry Integration

- [ ] Recording agent reads `traceparent` headers
- [ ] Tracium session ID linkable to OpenTelemetry span ID
- [ ] Deep linking between Jaeger/Grafana and Tracium

### 9.3 Distributed Timeline Assembly

- [ ] Interleaved timeline from correlated sessions
- [ ] Cross-service state inspection
- [ ] Prism distributed trace view

### 9.4 Execution Diffing Engine

- [ ] Trace alignment strategies (step-number, source-anchor, method-boundary)
- [ ] Diff output model (matched, changed, added, removed steps)
- [ ] Comparison API: `POST /comparisons` and `GET /comparisons/{id}`
- [ ] Variable value comparison at aligned steps
- [ ] Path divergence detection

### 9.5 Execution Versioning

- [ ] Code version tags on traces (commit hash, branch, build number)
- [ ] Version-aware trace queries
- [ ] Regression detection: compare traces across code versions

### 9.6 Prism Diff Views

- [ ] Side-by-side trace comparison
- [ ] Aligned timeline with diff markers
- [ ] Execution path overlay
- [ ] Variable diff highlighting

### 9.7 CI/CD Integration

- [ ] Trace capture during test runs
- [ ] Automated comparison against baseline traces
- [ ] Regression alerts when execution behavior changes
- [ ] PR integration: "this PR changed N execution paths"

---

## Exit Criteria

- Correlated traces from multiple services can be queried and assembled
- Execution diff produces meaningful comparison between two traces
- CI/CD pipeline can capture traces and detect regressions automatically
- Prism renders distributed traces and diff views
