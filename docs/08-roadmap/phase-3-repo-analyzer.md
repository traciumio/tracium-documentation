# Phase 3: Repo Analyzer First-Class Track (Atlas)

**Status:** PLANNED
**Products Involved:** Atlas, Quanta, Prism (graph views)
**Tech Stack:** Java 21, Gradle
**Depends On:** Phase 0 (can run parallel to Phase 1/2)

---

## Objective

Build the static code intelligence engine that can ingest local repositories, parse their structure, build symbol tables and dependency/call graphs, and emit UGF-compliant output. Add architecture-focused graph views to Prism.

---

## Sub-Tasks Breakdown

### 3.1 Project Scaffolding

- [ ] Set up Gradle multi-module build (`atlas-core`, `atlas-java-analyzer`, `atlas-service`)
- [ ] Configure Java 21 compiler settings
- [ ] Set up test framework and test fixtures (sample repositories)
- [ ] Create CI build pipeline

### 3.2 Quanta Integration - UGF Models

- [ ] Implement Java data classes for UGF node types:
  - [ ] Repository node
  - [ ] Module node
  - [ ] Package/Namespace node
  - [ ] Class/Type node
  - [ ] Method/Function node
- [ ] Implement Java data classes for UGF edge types:
  - [ ] DECLARES
  - [ ] IMPORTS
  - [ ] DEPENDS_ON
  - [ ] CALLS
  - [ ] IMPLEMENTS
  - [ ] EXTENDS
  - [ ] OWNS
- [ ] Implement certainty level model (high, medium, low)
- [ ] Implement UGF JSON serializer/deserializer
- [ ] Write schema validation tests

### 3.3 Repository Ingestion

- [ ] Define `AnalysisRequest` model (language, source, analysis mode)
- [ ] Implement local filesystem connector:
  - [ ] Directory traversal
  - [ ] File type detection
  - [ ] Gitignore-aware filtering
  - [ ] Binary file exclusion
- [ ] Implement source file inventory:
  - [ ] Language detection per file
  - [ ] File count and size metrics
  - [ ] Module/package structure detection
- [ ] Implement ingestion pipeline (scan -> filter -> index -> analyze)

### 3.4 Java Parser Pipeline

- [ ] Implement Java source parser (using Eclipse JDT or JavaParser):
  - [ ] Package declaration extraction
  - [ ] Import statement extraction
  - [ ] Class/interface/enum declaration extraction
  - [ ] Method declaration extraction
  - [ ] Field declaration extraction
- [ ] Build Abstract Syntax Tree (AST) per file
- [ ] Extract source anchors for all symbols

### 3.5 Symbol Inventory

- [ ] Build global symbol table:
  - [ ] Fully qualified class names
  - [ ] Method signatures
  - [ ] Field declarations
  - [ ] Constant/enum values
- [ ] Resolve symbol references:
  - [ ] Import resolution
  - [ ] Type resolution
  - [ ] Method call resolution
- [ ] Track symbol visibility (public, protected, private, package)
- [ ] Track symbol metadata (static, abstract, final, etc.)

### 3.6 Dependency Extraction

- [ ] Package-level dependency analysis:
  - [ ] Which packages import from which
  - [ ] Coupling metrics per package
- [ ] Class-level dependency analysis:
  - [ ] Field type dependencies
  - [ ] Method parameter/return type dependencies
  - [ ] Inheritance dependencies (extends, implements)
  - [ ] Annotation dependencies
- [ ] Module-level dependency analysis:
  - [ ] Cross-module references
  - [ ] Module boundary detection

### 3.7 Call Graph Construction

- [ ] Static call graph builder:
  - [ ] Direct method invocations
  - [ ] Constructor calls
  - [ ] Static method calls
  - [ ] Super method calls
- [ ] Confidence annotation:
  - [ ] High: direct static calls
  - [ ] Medium: interface method calls (known implementations)
  - [ ] Low: reflection, dynamic dispatch uncertainty
- [ ] Call graph metrics:
  - [ ] Fan-in / fan-out per method
  - [ ] Depth of call chains
  - [ ] Recursive call detection

### 3.8 Architecture Grouping

- [ ] Automatic layer detection:
  - [ ] Package naming conventions (controller, service, repository, model)
  - [ ] Annotation-based detection (@Controller, @Service, etc.)
- [ ] Module boundary inference
- [ ] Cyclic dependency detection
- [ ] Centrality analysis (most-depended-on components)

### 3.9 UGF Emission

- [ ] Construct full graph from symbol table + dependencies + call graph
- [ ] Serialize to UGF JSON format
- [ ] Attach certainty levels to all edges
- [ ] Include source anchors for all nodes
- [ ] Validate output against UGF JSON Schema
- [ ] Write golden-file tests

### 3.10 Atlas Service Layer

- [ ] Implement analysis session management
- [ ] Implement request validation
- [ ] Implement async analysis execution
- [ ] Implement session status tracking
- [ ] Implement result retrieval API
- [ ] Implement health check endpoint

### 3.11 Prism - Repository Workspace Views

- [ ] UGF data layer (parser, store, navigation)
- [ ] Repository map view (file tree with metrics)
- [ ] Package dependency graph (interactive)
- [ ] Class relationship diagram
- [ ] Call graph explorer
- [ ] Symbol detail panel (click node -> see details)
- [ ] Graph filtering (by package, by type, by coupling)
- [ ] Navigation breadcrumbs
- [ ] Search within graph nodes

### 3.12 Testing & Validation

- [ ] Unit tests for Java parser
- [ ] Unit tests for symbol table construction
- [ ] Unit tests for dependency extraction
- [ ] Unit tests for call graph builder
- [ ] Integration tests with sample Java repositories:
  - [ ] Single-package project
  - [ ] Multi-package project
  - [ ] Multi-module Gradle project
  - [ ] Spring Boot application structure
- [ ] Golden file tests: known repos produce expected UGF
- [ ] Prism graph rendering tests

---

## Sample Test Repositories

| Repository | Purpose |
|-----------|---------|
| `simple-calculator` | Single class, basic methods |
| `todo-app` | Multi-package, MVC pattern |
| `library-system` | Inheritance hierarchies, interfaces |
| `microservices-sample` | Multi-module, cross-module dependencies |

---

## Exit Criteria

- User can submit a local Java repository and receive a UGF graph
- Symbol inventory is complete and accurate for Java
- Dependency graph captures package, class, and method-level relationships
- Call graph captures static calls with confidence levels
- Prism renders interactive architecture views from UGF
- Works correctly on at least 4 sample repository types
