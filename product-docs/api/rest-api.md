# REST API

## Tracium Engine (port 8080)

### Create Runtime Session

**`POST /v1/sessions/runtime`**

Execute Java code and capture a trace.

Request:
```json
{
  "language": "java",
  "entrypoint": "Main.main",
  "code": "class Main { public static void main(String[] args) { int x = 5; } }",
  "limits": { "timeoutMs": 5000, "maxSteps": 500 }
}
```

Response `201`:
```json
{
  "sessionId": "sess_runtime_abc123",
  "status": "COMPLETED",
  "totalSteps": 5
}
```

### Get Session Status

**`GET /v1/sessions/runtime/{sessionId}`**

### Get Full Trace

**`GET /v1/sessions/runtime/{sessionId}/trace`**

Returns complete UEF JSON document.

### Health Check

**`GET /v1/sessions/runtime/health`**

---

## Nerva (port 4000)

### Create Session (with persistence)

**`POST /v1/sessions/runtime`**

Same request as Engine. Nerva proxies to Engine and persists the trace.

Response `201`:
```json
{
  "sessionId": "sess_runtime_abc123",
  "status": "COMPLETED",
  "totalSteps": 8,
  "persisted": true,
  "metadata": {
    "sessionId": "sess_runtime_abc123",
    "language": "java",
    "entrypoint": "Main.main",
    "totalSteps": 8,
    "startedAt": "2026-04-04T03:33:08Z",
    "recordingMode": "sandbox",
    "fidelity": "full"
  }
}
```

### List Traces

**`GET /v1/traces`**

Query parameters:
| Param | Description |
|-------|-------------|
| `language` | Filter by language |
| `entrypoint` | Filter by entrypoint (partial match) |
| `tag` | Filter by tag (`key=value`) |
| `limit` | Max results (default 50) |

### Get Persisted Trace

**`GET /v1/traces/{sessionId}`**

### Get Step Range

**`GET /v1/traces/{sessionId}/steps?from=3&to=8`**

### Get Trace Metadata

**`GET /v1/traces/{sessionId}/metadata`**

### Delete Trace

**`DELETE /v1/traces/{sessionId}`**

### Health

**`GET /health`**

### Capabilities

**`GET /v1/capabilities`**
