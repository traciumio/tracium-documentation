# Phase 2: Visualization Platform Foundation (Prism)

**Status:** PLANNED
**Products Involved:** Prism, Nerva (basic), Quanta
**Tech Stack:** React, TypeScript, Vite
**Depends On:** Phase 1

---

## Objective

Build the user-facing visualization application that consumes UEF traces from the CSE engine and renders them as interactive, debug-accurate runtime views.

---

## Sub-Tasks Breakdown

### 2.1 Project Setup & Architecture

- [ ] Configure Vite + React + TypeScript build
- [ ] Set up component library foundation (design tokens, theme)
- [ ] Establish layout system (panel-based workspace)
- [ ] Set up routing (runtime workspace, repo workspace, settings)
- [ ] Configure state management (Zustand or similar)
- [ ] Set up UEF type definitions from Quanta schemas
- [ ] Create mock UEF data for development

### 2.2 UEF Data Layer

- [ ] Implement UEF parser/loader (JSON -> typed models)
- [ ] Implement session store (loaded trace state)
- [ ] Implement step navigation state machine
- [ ] Implement state materialization from steps + deltas
- [ ] Implement checkpoint-based efficient navigation
- [ ] Implement file import for `.uef.json` files

### 2.3 Input Workflow

- [ ] Code input panel with syntax highlighting
  - [ ] Java syntax support
  - [ ] Line numbers
  - [ ] Error highlighting (compile errors from diagnostics)
- [ ] Snippet submission flow:
  - [ ] Language selector
  - [ ] Run button
  - [ ] Loading state during execution
  - [ ] Error state display
- [ ] File upload for pre-existing UEF traces
- [ ] Session history (recent traces)

### 2.4 Timeline & Playback Controls

- [ ] Timeline scrubber bar (visual step indicator)
- [ ] Playback controls:
  - [ ] Step forward (next step)
  - [ ] Step backward (previous step)
  - [ ] Play (auto-advance at configurable speed)
  - [ ] Pause
  - [ ] Jump to start / jump to end
  - [ ] Jump to step number
- [ ] Current step indicator
- [ ] Event type badges on timeline
- [ ] Keyboard shortcuts for navigation:
  - [ ] Arrow right / left for step
  - [ ] Space for play/pause
  - [ ] Home / End for jump

### 2.5 Source Panel

- [ ] Display source code with syntax highlighting
- [ ] Current line highlighting (synced to active step)
- [ ] Line-by-line execution indicator
- [ ] Method entry/exit visual markers
- [ ] Breakpoint-style step markers on gutter
- [ ] Source anchor navigation (click line -> jump to step)

### 2.6 Stack Panel

- [ ] Display active call stack (frames)
- [ ] Frame details:
  - [ ] Method name and declaring type
  - [ ] Source location (file:line)
  - [ ] Local variables with current values
  - [ ] Parameters with current values
  - [ ] `this` reference (if applicable)
- [ ] Frame expansion/collapse
- [ ] Active frame highlighting
- [ ] Variable value change highlighting (delta indicators)
- [ ] Click frame to navigate to its source

### 2.7 Heap / Object Panel

- [ ] Display heap objects referenced by current frame
- [ ] Object rendering:
  - [ ] Primitive values inline
  - [ ] Array visualization (indexed elements)
  - [ ] Object fields (name: value pairs)
  - [ ] Null values explicitly shown
- [ ] Reference links (click reference -> navigate to object)
- [ ] Object identity display (obj_xxx IDs)
- [ ] Aliasing visualization (multiple references to same object)
- [ ] Change highlighting (fields/elements that changed this step)
- [ ] Expandable nested objects

### 2.8 Output Panel

- [ ] stdout stream display (accumulated)
- [ ] stderr stream display (accumulated)
- [ ] New output highlighting per step
- [ ] Diagnostics display:
  - [ ] Compile errors
  - [ ] Runtime warnings
  - [ ] Capture limitations

### 2.9 Layout & Navigation

- [ ] Resizable panel layout (source | stack | heap)
- [ ] Panel show/hide toggles
- [ ] Full-screen mode for individual panels
- [ ] Responsive layout for different screen sizes
- [ ] Dark mode / light mode support
- [ ] Workspace state persistence (panel sizes, preferences)

### 2.10 Nerva Basic Integration

- [ ] REST client for session submission
- [ ] Polling for session status
- [ ] Result retrieval and UEF loading
- [ ] Error handling for failed sessions
- [ ] Connection status indicator

### 2.11 Testing & Quality

- [ ] Component unit tests (React Testing Library)
- [ ] UEF parser tests
- [ ] Navigation state machine tests
- [ ] Visual regression tests for key views
- [ ] Accessibility audit (keyboard navigation, screen readers)
- [ ] Performance test: smooth playback with 1000+ steps

---

## Key Screens

### Runtime Workspace Layout

```
+------------------------------------------------------------------+
|  [Tracium Prism]              [Settings] [Theme]                  |
+------------------------------------------------------------------+
|  Code Input / Source     |  Stack Panel        |  Heap Panel      |
|  +-----------------+     |  +---------------+  |  +------------+  |
|  | 1: class Main { |     |  | main()        |  |  | obj_1:     |  |
|  | 2:   public ... |     |  |  x = 5        |  |  |  int[] [3] |  |
|  | 3:     int x=5; | <-- |  |  arr -> obj_1 |  |  |  [1, 2, 3] |  |
|  | 4:     ...      |     |  +---------------+  |  +------------+  |
|  +-----------------+     |                     |                  |
+------------------------------------------------------------------+
|  [|<] [<] [>] [>|] [>>]    Step 3 / 47    [=====-------]        |
+------------------------------------------------------------------+
|  Output: Hello World                                              |
+------------------------------------------------------------------+
```

---

## Exit Criteria

- Users can load or submit Java code and see a UEF trace
- Timeline playback (forward/backward/jump) works smoothly
- Source, stack, and heap panels render accurately for basic programs
- Object references and aliasing are visually clear
- At least works with all Phase 1 golden-file test programs
