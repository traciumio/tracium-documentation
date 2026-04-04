# State Timeline

A state timeline is an ordered sequence of execution steps. Each step captures the complete program state at that moment — stack, heap, and what changed.

## How It Works

```
Step 1: SESSION_STARTED  → empty state
Step 2: METHOD_ENTERED   → main() frame pushed
Step 3: VARIABLE_ASSIGNED → x = 5
Step 4: VARIABLE_ASSIGNED → y = 10
Step 5: VARIABLE_ASSIGNED → z = 15
Step 6: METHOD_EXITED    → main() frame popped
Step 7: SESSION_FINISHED → empty state
```

Each step contains:
- **Full materialized state** — the complete picture at that moment
- **Delta** — what changed from the previous step
- **Event type** — what kind of thing happened
- **Source anchor** — which line of code caused it

## Navigation

You can navigate a timeline in any direction:

- **Forward** — step 3 → step 4 → step 5
- **Backward** — step 5 → step 4 → step 3
- **Jump** — go directly to step 12
- **Filter** — show only VARIABLE_ASSIGNED events

## Checkpoints

For large traces, the engine creates periodic checkpoints — full state snapshots that enable fast seeking without replaying from step 1.

## Recursion Example

Timelines capture recursive execution with full stack depth:

```
Step  4:   METHOD_ENTERED  depth=2  | n=4
Step  7:     METHOD_ENTERED  depth=3  | n=3
Step 10:       METHOD_ENTERED  depth=4  | n=2
Step 13:         METHOD_ENTERED  depth=5  | n=1  (base case)
Step 15:         METHOD_EXITED   depth=5  | return 1
Step 17:       METHOD_EXITED   depth=4  | return 2
Step 19:     METHOD_EXITED   depth=3  | return 6
Step 21:   METHOD_EXITED   depth=2  | return 24
```

Every recursive call, every parameter value, every return — visible in the timeline.
