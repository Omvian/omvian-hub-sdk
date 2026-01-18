/**
 * Omvian SDK - 入口文件
 * 导出所有 SDK 功能
 */
// 导出 React Hooks
export { useToolLifecycle, useTheme, useLanguage, useConfig, useClipboard, useNotification, useFileSelect, useFileSave, useErrorReporter, useTracking, } from './hooks';
// 导出生命周期组件
export { ToolLifecycleProvider, useToolContext } from './components/ToolLifecycle';
// ==================== 工具 API 快捷方法 ====================
/**
 * 获取当前主题
 */
export async function getTheme() {
    return window.electronAPI?.getCurrentTheme?.();
}
/**
 * 获取当前语言
 */
export async function getLanguage() {
    return window.electronAPI?.getCurrentLanguage?.();
}
/**
 * 读取剪贴板
 */
export async function readClipboard() {
    return window.electronAPI?.readClipboard?.();
}
/**
 * 写入剪贴板
 */
export async function writeClipboard(text) {
    return window.electronAPI?.writeClipboard?.(text);
}
/**
 * 显示系统通知
 */
export async function showNotification(title, body, options) {
    return window.electronAPI?.showNotification?.(title, body, options);
}
/**
 * 打开外部链接
 */
export function openExternal(url) {
    window.electronAPI?.openExternal?.(url);
}
/**
 * 输出日志
 */
export function log(...args) {
    console.log('[OmvianSDK]', ...args);
    window.toolApi?.log?.(...args);
}
/**
 * 输出错误
 */
export function error(...args) {
    console.error('[OmvianSDK]', ...args);
    window.toolApi?.error?.(...args);
}
