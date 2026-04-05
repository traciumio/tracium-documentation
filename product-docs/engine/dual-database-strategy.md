# Dual Database Strategy: TraciumDB Lite + TraciumDB Pro

## Overview

Tracium ships two database products that share one logical execution model and one Explorer UI:

- **TraciumDB Lite** -- the default embedded database inside the engine and agent. Optimized for single-node local capture, local query, fork lineage, and fast trace inspection with zero setup.
- **TraciumDB Pro** -- a standalone server-first hybrid execution database. Adds memory/disk tiering, richer indexing, semantic retrieval, and read/federate-first legacy connectors.

Both implement the same shared backend contract. The engine, agent, and Explorer support three runtime modes: `lite`, `pro`, and `dual`.

## Why Two Products

| Concern | Lite | Pro |
|---|---|---|
| Setup | Zero (embedded, file-based) | Server process (separate service) |
| Use case | Developer workstation, local debugging | Team/production, cross-service traces |
| Scale | Single-node, thousands of traces | Single-node initially, millions of traces |
| Vector/semantic | Not supported | HNSW index, embeddings, RAG |
| Legacy connectors | Not supported | JDBC (PostgreSQL, MySQL, etc.), MongoDB |
| Storage tiering | Filesystem only | RAM -> disk -> cold storage |

## Runtime Modes

| Mode | Write Path | Read Path | Use Case |
|---|---|---|---|
| `lite` | Local Lite only | Local Lite only | Default, zero-setup development |
| `pro` | Pro server only | Pro server only | Team/production with central DB |
| `dual` | Local Lite + async ship to Pro | Local Lite (fast) + Pro (full features) | Best of both worlds |

Configure via environment variable or application.yml:

```yaml
tracium:
  db:
    mode: lite          # lite | pro | dual
    url: http://localhost:9090    # Pro server URL (pro/dual modes)
    api-key: ""                   # Pro auth (pro/dual modes)
    ship-async: true              # Async ship in dual mode
    retention-days: 90
    hot-cache-mb: 256
```

## Shared Contract

Both Lite and Pro implement `TraciumDBBackend`:

```
putTrace / getTrace / deleteTrace
listSessions / query
searchValues / searchByVariable
getForkTree / getForkRoots / putFork
stats / capabilities
```

The `capabilities` endpoint tells the Explorer which features are available:

```json
{
  "vectorSearch": false,
  "connectors": false,
  "federation": false,
  "hybridQuery": false,
  "semanticSearch": false,
  "tiering": false,
  "mode": "lite",
  "engine": "TraciumDB Lite"
}
```

## Shared Entities

Defined once, used by both:

| Entity | Description |
|---|---|
| `TraceSession` | Session metadata (id, language, entrypoint, timestamps, tags) |
| `TraceStep` | Single execution step (event, state, delta) |
| `ValueFact` | Variable/value search hit (sessionId, step, variable, value) |
| `ForkEdge` | Fork relationship (child, parent, step, label) |
| `EmbeddingChunk` | Vector embedding over trace segment (Pro only) |
| `ConnectorSource` | External data source registration (Pro only) |

## API Surface

### Shared Endpoints (Lite + Pro)

| Endpoint | Method | Description |
|---|---|---|
| `/v1/db/capabilities` | GET | What this backend supports |
| `/v1/db/stats` | GET | Storage + performance stats |
| `/v1/db/stats/performance` | GET | Latency metrics only |
| `/v1/db/sessions` | GET | List sessions (pagination, filtering) |
| `/v1/db/sessions/{id}` | GET | Session metadata + fork info |
| `/v1/db/sessions/{id}` | DELETE | Delete session |
| `/v1/db/search` | GET | Variable/value search |
| `/v1/db/forks/{id}` | GET | Fork tree with lineage |
| `/v1/db/query` | POST | Structured query |

### Pro-Only Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/v1/db/vector/search` | POST | Semantic/ANN similarity search |
| `/v1/db/connectors` | GET/POST | List/register legacy connectors |
| `/v1/db/connectors/{id}/preview` | POST | Preview connector data |
| `/v1/db/connectors/{id}/sync` | POST | Sync/index connector data |
| `/v1/db/tiering/stats` | GET | Storage tier metrics |

## TraciumDB Lite

Lite is the current embedded storage, evolving toward a high-performance binary format:

**Current (v0.1.0)**: JSON trace files, JSONL metadata index, TSV inverted index
**Target (v0.2.0)**: Binary `.tdb` files, MessagePack encoding, LZ4 compression, LSM-tree inverted index, memory-mapped reads

### Scope

Lite handles:
- Local engine trace persistence
- Metadata and variable/value search
- Fork lineage tracking
- Embedded Explorer browsing
- Optional dual-write shipping to Pro

Lite does NOT handle:
- Legacy DB connectors or federation
- Distributed clustering
- Heavy semantic/vector workloads

### Performance Targets

| Operation | Current | Lite Target |
|---|---|---|
| Write 1000 steps | ~50ms | <5ms |
| Read 1000 steps | ~30ms | <3ms |
| Read single step | ~30ms | <0.2ms |
| Startup (1K sessions) | ~10s | <50ms |
| Disk per step | ~1KB | <100 bytes |

See [performance-targets.md](../../tracium-engine/docs/performance-targets.md) for full specs.

## TraciumDB Pro

Pro is a standalone server with five subsystems:

1. **Catalog Plane** -- projects, tenants, connectors, schemas, auth, policies
2. **Trace Store** -- immutable compressed trace segments and large payload blobs
3. **Index Plane** -- metadata, inverted value, fork/graph, vector (HNSW), full-text indexes
4. **Tiering Plane** -- RAM cache -> local disk -> cold storage
5. **Federation Plane** -- connector adapters, query pushdown, sync/index jobs

### Data Model Rules

- Relational structures for catalog, metadata, policies, tabular projections
- Trace bodies remain native execution documents/segments (not flattened rows)
- Lineage stays graph-native
- Semantic retrieval uses embeddings over trace summaries/chunks, not raw whole-trace vectors

### Query Model

- Primary interface: execution-aware query API + shared query IR
- SQL facade for SELECT, filtering, joining, grouping, projections
- v1 does NOT support arbitrary OLTP, cross-backend writes, or distributed transactions

### Legacy Connectors (Read/Federate-First)

v1 connectors are read-only:
- JDBC: PostgreSQL, MySQL/MariaDB, SQL Server, Oracle
- NoSQL: MongoDB
- Can query live or index into Pro
- No write-back in v1

## Explorer Integration

One Explorer app with capability-driven rendering:

- **Lite mode**: current features (browse sessions, search, forks, trace viewer)
- **Pro mode**: adds connector management, hybrid query, semantic search, lineage graph, storage tier metrics
- Backend selection via connection profiles
- Unsupported features automatically hidden based on `/v1/db/capabilities`

## Delivery Phases

1. **Contract + mode split** -- shared entities, capabilities, db.mode config
2. **Lite hardening** -- binary format, LSM indexes, WAL, crash recovery, benchmarks
3. **Pro single-node core** -- server, catalog, segment store, index plane, ingest
4. **Federation + hybrid query** -- JDBC connectors, pushdown, vector/semantic search
5. **Scale-out + enterprise** -- clustering, cold storage, tenancy, governance
