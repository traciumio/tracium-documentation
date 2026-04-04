# Tracium Engine

Tracium Engine (CSE — Code State Engine) is the execution recording core. It compiles Java code, launches a JVM with JDI attached, and captures every execution step into a UEF trace.

## Modules

```
tracium-engine/
  engine-core/              # State model, timeline, UEF serializer
  engine-java-jdi-adapter/  # Java execution via JDI
  engine-service/           # Spring Boot REST API
```

- **engine-core** — language-agnostic. Owns the state model, timeline engine, and UEF serializer.
- **engine-java-jdi-adapter** — Java-specific. Compiles source, launches JVM, attaches JDI, captures events.
- **engine-service** — Spring Boot application with REST endpoints.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Java 26 |
| Framework | Spring Boot 4.0.5 |
| Build | Gradle 9.4.1 |
| Debugger | JDI (Java Debug Interface) |
| Serialization | Jackson |

## Running

```bash
cd tracium-engine
./gradlew :engine-service:bootRun
```

Starts on `http://localhost:8080`.

## What It Captures

For every execution step:

- Stack frames (method name, declaring type, local variables, parameters)
- Heap objects (fields, array elements, reference graph)
- State deltas (before/after values for every mutation)
- Event type (VARIABLE_ASSIGNED, OBJECT_ALLOCATED, FIELD_UPDATED, etc.)
- Source anchor (file, symbol, line number)
