# What is Tracium?

Tracium is **execution intelligence infrastructure**. It captures program execution — every variable assignment, every method call, every heap mutation — and turns it into structured, persistent, queryable data.

> **Tracium is to execution what Kafka is to events.**
> Kafka made events durable and replayable. Tracium makes execution durable and replayable.

## The Problem

When you run a program today, execution is invisible. Variables change, methods are called, objects are created — but once the program finishes, all that state is gone.

You're left with:
- **Logs** — partial, human-written, lossy
- **Metrics** — aggregated, no state detail
- **Debugger memory** — ephemeral, gone when you close it
- **Stack traces** — only on errors, only the crash point

No system answers: *"What EXACTLY was the state of the program at every step, and can I replay it?"*

## The Solution

Tracium captures execution at the state level:

```
Code → Execution → State Timeline → Persistent, Queryable, Replayable Data
```

Every execution produces a **UEF trace** — a structured document containing:

- **Stack frames** with local variables and parameters at every step
- **Heap objects** with fields, elements, and reference relationships
- **State deltas** showing what changed (before/after values)
- **Event classification** (VARIABLE_ASSIGNED, OBJECT_ALLOCATED, FIELD_UPDATED, etc.)
- **Source anchors** linking every state change back to source code

## What It Looks Like

Submit Java code to Tracium:

```java
class Main {
  public static void main(String[] args) {
    int x = 5;
    int y = x * 2;
    int z = x + y;
  }
}
```

Get back a step-by-step trace:

```
Step 3: LINE_CHANGED    line 3  | locals: {}
Step 4: VARIABLE_ASSIGNED line 4  | x = 5        [delta: x: null → 5]
Step 5: VARIABLE_ASSIGNED line 5  | x = 5, y = 10 [delta: y: null → 10]
Step 6: VARIABLE_ASSIGNED line 6  | x = 5, y = 10, z = 15 [delta: z: null → 15]
```

Every variable, every assignment, every step — captured from real JVM execution via JDI.

## Key Capabilities

| Capability | Description |
|-----------|-------------|
| **Sandbox Execution** | Compile and run Java code in a controlled environment |
| **Full State Capture** | Stack frames, heap objects, references at every step |
| **Variable Deltas** | Before/after values for every mutation |
| **Event Classification** | VARIABLE_ASSIGNED, OBJECT_ALLOCATED, FIELD_UPDATED, etc. |
| **Persistent Traces** | Stored on disk, queryable by filter, replayable anytime |
| **REST API** | Submit code, retrieve traces, query history |
| **Multi-Consumer** | Visualization, SDK, IDE plugin, AI — all consume UEF |

## How It's Different

| | Debuggers | Observability | Visualizers | **Tracium** |
|---|-----------|--------------|-------------|-------------|
| **State capture** | Real-time only | Metrics only | Toy snippets | Full state, persisted |
| **Persistence** | Ephemeral | Time-series | Ephemeral | Durable artifacts |
| **Queryable** | No | Metric queries | No | Filter, search, compare |
| **Production** | Not intended | Yes (shallow) | No | Attach mode |
| **AI-friendly** | No | Limited | No | Structured, segmentable |

## Next Steps

- [Why Tracium?](/guide/why-tracium) — The paradigm shift in detail
- [Getting Started](/guide/getting-started) — Run your first trace in 2 minutes
- [Core Concepts](/guide/execution-as-data) — Understand execution as data
