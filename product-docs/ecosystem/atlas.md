# Atlas <Badge type="warning" text="Planned" />

Atlas is the static code intelligence engine. It will parse repositories, build symbol tables, resolve dependencies, and emit UGF (Unified Graph Format) for architecture visualization.

## Planned Capabilities

- Java source parsing via AST
- Symbol inventory (classes, methods, fields)
- Dependency extraction (package, class, method level)
- Call graph construction with confidence levels
- Architecture grouping and layer detection
- UGF emission

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Java |
| Parser | Eclipse JDT or JavaParser |
| Output | UGF (JSON) |
