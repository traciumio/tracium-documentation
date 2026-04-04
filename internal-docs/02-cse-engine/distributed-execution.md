# Distributed Execution Model

## Purpose

This document defines how Tracium correlates execution traces across multiple services, processes, or execution contexts. Real-world systems are distributed. Single-process tracing alone cannot explain production behavior.

## Core Principle

> A single request can touch 10 services. Tracium must connect those 10 execution traces into one coherent story.

## The Problem

Today's distributed tracing (Jaeger, Zipkin, OpenTelemetry) answers:

- which services were called?
- how long did each span take?
- where did the error propagate?

But they do NOT answer:

- what was the STATE inside each service at the point of failure?
- what variables had what values when the exception was thrown?
- how did the heap change during the request processing?

Tracium adds state-level depth to distributed execution understanding.

## Correlation Model

### Correlation ID

Every trace session can carry a correlation ID that links it to other sessions:

```json
{
  "session": {
    "id": "sess_svc_a_001",
    "correlationId": "req_abc123",
    "correlationGroup": "checkout-flow",
    "parentSessionId": "sess_gateway_001",
    "serviceName": "order-service",
    "serviceVersion": "2.1.0"
  }
}
```

### Correlation Fields

- `correlationId`: shared identifier across all traces in a distributed request (equivalent to OpenTelemetry trace ID)
- `correlationGroup`: human-readable label for the distributed flow
- `parentSessionId`: the trace session that triggered this one (parent span equivalent)
- `serviceName`: which service produced this trace
- `serviceVersion`: which version of the service

### How Correlation IDs Propagate

In observed execution mode, the recording agent extracts correlation IDs from:

- HTTP request headers (e.g., `X-Correlation-ID`, `traceparent`)
- message queue metadata (e.g., Kafka headers)
- gRPC metadata
- thread-local context

The agent includes these in the UEF session metadata automatically.

## Distributed Trace Assembly

### Query by Correlation ID

```
GET /v1/traces?correlationId=req_abc123
```

Returns all trace sessions that share this correlation ID, ordered by start time:

```json
{
  "correlationId": "req_abc123",
  "sessions": [
    { "sessionId": "sess_gateway_001", "service": "api-gateway", "startedAt": "...", "totalSteps": 12 },
    { "sessionId": "sess_order_001", "service": "order-service", "startedAt": "...", "totalSteps": 89 },
    { "sessionId": "sess_payment_001", "service": "payment-service", "startedAt": "...", "totalSteps": 45 },
    { "sessionId": "sess_inventory_001", "service": "inventory-service", "startedAt": "...", "totalSteps": 23 }
  ],
  "topology": {
    "sess_gateway_001": ["sess_order_001"],
    "sess_order_001": ["sess_payment_001", "sess_inventory_001"]
  }
}
```

### Assembled Timeline

A distributed timeline interleaves steps from correlated sessions:

```
[gateway] Step 1: METHOD_ENTERED processRequest
[gateway] Step 2: METHOD_ENTERED routeToOrder
  [order] Step 1: METHOD_ENTERED handleOrder
  [order] Step 15: METHOD_ENTERED chargePayment
    [payment] Step 1: METHOD_ENTERED processCharge
    [payment] Step 8: EXCEPTION_THROWN InsufficientFunds
  [order] Step 16: EXCEPTION_CAUGHT InsufficientFunds
[gateway] Step 3: EXCEPTION_CAUGHT OrderFailed
```

## Cross-Service State Inspection

At any point in the distributed timeline, the user can inspect:

- the state of the current service (stack, heap, locals)
- the request/response data between services
- the state of the calling service at the point of the call

This is something no existing distributed tracing tool provides.

## Integration with OpenTelemetry

Tracium does not replace OpenTelemetry. It extends it.

### Relationship

```
OpenTelemetry: spans, timing, service topology (wide and shallow)
Tracium: state, variables, heap, execution path (narrow and deep)
```

### Interoperability

- Tracium can read `traceparent` headers for correlation
- Tracium traces can be linked to OpenTelemetry spans by shared trace ID
- Grafana/Jaeger shows the span; Tracium shows what happened inside the span

### Possible Integration Points

- OpenTelemetry span attribute: `tracium.sessionId = "sess_order_001"`
- click span in Jaeger -> deep link to Tracium trace for that span
- Tracium UI shows OpenTelemetry topology alongside state-level detail

## Integration with Atlas (Architecture)

Correlated traces can be overlaid on the Atlas architecture graph:

- highlight which graph nodes (services, classes, methods) were exercised in a distributed request
- show the actual execution path vs. the static dependency graph
- detect architecture violations at runtime (e.g., service A called service C directly, bypassing service B)

## Performance Considerations

Distributed recording amplifies the data volume:

- each service produces its own trace
- correlation assembly requires cross-service queries
- timeline interleaving requires timestamp synchronization

### Mitigation

- traces are stored per service, assembled on query (not pre-assembled)
- correlation index is lightweight (just session IDs and metadata)
- detailed state is loaded on demand per session, not eagerly

## Phased Implementation

### Phase 1: Correlation ID Support

- add `correlationId` field to UEF session model
- Nerva indexes traces by correlation ID
- query API returns all sessions for a correlation ID

### Phase 2: Topology Assembly

- `parentSessionId` field for call chain reconstruction
- topology graph from correlated sessions
- interleaved timeline view in Prism

### Phase 3: OpenTelemetry Integration

- read `traceparent` headers in recording agent
- link Tracium sessions to OpenTelemetry spans
- deep linking between tools

### Phase 4: Cross-Service State Inspection

- request/response data capture at service boundaries
- correlated state navigation in Prism
- Atlas overlay with runtime execution data

## What This Enables

- understand exactly what happened inside each service during a failed request
- inspect variable state across service boundaries
- detect architecture violations at runtime
- correlate execution traces with OpenTelemetry spans for full-stack debugging
- onboard developers to distributed systems by showing real request flows with state
