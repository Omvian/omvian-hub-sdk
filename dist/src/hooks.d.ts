/**
 * Omvian SDK - React Hooks
 * 提供便捷的 React Hooks 封装，用于工具开发
 */
import type { OmvianTheme, VisibilityState, ConfigValue, NotificationOptions, FileSelectOptions, FileSaveOptions, FileSelectResult, FileSaveResult } from './types';
/**
 * 工具生命周期 Hook
 * 管理工具的挂载、卸载、可见性等生命周期事件
 */
export declare function useToolLifecycle(): {
    isMounted: boolean;
    isVisible: boolean;
    isFocused: boolean;
    visibilityState: VisibilityState;
};
/**
 * 主题 Hook
 * 获取当前主题并监听主题变化
 */
export declare function useTheme(): {
    theme: OmvianTheme;
    isDark: boolean;
    primaryColor: string;
};
/**
 * 语言 Hook
 * 获取当前语言并监听语言变化
 */
export declare function useLanguage(): {
    locale: string;
    isZhCN: boolean;
    isEnUS: boolean;
};
/**
 * 配置存储 Hook
 * 读写工具配置，支持自动同步
 */
export declare function useConfig<T = ConfigValue>(key: string, defaultValue?: T): {
    value: T | null;
    loading: boolean;
    error: Error | null;
    setValue: (value: T) => Promise<void>;
    deleteValue: () => Promise<void>;
    refresh: () => Promise<void>;
};
/**
 * 剪贴板 Hook
 * 读写系统剪贴板
 */
export declare function useClipboard(): {
    text: string;
    error: Error | null;
    read: () => Promise<string>;
    write: (content: string) => Promise<void>;
    copy: (content: string) => Promise<void>;
};
/**
 * 系统通知 Hook
 */
export declare function useNotification(): {
    show: (title: string, body: string, options?: NotificationOptions) => Promise<void>;
    error: Error | null;
};
/**
 * 文件选择 Hook
 */
export declare function useFileSelect(): {
    result: FileSelectResult | null;
    loading: boolean;
    error: Error | null;
    select: (options?: FileSelectOptions) => Promise<{
        canceled: boolean;
        filePaths: string[];
    }>;
};
/**
 * 文件保存 Hook
 */
export declare function useFileSave(): {
    result: FileSaveResult | null;
    loading: boolean;
    error: Error | null;
    save: (content: string | Uint8Array, options?: FileSaveOptions) => Promise<{
        canceled: boolean;
        filePath?: string;
    }>;
};
/**
 * 错误上报 Hook
 */
export declare function useErrorReporter(): {
    report: (error: Error | string, context?: Record<string, any>) => Promise<void>;
};
/**
 * 埋点统计 Hook
 */
export declare function useTracking(): {
    trackEvent: (eventName: string, properties?: Record<string, any>) => Promise<void>;
    trackTiming: (eventName: string, durationMs: number) => Promise<void>;
};
