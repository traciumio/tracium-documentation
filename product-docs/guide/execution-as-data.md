# Execution as Data

The fundamental idea behind Tracium is simple:

> **Execution should be a first-class data structure — captured, stored, queried, and replayed.**

## The Analogy

Think about what happened to events:

```
Before Kafka:  Event happens → disappears
After Kafka:   Event happens → stored in log → replayed by consumers
```

Tracium does the same for execution:

```
Before Tracium:  Code executes → state disappears
After Tracium:   Code executes → state captured → stored as trace → queried by consumers
```

## What Gets Captured

At every execution step, Tracium records:

### Stack Frames
The call stack — which methods are active, what their local variables are, what parameters were passed.

```json
{
  "id": "frame_main_0",
  "name": "main",
  "declaringType": "Main",
  "locals": {
    "x": { "kind": "primitive", "type": "int", "value": 5 },
    "y": { "kind": "primitive", "type": "int", "value": 10 }
  },
  "parameters": {
    "args": { "kind": "reference", "ref": "obj_1" }
  },
  "status": "active"
}
```

### Heap Objects
Every object on the heap with its fields, array elements, and reference relationships.

```json
{
  "obj_1": {
    "kind": "array",
    "type": "int[]",
    "elements": [
      { "kind": "primitive", "type": "int", "value": 3 },
      { "kind": "primitive", "type": "int", "value": 1 }
    ]
  }
}
```

### State Deltas
What changed at each step — the before and after values.

```json
{
  "frameChanges": [{
    "frameId": "frame_main_0",
    "local": "x",
    "before": null,
    "after": { "kind": "primitive", "type": "int", "value": 5 }
  }]
}
```

### Events
Every step is classified by what happened:

| Event | Meaning |
|-------|---------|
| `SESSION_STARTED` | Execution begins |
| `METHOD_ENTERED` | Method call, new frame pushed |
| `METHOD_EXITED` | Method returns, frame popped |
| `VARIABLE_ASSIGNED` | Local variable receives a value |
| `OBJECT_ALLOCATED` | New object created on heap |
| `FIELD_UPDATED` | Object field changed |
| `ARRAY_ELEMENT_UPDATED` | Array element changed |
| `EXCEPTION_THROWN` | Exception thrown |
| `SESSION_FINISHED` | Execution ends |

## Traces Are Persistent

Unlike debugger sessions that vanish when closed, Tracium traces are **stored as files on disk**. They have:

- **Identity** — each trace has a unique session ID
- **Metadata** — language, entrypoint, timestamps, recording mode
- **Queryability** — filter by language, entrypoint, time range
- **Durability** — traces persist until explicitly deleted

This means you can:
- Replay a trace from last week
- Compare traces across code versions
- Share a trace with a teammate
- Feed traces to AI for analysis
