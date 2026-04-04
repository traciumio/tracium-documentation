# Nerva

Nerva is the orchestration and trace storage layer. It sits between clients and engines, managing sessions and persisting every trace as a durable artifact.

## What It Does

1. **Proxies** execution requests to Tracium Engine
2. **Persists** every UEF trace to disk as JSON
3. **Indexes** traces for fast querying by metadata
4. **Serves** traces to consumers (Prism, Pulse, Vector)

## Running

```bash
cd nerva
npm install
npx tsx src/index.ts
```

Starts on `http://localhost:4000`. Requires Tracium Engine on port 8080.

## Trace Store

Traces are stored as JSON files in `data/traces/`. On startup, Nerva rebuilds its in-memory index from existing files.

Each trace is queryable by: session ID, language, entrypoint, time range, tags.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Fastify |
| Language | TypeScript |
| Storage | File-based JSON |
