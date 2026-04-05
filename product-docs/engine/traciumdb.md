# TraciumDB

TraciumDB is the engine's built-in storage engine for execution traces.

You do not need PostgreSQL, MongoDB, Redis, or any other external database to use the engine.

## What It Stores

TraciumDB stores:

- trace documents
- session metadata
- variable/value search entries
- fork relationships

## Current File Layout

```text
data/traciumdb/
  traces/
    sess_xxx.trace
  index.db
  steps.idx
  forks.db
```

## What You Can Do With It

- browse stored sessions
- search executions by variable and value
- inspect fork relationships
- get storage stats
- persist traces across restarts

## How the Service Uses It

`SessionStore` writes completed traces into TraciumDB and reads them back for:

- REST APIs
- the embedded UI
- time-machine workflows
- diffing inputs

## Current Guarantees

Today TraciumDB should be understood as:

- embedded
- file-based
- restart-safe
- searchable
- actively used by the engine service

## Advanced Storage Components

The repository also contains:

- journal support
- async write queue support
- retention-policy support

These are important parts of the storage architecture, but they are not yet the default end-to-end service persistence path.

## Ways to Access Data

You can access stored traces through:

- the embedded UI
- `/v1/db/...` REST endpoints
- direct file access to the storage directory
- Swagger UI for API exploration
