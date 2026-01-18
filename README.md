# Omvian Hub SDK

Independent SDK module for Omvian Hub tools development.

## 📁 Directory Structure

- `src/`: TypeScript source code
  - `index.ts`: SDK entry point
  - `types.ts`: Type definitions
  - `hooks.ts`: React hooks for tool development
  - `components/`: React components (e.g., `ToolLifecycle`)
  - `utils/`: Utility functions (e.g., version reading)
  - `go/`: Go SDK implementation
- `scripts/`: Automation scripts
- `dist/`: Compiled output
- `version.json`: Current version info (auto-generated)
- `version.go`: Go version info (auto-generated)

## 🔧 Development

### Generate Version Files
```bash
npm run version
```

### Build SDK
```bash
npm run build
```

## 📦 Usage

### TypeScript/React
Import the SDK from `omvian-hub-sdk`:
```typescript
import { useToolContext } from 'omvian-hub-sdk';
```

### Go
Import the SDK from the local package:
```go
import "omvian-hub/sdk"
```

## 🚀 Automation
This project uses `semantic-release` for automated versioning and changelog generation.
