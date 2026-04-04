# Repo Analyzer Access And Ingestion

## Goal

Allow repository analysis from multiple sources without mixing source access concerns into graph logic.

## Core Rule

`Repo Analyzer` should remain a standalone analysis engine.

The source of the repository can vary, but the analyzer contract should stay the same.

That means:

- local repo input and GitHub repo input both end in the same analysis pipeline
- the Visualization Platform can launch either mode
- the analyzer itself should not become a GitHub-specific product

## Recommended Model

Split the system into:

- `Source Connector Layer`
- `Repo Analyzer Core`
- `UGF Output Layer`

Conceptually:

```text
Visualization Platform / IDE Plugin / SDK
                 |
                 v
        Repo Session API / Orchestrator
                 |
       +---------+---------+
       |                   |
       v                   v
 Local Source Connector   GitHub Connector
       |                   |
       +---------+---------+
                 v
          Repo Analyzer Core
                 |
                 v
                UGF
                 |
                 v
      Visualization Platform / SDK / IDE
```

## Mode 1: Local Source Connector

This connector handles repositories available on the user's machine or mounted workspace.

Inputs:

- local folder path
- uploaded archive
- current IDE workspace

Best for:

- initial implementation
- local-first users
- high privacy and low integration complexity

Key responsibilities:

- enumerate allowed files
- snapshot or stream source content to analyzer workers
- preserve source anchors and repo metadata

## Mode 2: GitHub Connector

This connector handles repositories hosted on GitHub, including private repositories the user is authorized to access.

Possible access patterns:

- GitHub OAuth plus repository selection
- GitHub App installation on selected repos
- temporary archive download for a specific commit or branch
- shallow clone in an isolated worker

Recommended long-term approach:

- GitHub App for controlled repository access

Why:

- narrower permission model
- easier org-level installation and revocation
- better fit for private repository access

## Private Repository Handling

Private repo support is a major product feature, but it changes your security model.

Minimum rules:

- request least-privilege access
- analyze in isolated workers
- never expose raw source outside the authorized session path
- encrypt stored credentials or installation metadata
- define clear retention rules for code snapshots and analysis artifacts

Recommended policy direction:

- keep raw source ephemeral when possible
- persist `UGF` and analysis metadata, not full repo contents, unless explicitly needed
- allow repo owners to revoke access and delete stored artifacts

## What The Visualization Platform Should Do

The Visualization Platform should offer two user entry points:

- `Analyze Local Repository`
- `Connect GitHub Repository`

But the platform should not own parsing or graph construction logic.

Its role is:

- authenticate or collect the source
- launch repo analysis sessions
- display resulting graphs and diagnostics

## What The Repo Analyzer Core Should Do

The core should receive a normalized repository snapshot or source stream and then:

- parse supported files
- build graph layers
- emit `UGF`

The core should not care whether the repo came from local disk or GitHub once ingestion is complete.

## Session Model

Each repo analysis session should record:

- session ID
- source type: `local` or `github`
- source reference: local path, repo ID, branch, commit SHA
- analyzer version
- language set
- diagnostics
- output graph reference

## Recommended Implementation Order

Start with:

1. local source connector
2. repo analyzer core
3. visualization of `UGF`
4. GitHub connector for private repo access

This order is practical because it validates the analyzer and graph contract before adding authentication, permissions, and hosted source access.

## Product Clarification

So the clean product story is:

- one `Repo Analyzer`
- two repo access modes
- one output contract
- many consuming surfaces

That keeps the architecture clean while still supporting your GitHub-connected private-repo idea.
