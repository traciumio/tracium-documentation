# Design Decisions

## 1. CSE and Visualization Platform Stay Separate

Decision:

- `CSE` is a standalone headless engine
- the `Visualization Platform` is a separate consuming application

Why:

- keeps runtime capture independent from UX decisions
- allows engine reuse in SDKs, plugins, and future products
- prevents UI assumptions from polluting core execution modeling

## 2. Runtime and Static Analysis Stay Separate

Decision:

- `CSE` handles runtime execution
- `Repo Analyzer` handles static repository structure

Why:

- they solve different classes of problems
- they require different adapters and confidence models
- mixing them too early would damage clarity and maintainability

## 3. UEF Is the Primary Runtime Contract

Decision:

- `UEF` is the canonical runtime output

Why:

- creates a shared language for engine, UI, SDK, and plugins
- allows multiple visual experiences from one truth source
- makes long-term language expansion realistic

## 4. UGF Is the Primary Static Contract

Decision:

- `UGF` is the canonical repository-analysis output

Why:

- keeps static outputs consistent across analyzers and consumers
- avoids UI-coupled graph structures
- supports platform growth beyond one visualizer

## 5. Truth-First Engine, Simplified Visuals Later

Decision:

- the engine models execution truth
- simplification happens in the visualization layer

Why:

- supports both learning mode and debugging mode
- avoids losing crucial aliasing and identity information
- preserves trust in the system

## 6. Java and JDI First

Decision:

- initial runtime implementation targets Java using `JDI`

Why:

- strong debugger integration
- clear stack and heap semantics
- practical path to a robust first engine

## 7. Repo Analyzer Is a Parallel Strategic Track

Decision:

- repository analysis is part of the product strategy early, not a distant add-on

Why:

- repository architecture understanding is central to the user vision
- it opens a second major product surface beyond snippet visualization
- it strengthens the future IDE and SDK platform story

## 8. SDK and IDE Plugin Are Platform Multipliers

Decision:

- plugin and SDK development follow once engine contracts and core analyzers stabilize

Why:

- they multiply product reach
- they turn the system into an ecosystem
- they create leverage for adoption and extensibility

## 9. Final-Quality Foundation Over Feature Explosion

Decision:

- prioritize stable contracts and architecture over trying to solve every use case immediately

Why:

- execution engines fail when built without boundaries
- early overreach creates fragile internals
- a strong foundation is the fastest route to a serious final product

## 10. Tracium Engine Is an Execution Recording System, Not Just a Sandbox Runner

Decision:

- the engine must support both controlled execution (sandbox) and observation of existing execution (agent-based instrumentation)
- UEF traces are persistent, queryable artifacts, not ephemeral visualization input
- execution becomes data that outlives the session that created it

Why:

- sandbox-only execution limits the platform to toy snippets and learning tools
- recording real execution from running systems is what makes this infrastructure, not a visualizer
- persistent traces enable replay, comparison, querying, and AI reasoning long after execution ends
- this is the difference between a cool project and a Kafka-level system

Implications:

- JDI adapter must support attach mode (observe running JVM), not just launch mode (sandbox execution)
- Nerva must include a trace store with indexing and retention policies
- SDK must support querying historical traces, not just creating new ones
- UEF must include metadata for recording context (sandbox vs observed, sampling level, capture fidelity)

## 11. UEF Traces Are Persistent and Queryable

Decision:

- UEF traces are stored as durable artifacts with identity, indexing, and lifecycle management
- traces can be queried by session, time range, event type, symbol, and custom tags
- the system maintains a trace store as core infrastructure, not an optional add-on

Why:

- ephemeral traces that disappear after viewing provide no compounding value
- persistent traces enable: regression comparison, onboarding walkthroughs, incident replay, AI training data
- queryability is what transforms execution data from logs into intelligence
- this is the "Kafka log" equivalent: append-only, replayable, queryable

Implications:

- Nerva owns trace storage and indexing
- retention policies must be configurable (time-based, size-based, explicit keep)
- traces must be addressable by stable URI for sharing and deep linking
- SDK exposes query and retrieval, not just session creation

## 12. Execution Streaming Is a First-Class Capability

Decision:

- execution events can be streamed in real-time to consumers during capture
- the system supports both batch mode (complete trace after execution) and streaming mode (events as they happen)
- consumers can subscribe to live execution sessions

Why:

- batch-only limits the system to post-hoc analysis
- streaming enables: live debugging, real-time monitoring, progressive UI loading, event-driven pipelines
- this is what makes the system embeddable in CI/CD, monitoring, and live debugging workflows

Implications:

- engine must emit events as a stream, not only as a final document
- Nerva must support WebSocket or SSE subscriptions for live sessions
- UEF must be appendable (already designed this way) and consumable incrementally
- SDK must expose streaming client in addition to request/response

## 13. The Platform Must Support Distributed Execution Correlation

Decision:

- traces from different services, processes, or execution contexts can be correlated through shared identifiers
- the system supports a correlation model for multi-service execution understanding

Why:

- real-world systems are distributed; single-process tracing alone cannot explain production behavior
- correlation enables: request-level tracing across microservices, understanding cascading failures, mapping execution to architecture
- this is what makes Tracium relevant to backend teams, not just students

Implications:

- UEF must support a correlation ID field (request ID, trace ID) for cross-session linking
- Nerva must support grouped session queries (all traces for a given correlation ID)
- Atlas (repo analyzer) can map correlated traces to architecture graph nodes
- this aligns with OpenTelemetry concepts but goes deeper (state-level, not span-level)

## 14. AI Consumes Execution Data as a First-Class Use Case

Decision:

- AI and LLM consumption of UEF traces is a primary design consideration, not an afterthought
- the system must support efficient AI-friendly trace representations

Why:

- AI that can reason over real execution state (not just static code) is a fundamental capability unlock
- execution traces are training data, reasoning context, and explanation substrate
- this is the highest-leverage long-term use case for the platform

Implications:

- UEF must support summarization layers (step ranges collapsed into semantic summaries)
- traces must be segmentable for context window management
- the system should support trace-to-natural-language explanation pipelines
- SDK must expose AI-friendly endpoints (summarized traces, filtered views, semantic queries)
