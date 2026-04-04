# UGF Output Format

## Purpose

`UGF` (`Unified Graph Format`) is the canonical output of `Repo Analyzer`.

Its role is similar to `UEF`, but for static structure rather than runtime state.

## Design Goals

`UGF` should be:

- language-agnostic at the contract level
- source-anchor aware
- graph-tool friendly
- versioned
- explicit about certainty and inference

## Top-Level Shape

```json
{
  "ugfVersion": "0.1.0",
  "graph": {
    "id": "repo_graph_001",
    "kind": "architecture",
    "nodes": [],
    "edges": [],
    "groups": [],
    "diagnostics": []
  }
}
```

## Node Model

```json
{
  "id": "method:com.example.UserService.createUser",
  "kind": "method",
  "label": "createUser",
  "language": "java",
  "source": {
    "file": "src/main/java/com/example/UserService.java",
    "symbol": "com.example.UserService.createUser",
    "line": 42
  },
  "metadata": {
    "visibility": "public"
  }
}
```

## Edge Model

```json
{
  "id": "edge_001",
  "kind": "CALLS",
  "from": "method:com.example.UserController.create",
  "to": "method:com.example.UserService.createUser",
  "certainty": "high",
  "metadata": {}
}
```

## Group Model

Groups represent higher-order clustering.

Examples:

- module
- package
- layer
- bounded context

```json
{
  "id": "group_service_layer",
  "kind": "layer",
  "label": "Service Layer",
  "members": [
    "class:com.example.UserService",
    "class:com.example.OrderService"
  ]
}
```

## Certainty Levels

Because static analysis can involve inference, `UGF` should allow certainty labels such as:

- `high`
- `medium`
- `low`

## Diagnostics

Graph diagnostics may report:

- unresolved imports
- ambiguous call targets
- unsupported syntax
- partial analysis due to configuration gaps

## Relationship to Visualization

`UGF` should provide semantics, not layout.

Layout coordinates, animation metadata, and styling belong in the visualization layer.
