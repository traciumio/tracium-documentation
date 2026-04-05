# Getting Started

This guide gets you from zero to a stored execution trace.

## Prerequisites

- JDK 26 recommended
- a JDK, not just a JRE

Why JDK:

- the Gradle toolchain targets Java 26
- JDI requires JDK debugging support
- runtime compilation uses Java compiler APIs

You do not need:

- PostgreSQL
- MongoDB
- Redis
- Docker

## 1. Start the Engine

```bash
cd tracium-engine
./gradlew :engine-service:bootRun
```

The service starts on:

`http://localhost:8080`

## 2. Open the UI

Open:

`http://localhost:8080`

You get:

- embedded UI
- REST API
- Swagger UI
- TraciumDB-backed persistence

## 3. Check Health

```bash
curl http://localhost:8080/v1/sessions/runtime/health
```

## 4. Run Your First Trace

```bash
curl -X POST http://localhost:8080/v1/sessions/runtime \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "entrypoint": "Main.main",
    "code": "public class Main {\n  public static void main(String[] args) {\n    int x = 5;\n    int y = x * 2;\n    System.out.println(y);\n  }\n}",
    "limits": {
      "timeoutMs": 5000,
      "maxSteps": 100,
      "maxHeapMb": 64,
      "allowNetwork": false,
      "allowFileWrite": false
    }
  }'
```

Response:

```json
{ "sessionId": "sess_runtime_ab12cd34", "status": "COMPLETED", "totalSteps": 8 }
```

## 5. View the Trace

```bash
curl http://localhost:8080/v1/sessions/runtime/{sessionId}/trace
```

Or use the embedded UI to inspect:

- frames
- locals
- heap
- deltas
- stdout

## 6. Try Time Machine Features

Examples:

- root cause: variable `y`, step `6`
- query: `?variable=x`
- predictive fork: set `x = 0`
- real fork: re-execute with modified state

## 7. Try AI and Diffing

Useful endpoints:

- `/ai/summarize`
- `/ai/focus`
- `/ai/explain`
- `/ai/narrative`
- `/v1/comparisons`

## 8. Explore TraciumDB

Browse storage through:

- UI TraciumDB section
- `/v1/db/stats`
- `/v1/db/sessions`
- `/v1/db/search`

Stored traces live under:

`./data/traciumdb/`

## 9. Try Live Streaming

Start a streaming session:

```bash
curl -X POST http://localhost:8080/v1/sessions/runtime/stream \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "entrypoint": "Main.main",
    "code": "public class Main { public static void main(String[] args) { int x = 1; } }",
    "limits": { "timeoutMs": 5000, "maxSteps": 100 }
  }'
```

Then open:

`GET /v1/sessions/runtime/{sessionId}/stream`

## 10. Optional: Try Attach Mode

Start a target JVM with JDWP enabled:

```bash
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar myapp.jar
```

Then attach:

```bash
curl -X POST http://localhost:8080/v1/sessions/attach \
  -H "Content-Type: application/json" \
  -d '{
    "host": "localhost",
    "port": 5005,
    "strategy": "method-boundary",
    "includePackages": ["com.myapp.service"]
  }'
```

## 11. Optional: Use the Standalone Agent

Build the agent and run:

```bash
cd tracium-engine
./gradlew :engine-agent:jar
java -jar engine-agent/build/libs/tracium-agent.jar \
  --target localhost:5005 \
  --packages com.myapp.service \
  --strategy method-boundary \
  --sample-rate 100 \
  --output ./traces
```

## What Just Happened

When you run a runtime session:

1. the engine compiles your Java code
2. it launches a JVM under JDI
3. it captures steps, state, and deltas
4. it assembles a UEF trace
5. it persists the trace in TraciumDB
6. it exposes the stored trace to APIs, the UI, and analysis features

## Next Steps

- [Engine Overview](/engine/overview)
- [How the Engine Works](/engine/how-it-works)
- [Configuration](/engine/configuration)
- [Recording Modes](/guide/recording-modes)
- [TraciumDB](/engine/traciumdb)
- [REST API](/api/rest-api)
