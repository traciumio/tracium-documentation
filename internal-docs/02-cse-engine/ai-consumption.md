# AI Consumption Model

## Purpose

This document covers the AI-facing trace utilities that currently exist in the engine.

Important framing:

- the engine does not ship an external LLM runtime by itself
- the current AI layer is a deterministic trace-transformation layer
- its job is to make execution traces easier for AI systems and human consumers to use

## Current Components

The current AI layer in `engine-core` contains:

- `TraceCompressor`
- `TraceFocuser`
- `NaturalLanguageConverter`
- `SummarizationLevel`

The current REST surface is owned by `AiConsumptionController`.

## Current Endpoints

- `POST /v1/sessions/runtime/{sessionId}/ai/summarize`
- `POST /v1/sessions/runtime/{sessionId}/ai/focus`
- `POST /v1/sessions/runtime/{sessionId}/ai/explain`
- `GET /v1/sessions/runtime/{sessionId}/ai/narrative`

There is no general `/ask` endpoint in the current engine-service.

## Summarization

`TraceCompressor` supports these levels:

- `STEP_LEVEL`
- `METHOD_LEVEL`
- `PHASE_LEVEL`
- `KEY_EVENTS_ONLY`

The output is a compressed trace made of structured segments rather than raw UEF steps.

This is useful for:

- LLM context reduction
- UI summaries
- quick execution review

## Focused Views

`TraceFocuser` currently supports:

- variable-focused views
- method-focused views
- exception-focused views
- object-focused views

This is useful when the caller only cares about a narrow slice of the execution.

## Natural Language Conversion

`NaturalLanguageConverter` supports:

- per-step conversion
- step-range conversion
- full-trace narrative summaries

This is currently deterministic text generation from trace structure, not a generative model call.

## Current Explain Behavior

`/ai/explain` currently accepts a step range and returns a natural-language description of that range.

It does not currently:

- answer arbitrary questions
- perform retrieval against external sources
- run a hosted model

## Grounding

The current AI layer is grounded directly in recorded execution state.

That means:

- it only transforms captured trace data
- it should respect capture fidelity and missing data
- it should not invent steps that are not present

## Relationship to the UI

The embedded UI exposes these helpers under the AI Studio concept, but the underlying capability is still the engine's trace-transformation layer.

## Caveats

- output quality is bounded by trace quality and capture fidelity
- these helpers are strongest for compact traces and focused analysis
- this is not yet a full conversational AI system over traces
