# TraciumDB — Embedded Storage Engine

## Overview

TraciumDB is Tracium's own embedded storage engine, purpose-built for execution traces. It replaces the need for any external database (PostgreSQL, MongoDB, Redis, etc.) by storing all data as human-readable files on disk.

**Key properties:**
- **Embedded** — no separate process, no connection strings, no Docker container
- **File-based** — all data stored as plain text (JSON, JSONL, TSV)
- **Append-only traces** — once written, traces are never modified
- **Native UEF understanding** — indexes step content (variable names, values, events)
- **WAL built-in** — crash recovery via write-ahead log with hash-chain integrity
- **Fork-tree-aware** — tracks parent/child relationships between forked executions
- **Zero configuration** — works out of the box, just a directory path

---

## Why TraciumDB?

No existing database fits Tracium's access patterns:

| Access Pattern | Traditional DB Problem | TraciumDB Solution |
|----------------|----------------------|-------------------|
| Traces are append-only documents | Relational schema overhead | One JSON file per trace, immutable |
| Step content queries ("find x = -1") | Slow JSON path queries | Inverted index on variable:value |
| Fork trees (parent/child branches) | Relational JOINs | Native adjacency list |
| Must be embedded | Requires separate server process | Just a directory |
| Human-inspectable data | Binary formats | Plain text everywhere |
| Crash recovery | Complex transaction logs | Atomic file writes + WAL |

---

## Architecture

### File Layout

```
{data-dir}/
├── traces/                     ← one .trace file per session
│   ├── sess_abc12345.trace     ← UEF JSON (immutable after write)
│   ├── sess_def67890.trace
│   └── sess_fork_xyz.trace
├── index.db                    ← metadata index (JSONL, one line per session)
├── steps.idx                   ← inverted index (variable:value → session:step)
└── forks.db                    ← fork tree (child → parent relationships)
```

### Data Flow

```
Execute Code
    │
    ▼
JDI captures steps
    │
    ▼
UEF trace assembled
    │
    ├──► traces/sess_xxx.trace     (atomic write: .tmp → rename)
    ├──► index.db                  (append metadata line)
    ├──► steps.idx                 (append variable:value entries)
    └──► forks.db                  (append if fork execution)
```

### Memory Model

| Component | In Memory | On Disk | Purpose |
|-----------|-----------|---------|---------|
| Trace cache | LRU (200 entries) | `traces/*.trace` | Avoid re-parsing JSON on repeated reads |
| Metadata index | Full ConcurrentSkipListMap | `index.db` | Fast session listing, filtering, querying |
| Step index | Full ConcurrentHashMap | `steps.idx` | Cross-trace variable/value search |
| Fork store | Full ConcurrentHashMap | `forks.db` | Fork tree navigation |

Data is written to disk FIRST, then cached in memory (WAL guarantee).

---

## Storage Components

### 1. TraceStore (traces/*.trace)

**Purpose:** Stores the actual UEF trace data.

**Properties:**
- One file per session: `{sessionId}.trace`
- Plain UEF JSON format (same as the API output)
- Immutable — never modified after creation
- Atomic writes: write to `.trace.tmp`, then `Files.move()` with `ATOMIC_MOVE`
- Average size: 5KB (simple) to 2MB (complex, 1000+ steps)

**Operations:**
- `write(sessionId, trace)` — serialize to JSON, atomic write
- `read(sessionId)` — read file, deserialize
- `delete(sessionId)` — remove file
- `diskUsage()` — total bytes across all trace files

### 2. MetadataIndex (index.db)

**Purpose:** Fast session lookup without loading trace files.

**Format:** JSONL (newline-delimited JSON), one object per line:
```jsonl
{"sessionId":"sess_abc","kind":"runtime","language":"java","entrypoint":"Main.main","totalSteps":15,"startedAt":"2026-04-05T12:00:00Z","storedAt":"2026-04-05T12:00:01Z","recordingMode":"sandbox","fidelity":"full"}
```

**Properties:**
- Loaded entirely into memory on startup (~500 bytes per session)
- Supports: list with pagination, filter by language/kind/status/time/correlation
- Appended on each `put()`, compacted on `flush()`
- 100K sessions ≈ 50MB memory

**Queryable fields:** sessionId, kind, status, language, entrypoint, correlationId, recordingMode, fidelity, startedAt, totalSteps, tags

### 3. StepIndex (steps.idx)

**Purpose:** Content-level search across all traces.

**Format:** Tab-separated: `key \t sessionId \t stepNumber \t variable \t value`
```
x:42	sess_abc	5	x	42
var:x	sess_abc	5	x	42
event:EXCEPTION_THROWN	sess_def	12	(event)	EXCEPTION_THROWN
```

**Index keys:**
- `variable:value` — exact match on variable name + value
- `var:variable` — match on variable name (any value)
- `event:EVENT_TYPE` — match on event type

**Enables queries that no generic database can do efficiently:**
- "Which executions had x = -1?"
- "Which executions had a variable called 'result'?"
- "Which executions threw an exception?"

### 4. ForkStore (forks.db)

**Purpose:** Tracks parent/child relationships between forked executions.

**Format:** Tab-separated: `childId \t parentId \t forkAtStep \t label`
```
sess_fork_001	sess_abc	5	What if x = 0?
sess_fork_002	sess_abc	5	What if x = -1?
sess_fork_003	sess_fork_001	8	What if y = true?
```

**Supports:**
- Get parent of any session
- Get all children of a session
- Walk full lineage (root → ... → current)
- Find all fork roots (sessions with no parent)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/db/stats` | Storage stats: session count, disk usage, index sizes |
| GET | `/v1/db/sessions` | List sessions with pagination (`?offset=0&limit=50`) |
| GET | `/v1/db/sessions/{id}` | Session metadata + fork info |
| GET | `/v1/db/search` | Search by variable/value (`?variable=x&value=5`) |
| GET | `/v1/db/forks/{id}` | Fork tree: parent, children, full lineage |
| DELETE | `/v1/db/sessions/{id}` | Delete a session and its trace |

---

## UI Access

The Engine Explorer (embedded at `http://localhost:8080`) has a **TraciumDB** tab that provides a visual interface for all storage operations.

---

## Configuration

```yaml
tracium:
  engine:
    data-dir: ${DATA_DIR:./data/traciumdb}
    journal-dir: ${JOURNAL_DIR:./data/journals}
```

| Env Variable | Default | Description |
|-------------|---------|-------------|
| `DATA_DIR` | `./data/traciumdb` | Root directory for all TraciumDB data |
| `JOURNAL_DIR` | `./data/journals` | WAL journal directory |

---

## Crash Recovery

1. **Trace files** — Atomic writes (`.tmp` → rename). A crash mid-write leaves only the `.tmp` file; the original is untouched. On next startup, orphaned `.tmp` files are ignored.

2. **Metadata index** — Rebuilt from trace file names on startup if `index.db` is corrupted. Each trace file is re-parsed for metadata.

3. **WAL journal** — Each entry is fsynced to disk before being acknowledged. On crash, the journal can be replayed to reconstruct the in-memory state. Hash chain detects corruption.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Plain text format** | Human-inspectable. No special tools needed. `cat`, `grep`, VS Code all work. |
| **One file per trace** | Simple. Atomic. Easy to backup/delete individual sessions. No lock contention. |
| **JSONL for indexes** | Append-friendly. Line-by-line parsing. Compactable. |
| **In-memory indexes** | Fast queries. Traces are the large data; indexes are small (~500B per session). |
| **No binary format** | Debuggability over performance. A 2MB JSON trace loads in <10ms. Good enough. |
| **No SQL** | Execution traces don't fit relational schemas. UEF is hierarchical (frames → locals → values → heap). |
| **Embedded, not client-server** | One less thing to deploy, configure, monitor, and debug. |

---

## Relationship to Nerva Trace Store

Nerva (the orchestration layer) has its own trace store for cross-ecosystem persistence. TraciumDB is the **engine's internal storage** — it persists sessions, enables time machine features (fork, compare, query), and provides the data for the embedded UI.

In the full Tracium architecture:
```
Engine (TraciumDB)  →  Nerva (Trace Store)  →  Prism (Visualization)
   internal              ecosystem-wide           user-facing
```

Both can coexist. The engine stores its working data in TraciumDB; Nerva stores the canonical trace archive for all ecosystem consumers.
