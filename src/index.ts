/**
 * Omvian SDK - 入口文件
 * 导出所有 SDK 功能
 */

// 导出类型
export type {
    ThemeMode,
    GlassStyle,
    OmvianTheme,
    LifecycleEventType,
    VisibilityState,
    LifecycleCallbacks,
    FileSelectOptions,
    FileSaveOptions,
    FileSelectResult,
    FileSaveResult,
    NotificationOptions,
    ConfigValue,
    FetchOptions,
    FetchResponse,
    UserRole,
    PermissionLevel,
    UserInfo,
    EventProperties,
    ToolMessageType,
    ToolMessage,
    OmvianToolApi,
} from './types'
import type { OmvianTheme, VisibilityState } from './types'

// 导出 React Hooks
export {
    useToolLifecycle,
    useTheme,
    useLanguage,
    useConfig,
    useClipboard,
    useNotification,
    useFileSelect,
    useFileSave,
    useErrorReporter,
    useTracking,
} from './hooks'

// 导出生命周期组件
export { ToolLifecycleProvider, useToolContext } from './components/ToolLifecycle'

// ==================== 工具 API 快捷方法 ====================

/**
 * 获取当前主题
 */
export async function getTheme() {
    return window.electronAPI?.getCurrentTheme?.()
}

/**
 * 获取当前语言
 */
export async function getLanguage() {
    return window.electronAPI?.getCurrentLanguage?.()
}

/**
 * 读取剪贴板
 */
export async function readClipboard() {
    return window.electronAPI?.readClipboard?.()
}

/**
 * 写入剪贴板
 */
export async function writeClipboard(text: string) {
    return window.electronAPI?.writeClipboard?.(text)
}

/**
 * 显示系统通知
 */
export async function showNotification(
    title: string,
    body: string,
    options?: { icon?: string; silent?: boolean }
) {
    return window.electronAPI?.showNotification?.(title, body, options)
}

/**
 * 打开外部链接
 */
export function openExternal(url: string) {
    window.electronAPI?.openExternal?.(url)
}

/**
 * 输出日志
 */
export function log(...args: any[]) {
    console.log('[OmvianSDK]', ...args)
    window.toolApi?.log?.(...args)
}

/**
 * 输出错误
 */
export function error(...args: any[]) {
    console.error('[OmvianSDK]', ...args)
    window.toolApi?.error?.(...args)
}
