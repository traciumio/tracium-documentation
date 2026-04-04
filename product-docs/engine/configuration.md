# Configuration

## Application Config

`engine-service/src/main/resources/application.yml`:

```yaml
server:
  port: 8080

spring:
  application:
    name: tracium-engine

tracium:
  engine:
    default-timeout-ms: 5000
    default-max-steps: 1000
```

## Execution Limits

Every request can specify limits:

```json
{
  "limits": {
    "timeoutMs": 5000,
    "maxSteps": 500
  }
}
```

| Limit | Default | Description |
|-------|---------|-------------|
| `timeoutMs` | 5000 | Maximum execution time in milliseconds |
| `maxSteps` | 1000 | Maximum number of steps to capture |

## Sandbox Security

Every sandbox execution enforces:

- **CPU timeout** — hard kill after `timeoutMs`
- **Step limit** — stop capturing after `maxSteps`
- **Temp directory cleanup** — compiled files removed after execution

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | 8080 | HTTP port |
| `JAVA_HOME` | System default | JDK used for compilation |
