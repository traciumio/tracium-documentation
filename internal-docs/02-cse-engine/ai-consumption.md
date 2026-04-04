# AI Consumption Model

## Purpose

This document defines how AI systems (LLMs, reasoning engines, code assistants) consume UEF traces as a first-class use case. AI reasoning over real execution state, not just static code, is the highest-leverage long-term capability of the platform.

## Core Principle

> Today AI sees static code. With Tracium, AI sees execution: what actually happened, step by step, with real state. This is a fundamental capability unlock.

## Why This Matters

### What AI has today

- source code (static text)
- documentation (human-written, often outdated)
- error messages (partial, lossy)
- logs (unstructured, sampled)

### What Tracium gives AI

- complete execution trace (structured, ordered)
- variable state at every step (precise, machine-readable)
- heap object relationships (graph-structured)
- control flow path (actual, not inferred)
- deltas (what changed and when)

This transforms AI code understanding from "guess from static text" to "reason from actual execution."

## AI Consumption Challenges

### Challenge 1: Trace Size vs Context Window

A UEF trace can have thousands of steps. An LLM context window is finite.

### Challenge 2: State Complexity

Full heap snapshots at every step contain noise that is irrelevant to most questions.

### Challenge 3: Relevance

Most AI queries care about a specific aspect of execution, not the entire trace.

## Solutions: AI-Friendly Trace Representations

### 1. Trace Summarization

Collapse step ranges into semantic summaries:

```json
{
  "type": "summary",
  "stepRange": [1, 15],
  "description": "Initializes array with 5 elements and enters sort method",
  "keyEvents": ["OBJECT_ALLOCATED", "METHOD_ENTERED"],
  "keyState": {
    "arr": "[5, 3, 8, 1, 2]",
    "method": "sort()"
  }
}
```

Summarization levels:

- `step-level`: every step (full detail, maximum context cost)
- `method-level`: one summary per method call (balanced)
- `phase-level`: algorithmic phases (compact, highest abstraction)
- `key-events-only`: only exceptions, allocations, method entries (minimal)

### 2. Trace Segmentation

Divide traces into context-window-sized segments with overlap:

```json
{
  "traceId": "sess_001",
  "totalSegments": 5,
  "segment": 2,
  "stepRange": [20, 40],
  "overlapSteps": 3,
  "context": {
    "activeMethod": "sort()",
    "activeVariables": { "i": 1, "j": 2, "arr": "-> obj_1" },
    "callStack": ["main()", "sort()"]
  }
}
```

Each segment includes enough context to be understood independently.

### 3. Focused Trace Views

Extract only the parts relevant to a specific question:

- `variable-focused`: all steps where a specific variable changes
- `method-focused`: all steps within a specific method (including recursive calls)
- `exception-focused`: the step sequence leading to an exception
- `object-focused`: all steps involving a specific heap object

### 4. Natural Language Trace Representation

Convert UEF steps into natural language for direct LLM consumption:

```
Step 7: In method sort(), line 6: Comparing arr[0]=5 with arr[1]=3. 
        Since 5 > 3, entering swap branch.
Step 8: In method sort(), line 7: Created temp variable tmp = 5
Step 9: In method sort(), line 8: Set arr[0] = 3 (was 5)
Step 10: In method sort(), line 9: Set arr[1] = 5 (was 3). 
         Array is now [3, 5, 8, 1, 2]
```

This is a lossy but LLM-optimized representation.

## AI API Endpoints

### Summarize Trace

```
POST /v1/sessions/{id}/ai/summarize
{
  "level": "method-level",
  "maxTokens": 2000
}
```

Returns: natural language summary or structured summary objects.

### Focus Trace

```
POST /v1/sessions/{id}/ai/focus
{
  "focusType": "variable",
  "target": "result",
  "includeContext": true
}
```

Returns: filtered step sequence relevant to the target.

### Explain Step

```
POST /v1/sessions/{id}/ai/explain
{
  "step": 12,
  "contextSteps": 5,
  "question": "Why did this variable become negative?"
}
```

Returns: AI-generated explanation grounded in actual execution data.

### Ask About Trace

```
POST /v1/sessions/{id}/ai/ask
{
  "question": "What is the time complexity of this execution?",
  "includeTrace": "method-level-summary"
}
```

Returns: AI-generated answer with references to specific steps.

## Grounding Rules

AI explanations MUST be grounded in actual execution data:

- never hallucinate steps that did not occur
- always reference actual step numbers and values
- explicitly state when capture was incomplete (fidelity < full)
- distinguish between "the trace shows X" and "this likely means Y"

## AI Training Data

Persisted UEF traces become training data for:

- code explanation models (trace -> natural language)
- bug detection models (trace patterns -> defect likelihood)
- performance models (trace metrics -> optimization suggestions)
- auto-documentation (trace + code -> behavioral documentation)

### Training Data Pipeline

```
Trace Store -> Export API -> Filter/Anonymize -> Training Dataset
```

Requirements:

- traces must be exportable in bulk
- PII and sensitive data must be filterable
- export format must be standardized for ML pipelines

## Relationship to Phase 8 (Intelligence Layer)

This document defines the data model and API. Phase 8 implements the intelligence:

- semantic event enrichment (pattern recognition)
- LLM-powered explanations (natural language generation)
- runtime + architecture cross-correlation
- interactive Q&A

The AI consumption model ensures that Phase 8 has the right data substrate to build on.

## What This Enables

- AI debugging assistant: "explain why this request failed" with actual execution context
- code review with execution context: "this change causes 3 new execution paths"
- automated incident explanation: traces fed to LLM produce human-readable incident reports
- educational AI: students ask questions about execution and get answers grounded in real state
- execution-aware code generation: AI sees how code actually runs, not just how it reads
