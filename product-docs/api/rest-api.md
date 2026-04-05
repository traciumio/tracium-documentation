# REST API

Base URL:

`http://localhost:8080`

Interactive docs:

`http://localhost:8080/swagger-ui.html`

OpenAPI document:

`http://localhost:8080/v3/api-docs`

## Authentication

By default, auth is disabled.

If `AUTH_ENABLED=true`, send:

`X-API-Key: <your configured key>`

Public endpoints still include health, swagger, actuator, and static UI assets.

## Runtime Sessions

### Create Runtime Session

`POST /v1/sessions/runtime`

Example body:

```json
{
  "language": "java",
  "entrypoint": "Main.main",
  "code": "public class Main { public static void main(String[] args) { int x = 42; } }",
  "limits": {
    "timeoutMs": 5000,
    "maxSteps": 500,
    "maxHeapMb": 64,
    "allowNetwork": false,
    "allowFileWrite": false
  }
}
```

### Get Runtime Session

`GET /v1/sessions/runtime/{sessionId}`

### Get Full Trace

`GET /v1/sessions/runtime/{sessionId}/trace`

### Health

`GET /v1/sessions/runtime/health`

## Time Machine

Base path:

`/v1/sessions/runtime/{sessionId}/timemachine`

### Root Cause

`POST /rootcause`

```json
{ "variable": "result", "atStep": 10 }
```

### Divergence Detection

`POST /divergence`

```json
{ "variable": "x", "expectedValue": 100 }
```

### Query Steps

`GET /query`

Supported query styles:

- `?variable=x`
- `?variable=x&value=5`
- `?event=EXCEPTION_THROWN`
- `?method=sort`
- `?line=7`

### Predictive Fork

`POST /fork`

```json
{ "forkAtStep": 5, "setVariable": "x", "toValue": 0 }
```

### Real Re-Execution Fork

`POST /realfork`

```json
{
  "forkAtStep": 5,
  "setVariable": "x",
  "toValue": 0,
  "code": "public class Main { ... }",
  "entrypoint": "Main.main"
}
```

## AI Endpoints

Base path:

`/v1/sessions/runtime/{sessionId}/ai`

### Summarize

`POST /summarize`

```json
{ "level": "method-level" }
```

Supported levels:

- `step-level`
- `method-level`
- `phase-level`
- `key-events-only`

### Focus

`POST /focus`

```json
{ "focusType": "variable", "target": "result" }
```

Supported focus types:

- `variable`
- `method`
- `exception`
- `object`

### Explain

`POST /explain`

```json
{ "fromStep": 3, "toStep": 10 }
```

### Narrative

`GET /narrative`

## Causality

Base path:

`/v1/sessions/runtime/{sessionId}/causality`

### Analyze

`POST /analyze`

```json
{ "variable": "result", "atStep": 15 }
```

### Taint

`POST /taint`

```json
{ "sourceVariable": "userInput", "fromStep": 3 }
```

### Slice

`POST /slice`

```json
{ "variable": "result", "atStep": 20 }
```

## Simulation

Base path:

`/v1/sessions/runtime/{sessionId}/simulate`

### Explore

`POST /explore`

```json
{ "variable": "x", "atStep": 5, "values": [0, 1, -1, 100] }
```

### Chaos

`POST /chaos`

```json
{ "method": "processOrder" }
```

### Predict

`POST /predict`

```json
{ "fromStep": 10 }
```

### Fork Tree

`GET /tree`

### Counterfactual Query

`GET /counterfactual?variable=x&condition=negative`

Supported conditions:

- `negative`
- `zero`
- `null`
- `positive`

## Execution Diffing

### Create Comparison

`POST /v1/comparisons`

```json
{
  "baseline": "sess_001",
  "comparison": "sess_002",
  "alignment": "source-anchor",
  "options": {
    "ignoreLineChanges": true,
    "focusMethods": ["processOrder"],
    "ignoreVariables": ["timestamp"]
  }
}
```

Supported alignments:

- `step-number`
- `source-anchor`
- `method-boundary`
- `event-sequence`

### Get Comparison

`GET /v1/comparisons/{comparisonId}`

### Get Summary

`GET /v1/comparisons/{comparisonId}/summary`

## Streaming

### Start Streaming Session

`POST /v1/sessions/runtime/stream`

Returns `202 Accepted` with:

- `sessionId`
- `status`
- `streamUrl`

### Open SSE Stream

`GET /v1/sessions/runtime/{sessionId}/stream`

Current SSE event names:

- `connected`
- `step`
- `complete`
- `error`

## Attach Mode

### Attach to a Running JVM

`POST /v1/sessions/attach`

Example:

```json
{
  "host": "localhost",
  "port": 5005,
  "strategy": "method-boundary",
  "includePackages": ["com.myapp.service"],
  "correlationId": "req_123"
}
```

Supported strategies:

- `full`
- `method-boundary`
- `breakpoint`
- `event-filter`

## TraciumDB

Base path:

`/v1/db`

### Stats

`GET /stats`

### List Sessions

`GET /sessions?offset=0&limit=50`

Optional filters currently exposed by the controller:

- `language`
- `kind`
- `status`

### Session Metadata

`GET /sessions/{sessionId}`

### Search

`GET /search?variable=x&value=5`

You can also search by variable only:

`GET /search?variable=result`

### Fork Lineage

`GET /forks/{sessionId}`

### Delete Session

`DELETE /sessions/{sessionId}`

## Current Notes

- runtime sandbox execution is the most mature path
- streaming is SSE-only today
- attach mode is shipped and exposed, but production hardening is still evolving
- advanced capture controls such as sampling, circuit breaking, async storage, and retention exist in source but are not yet default service knobs
