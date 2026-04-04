# Rendering Model

## Goal

The rendering layer transforms structured contracts into visual models suitable for UI components and animation systems.

It should never depend on raw debugger or parser internals.

## Input Contracts

Runtime inputs:

- `UEF`

Static inputs:

- `UGF`

## Render Pipeline

1. Ingest contract payload
2. Normalize into internal view models
3. Resolve layout data
4. Apply interaction state
5. Render scene or panel views

## Runtime Views

Recommended runtime visual views:

- source view
- timeline view
- stack frames
- heap explorer
- object relation graph
- stdout or diagnostics panel

## Structure Views

Recommended repository visual views:

- module graph
- package tree
- call graph
- dependency graph
- symbol details panel

## Render Model Principles

The render model should:

- preserve stable IDs across updates
- avoid duplicating business logic from engine layers
- support animation between states
- separate layout metadata from semantic metadata

## Educational Derivations

The rendering layer may derive simplified teaching visuals from `UEF`.

Examples:

- array as boxes
- recursion as a tree
- linked list as connected nodes

These derivations must remain traceable back to the original runtime entities.

## Cross-Linking

The rendering layer should support cross-links between:

- source anchors
- stack frames
- heap objects
- graph nodes

This is especially important when the platform combines runtime and repo analysis in one session.
