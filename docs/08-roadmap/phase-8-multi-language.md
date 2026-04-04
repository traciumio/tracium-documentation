# Phase 8: Multi-Language Expansion

**Status:** FUTURE
**Products Involved:** Tracium Engine, Atlas, Quanta, Prism
**Tech Stack:** Per-language adapters
**Depends On:** Phase 7

---

## Objective

Expand the platform from Java-only to support Python, JavaScript/TypeScript, and groundwork for C++. Each language gets both a runtime adapter (CSE) with launch + attach modes and a static analyzer (Atlas).

---

## Sub-Tasks Breakdown

### 8.1 Language Adapter Architecture

- [ ] Formalize `ExecutionAdapter` plugin interface (launch + attach)
- [ ] Formalize `LanguageAnalyzer` plugin interface
- [ ] Adapter capability declaration (supported modes, fidelity levels)
- [ ] Update capabilities API

### 8.2 Python Runtime Adapter

- [ ] Launch mode via `sys.settrace` or `debugpy`
- [ ] Attach mode via `debugpy` remote attach
- [ ] Python types to UEF value kinds mapping
- [ ] Recording strategy support (full, method-boundary, breakpoint)
- [ ] Golden file tests

### 8.3 Python Static Analyzer

- [ ] AST parsing and symbol extraction
- [ ] Import graph and dependency analysis
- [ ] UGF emission

### 8.4 JavaScript/TypeScript Runtime Adapter

- [ ] Launch mode via Node.js inspector
- [ ] Attach mode via Chrome DevTools Protocol (CDP)
- [ ] JS types to UEF value kinds mapping
- [ ] Async/await and event loop handling
- [ ] Golden file tests

### 8.5 JavaScript/TypeScript Static Analyzer

- [ ] TypeScript compiler API parsing
- [ ] Module/dependency extraction
- [ ] UGF emission

### 8.6 C++ Groundwork

- [ ] Feasibility study for LLDB/GDB backends
- [ ] Prototype basic execution capture
- [ ] Document limitations

### 8.7 Prism Multi-Language Support

- [ ] Language-aware syntax highlighting
- [ ] Language-specific value rendering

---

## Exit Criteria

- Python adapter produces valid UEF in both launch and attach modes
- JS/TS adapter produces valid UEF in both launch and attach modes
- All existing infrastructure (persistence, streaming, querying) works with new languages
