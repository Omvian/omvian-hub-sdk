/**
 * Omvian SDK - 入口文件
 * 导出所有 SDK 功能
 */
export type { ThemeMode, GlassStyle, OmvianTheme, LifecycleEventType, VisibilityState, LifecycleCallbacks, FileSelectOptions, FileSaveOptions, FileSelectResult, FileSaveResult, NotificationOptions, ConfigValue, FetchOptions, FetchResponse, UserRole, PermissionLevel, UserInfo, EventProperties, ToolMessageType, ToolMessage, OmvianToolApi, } from './types';
export { useToolLifecycle, useTheme, useLanguage, useConfig, useClipboard, useNotification, useFileSelect, useFileSave, useErrorReporter, useTracking, } from './hooks';
export { ToolLifecycleProvider, useToolContext } from './components/ToolLifecycle';
/**
 * 获取当前主题
 */
export declare function getTheme(): Promise<{
    mode: "light" | "dark";
    primaryColor: string;
    glassEnabled: boolean;
    glassStyle: string;
}>;
/**
 * 获取当前语言
 */
export declare function getLanguage(): Promise<string>;
/**
 * 读取剪贴板
 */
export declare function readClipboard(): Promise<string>;
/**
 * 写入剪贴板
 */
export declare function writeClipboard(text: string): Promise<void>;
/**
 * 显示系统通知
 */
export declare function showNotification(title: string, body: string, options?: {
    icon?: string;
    silent?: boolean;
}): Promise<void>;
/**
 * 打开外部链接
 */
export declare function openExternal(url: string): void;
/**
 * 输出日志
 */
export declare function log(...args: any[]): void;
/**
 * 输出错误
 */
export declare function error(...args: any[]): void;
