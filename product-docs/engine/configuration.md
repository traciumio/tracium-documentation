# Configuration

## Service Configuration

The main service configuration lives in:

`engine-service/src/main/resources/application.yml`

## Core Service Settings

```yaml
server:
  port: ${PORT:8080}

tracium:
  engine:
    default-timeout-ms: ${DEFAULT_TIMEOUT:5000}
    default-max-steps: ${DEFAULT_MAX_STEPS:1000}
    data-dir: ${DATA_DIR:./data/traciumdb}
    journal-dir: ${JOURNAL_DIR:./data/journals}
    cors-origins: ${CORS_ORIGINS:*}

  security:
    enabled: ${AUTH_ENABLED:false}
    api-key: ${API_KEY:tracium-default-key}
```

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | HTTP port |
| `DEFAULT_TIMEOUT` | `5000` | Default runtime timeout in ms |
| `DEFAULT_MAX_STEPS` | `1000` | Default runtime step cap |
| `DATA_DIR` | `./data/traciumdb` | TraciumDB root directory |
| `JOURNAL_DIR` | `./data/journals` | Journal directory reserved for journal-based flows |
| `CORS_ORIGINS` | `*` | Allowed origins |
| `AUTH_ENABLED` | `false` | Enables API-key auth |
| `API_KEY` | `tracium-default-key` | Expected `X-API-Key` value when auth is enabled |
| `LOG_LEVEL` | `INFO` | App logging level for `io.tracium` |

## Request-Level Execution Limits

Every runtime request can provide `ExecutionLimits`.

Current fields:

- `timeoutMs`
- `maxSteps`
- `maxHeapMb`
- `allowNetwork`
- `allowFileWrite`

Example:

```json
{
  "limits": {
    "timeoutMs": 5000,
    "maxSteps": 1000,
    "maxHeapMb": 64,
    "allowNetwork": false,
    "allowFileWrite": false
  }
}
```

## Attach Configuration

Attach mode is configured per request or via the standalone agent.

Useful request fields include:

- `host`
- `port`
- `strategy`
- `includePackages`
- `correlationId`

The agent adds CLI-level config for:

- reconnect behavior
- sampling defaults
- output directory

## API Authentication

When `AUTH_ENABLED=true`:

- `/v1/**` endpoints require authentication
- send `X-API-Key: <your key>`

Public endpoints still include:

- runtime health
- swagger docs
- actuator endpoints
- static UI files

## Observability and Docs

The service also enables:

- actuator endpoints
- Prometheus metrics registry
- Swagger / OpenAPI docs

Current paths:

- `/actuator`
- `/v3/api-docs`
- `/swagger-ui.html`

## Logging

Logging is controlled mainly through `LOG_LEVEL`.

The service currently uses structured logging dependencies and Spring Boot logging configuration.

## Advanced Storage / Scaling Components

The repository also contains:

- `AsyncWriteQueue`
- `RetentionPolicy`
- `SamplingEngine`
- `CircuitBreaker`

These are useful to know about, but they are not currently configured as default service toggles through `application.yml`.
