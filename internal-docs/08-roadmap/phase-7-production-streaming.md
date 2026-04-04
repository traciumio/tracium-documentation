# Phase 7: Production Recording & Streaming

**Status:** PLANNED
**Products Involved:** Tracium Engine, Nerva, Vector, Prism
**Tech Stack:** Java 21 (JDI attach mode), TypeScript (WebSocket/SSE)
**Depends On:** Phase 6

---

## Objective

Enable the engine to attach to running JVM processes and record execution in production-like environments. Add real-time event streaming so consumers can observe execution as it happens, not just replay it afterward.

---

## Sub-Tasks Breakdown

### 7.1 JDI Attach Mode

- [ ] Implement `AttachingConnector` support in JDI adapter
- [ ] Socket-based attach to remote JVM
- [ ] Connection lifecycle management (attach, pause, resume, detach)
- [ ] Auto-detach on target unresponsiveness
- [ ] Error handling for connection failures

### 7.2 Recording Strategies

- [ ] Method boundary capture (entry/exit with params and return values)
- [ ] Breakpoint capture (full state at specific locations)
- [ ] Event filter capture (only exceptions, specific method calls)
- [ ] Configurable scope (include/exclude packages)
- [ ] Capture fidelity metadata in UEF recording context

### 7.3 Recording Agent

- [ ] Lightweight agent process for production deployment
- [ ] Agent configuration (target, strategy, scope, limits)
- [ ] Performance overhead monitoring
- [ ] Circuit breaker (reduce scope if overhead exceeds threshold)
- [ ] Graceful shutdown and cleanup

### 7.4 Real-Time Event Streaming

- [ ] WebSocket endpoint for live session subscription
- [ ] Server-Sent Events fallback endpoint
- [ ] Polling fallback for restricted environments
- [ ] Event filtering at subscription time
- [ ] Backpressure handling (bounded buffer, sampling under pressure)
- [ ] Stream lifecycle messages (session_started, checkpoint, session_finished)

### 7.5 Nerva Streaming Infrastructure

- [ ] WebSocket server in Nerva
- [ ] Session subscription management
- [ ] Fan-out: multiple consumers per session
- [ ] Watch subscriptions (subscribe to future sessions by tag/filter)
- [ ] Simultaneous stream + persist (events go to both consumers and trace store)

### 7.6 Prism Live Mode

- [ ] Connect to active session stream
- [ ] Progressive rendering (show steps as they arrive)
- [ ] Live timeline that grows during execution
- [ ] Auto-scroll to latest step
- [ ] Transition from live to replay mode when session completes

### 7.7 Testing

- [ ] Attach to test JVM and record method boundaries
- [ ] Verify overhead stays within budget (< 5%)
- [ ] WebSocket streaming end-to-end test
- [ ] Backpressure and sampling tests
- [ ] Recording context correctly written to UEF

---

## Exit Criteria

- Engine can attach to a running JVM and produce valid UEF at method-boundary fidelity
- Overhead stays under 5% for method boundary capture
- Live consumers receive events in real-time via WebSocket
- Prism can show a live-updating trace during execution
- Recording context metadata is preserved in persisted traces
