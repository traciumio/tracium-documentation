# Phase 5: IDE Plugin (Pulse)

**Status:** PLANNED
**Products Involved:** Pulse, Nerva, Tracium Engine, Atlas
**Tech Stack:** TypeScript, VS Code Extension API
**Depends On:** Phase 2, Phase 3

---

## Objective

Bring the Tracium ecosystem into the developer's editor. Pulse bridges VS Code with runtime execution (CSE) and repository analysis (Atlas), letting developers trace code and explore architecture without leaving their IDE.

---

## Sub-Tasks Breakdown

### 5.1 Extension Scaffolding

- [ ] Initialize VS Code extension project (Yeoman generator)
- [ ] Configure TypeScript build pipeline
- [ ] Set up extension manifest (`package.json` contributions)
- [ ] Configure development launch profiles (Extension Host)
- [ ] Set up extension bundling (esbuild/webpack)
- [ ] Create extension icon and branding

### 5.2 Runtime Workflow - Trace from Editor

- [ ] **Run with Tracium** command:
  - [ ] Register command in command palette
  - [ ] Context menu on editor (right-click -> "Trace with Tracium")
  - [ ] Detect current file language
  - [ ] Extract selected code or full file
  - [ ] Package execution request
- [ ] Send execution request to Nerva/CSE:
  - [ ] Service discovery (local or remote engine)
  - [ ] HTTP client for session creation
  - [ ] Polling for session completion
  - [ ] Error handling and user feedback
- [ ] Display trace results:
  - [ ] Inline decorations on source lines (step markers)
  - [ ] Sidebar panel: step-by-step trace viewer
  - [ ] Variable values on hover (at current step)
  - [ ] Call stack view in sidebar
  - [ ] Output channel for stdout/stderr

### 5.3 Runtime Trace Navigation in Editor

- [ ] Step-through controls:
  - [ ] Status bar buttons (previous/next/play/pause)
  - [ ] Keyboard shortcuts for stepping
  - [ ] Step counter display
- [ ] Source synchronization:
  - [ ] Highlight current execution line
  - [ ] Scroll to active line on step change
  - [ ] Gutter icons for step positions
- [ ] Variable inspection:
  - [ ] Hover provider: show variable value at current step
  - [ ] Inline decorations: show key values next to assignments
  - [ ] Watch panel integration

### 5.4 Repository Workflow - Analyze from Editor

- [ ] **Analyze Project** command:
  - [ ] Register command in command palette
  - [ ] Detect workspace root
  - [ ] Package analysis request (local source)
  - [ ] Send to Atlas via Nerva
  - [ ] Show progress notification
- [ ] Display architecture results:
  - [ ] Webview panel: interactive graph view
  - [ ] Tree view: project structure with metrics
  - [ ] Code lens: show dependency count on classes/methods
- [ ] Navigation between graph and source:
  - [ ] Click graph node -> open source file at symbol
  - [ ] Click source symbol -> highlight in graph
  - [ ] Breadcrumb navigation

### 5.5 Source Anchor Navigation

- [ ] Bidirectional navigation:
  - [ ] Editor -> Prism: "Open in Tracium" opens full visualization
  - [ ] Prism -> Editor: deep link opens file at specific line
- [ ] URI scheme registration for `tracium://` links
- [ ] Cross-tool state sync (current step, selected symbol)

### 5.6 Configuration & Settings

- [ ] Extension settings:
  - [ ] Engine URL (local/remote)
  - [ ] Default language
  - [ ] Auto-trace on save (opt-in)
  - [ ] Inline decoration toggle
  - [ ] Theme preferences
- [ ] Connection status indicator in status bar
- [ ] Engine health check on activation

### 5.7 UX Polish

- [ ] Welcome/onboarding walkthrough
- [ ] Loading states for all async operations
- [ ] Error messages with actionable guidance
- [ ] Minimal UI footprint (contextual power, not cluttered)
- [ ] Respect VS Code theme (light/dark)

### 5.8 Testing

- [ ] Extension unit tests (VS Code test runner)
- [ ] Integration tests with mock engine
- [ ] Command registration tests
- [ ] Webview rendering tests
- [ ] End-to-end: trace a Java file, verify inline results
- [ ] End-to-end: analyze workspace, verify graph rendering

---

## VS Code Contribution Points

| Type | Contribution |
|------|-------------|
| Commands | `tracium.traceFile`, `tracium.traceSelection`, `tracium.analyzeProject` |
| Menus | Editor context menu, explorer context menu |
| Views | Trace Steps sidebar, Call Stack sidebar, Architecture tree |
| Webviews | Graph viewer, detailed trace viewer |
| Configuration | Engine URL, display preferences |
| Keybindings | Step forward/backward, play/pause |
| Status Bar | Connection status, current step |

---

## Exit Criteria

- Users can trace a Java file from VS Code and see step-by-step results inline
- Users can analyze a workspace and see architecture graph in a webview
- Navigation works bidirectionally (source <-> graph, source <-> trace)
- Extension follows VS Code UX guidelines
- Works with local engine instance
