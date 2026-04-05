# Recording Modes

Tracium Engine currently supports two real recording modes.

## 1. Sandbox Mode

Sandbox mode launches the target JVM itself.

```text
Engine launches JVM -> JDI capture -> UEF trace -> TraciumDB
```

### Characteristics

- full control by the engine
- strongest capture fidelity
- execution limits enforced by the engine
- best path for snippets, experiments, and deep state capture

### Typical Use Cases

- learning and demos
- debugging small programs
- validating time-machine features
- generating full traces for comparison

## 2. Observation Mode (Attach)

Observation mode attaches to a running JVM.

```text
Running JVM -> JDI attach -> bounded capture -> UEF trace -> TraciumDB
```

### Characteristics

- the engine observes instead of launching
- capture can be selective or bounded
- meant for real services and live JVMs
- available through both REST and the standalone agent

## Attach Strategies

Current strategies:

- `full`
- `method-boundary`
- `breakpoint`
- `event-filter`

## Capture Budgets

Attach mode can apply bounded capture rules for:

- frames
- object depth
- object count
- field count
- array size

This is what keeps production-oriented recording practical.

## Standalone Agent

For long-running or deployment-side observation, use `tracium-agent.jar`.

This gives you:

- no Spring Boot dependency
- CLI configuration
- reconnect behavior
- local TraciumDB output

## Recording Context in Traces

Every trace carries recording metadata such as:

- mode
- fidelity
- sampling strategy name
- environment

That lets consumers understand whether a trace was full sandbox capture or a budgeted observed trace.

## Current Notes

- sandbox is the most mature path
- attach mode is shipped and exposed
- advanced controls such as sampling and circuit breaking exist in source but are not yet the default end-to-end service path
