# Visualization Platform Overview

## Purpose

The Visualization Platform is the user-facing product layer.

It is a separate application that consumes structured outputs from:

- `CSE` via `UEF`
- `Repo Analyzer` via `UGF`

Its purpose is not to execute or analyze code directly. Its purpose is to turn structured intelligence into understandable experiences.

## Core Experiences

### 1. Runtime Visualization

Input:

- code snippet
- runnable file
- execution session output from `CSE`

Output:

- step-by-step playback
- stack and heap views
- object references
- control flow and current line

### 2. Repository Architecture Visualization

Input:

- repository
- project path
- analyzed structure from `Repo Analyzer`

Output:

- module maps
- class and function relationships
- dependency graphs
- architecture-level navigation

## Product Modes

The platform should support at least two runtime presentation modes.

### Learning Mode

Optimized for:

- concept clarity
- minimal cognitive overhead
- pattern emphasis
- educational storytelling

Examples:

- highlighted array swaps
- recursion unfolding
- linked-list shape views

### Debugging Mode

Optimized for:

- state accuracy
- reference truth
- step-level fidelity
- source correlation

Examples:

- real frame stacks
- precise heap identity
- true aliasing
- object field transitions

These are not separate engines. They are different views on the same structured runtime output.

## Responsibilities

The platform owns:

- editor or input surfaces
- playback controls
- panel layout
- cross-view interactions
- visual transformations
- explanation UX

The platform does not own:

- execution instrumentation
- runtime object capture
- raw repository parsing

## Input Strategy

The platform should support:

- direct code input
- imported trace files
- imported graph files
- live service-backed sessions

That flexibility allows:

- local usage
- cloud-backed usage
- IDE-driven usage
- future sharing and collaboration

## Architectural Rule

The platform must be able to swap or upgrade its rendering and UX without forcing changes to `CSE` or `Repo Analyzer`.
