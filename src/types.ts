/**
 * Omvian SDK - TypeScript 类型定义
 * 宿主应用与工具通信的完整类型系统
 */

// ==================== 主题相关 ====================

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark'

/**
 * 毛玻璃样式
 */
export type GlassStyle = 'blur' | 'acrylic' | 'mica'

/**
 * 主题配置
 */
export interface OmvianTheme {
  /** 主题模式 */
  mode: ThemeMode
  /** 主色调 */
  primaryColor: string
  /** 是否启用毛玻璃 */
  glassEnabled: boolean
  /** 毛玻璃样式 */
  glassStyle: GlassStyle
}

// ==================== 生命周期相关 ====================

/**
 * 生命周期事件类型
 */
export type LifecycleEventType = 
  | 'mount' 
  | 'unmount' 
  | 'visibilityChange' 
  | 'themeChange' 
  | 'languageChange'
  | 'beforeReload'

/**
 * 可见性状态
 */
export interface VisibilityState {
  /** 是否可见 */
  visible: boolean
  /** 是否获得焦点 */
  focused: boolean
}

/**
 * 生命周期事件回调
 */
export interface LifecycleCallbacks {
  onMount?: () => void
  onUnmount?: () => void
  onVisibilityChange?: (state: VisibilityState) => void
  onThemeChange?: (theme: OmvianTheme) => void
  onLanguageChange?: (locale: string) => void
  onBeforeReload?: () => void | Promise<void>
}

// ==================== 文件操作相关 ====================

/**
 * 文件选择选项
 */
export interface FileSelectOptions {
  /** 对话框标题 */
  title?: string
  /** 默认路径 */
  defaultPath?: string
  /** 文件过滤器 */
  filters?: Array<{
    name: string
    extensions: string[]
  }>
  /** 是否允许多选 */
  multiSelect?: boolean
}

/**
 * 文件保存选项
 */
export interface FileSaveOptions {
  /** 对话框标题 */
  title?: string
  /** 默认文件名 */
  defaultPath?: string
  /** 文件过滤器 */
  filters?: Array<{
    name: string
    extensions: string[]
  }>
}

/**
 * 文件选择结果
 */
export interface FileSelectResult {
  /** 是否取消 */
  canceled: boolean
  /** 选中的文件路径 */
  filePaths: string[]
}

/**
 * 文件保存结果
 */
export interface FileSaveResult {
  /** 是否取消 */
  canceled: boolean
  /** 保存的文件路径 */
  filePath?: string
}

// ==================== 通知相关 ====================

/**
 * 通知选项
 */
export interface NotificationOptions {
  /** 通知图标 */
  icon?: string
  /** 是否静默 */
  silent?: boolean
  /** 紧急程度 */
  urgency?: 'normal' | 'critical' | 'low'
  /** 超时时间(毫秒) */
  timeoutMs?: number
}

// ==================== 配置存储相关 ====================

/**
 * 配置值类型
 */
export type ConfigValue = string | number | boolean | object | null

// ==================== 网络请求相关 ====================

/**
 * 网络请求选项
 */
export interface FetchOptions {
  /** HTTP 方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** 请求头 */
  headers?: Record<string, string>
  /** 请求体 */
  body?: string | object
  /** 超时时间(毫秒) */
  timeout?: number
}

/**
 * 网络响应
 */
export interface FetchResponse {
  /** 状态码 */
  status: number
  /** 状态文本 */
  statusText: string
  /** 响应头 */
  headers: Record<string, string>
  /** 响应体 */
  data: any
}

// ==================== 用户信息相关 ====================

/**
 * 用户角色
 */
export type UserRole = 'guest' | 'user' | 'developer' | 'admin'

/**
 * 权限等级
 */
export type PermissionLevel = 'free' | 'premium' | 'enterprise'

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户 ID */
  id: string
  /** 用户名 */
  name: string
  /** 头像 URL */
  avatar?: string
  /** 邮箱 */
  email?: string
  /** 用户角色 */
  role: UserRole
  /** 权限等级 */
  permissionLevel: PermissionLevel
}

// ==================== 埋点统计相关 ====================

/**
 * 事件属性
 */
export type EventProperties = Record<string, string | number | boolean>

// ==================== 消息通信相关 ====================

/**
 * 工具消息类型
 */
export type ToolMessageType = 
  | 'LOG'
  | 'ERROR'
  | 'API_CALL'
  | 'API_RESPONSE'
  | 'LIFECYCLE'
  | 'THEME_CHANGE'
  | 'LANGUAGE_CHANGE'
  | 'VISIBILITY_CHANGE'

/**
 * 工具消息结构
 */
export interface ToolMessage {
  /** 消息类型 */
  type: ToolMessageType
  /** 工具 ID */
  toolId: string
  /** 消息负载 */
  payload?: any
  /** 请求 ID (用于 API 调用) */
  requestId?: string
}

// ==================== API 定义 ====================

/**
 * Omvian Tool API
 * 工具可调用的所有 API
 */
export interface OmvianToolApi {
  // 生命周期
  onMount: (callback: () => void) => void
  onUnmount: (callback: () => void) => void
  onVisibilityChange: (callback: (state: VisibilityState) => void) => void
  onBeforeReload: (callback: () => void | Promise<void>) => void

  // 主题
  getTheme: () => OmvianTheme
  onThemeChange: (callback: (theme: OmvianTheme) => void) => void

  // 语言
  getLanguage: () => string
  onLanguageChange: (callback: (locale: string) => void) => void

  // 配置存储
  getConfig: <T = ConfigValue>(key: string) => Promise<T | null>
  setConfig: (key: string, value: ConfigValue) => Promise<void>
  deleteConfig: (key: string) => Promise<void>

  // 文件操作
  selectFile: (options?: FileSelectOptions) => Promise<FileSelectResult>
  saveFile: (content: string | Uint8Array, options?: FileSaveOptions) => Promise<FileSaveResult>

  // 剪贴板
  readClipboard: () => Promise<string>
  writeClipboard: (text: string) => Promise<void>

  // 系统通知
  showNotification: (title: string, body: string, options?: NotificationOptions) => Promise<void>

  // 网络请求
  fetch: (url: string, options?: FetchOptions) => Promise<FetchResponse>

  // 外部链接
  openExternal: (url: string) => Promise<void>

  // 用户信息
  getUserInfo: () => Promise<UserInfo | null>
  getPermissionLevel: () => Promise<PermissionLevel>

  // 埋点统计
  trackEvent: (eventName: string, properties?: EventProperties) => Promise<void>
  trackTiming: (eventName: string, durationMs: number) => Promise<void>

  // 错误上报
  reportError: (error: Error | string, context?: Record<string, any>) => Promise<void>

  // 沙盒文件
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, content: string) => Promise<void>
  listDir: (path: string) => Promise<string[]>

  // 日志
  log: (...args: any[]) => void
  error: (...args: any[]) => void
}

// ==================== 全局声明 ====================

declare global {
  interface Window {
    omvianApi?: OmvianToolApi
    omvianTheme?: OmvianTheme
    toolApi?: {
      readFile: (toolId: string, path: string) => Promise<string>
      writeFile: (toolId: string, path: string, content: string) => Promise<void>
      listDir: (toolId: string, path: string) => Promise<string[]>
      log: (...args: any[]) => void
      error: (...args: any[]) => void
    }
  }
}

export {}
