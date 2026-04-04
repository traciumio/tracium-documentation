# Glossary

## CSE

`Code State Engine`, the standalone runtime intelligence engine.

## Visualization Platform

The separate application that renders runtime and static-analysis outputs for end users.

## Repo Analyzer

The standalone static-analysis engine that turns repository structure into a graph model.

## UEF

`Universal Execution Format`, the canonical runtime output contract from `CSE`.

## UGF

`Unified Graph Format`, the canonical static-analysis output contract from `Repo Analyzer`.

## State Timeline

An ordered sequence of execution steps produced by `CSE`.

## Session

A single execution or analysis run with its own inputs, outputs, metadata, and lifecycle.

## Step

A single timeline unit in an execution session. A step is typically tied to an event, source location, and state delta or snapshot.

## Event

A classified runtime or structural occurrence such as method entry, variable update, object creation, or graph edge discovery.

## Language Adapter

A language-specific execution or analysis component that converts raw language behavior into stable product contracts.

## Headless Engine

A backend component with no UI dependency. It can run as a service, library, or CLI.

## Learning Mode

A visualization experience optimized for clarity and education.

## Debugging Mode

A visualization experience optimized for runtime truth and faithful program state representation.

## Source Anchor

A stable pointer to code location metadata such as file path, class name, symbol name, line number, or span.

## Visualization API

The boundary where `UEF` and `UGF` are transformed into renderable views for the application UI.

## Workspace

An umbrella folder used to manage strategy, documentation, standards, and links to multiple product repositories or projects.

## Repo

A source-control boundary for one product, service, library, or closely related set of packages.

## Package

A build or distribution unit inside a repository.

## Library

A reusable package with no required network boundary. Libraries are typically embedded or imported by other components.

## Service

A deployable backend with a network or job boundary.

## Worker

A background execution unit for long-running or heavy tasks.

## App

A user-facing product surface such as a web or desktop application.

## SDK

A client library intended for external or internal developers integrating with the platform.

## Plugin

A host-specific extension for an existing tool or environment, such as VS Code.

## Spec

A canonical contract or schema definition used across products.

## Connector

An integration component responsible for accessing or interacting with an external system such as GitHub.

## Shared Component

A reusable component intended to be consumed by multiple products without owning a product surface itself.

## Trace Store

The persistent storage layer for UEF traces, owned by Nerva. Traces are indexed, queryable, and have configurable retention policies. The trace store is to Tracium what the commit log is to Kafka.

## Recording Mode

How a trace was captured: `sandbox` (engine launched execution), `observed` (engine attached to running process), or `replayed` (re-execution from stored trace).

## Capture Fidelity

The level of detail captured during recording: `full` (every step), `sampled` (periodic), `selective` (specific regions), `minimal` (entry/exit only).

## Correlation ID

A shared identifier that links execution traces across multiple services or processes in a distributed request. Enables assembling a complete picture from multiple independent traces.

## Execution Diffing

Comparing two execution traces to identify behavioral differences. Used for regression detection, behavior verification, and understanding the impact of code changes.

## Production Recording

The capability to attach the engine to a running process and record execution, as opposed to sandbox mode where the engine launches and controls execution.

## Attach Mode

An execution mode where the engine connects to an already-running process via debugger APIs (e.g., JDI AttachingConnector) to observe and record execution without controlling it.

## Launch Mode

An execution mode where the engine creates, controls, and terminates the target process. The default mode for sandbox execution.

## Event Stream

Real-time delivery of execution events to consumers during capture, via WebSocket or SSE. Enables live debugging and monitoring without waiting for execution to complete.

## Trace URI

A stable, addressable reference to a persisted trace or trace segment: `tracium://traces/{sessionId}/step/{stepNumber}`. Enables deep linking and sharing.
