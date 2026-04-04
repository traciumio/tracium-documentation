# IDE Plugin Overview

## Purpose

The IDE Plugin brings the ecosystem into the place where developers already work.

Its purpose is to reduce friction between writing code and understanding code.

## Core Workflows

### Runtime Workflow

- select code or file
- run with `CSE`
- inspect trace results inline or in a companion panel

### Repository Workflow

- analyze project with `Repo Analyzer`
- navigate architecture without leaving the editor
- move between graph nodes and source files

## First Target

Recommended first target:

- `VS Code`

Why:

- strong extension ecosystem
- broad developer reach
- good support for webview-based visual panels

## Plugin Responsibilities

The plugin should:

- package editor context into requests
- communicate with engine services
- render lightweight previews or launch full views
- support navigation from source anchors to platform views

## Plugin Boundaries

The plugin should not:

- duplicate execution logic from `CSE`
- duplicate parsing logic from `Repo Analyzer`
- become the primary rendering home for every visualization

Instead, it should be a workflow bridge.

## Phased Capability

Suggested progression:

1. launch runtime trace for current file or snippet
2. show selected trace steps and source-linked state
3. launch repository graph for current workspace
4. support breakpoint-aware or debug-session-linked flows

## Key UX Principle

The plugin should provide contextual power, not a crowded interface.

Inline surfaces should stay lightweight, with deeper analysis opening in focused views or panels.
