# UI Architecture

## Goal

Design a frontend that can host both runtime and repository intelligence without collapsing into one overloaded view.

## Primary Screens

### Runtime Workspace

Core regions:

- code input or source panel
- playback controls
- timeline scrubber
- stack panel
- heap or structure panel
- diagnostics and output panel

### Repository Workspace

Core regions:

- repository map
- graph canvas
- filters and scopes
- symbol details panel
- navigation breadcrumbs

## Shared UI Requirements

The application should support:

- deep linking to source anchors
- keyboard navigation
- step or node selection
- preserved workspace state
- responsive layout for large and small screens

## Frontend State Layers

Recommended state categories:

- session state
- playback state
- selected entity state
- layout state
- user preference state

## Interaction Principles

- selection in one view should highlight related items in other views
- the current source anchor should be consistently visible
- debug-accurate information should always be reachable, even if learning mode simplifies the default presentation

## Suggested Initial Stack

Technology choices can change later, but the UI architecture should be prepared for:

- web-based application shell
- graph-capable visualization library
- editor component
- streaming or polling data transport from backend services

## Key Constraint

The UI should not invent state that conflicts with engine truth.

It may simplify presentation, but it must preserve the ability to inspect the underlying structured data.
