# TraciumDB

TraciumDB is the engine's embedded storage — a file-based database purpose-built for execution traces. No PostgreSQL, no MongoDB, no external process.

## How It Works

```
data/traciumdb/
├── traces/                  ← one JSON file per execution (immutable)
│   ├── sess_abc123.trace
│   └── sess_def456.trace
├── index.db                 ← session metadata (JSONL)
├── steps.idx                ← variable/value search index
└── forks.db                 ← fork tree relationships
```

**Every file is human-readable.** Open any `.trace` file in VS Code and you'll see the full execution trace as formatted JSON.

## Why Not a Real Database?

| Need | PostgreSQL | TraciumDB |
|------|-----------|-----------|
| Store execution traces | JSONB column (generic) | Native UEF JSON files |
| Search by variable value | JSON path queries (slow) | Inverted index (instant) |
| Fork tree relationships | Relational JOINs | Native adjacency list |
| Setup | Install + configure + run server | Nothing (just a directory) |
| View data | psql / pgAdmin | VS Code / cat / browser UI |
| Backup | pg_dump | cp -r |

## Viewing the Data

### 1. Engine Explorer UI

Open `http://localhost:8080` → **TraciumDB** tab.

- **Storage Stats** — session count, disk usage
- **Browse Sessions** — list with metadata
- **Search** — "which executions had x = -1?"
- **Fork Tree** — parent/child lineage
- **Delete** — remove sessions

### 2. REST API

```bash
curl http://localhost:8080/v1/db/stats
curl http://localhost:8080/v1/db/sessions?limit=20
curl "http://localhost:8080/v1/db/search?variable=x&value=5"
curl http://localhost:8080/v1/db/forks/{sessionId}
```

### 3. Direct File Access

```bash
ls data/traciumdb/traces/
cat data/traciumdb/traces/sess_abc123.trace | python -m json.tool
```

## Configuration

```yaml
tracium:
  engine:
    data-dir: ${DATA_DIR:./data/traciumdb}
```

| Env Variable | Default | Description |
|-------------|---------|-------------|
| `DATA_DIR` | `./data/traciumdb` | Where all data is stored |

## Persistence Guarantees

- **Traces** — atomic writes (write to `.tmp`, then rename). No half-written files.
- **Indexes** — rebuilt from trace files on startup if corrupted.
- **WAL** — each journal entry fsynced to disk before acknowledged.
- **Survives restarts** — all data on disk, loaded into memory on startup.

## Disk Usage

| Trace Size | Steps | File Size |
|-----------|-------|-----------|
| Simple | 5-10 | 2-5 KB |
| Medium | 50-100 | 20-50 KB |
| Complex | 200-500 | 100-300 KB |
| Large | 1000+ | 500 KB - 2 MB |

100 traces ≈ 5-50 MB. Thousands of traces fit on any modern SSD.
