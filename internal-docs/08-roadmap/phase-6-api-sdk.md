# Phase 6: API & SDK (Vector)

**Status:** PLANNED
**Products Involved:** Vector, Nerva
**Tech Stack:** TypeScript
**Depends On:** Phase 4

---

## Objective

Create a stable, typed, developer-friendly SDK and public API surface that allows external tools, custom frontends, CI/CD pipelines, and teaching platforms to programmatically access runtime tracing and repository analysis.

---

## Sub-Tasks Breakdown

### 6.1 API Surface Design

- [ ] Finalize REST API specification (OpenAPI 3.0):
  - [ ] Runtime analysis endpoints
  - [ ] Repository analysis endpoints
  - [ ] GitHub integration endpoints
  - [ ] Shared utility endpoints
- [ ] API versioning strategy (URL-based: `/v1/...`)
- [ ] Authentication model:
  - [ ] API key authentication
  - [ ] OAuth token pass-through
  - [ ] Rate limiting per key
- [ ] Error response format (structured, consistent)
- [ ] Pagination model for list endpoints

### 6.2 Runtime Analysis API

- [ ] `POST /v1/sessions/runtime` - Create execution session
  - [ ] Request: language, code, entrypoint, limits
  - [ ] Response: session ID, status
- [ ] `GET /v1/sessions/runtime/{id}` - Get session status
- [ ] `GET /v1/sessions/runtime/{id}/trace` - Get full UEF trace
- [ ] `GET /v1/sessions/runtime/{id}/steps` - Get step list (paginated)
- [ ] `GET /v1/sessions/runtime/{id}/steps/{step}` - Get single step
- [ ] `GET /v1/sessions/runtime/{id}/state/{step}` - Get materialized state at step
- [ ] `DELETE /v1/sessions/runtime/{id}` - Delete session

### 6.3 Repository Analysis API

- [ ] `POST /v1/sessions/repo` - Create analysis session
  - [ ] Request: language, source (local/github), analysis mode
  - [ ] Response: session ID, status
- [ ] `GET /v1/sessions/repo/{id}` - Get session status
- [ ] `GET /v1/sessions/repo/{id}/graph` - Get full UGF graph
- [ ] `GET /v1/sessions/repo/{id}/symbols` - Get symbol inventory
- [ ] `GET /v1/sessions/repo/{id}/dependencies` - Get dependency edges
- [ ] `GET /v1/sessions/repo/{id}/callgraph` - Get call graph
- [ ] `DELETE /v1/sessions/repo/{id}` - Delete session

### 6.4 Platform API

- [ ] `GET /v1/health` - Health check
- [ ] `GET /v1/capabilities` - Language/feature support discovery
- [ ] `GET /v1/schemas/uef` - Get UEF schema
- [ ] `GET /v1/schemas/ugf` - Get UGF schema
- [ ] `GET /v1/sessions` - List all sessions (paginated)

### 6.5 TypeScript SDK (Vector)

- [ ] Project setup:
  - [ ] npm package configuration
  - [ ] TypeScript strict mode
  - [ ] Build to ESM + CJS
  - [ ] API documentation generation (TypeDoc)
- [ ] Core client:
  - [ ] `TraciumClient` class (base URL, API key)
  - [ ] HTTP transport layer (fetch-based)
  - [ ] Automatic retry with backoff
  - [ ] Request/response interceptors
  - [ ] Error wrapping (typed error classes)
- [ ] Runtime analysis module:
  - [ ] `client.runtime.create(request)` -> session
  - [ ] `client.runtime.get(sessionId)` -> status
  - [ ] `client.runtime.trace(sessionId)` -> UEF trace
  - [ ] `client.runtime.steps(sessionId, options)` -> paginated steps
  - [ ] `client.runtime.step(sessionId, stepNumber)` -> single step
  - [ ] `client.runtime.state(sessionId, stepNumber)` -> state
  - [ ] `client.runtime.waitForCompletion(sessionId)` -> polling helper
- [ ] Repository analysis module:
  - [ ] `client.repo.create(request)` -> session
  - [ ] `client.repo.get(sessionId)` -> status
  - [ ] `client.repo.graph(sessionId)` -> UGF graph
  - [ ] `client.repo.symbols(sessionId)` -> symbol list
  - [ ] `client.repo.waitForCompletion(sessionId)` -> polling helper
- [ ] GitHub module:
  - [ ] `client.github.connect()` -> OAuth initiation
  - [ ] `client.github.repos()` -> accessible repos
  - [ ] `client.github.disconnect()` -> revoke
- [ ] Platform module:
  - [ ] `client.health()` -> health status
  - [ ] `client.capabilities()` -> capability descriptor
  - [ ] `client.schemas.uef()` -> UEF schema
  - [ ] `client.schemas.ugf()` -> UGF schema

### 6.6 Typed Models

- [ ] Generate TypeScript types from UEF JSON Schema
- [ ] Generate TypeScript types from UGF JSON Schema
- [ ] Export all types for consumer use
- [ ] Type guards and validation helpers
- [ ] Zod schemas for runtime validation (optional)

### 6.7 Documentation & Onboarding

- [ ] API reference documentation (auto-generated from OpenAPI)
- [ ] SDK quick-start guide
- [ ] Code examples:
  - [ ] Trace a Java snippet
  - [ ] Analyze a local repository
  - [ ] Analyze a GitHub repository
  - [ ] Navigate trace steps programmatically
  - [ ] Extract call graph data
- [ ] Error handling guide
- [ ] Authentication setup guide

### 6.8 Testing

- [ ] SDK unit tests (mocked HTTP)
- [ ] SDK integration tests (against running Nerva)
- [ ] API contract tests (OpenAPI compliance)
- [ ] Rate limiting tests
- [ ] Authentication tests
- [ ] Type compatibility tests (ensure generated types match schemas)
- [ ] Publish dry-run tests

---

## SDK Usage Example

```typescript
import { TraciumClient } from '@tracium/vector';

const client = new TraciumClient({
  baseUrl: 'http://localhost:3000',
  apiKey: 'tk_...'
});

// Trace Java code
const session = await client.runtime.create({
  language: 'java',
  entrypoint: 'Main.main',
  code: `class Main {
    public static void main(String[] args) {
      int x = 5;
      int y = x * 2;
      System.out.println(y);
    }
  }`,
  limits: { timeoutMs: 5000, maxSteps: 500 }
});

await client.runtime.waitForCompletion(session.id);
const trace = await client.runtime.trace(session.id);

console.log(`Total steps: ${trace.steps.length}`);
for (const step of trace.steps) {
  console.log(`Step ${step.step}: ${step.event} at line ${step.source.line}`);
}
```

---

## Exit Criteria

- OpenAPI spec covers all endpoints with examples
- TypeScript SDK published to npm (or ready to publish)
- SDK can create sessions, poll for results, and retrieve traces/graphs
- At least 5 working code examples in documentation
- API versioning strategy in place and enforced
