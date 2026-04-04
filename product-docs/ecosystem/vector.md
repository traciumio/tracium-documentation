# Vector <Badge type="warning" text="Planned" />

Vector is the TypeScript SDK for programmatic access to the Tracium platform.

## Planned API

```typescript
import { TraciumClient } from '@tracium/vector';

const client = new TraciumClient({ baseUrl: 'http://localhost:4000' });

// Execute and trace
const session = await client.runtime.create({
  language: 'java',
  entrypoint: 'Main.main',
  code: 'class Main { ... }',
});

// Get the trace
const trace = await client.traces.get(session.sessionId);

// Query history
const recent = await client.traces.list({ language: 'java', limit: 10 });
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript |
| Distribution | npm (`@tracium/vector`) |
| Output | ESM + CJS |
