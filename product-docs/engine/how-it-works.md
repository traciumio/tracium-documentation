# How the Engine Works

## Pipeline

```
Source Code → Compile → Launch JVM → Attach JDI → Step → Capture → Normalize → UEF
```

### 1. Compile
Uses `javax.tools.JavaCompiler` to compile source code to `.class` files in a temp directory.

### 2. Launch
Creates a new JVM process via JDI `LaunchingConnector`. The JVM starts with the debugger attached from the beginning.

### 3. Attach JDI Events
Subscribes to:
- `ClassPrepareEvent` — know when user class is loaded
- `StepEvent` — line-by-line stepping
- `MethodEntryEvent` / `MethodExitEvent` — track call stack
- `ExceptionEvent` — capture thrown exceptions

### 4. Capture State
At every step, the engine inspects:
- All stack frames via `ThreadReference.frames()`
- Local variables via `StackFrame.visibleVariables()`
- Object fields via `ObjectReference.getValue()`
- Array elements via `ArrayReference.getValues()`

### 5. Normalize
Raw JDI types are converted to UEF value kinds:
- `IntegerValue` → `{ "kind": "primitive", "type": "int", "value": 42 }`
- `ArrayReference` → stored in heap as `HeapObject.ArrayInstance`
- `ObjectReference` → stored in heap as `HeapObject.ObjectInstance`
- `null` → `{ "kind": "null" }`

### 6. Compute Deltas
Previous state is compared to current state:
- New locals → `FrameChange` with `before: null`
- Changed locals → `FrameChange` with before/after values
- Changed fields → `HeapChange` with object ID and path
- New heap objects → classified as `OBJECT_ALLOCATED`

### 7. Classify Event
Based on what changed:
- New heap objects → `OBJECT_ALLOCATED`
- Changed fields → `FIELD_UPDATED`
- Changed array elements → `ARRAY_ELEMENT_UPDATED`
- Changed locals → `VARIABLE_ASSIGNED`
- Nothing changed → `LINE_CHANGED`

### 8. Serialize UEF
Complete trace assembled with session metadata, recording context, all steps, and diagnostics. Serialized to JSON via custom Jackson serializers.
