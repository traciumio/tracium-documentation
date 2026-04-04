# Error Codes

All errors return structured JSON:

```json
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "No session with ID sess_999"
  }
}
```

## Engine Errors

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `INVALID_REQUEST` | Malformed request body |
| 400 | `UNSUPPORTED_LANGUAGE` | Language not available |
| 404 | `SESSION_NOT_FOUND` | Session ID doesn't exist |
| 409 | `SESSION_STILL_RUNNING` | Trace not yet available |
| 422 | `COMPILE_FAILURE` | Code failed to compile |
| 500 | `EXECUTION_FAILED` | Unexpected runtime error |
| 503 | `CAPACITY_EXCEEDED` | Too many concurrent sessions |

## Nerva Errors

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `INVALID_REQUEST` | Invalid session request |
| 404 | `TRACE_NOT_FOUND` | No persisted trace for ID |
| 502 | `ENGINE_UNREACHABLE` | Cannot reach Tracium Engine |
| 502 | `ENGINE_ERROR` | Engine returned unexpected response |
