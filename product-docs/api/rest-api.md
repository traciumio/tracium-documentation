# REST API

All endpoints are served from the engine at `http://localhost:8080`.

Interactive docs: **Swagger UI** at `http://localhost:8080/swagger-ui.html`

---

## Execution

### Execute Code

**`POST /v1/sessions/runtime`**

```json
{
  "language": "java",
  "entrypoint": "Main.main",
  "code": "public class Main { public static void main(String[] args) { int x = 42; } }",
  "limits": { "timeoutMs": 5000, "maxSteps": 500 }
}
```

Response `201`:
```json
{ "sessionId": "sess_abc12345", "status": "COMPLETED", "totalSteps": 8 }
```

### Get Session

**`GET /v1/sessions/runtime/{sessionId}`**

### Get Full Trace

**`GET /v1/sessions/runtime/{sessionId}/trace`**

Returns complete UEF JSON document with all steps, state, deltas, heap.

### Health

**`GET /v1/sessions/runtime/health`**

---

## Time Machine

All endpoints: `POST /v1/sessions/runtime/{sessionId}/timemachine/...`

### Root Cause Analysis

**`POST .../timemachine/rootcause`** — "Why does this variable have this value?"

```json
{ "variable": "result", "atStep": 10 }
```

Returns: causal chain from observation point back to root cause.

### Divergence Detection

**`POST .../timemachine/divergence`** — "Where did this variable go wrong?"

```json
{ "variable": "x", "expectedValue": 100 }
```

### Execution Query

**`GET .../timemachine/query`** — Find steps matching criteria.

Query params: `?variable=x&value=5`, `?event=EXCEPTION_THROWN`, `?method=sort`, `?line=7`

### Predictive Fork

**`POST .../timemachine/fork`** — "What if X was 0?" (prediction, no re-execution)

```json
{ "forkAtStep": 5, "setVariable": "x", "toValue": 0 }
```

### Real Re-execution Fork

**`POST .../timemachine/realfork`** — Actually re-run with modified state via JDI.

```json
{
  "forkAtStep": 5, "setVariable": "x", "toValue": 0,
  "code": "public class Main { ... }", "entrypoint": "Main.main"
}
```

Returns: original vs forked trace comparison with divergence points.

---

## AI Studio

All endpoints: `/v1/sessions/runtime/{sessionId}/ai/...`

### Summarize

**`POST .../ai/summarize`** — Compress trace for LLM context.

```json
{ "level": "method-level" }
```

Levels: `step-level`, `method-level`, `phase-level`, `key-events-only`

### Focused View

**`POST .../ai/focus`** — Extract only relevant steps.

```json
{ "focusType": "variable", "target": "result" }
```

Types: `variable`, `method`, `exception`, `object`

### Explain

**`POST .../ai/explain`** — Natural language explanation of a step range.

```json
{ "fromStep": 3, "toStep": 10 }
```

### Narrative

**`GET .../ai/narrative`** — Full trace narrative summary.

---

## Causality

All endpoints: `/v1/sessions/runtime/{sessionId}/causality/...`

### Causal Analysis

**`POST .../causality/analyze`** — Full data dependency graph.

```json
{ "variable": "result", "atStep": 15 }
```

Returns: nodes, edges, root causes, control dependencies.

### Taint Tracking

**`POST .../causality/taint`** — Where does a value flow to?

```json
{ "sourceVariable": "userInput", "fromStep": 3 }
```

### Program Slice

**`POST .../causality/slice`** — Minimal steps affecting the target.

```json
{ "variable": "result", "atStep": 20 }
```

---

## Simulation

All endpoints: `/v1/sessions/runtime/{sessionId}/simulate/...`

### Probability Exploration

**`POST .../simulate/explore`** — All possible outcomes.

```json
{ "variable": "x", "atStep": 5, "values": [0, 1, -1, 100] }
```

### Chaos Injection

**`POST .../simulate/chaos`** — What if a method fails?

```json
{ "method": "processOrder" }
```

### Prophecy Mode

**`POST .../simulate/predict`** — What will happen next?

```json
{ "fromStep": 10 }
```

### Fork Tree

**`GET .../simulate/tree`** — View all branched timelines.

### Counterfactual Query

**`GET .../simulate/counterfactual?variable=x&condition=negative`**

Conditions: `negative`, `zero`, `null`, `positive`

---

## Execution Diffing

### Create Comparison

**`POST /v1/comparisons`**

```json
{
  "baseline": "sess_001",
  "comparison": "sess_002",
  "alignment": "source-anchor"
}
```

Alignments: `step-number`, `source-anchor`, `method-boundary`, `event-sequence`

### Get Comparison

**`GET /v1/comparisons/{comparisonId}`**

### Get Summary

**`GET /v1/comparisons/{comparisonId}/summary`**

---

## Streaming

### Start Streaming Session

**`POST /v1/sessions/runtime/stream`** — Returns `202` immediately with sessionId.

### Connect to SSE Stream

**`GET /v1/sessions/runtime/{sessionId}/stream`** — Server-Sent Events.

Events: `connected`, `step`, `complete`, `error`

---

## Attach Mode

### Attach to Running JVM

**`POST /v1/sessions/attach`**

```json
{
  "host": "localhost",
  "port": 5005,
  "strategy": "method-boundary",
  "includePackages": ["com.myapp.service"]
}
```

Strategies: `full`, `method-boundary`, `breakpoint`, `event-filter`

---

## TraciumDB

### Storage Stats

**`GET /v1/db/stats`** — Session count, disk usage, index sizes.

### Browse Sessions

**`GET /v1/db/sessions?offset=0&limit=50`** — Paginated session list with metadata.

### Session Details

**`GET /v1/db/sessions/{sessionId}`** — Metadata + fork info.

### Search Across Traces

**`GET /v1/db/search?variable=x&value=5`** — "Which executions had x = 5?"

### Fork Tree

**`GET /v1/db/forks/{sessionId}`** — Parent, children, full lineage.

### Delete Session

**`DELETE /v1/db/sessions/{sessionId}`**

---

## Nerva (port 4000)

Nerva is the orchestration layer. It proxies to the engine and provides ecosystem-wide trace persistence.

### Create Session (with persistence)

**`POST /v1/sessions/runtime`** — Same request as Engine. Nerva proxies and persists.

### List Traces

**`GET /v1/traces?language=java&limit=50`**

### Get Trace

**`GET /v1/traces/{sessionId}`**

### Get Step Range

**`GET /v1/traces/{sessionId}/steps?from=3&to=8`**

### Delete Trace

**`DELETE /v1/traces/{sessionId}`**

### Health / Capabilities

**`GET /health`** | **`GET /v1/capabilities`**
