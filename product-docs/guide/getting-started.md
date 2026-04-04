# Getting Started

Get a working trace in 2 minutes.

## Prerequisites

- **Java 21+** (JDK, not JRE — JDI requires a JDK)

That's it. No database, no Node.js, no Docker required.

## 1. Start the Engine

```bash
cd tracium-engine
./gradlew :engine-service:bootRun
```

Engine starts on `http://localhost:8080` with:
- Engine Explorer UI (visual interface)
- REST API (30+ endpoints)
- TraciumDB (embedded storage)
- Swagger UI (API docs)

## 2. Open the UI

Go to **http://localhost:8080** in your browser.

You'll see the Engine Explorer with 8 tabs:
Execute | Trace Viewer | Time Machine | AI Studio | Causality | Simulation | Diff Lab | TraciumDB

## 3. Execute Your First Trace

In the **Execute** tab, you'll see sample code (factorial). Click **Execute**.

Or via curl:
```bash
curl -X POST http://localhost:8080/v1/sessions/runtime \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "entrypoint": "Main.main",
    "code": "public class Main {\n  public static void main(String[] args) {\n    int x = 5;\n    int y = x * 2;\n    System.out.println(y);\n  }\n}",
    "limits": { "timeoutMs": 5000, "maxSteps": 100 }
  }'
```

Response:
```json
{ "sessionId": "sess_abc12345", "status": "COMPLETED", "totalSteps": 8 }
```

## 4. Explore the Trace

The UI automatically switches to the **Trace Viewer** tab. You can:
- Step forward/backward through execution
- See stack frames and local variables at each step
- See what changed (deltas) at each step
- See heap objects and references
- See stdout output

Or via API:
```bash
curl http://localhost:8080/v1/sessions/runtime/{sessionId}/trace
```

## 5. Use the Time Machine

Go to the **Time Machine** tab. Try:

**Root Cause:** Enter `y` and step `6` → see the chain of assignments that produced y's value.

**Execution Query:** Enter variable `x` → find every step where x exists.

**Fork:** Enter step `3`, variable `x`, value `0` → see what would change if x was 0 instead of 5.

## 6. Try AI Studio

Go to the **AI Studio** tab. Click **method-level** → get a compressed summary of the trace suitable for feeding to an LLM.

Click **Generate Narrative** → get a human-readable story of the execution.

## 7. Check TraciumDB

Go to the **TraciumDB** tab. Click **Load Stats** → see how many sessions are stored, disk usage.

Click **Latest 20** → browse all your stored executions.

Your traces are persisted at `./data/traciumdb/traces/` — plain JSON files you can open in any editor.

## What Just Happened?

1. You sent Java source code to the engine
2. Engine compiled it with javac
3. Engine launched a sandboxed JVM with JDI (Java Debug Interface) attached
4. JDI stepped through every line, capturing full state (variables, heap, stack)
5. Engine produced a UEF (Universal Execution Format) trace
6. TraciumDB persisted the trace to disk as an immutable JSON file
7. The trace is now queryable, replayable, forkable, and diffable

## Next Steps

- [Execution as Data](/guide/execution-as-data) — Understand the core concept
- [UEF Format](/guide/uef) — What's inside a trace
- [REST API](/api/rest-api) — Full API reference (30+ endpoints)
- [Engine Internals](/engine/overview) — Architecture and modules
- [TraciumDB](/engine/traciumdb) — How storage works
- **Swagger UI** — Open `http://localhost:8080/swagger-ui.html` for interactive API docs
