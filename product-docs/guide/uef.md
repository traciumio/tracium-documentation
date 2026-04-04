# UEF: Universal Execution Format

UEF is the structured data format that every Tracium trace uses. It's the shared language of the ecosystem — every tool reads and writes UEF.

## Structure

Every UEF trace has this shape:

```json
{
  "uefVersion": "0.1.0",
  "session": { ... },
  "recording": { ... },
  "correlation": { ... },
  "steps": [ ... ],
  "diagnostics": [ ... ]
}
```

## Session

Identifies what was executed:

```json
{
  "id": "sess_abc123",
  "language": "java",
  "adapter": "jdi",
  "runtimeVersion": "26",
  "entrypoint": "Main.main",
  "startedAt": "2026-04-04T10:15:00Z",
  "completedAt": "2026-04-04T10:15:01Z"
}
```

## Recording

How the trace was captured:

```json
{
  "mode": "sandbox",
  "fidelity": "full",
  "samplingStrategy": "none",
  "environment": "development"
}
```

| Field | Values |
|-------|--------|
| `mode` | `sandbox` (engine controls execution), `observed` (engine attaches to running process) |
| `fidelity` | `full`, `sampled`, `selective`, `minimal` |

## Steps

The heart of every trace. Each step is one execution event:

```json
{
  "step": 4,
  "event": "VARIABLE_ASSIGNED",
  "threadId": "main",
  "source": { "file": "Main.java", "symbol": "Main.main", "line": 4 },
  "delta": {
    "frameChanges": [{
      "frameId": "frame_main_0",
      "local": "x",
      "before": null,
      "after": { "kind": "primitive", "type": "int", "value": 5 }
    }],
    "heapChanges": []
  },
  "state": {
    "frames": [ ... ],
    "heap": { ... },
    "stdout": [],
    "stderr": []
  }
}
```

## Value Types

Every runtime value normalizes to one of these:

| Kind | Example |
|------|---------|
| `primitive` | `{ "kind": "primitive", "type": "int", "value": 42 }` |
| `null` | `{ "kind": "null" }` |
| `reference` | `{ "kind": "reference", "ref": "obj_1" }` |
| `object` | `{ "kind": "object", "type": "Node", "fields": { ... } }` |
| `array` | `{ "kind": "array", "type": "int[]", "elements": [ ... ] }` |

## What Doesn't Belong in UEF

- Pixel positions or animation data
- UI labels or color choices
- AI-generated explanations
- Renderer-specific formatting

UEF is pure execution data. How it's displayed is up to the consumer.
