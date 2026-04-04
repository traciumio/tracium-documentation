# Documentation Index

This documentation system turns the product direction into an engineering-ready foundation.

The ecosystem is intentionally split into separate products:

- `CSE` (`Code State Engine`): headless runtime intelligence engine
- `Visualization Platform`: end-user app that consumes runtime and static-analysis outputs
- `Repo Analyzer`: static code intelligence engine for repository structure and architecture graphs
- `SDK`: developer-facing access layer for external integrations
- `IDE Plugin`: workflow integration layer for editors and IDEs

Core design rule:

`CSE` and the `Visualization Platform` are not the same project. The visualizer consumes engine outputs, but it does not own execution logic.

Primary contracts:

- `UEF` (`Universal Execution Format`): runtime state timeline contract from `CSE`
- `UGF` (`Unified Graph Format`): static structure graph contract from `Repo Analyzer`

Recommended reading order:

1. [Product Vision](./00-overview/vision.md)
2. [Glossary](./00-overview/glossary.md)
3. [System Overview](./01-architecture/system-overview.md)
4. [Tracium Workspace](./01-architecture/tracium-workspace.md)
5. [Ecosystem Component Map](./01-architecture/ecosystem-component-map.md)
6. [Repository Strategy](./01-architecture/repository-strategy.md)
7. [UEF Schema](./07-uef-spec/schema.md)
8. [CSE Overview](./02-cse-engine/overview.md)
9. [Visualization Platform Overview](./03-visualization-platform/overview.md)
10. [Repo Analyzer Overview](./04-repo-analyzer/overview.md)
11. [Repo Analyzer Access And Ingestion](./04-repo-analyzer/access-and-ingestion.md)
12. [TraciumDB — Embedded Storage Engine](./02-cse-engine/traciumdb.md)
13. [Roadmap](./08-roadmap/roadmap.md)
14. [Production Roadmap v2](./08-roadmap/roadmap-v2-production.md)
15. [Design Decisions](./09-design-decisions/decisions.md)

What this docs set solves:

- Defines the product clearly before implementation begins
- Keeps runtime visualization and repo visualization separate but interoperable
- Establishes stable contracts that future architecture and code can follow
- Creates a contributor-friendly starting point for a serious long-term project
