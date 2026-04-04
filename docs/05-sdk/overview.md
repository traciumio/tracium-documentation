# SDK Overview

## Purpose

The SDK exposes ecosystem capabilities to other developers, tools, CI/CD pipelines, and AI systems.

It should make it easy to:

- submit code for runtime tracing (sandbox execution)
- attach to running processes for production recording
- query, retrieve, and compare persisted UEF traces
- subscribe to real-time execution event streams
- submit repositories for structural analysis
- retrieve `UEF` or `UGF`
- embed platform behavior inside other applications
- consume AI-friendly trace representations

## Why It Matters

The SDK is how the ecosystem becomes infrastructure, not just an app.

It enables:

- external integrations and custom frontends
- CI/CD pipeline integration (trace test execution, detect regressions)
- monitoring and observability dashboards
- AI reasoning over execution data
- automation and scripting
- teaching tooling and educational platforms
- internal team debugging workflows
- trace comparison and regression detection

## SDK Responsibilities

The SDK should provide:

- typed request and response models
- session lifecycle helpers
- authentication and transport wrappers where applicable
- stable compatibility guarantees

## Delivery Modes

The SDK may evolve into multiple forms:

- language-specific client libraries
- CLI wrappers
- embedded local runtime libraries

Initial priority should be a networked client SDK that talks to engine services.

## Supported Product Surfaces

The SDK should expose at least two product families:

- runtime analysis surface backed by `CSE`
- repository analysis surface backed by `Repo Analyzer`

## Trace Store Access

The SDK must provide first-class access to the persistent trace store:

- query traces by filter (language, entrypoint, tags, time range, correlation ID)
- retrieve full traces or step ranges
- stream real-time events from active sessions
- compare two traces and retrieve diff results
- manage trace lifecycle (tag, pin, delete)

This is what makes the SDK infrastructure-grade, not just a session creation wrapper.

## Stability Strategy

The SDK should version independently, but its types must stay aligned with shared contracts such as `UEF` and `UGF`.
