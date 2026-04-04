# JDI Adapter

The JDI (Java Debug Interface) adapter is the language-specific component that captures Java execution.

## What Is JDI?

JDI is Java's official debugger API, part of the JDK. It provides programmatic access to:
- Stack frame inspection
- Local variable reading
- Object field and array element access
- Method entry/exit events
- Line-level step events
- Exception events

## How Tracium Uses JDI

### Launch Mode
```java
LaunchingConnector connector = Bootstrap.virtualMachineManager().defaultConnector();
Map<String, Connector.Argument> args = connector.defaultArguments();
args.get("main").setValue(className);
args.get("options").setValue("-cp " + classPath);
VirtualMachine vm = connector.launch(args);
```

### Event Subscription
```java
// Step through every line in user code
StepRequest stepRequest = erm.createStepRequest(
    thread, StepRequest.STEP_LINE, StepRequest.STEP_INTO
);
stepRequest.addClassFilter(className);
stepRequest.enable();
```

### State Inspection
```java
// Read all local variables in a frame
for (LocalVariable var : frame.visibleVariables()) {
    Value jdiValue = frame.getValue(var);
    // Convert to UEF Value type
}
```

## Value Conversion

| JDI Type | UEF Value |
|----------|-----------|
| `IntegerValue` | `Value.ofInt(v.value())` |
| `BooleanValue` | `Value.ofBoolean(v.value())` |
| `StringReference` | `Value.ofString(v.value())` |
| `ArrayReference` | `Value.ofRef(objectId)` + heap entry |
| `ObjectReference` | `Value.ofRef(objectId)` + heap entry |
| `null` | `Value.ofNull()` |

## Object Identity

Every JDI `ObjectReference` has a `uniqueID()`. Tracium maps these to stable `obj_1`, `obj_2`, etc. Two references to the same runtime object always resolve to the same ID — aliasing is preserved.

## Filtering

Only user code is captured. JDK internals (`java.*`, `jdk.*`, `sun.*`) are skipped automatically.
