# Recording Modes

Tracium supports two ways of capturing execution.

## Sandbox Mode (Launch)

The engine creates, controls, and terminates the target process.

```
Engine creates JVM → attaches JDI → captures every step → terminates
```

| Aspect | Detail |
|--------|--------|
| Control | Engine has full control |
| Fidelity | Full — every step captured |
| Determinism | Single-threaded, deterministic |
| Safety | Sandboxed (CPU, memory, filesystem limits) |
| Use case | Learning, debugging snippets, testing |

**This is the default mode and what's implemented today.**

## Observation Mode (Attach) <Badge type="warning" text="Planned" />

The engine connects to an already-running process.

```
Running JVM → Engine attaches JDI → captures selectively → detaches
```

| Aspect | Detail |
|--------|--------|
| Control | Engine observes, doesn't control |
| Fidelity | Configurable (sampled, selective, minimal) |
| Overhead | < 5% for method boundary capture |
| Use case | Production debugging, monitoring, incident investigation |

### Recording Strategies (Planned)

- **Method boundary** — capture entry/exit with params and return values
- **Breakpoint** — full state at specific source locations
- **Event filter** — only exceptions, specific method calls

## Recording Context

Every trace carries metadata about how it was captured:

```json
{
  "recording": {
    "mode": "sandbox",
    "fidelity": "full",
    "samplingStrategy": "none",
    "environment": "development"
  }
}
```

Consumers always know: was this a complete capture or a sampled one?
