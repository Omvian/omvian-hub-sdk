# Omvian Hub SDK

用于 Omvian Hub 工具开发的独立 SDK 模块。

## 📁 目录结构

- `src/`: TypeScript 源代码
  - `index.ts`: SDK 入口文件
  - `types.ts`: 类型定义
  - `hooks.ts`: 用于工具开发的 React hooks
  - `components/`: React 组件（例如：`ToolLifecycle`）
  - `utils/`: 工具函数（例如：版本读取）
  - `go/`: Go SDK 实现
- `scripts/`: 自动化脚本
- `dist/`: 编译输出
- `version.json`: 当前版本信息（自动生成）
- `version.go`: Go 版本信息（自动生成）

## 🔧 开发

### 生成版本文件
```bash
npm run version
```

### 构建 SDK
```bash
npm run build
```

## 📦 使用

### TypeScript/React
从 `omvian-hub-sdk` 导入 SDK：
```typescript
import { useToolContext } from 'omvian-hub-sdk';
```

### Go
从本地包导入 SDK：
```go
import "omvian-hub/sdk"
```

## 🚀 自动化
本项目使用 `semantic-release` 进行自动版本控制和变更日志生成。
