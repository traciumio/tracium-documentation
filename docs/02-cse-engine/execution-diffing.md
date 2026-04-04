# Execution Diffing and Comparison

## Purpose

This document defines how Tracium compares execution traces, enabling regression detection, behavior verification, and execution versioning. Execution diffing is the "git diff for execution" -- it answers "what changed between these two runs?"

## Core Principle

> If execution is data, then two executions can be compared like two documents. The diff is the insight.

## Comparison Types

### 1. Same Code, Different Runs

Compare two executions of the same code to detect nondeterminism or environmental differences.

Use cases:

- "this test passed locally but failed in CI -- what differed in execution?"
- "is this function deterministic?"
- verify execution reproducibility

### 2. Different Code Versions, Same Input

Compare execution before and after a code change to understand behavioral impact.

Use cases:

- "my refactor should not change behavior -- did it?"
- "what exactly changed in execution after this commit?"
- regression detection: "this bug fix changed 3 execution paths"

### 3. Same Code, Different Inputs

Compare execution with different inputs to understand code behavior patterns.

Use cases:

- "how does the sort behave with 10 elements vs 1000?"
- "what path does the algorithm take for edge cases?"
- educational: show how input affects execution

### 4. Cross-Service Correlation Diff

Compare the execution path of a request across different trace sessions.

Use cases:

- "why did this request take 3x longer than usual?"
- "which service diverged from the expected call pattern?"

## Diff Model

### Trace Alignment

Before diffing, traces must be aligned. Alignment strategies:

- `step-number`: align by step index (simple, works for deterministic same-code runs)
- `source-anchor`: align by source location (works across code versions)
- `method-boundary`: align by method entry/exit sequence (coarse but robust)
- `event-sequence`: align by event type pattern (semantic alignment)

### Diff Output Structure

```json
{
  "diffVersion": "0.1.0",
  "baseline": {
    "sessionId": "sess_001",
    "label": "before-refactor"
  },
  "comparison": {
    "sessionId": "sess_002",
    "label": "after-refactor"
  },
  "alignment": "source-anchor",
  "summary": {
    "totalStepsBaseline": 47,
    "totalStepsComparison": 52,
    "matchedSteps": 40,
    "addedSteps": 12,
    "removedSteps": 7,
    "changedSteps": 5
  },
  "differences": [
    {
      "type": "step_changed",
      "baselineStep": 12,
      "comparisonStep": 14,
      "source": { "file": "Main.java", "line": 7 },
      "changes": {
        "variableDiffs": [
          {
            "name": "result",
            "baseline": { "kind": "primitive", "type": "int", "value": 5 },
            "comparison": { "kind": "primitive", "type": "int", "value": 8 }
          }
        ]
      }
    },
    {
      "type": "step_added",
      "comparisonStep": 20,
      "source": { "file": "Validator.java", "line": 15 },
      "event": "METHOD_ENTERED",
      "note": "New validation step not present in baseline"
    }
  ]
}
```

### Diff Categories

- `step_matched`: same event, same state at aligned position
- `step_changed`: same event location, different state values
- `step_added`: exists in comparison but not in baseline
- `step_removed`: exists in baseline but not in comparison
- `path_diverged`: execution took a different branch
- `exception_diff`: different exception behavior

## Comparison API

### Create Comparison

```
POST /v1/comparisons
{
  "baseline": "sess_001",
  "comparison": "sess_002",
  "alignment": "source-anchor",
  "options": {
    "ignoreLineChanges": true,
    "ignoreTimestamps": true,
    "focusMethods": ["processOrder", "calculateTotal"]
  }
}
```

### Retrieve Comparison

```
GET /v1/comparisons/{comparisonId}
GET /v1/comparisons/{comparisonId}/summary
GET /v1/comparisons/{comparisonId}/differences?type=step_changed
```

## Execution Versioning

Traces can be tagged with version metadata to enable version-aware comparisons:

```json
{
  "tags": {
    "codeVersion": "abc123",
    "branch": "feature/validation",
    "testSuite": "integration",
    "buildNumber": "142"
  }
}
```

This enables:

- "compare execution of this test between commit A and commit B"
- "show me how this function's execution changed across the last 5 releases"
- regression dashboards: "which code changes caused execution differences?"

## Diff Visualization in Prism

- side-by-side trace view (baseline left, comparison right)
- aligned timeline with diff markers
- highlighted added/removed/changed steps
- variable value comparison at each aligned step
- execution path overlay (where did execution diverge?)

## What This Enables

- automated regression detection in CI/CD ("this PR changed execution behavior")
- performance comparison ("this version takes 30% more steps")
- behavior verification ("refactor did not change functional behavior")
- incident investigation ("what differs between the working and broken trace?")
- educational comparison ("see how bubble sort vs merge sort execute differently")
