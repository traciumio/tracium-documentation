# API Surface

## Purpose

This document defines the initial platform-facing API surface that the SDK can wrap.

## Core Service Areas

### Runtime Analysis

Suggested endpoints:

- `POST /sessions/runtime` - create sandbox execution session
- `POST /sessions/runtime/attach` - attach to running process for recording
- `GET /sessions/runtime/{sessionId}` - get session status
- `GET /sessions/runtime/{sessionId}/steps` - get step list (paginated)
- `GET /sessions/runtime/{sessionId}/step/{step}` - get single step
- `GET /sessions/runtime/{sessionId}/state/{step}` - get materialized state at step
- `WS /sessions/runtime/{sessionId}/stream` - subscribe to live event stream

### Trace Store

Suggested endpoints:

- `GET /traces` - query persisted traces by filter
- `GET /traces/{sessionId}` - retrieve full persisted trace
- `GET /traces/{sessionId}/steps?from=10&to=50` - retrieve step range
- `DELETE /traces/{sessionId}` - delete persisted trace
- `PATCH /traces/{sessionId}/tags` - update trace tags
- `POST /comparisons` - create trace comparison (diff)
- `GET /comparisons/{comparisonId}` - retrieve comparison results

### AI-Friendly Access

Suggested endpoints:

- `POST /sessions/{sessionId}/ai/summarize` - get trace summary at specified level
- `POST /sessions/{sessionId}/ai/focus` - get filtered trace for specific variable/method
- `POST /sessions/{sessionId}/ai/explain` - get AI explanation for a step

### Repository Analysis

Suggested endpoints:

- `POST /sessions/repo`
- `GET /sessions/repo/{sessionId}`
- `GET /sessions/repo/{sessionId}/graph`
- `GET /integrations/github/repos`
- `POST /integrations/github/connect`

### Shared

Suggested endpoints:

- `GET /health`
- `GET /capabilities`
- `GET /schemas/uef`
- `GET /schemas/ugf`

## Example Runtime Request

```json
{
  "language": "java",
  "entrypoint": "Main.main",
  "code": "class Main { public static void main(String[] args) { int x = 1; } }",
  "limits": {
    "timeoutMs": 5000,
    "maxSteps": 1000
  }
}
```

## Example Repo Request

```json
{
  "language": "java",
  "source": {
    "type": "local",
    "rootPath": "/workspace/sample-repo"
  },
  "analysisMode": "architecture"
}
```

Alternative GitHub-backed request:

```json
{
  "language": "java",
  "source": {
    "type": "github",
    "provider": "github",
    "repository": "acme/private-service",
    "ref": "main"
  },
  "analysisMode": "architecture"
}
```

## Example Runtime Session Response

```json
{
  "sessionId": "sess_runtime_001",
  "status": "running",
  "kind": "runtime"
}
```

## Example Repo Session Response

```json
{
  "sessionId": "sess_repo_001",
  "status": "queued",
  "kind": "repo"
}
```

## API Principles

- asynchronous sessions for long-running work
- stable IDs and addressable URIs for all traces
- persistent trace storage with configurable retention
- real-time streaming for live sessions (WebSocket/SSE)
- structured diagnostics
- capability discovery for language and feature support
- explicit versioning for contracts and endpoints
- trace comparison and diffing as first-class operations
- AI-friendly endpoints for summarization and focused views
- correlation ID support for distributed trace assembly
