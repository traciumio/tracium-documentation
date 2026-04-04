# Getting Started

Get a working trace in 2 minutes.

## Prerequisites

- **Java 25+** (JDK, not JRE)
- **Node.js 18+** (for Nerva)

## 1. Start Tracium Engine

```bash
cd tracium-engine
./gradlew :engine-service:bootRun
```

Engine starts on `http://localhost:8080`.

## 2. Start Nerva

```bash
cd nerva
npm install
npx tsx src/index.ts
```

Nerva starts on `http://localhost:4000`. It proxies to Engine and persists traces.

## 3. Execute Your First Trace

```bash
curl -X POST http://localhost:4000/v1/sessions/runtime \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "entrypoint": "Main.main",
    "code": "class Main {\n  public static void main(String[] args) {\n    int x = 5;\n    int y = x * 2;\n    System.out.println(y);\n  }\n}",
    "limits": { "timeoutMs": 5000, "maxSteps": 100 }
  }'
```

Response:
```json
{
  "sessionId": "sess_runtime_abc123",
  "status": "COMPLETED",
  "totalSteps": 8,
  "persisted": true
}
```

## 4. Retrieve the Trace

```bash
curl http://localhost:4000/v1/traces/sess_runtime_abc123
```

You'll get a complete UEF trace with every step, every variable value, every state change.

## 5. Query Your Traces

```bash
# List all stored traces
curl http://localhost:4000/v1/traces

# Get specific step range
curl "http://localhost:4000/v1/traces/sess_runtime_abc123/steps?from=3&to=6"
```

## What Just Happened?

1. You sent Java source code to **Nerva**
2. Nerva forwarded it to **Tracium Engine**
3. Engine compiled it, launched a JVM with JDI attached
4. JDI stepped through every line, capturing full state
5. Engine produced a UEF trace and returned it
6. Nerva **persisted the trace to disk** as a queryable artifact
7. You can now replay, query, and compare this trace anytime

## Next Steps

- [Execution as Data](/guide/execution-as-data) — Understand the core concept
- [UEF Format](/guide/uef) — What's inside a trace
- [REST API](/api/rest-api) — Full API reference
- [Engine Internals](/engine/overview) — How the engine works
