# Phase 4: GitHub-Connected Repository Access

**Status:** PLANNED
**Products Involved:** Nerva, Atlas, Prism
**Tech Stack:** TypeScript (Nerva), GitHub API, OAuth
**Depends On:** Phase 3

---

## Objective

Enable users to analyze GitHub repositories (including private repos) through the same Atlas analyzer, with secure authorization, remote snapshot ingestion, and branch/commit-level re-analysis.

---

## Sub-Tasks Breakdown

### 4.1 GitHub Connection Model

- [ ] Design OAuth 2.0 flow for GitHub authorization
- [ ] Implement GitHub App registration support
- [ ] Define permission scopes required:
  - [ ] Repository read access
  - [ ] Organization membership (for private repos)
- [ ] Implement token management:
  - [ ] Access token storage (encrypted)
  - [ ] Token refresh flow
  - [ ] Token revocation
- [ ] Implement connection status tracking per user

### 4.2 Private Repository Authorization

- [ ] GitHub App installation flow:
  - [ ] User installs Tracium GitHub App
  - [ ] App receives installation webhook
  - [ ] Generate installation access tokens
- [ ] OAuth flow for personal access:
  - [ ] Authorization redirect
  - [ ] Callback handling
  - [ ] Scope validation
- [ ] Repository visibility enforcement:
  - [ ] Only show repos user has access to
  - [ ] Respect organization policies
- [ ] Audit logging for repository access

### 4.3 Remote Snapshot Ingestion

- [ ] Implement GitHub API client:
  - [ ] Repository metadata fetching
  - [ ] File tree listing (recursive)
  - [ ] File content downloading
  - [ ] Branch listing
  - [ ] Commit history
- [ ] Implement snapshot pipeline:
  - [ ] Clone or download archive for target branch/commit
  - [ ] Stage files in temporary analysis workspace
  - [ ] Pass to Atlas local connector (same analysis path)
  - [ ] Cleanup after analysis
- [ ] Implement efficient re-analysis:
  - [ ] Cache previous snapshots
  - [ ] Diff-based incremental analysis (future optimization)
  - [ ] Branch comparison support

### 4.4 Branch & Commit Selection

- [ ] Branch selector UI in Prism:
  - [ ] List available branches
  - [ ] Default to main/master
  - [ ] Branch search/filter
- [ ] Commit selector:
  - [ ] Recent commits list
  - [ ] Commit hash input
  - [ ] Tag selection
- [ ] Re-analyze on branch/commit change
- [ ] Side-by-side comparison view (two branches/commits)

### 4.5 Nerva Orchestration

- [ ] GitHub integration endpoints:
  - [ ] `POST /integrations/github/connect` - initiate OAuth
  - [ ] `GET /integrations/github/callback` - OAuth callback
  - [ ] `GET /integrations/github/repos` - list accessible repos
  - [ ] `POST /sessions/repo` - create analysis from GitHub source
  - [ ] `DELETE /integrations/github/disconnect` - revoke access
- [ ] Session management for GitHub-sourced analyses
- [ ] Rate limiting for GitHub API calls
- [ ] Error handling for GitHub API failures

### 4.6 Prism GitHub Integration UI

- [ ] GitHub connection button/flow
- [ ] Repository browser:
  - [ ] Organization/user filter
  - [ ] Repository search
  - [ ] Visibility indicators (public/private)
  - [ ] Last analyzed timestamp
- [ ] Connected accounts management
- [ ] Analysis trigger from selected repo + branch

### 4.7 Security & Privacy

- [ ] Encrypted token storage
- [ ] No source code persistence after analysis
- [ ] Audit log for all repository accesses
- [ ] Rate limiting per user
- [ ] Scoped access (only requested repos)
- [ ] GDPR compliance considerations

### 4.8 Testing

- [ ] Unit tests for GitHub API client
- [ ] Integration tests with GitHub API (mocked)
- [ ] OAuth flow end-to-end test
- [ ] Snapshot ingestion tests
- [ ] Authorization boundary tests (can't access unauthorized repos)
- [ ] Rate limit handling tests

---

## Exit Criteria

- Users can connect their GitHub account via OAuth
- Users can browse and select repositories (including private)
- Selected repository is analyzed through Atlas and produces UGF
- Branch/commit selection works
- No source code persists after analysis completes
