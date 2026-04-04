# Tracium Engine

Tracium Engine is the **execution intelligence core** — a State Time Machine that records every state transition of a running program, allows rewind, forks timelines, and simulates alternate outcomes.

## Quick Start

```bash
cd tracium-engine
./gradlew :engine-service:bootRun
```

Open `http://localhost:8080` — the Engine Explorer UI loads with the API.

## What It Does

| Capability | Description |
|-----------|-------------|
| **Execute & Capture** | Run Java code, capture every variable, every heap object, every step |
| **Time Machine** | Root cause analysis, divergence detection, execution queries |
| **Fork Timelines** | "What if X was 0?" — real re-execution with state injection via JDI |
| **AI Studio** | Trace summarization, focused views, natural language explanations |
| **Causality** | Data dependency graphs, taint tracking, dynamic program slicing |
| **Simulation** | Chaos injection, probability exploration, prophecy mode |
| **Execution Diffing** | Compare two traces, detect regressions, behavioral equivalence |
| **Attach Mode** | Connect to running JVMs for production recording |
| **Streaming** | Real-time SSE step delivery during execution |
| **TraciumDB** | Embedded storage engine — no external database needed |

## Architecture

```
tracium-engine/
├── engine-core/                # Language-agnostic core
│   ├── model/                  #   UEF data models (Value, ExecutionState, StackFrame, HeapObject)
│   ├── serializer/             #   UEF JSON serializer + deserializer
│   ├── timeline/               #   Timeline, checkpoints, root cause, fork, fork tree
│   ├── comparison/             #   Execution diffing (4 alignment strategies)
│   ├── ai/                     #   Trace compression, focused views, NL converter
│   ├── causality/              #   Causal graph (DDG, CDG, taint, slicing)
│   ├── simulation/             #   Chaos injection, probability exploration, prophecy
│   ├── distributed/            #   Cross-service trace assembly
│   ├── journal/                #   Write-ahead log with hash-chain integrity
│   └── storage/                #   TraciumDB embedded storage engine
├── engine-java-jdi-adapter/    # Java-specific execution via JDI
│   ├── JavaJdiAdapter          #   Launch + attach + stream + fork
│   ├── JdiExecutionEngine      #   Sandbox execution with real-time callbacks
│   ├── JdiForkEngine           #   Real re-execution with state injection
│   ├── JdiAttachEngine         #   Production recording via AttachingConnector
│   ├── SandboxPolicy           #   Memory/network/filesystem restrictions
│   └── JavaCompiler            #   Source compilation with javac
└── engine-service/             # Spring Boot REST API + embedded UI
    ├── RuntimeController       #   Execute, get session, get trace
    ├── TimeMachineController   #   Root cause, divergence, query, fork, real fork
    ├── StreamingController     #   SSE real-time step delivery
    ├── AiConsumptionController #   Summarize, focus, explain, narrative
    ├── DiffController          #   Create/retrieve trace comparisons
    ├── CausalityController     #   Causal graph, taint, program slice
    ├── SimulationController    #   Explore, chaos, predict, fork tree, counterfactual
    ├── AttachController        #   Production recording endpoint
    ├── StorageController       #   TraciumDB browser (stats, search, browse)
    └── Engine Explorer UI      #   Embedded React UI at /
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Java 26 |
| Framework | Spring Boot 4.0.5 |
| Build | Gradle 9.4.1 |
| Debugger | JDI (Java Debug Interface) |
| Serialization | Jackson |
| Storage | TraciumDB (embedded, file-based) |
| UI | React 18 + TypeScript + Vite (embedded) |
| Tests | 244 tests, JUnit 5 |

## What It Captures

For every execution step:

- **Stack frames** — method name, declaring type, local variables, parameters
- **Heap objects** — fields, array elements, stable object identity, reference graph
- **State deltas** — before/after values for every mutation
- **Event type** — SESSION_STARTED, VARIABLE_ASSIGNED, METHOD_ENTERED, OBJECT_ALLOCATED, EXCEPTION_THROWN, etc.
- **Source anchor** — file, symbol, line number, column
- **Stdout/stderr** — captured from the target JVM process

## Storage

TraciumDB stores all data as human-readable files:

```
data/traciumdb/
├── traces/sess_abc.trace    ← plain JSON (open in VS Code)
├── index.db                 ← session metadata index
├── steps.idx                ← variable/value search index
└── forks.db                 ← fork tree relationships
```

No PostgreSQL, no MongoDB, no Redis. Just files. See [TraciumDB documentation](/engine/traciumdb) for details.
