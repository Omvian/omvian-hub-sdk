/**
 * Omvian SDK - 生命周期组件
 * 提供 React Context 包装，管理工具生命周期
 */
import { type ReactNode } from 'react';
import type { OmvianTheme, VisibilityState } from '../types';
interface ToolContextValue {
    toolId: string;
    theme: OmvianTheme;
    isDark: boolean;
    locale: string;
    isVisible: boolean;
    isFocused: boolean;
    readClipboard: () => Promise<string>;
    writeClipboard: (text: string) => Promise<void>;
    showNotification: (title: string, body: string) => Promise<void>;
    openExternal: (url: string) => void;
    getConfig: <T = any>(key: string) => Promise<T | null>;
    setConfig: (key: string, value: any) => Promise<void>;
}
interface ToolLifecycleProviderProps {
    children: ReactNode;
    toolId?: string;
    onMount?: () => void;
    onUnmount?: () => void;
    onThemeChange?: (theme: OmvianTheme) => void;
    onLanguageChange?: (locale: string) => void;
    onVisibilityChange?: (state: VisibilityState) => void;
}
export declare function ToolLifecycleProvider({ children, toolId: propToolId, onMount, onUnmount, onThemeChange, onLanguageChange, onVisibilityChange, }: ToolLifecycleProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * 获取工具上下文
 */
export declare function useToolContext(): ToolContextValue;
export {};
