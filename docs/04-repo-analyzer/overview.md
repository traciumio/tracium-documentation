# Repo Analyzer Overview

## Purpose

`Repo Analyzer` is the static-analysis counterpart to `CSE`.

Its purpose is to transform a repository into a structured architectural graph that can be explored visually and programmatically.

## Why It Is Separate

Runtime execution and repository architecture are fundamentally different analysis problems.

`CSE` answers:

- what happened when the code ran

`Repo Analyzer` answers:

- how the codebase is organized
- which symbols depend on each other
- where architectural boundaries appear

Keeping them separate avoids contaminating runtime truth with speculative static inference.

## Core Responsibilities

`Repo Analyzer` should:

- parse repository contents
- build symbol tables
- resolve imports and dependencies
- infer module and package relationships
- construct call and dependency graphs
- emit `UGF`

## Access Model

`Repo Analyzer` should support two analysis approaches through one engine.

### 1. Local Workspace Analysis

The user analyzes a repository that is already available locally through the Visualization Platform or IDE workflow.

Examples:

- open local folder and analyze it
- select current workspace in the app
- analyze the project currently opened in the IDE

Why it matters:

- fastest path to implementation
- easiest privacy story
- strong developer workflow
- no GitHub integration required

### 2. GitHub-Connected Analysis

The user connects a GitHub account or installs a GitHub App and analyzes a remote repository, including private repositories they have access to.

Examples:

- connect GitHub and select a repo from an account
- analyze a private repo without manually uploading code
- re-run analysis automatically when the default branch changes

Why it matters:

- makes the product useful beyond local development
- unlocks team and cloud workflows
- supports private codebases with managed access

Important rule:

These are two ingestion modes for the same `Repo Analyzer`, not two different analyzers.

## Supported Questions

The analyzer should eventually help users answer:

- what are the main modules in this repo
- how do components call each other
- which package is central or highly coupled
- where are likely boundaries and layers
- how can I navigate from architecture to code

## Language Strategy

Architecture is language-dependent, so the analyzer must use per-language parsers behind a common contract.

Recommended order:

1. Java
2. JavaScript or TypeScript
3. Python
4. C++

Even if runtime execution starts with Java only, the graph contract should be designed to expand.

## Output Contract

The primary output is `UGF` (`Unified Graph Format`).

`UGF` is designed for:

- graph rendering
- programmatic querying
- IDE navigation
- future architecture insights and AI explanation

## Scope Boundaries

The analyzer should support multiple graph layers over time:

- filesystem and package structure
- symbol dependency graph
- call graph
- architecture groupings

Initial versions should clearly label what is exact, inferred, or incomplete.
