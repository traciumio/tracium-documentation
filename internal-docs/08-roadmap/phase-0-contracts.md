# Phase 0: Documentation & Contracts

**Status:** COMPLETE
**Products Involved:** Quanta (specs), Tracium Workspace (docs)
**Duration:** Foundation phase

---

## Objective

Establish the intellectual and architectural foundation before writing any product code. Every contract, boundary, and design decision documented here becomes the stable target for all future implementation.

---

## Sub-Tasks Breakdown

### 0.1 Product Vision & Strategy

- [x] Define the core problem (runtime understanding + structural understanding)
- [x] Define the two intelligence tracks (dynamic + static)
- [x] Document the product ecosystem (7 products)
- [x] Establish product naming (Tracium, Quanta, Atlas, Nerva, Prism, Vector, Pulse)
- [x] Write product overview document

### 0.2 Architecture Boundaries

- [x] Define component types (SPEC, SERVICE, APP, SDK, PLUGIN)
- [x] Map technology choices per component
- [x] Establish repository topology (monorepo workspace + product folders)
- [x] Document inter-product communication model
- [x] Define what each product owns vs. does NOT own

### 0.3 UEF (Universal Execution Format) Specification

- [x] Define top-level session model
- [x] Define step model (step, event, source, delta, state)
- [x] Define state model (frames, heap, globals, stdout/stderr)
- [x] Define value kinds (primitive, null, reference, object, array, collection, symbolic)
- [x] Define delta model (frameChanges, heapChanges)
- [x] Define event taxonomy (core + optional semantic events)
- [x] Define diagnostics model
- [x] Establish versioning policy (semver)
- [x] Create JSON Schema for UEF

### 0.4 UGF (Unified Graph Format) Specification

- [x] Define graph node types (repository, module, package, class, method)
- [x] Define edge types (DECLARES, IMPORTS, DEPENDS_ON, CALLS, IMPLEMENTS, EXTENDS, OWNS)
- [x] Define certainty levels (high, medium, low)
- [x] Establish versioning policy

### 0.5 Design Decisions

- [x] Document all 9 core design rules
- [x] CSE and Visualization stay separate
- [x] Runtime and static analysis stay separate
- [x] UEF is primary runtime contract
- [x] UGF is primary static contract
- [x] Truth-first engine, simplified visuals later
- [x] Java and JDI first
- [x] Repo Analyzer is parallel strategic track
- [x] SDK and IDE Plugin are platform multipliers
- [x] Final-quality foundation over feature explosion

### 0.6 Roadmap & Planning

- [x] Define phase order and dependencies
- [x] Document priority rationale
- [x] Create detailed per-phase roadmaps

---

## Deliverables

| Deliverable | Location |
|-------------|----------|
| Product Overview | `docs/00-overview/` |
| Architecture Doc | `docs/01-architecture/` |
| CSE Engine Doc | `docs/02-cse-engine/` |
| Visualization Doc | `docs/03-visualization-platform/` |
| Repo Analyzer Doc | `docs/04-repo-analyzer/` |
| SDK Doc | `docs/05-sdk/` |
| IDE Plugin Doc | `docs/06-ide-plugin/` |
| UEF Spec | `docs/07-uef-spec/` |
| Roadmap | `docs/08-roadmap/` |
| Design Decisions | `docs/09-design-decisions/` |
| UEF Schema | `quanta/schemas/` |
| UGF Schema | `quanta/schemas/` |

---

## Exit Criteria

- All product boundaries documented
- UEF and UGF schemas defined and versioned
- Design decisions locked and rationale recorded
- Phase 1 can begin without ambiguity
