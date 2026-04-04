# UEF Schema Reference

## Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `uefVersion` | string | Schema version (`"0.1.0"`) |
| `session` | object | Session metadata |
| `recording` | object | How the trace was captured |
| `correlation` | object | Distributed trace context |
| `steps` | array | Ordered execution steps |
| `diagnostics` | array | Warnings and errors |

## Session Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique session identifier |
| `language` | string | Source language (`"java"`) |
| `adapter` | string | Capture adapter (`"jdi"`) |
| `runtimeVersion` | string | JDK version |
| `entrypoint` | string | Entry method (`"Main.main"`) |
| `startedAt` | string | ISO 8601 timestamp |
| `completedAt` | string | ISO 8601 timestamp |

## Recording Object

| Field | Type | Values |
|-------|------|--------|
| `mode` | string | `sandbox`, `observed`, `replayed` |
| `fidelity` | string | `full`, `sampled`, `selective`, `minimal` |
| `samplingStrategy` | string | `none`, `method-boundary`, `breakpoint`, `event-filter` |
| `environment` | string | `development`, `staging`, `production` |

## Step Object

| Field | Type | Description |
|-------|------|-------------|
| `step` | integer | Monotonic step number (1-based) |
| `event` | string | Event type |
| `threadId` | string | Thread identifier |
| `source` | object | Source anchor (file, symbol, line) |
| `delta` | object | What changed (frame + heap changes) |
| `state` | object | Full materialized state |

## Event Types

| Event | Description |
|-------|-------------|
| `SESSION_STARTED` | Execution begins |
| `SESSION_FINISHED` | Execution ends |
| `LINE_CHANGED` | New source line |
| `METHOD_ENTERED` | Method call, frame pushed |
| `METHOD_EXITED` | Method returns, frame popped |
| `VARIABLE_ASSIGNED` | Local variable assigned |
| `OBJECT_ALLOCATED` | New heap object |
| `FIELD_UPDATED` | Object field changed |
| `ARRAY_ELEMENT_UPDATED` | Array element changed |
| `EXCEPTION_THROWN` | Exception thrown |
| `EXCEPTION_CAUGHT` | Exception caught |
| `STDOUT_APPENDED` | Console output |
| `STDERR_APPENDED` | Error output |

## Value Kinds

| Kind | Fields | Example |
|------|--------|---------|
| `primitive` | `type`, `value` | `{ "kind": "primitive", "type": "int", "value": 42 }` |
| `null` | — | `{ "kind": "null" }` |
| `reference` | `ref` | `{ "kind": "reference", "ref": "obj_1" }` |
| `object` | `type`, `fields` | `{ "kind": "object", "type": "Node", "fields": {...} }` |
| `array` | `type`, `elements` | `{ "kind": "array", "type": "int[]", "elements": [...] }` |
