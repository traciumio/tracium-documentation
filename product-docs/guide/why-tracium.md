# Why Tracium?

## The Paradigm Shift

**Before Tracium:** Code executes → state disappears → we infer from logs.

**After Tracium:** Code executes → state becomes structured, replayable, queryable data.

This is the same shift that happened with:

- **Kafka** — before: events disappear. After: events are stored, replayed, streamed.
- **Docker** — before: environments are inconsistent. After: execution environments are standardized.
- **Git** — before: code changes are lost. After: every change is tracked, diffable, reversible.

Tracium does this for **execution itself**.

## What Existing Tools Miss

### Debuggers
Show you the current state at a breakpoint. But:
- Ephemeral — gone when you close the session
- Local only — can't share or replay
- Manual — you have to know where to look

### Observability (Prometheus, Grafana, Jaeger)
Show you metrics and spans. But:
- No state — you see "request failed" not "user.balance = -100"
- Shallow — spans tell you which service, not what happened inside
- Aggregated — individual execution paths are lost

### Code Visualizers (PythonTutor, etc.)
Show animated execution. But:
- Toy only — break down on real code
- Not infrastructure — can't be consumed by other tools
- Ephemeral — no persistence, no querying

### Logs
The universal fallback. But:
- Partial — only what someone thought to log
- Unstructured — grep-able text, not queryable data
- Lossy — most state is never logged

## What Tracium Enables

### 1. Replay Any Execution
Record execution once, replay it forever. Debug a production issue from last week by loading its trace.

### 2. Compare Executions
Diff two traces to see exactly what changed. "My refactor should not change behavior — did it?"

### 3. State-Level Observability
Go beyond metrics. See the actual variable values, heap state, and execution path at any point.

### 4. AI Over Execution
Give an LLM real execution data instead of static code. "Why did this request fail?" answered with actual state.

### 5. Execution as Infrastructure
Build tools on top of execution data. Monitoring dashboards, regression detection, onboarding tools — all consuming the same UEF traces.
