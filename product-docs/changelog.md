# Changelog

## v0.1.0 (2026-04-04)

### Tracium Engine
- Java compilation via `javax.tools.JavaCompiler`
- JDI launch mode with full state capture
- Line-level stepping with variable-level deltas
- Event classification: SESSION_STARTED, METHOD_ENTERED/EXITED, LINE_CHANGED, VARIABLE_ASSIGNED, OBJECT_ALLOCATED, FIELD_UPDATED, ARRAY_ELEMENT_UPDATED
- Heap tracking with object identity preservation
- Stdout/stderr capture from target JVM
- REST API (Spring Boot 4.0.5, Java 26)
- Tested: variables, arrays, recursion, objects, field mutation, exceptions

### Nerva
- Fastify REST API
- Engine proxy (forward execution requests)
- File-based trace store with JSON persistence
- Trace query API (filter by language, entrypoint, tags)
- Step range retrieval
- CORS support for Prism

### Prism
- React + TypeScript + Vite
- Runtime Studio and Architecture Lens surfaces
- Debug Truth and Learning Lens modes
- API client wired to Nerva

### Documentation
- 43 internal architecture docs
- VitePress product documentation site
- 8 sample HTML previews
