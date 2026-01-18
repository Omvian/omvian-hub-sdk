import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Omvian SDK - 生命周期组件
 * 提供 React Context 包装，管理工具生命周期
 */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
const ToolContext = createContext(null);
export function ToolLifecycleProvider({ children, toolId: propToolId, onMount, onUnmount, onThemeChange, onLanguageChange, onVisibilityChange, }) {
    // 工具 ID
    const [toolId] = useState(() => {
        if (propToolId)
            return propToolId;
        return window.__TOOL_ID__ || 'unknown';
    });
    // 主题状态
    const [theme, setTheme] = useState(() => {
        if (window.omvianTheme)
            return window.omvianTheme;
        return {
            mode: 'light',
            primaryColor: '#1677ff',
            glassEnabled: true,
            glassStyle: 'blur',
        };
    });
    // 语言状态
    const [locale, setLocale] = useState('zh-CN');
    // 可见性状态
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(true);
    // 初始化
    useEffect(() => {
        // 获取初始主题
        window.electronAPI?.getCurrentTheme?.().then((t) => {
            if (t)
                setTheme(t);
        });
        // 获取初始语言
        window.electronAPI?.getCurrentLanguage?.().then((l) => {
            if (l)
                setLocale(l);
        });
        // 调用 onMount
        onMount?.();
        return () => {
            onUnmount?.();
        };
    }, [onMount, onUnmount]);
    // 监听主题变化
    useEffect(() => {
        const handleThemeChange = (newTheme) => {
            setTheme(newTheme);
            onThemeChange?.(newTheme);
        };
        window.electronAPI?.onThemeChange?.(handleThemeChange);
        return () => {
            window.electronAPI?.removeThemeChangeListener?.();
        };
    }, [onThemeChange]);
    // 监听语言变化
    useEffect(() => {
        const handleLanguageChange = (newLocale) => {
            setLocale(newLocale);
            onLanguageChange?.(newLocale);
        };
        window.electronAPI?.onLanguageChange?.(handleLanguageChange);
        return () => {
            window.electronAPI?.removeLanguageChangeListener?.();
        };
    }, [onLanguageChange]);
    // 监听可见性变化
    useEffect(() => {
        const handleVisibility = () => {
            const visible = document.visibilityState === 'visible';
            setIsVisible(visible);
            onVisibilityChange?.({ visible, focused: isFocused });
        };
        const handleFocus = (focused) => {
            setIsFocused(focused);
            onVisibilityChange?.({ visible: isVisible, focused });
        };
        document.addEventListener('visibilitychange', handleVisibility);
        window.electronAPI?.onWindowFocusChange?.(handleFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.electronAPI?.removeWindowFocusChangeListener?.();
        };
    }, [isVisible, isFocused, onVisibilityChange]);
    // API 方法
    const readClipboard = useCallback(async () => {
        return (await window.electronAPI?.readClipboard?.()) || '';
    }, []);
    const writeClipboard = useCallback(async (text) => {
        await window.electronAPI?.writeClipboard?.(text);
    }, []);
    const showNotification = useCallback(async (title, body) => {
        await window.electronAPI?.showNotification?.(title, body);
    }, []);
    const openExternal = useCallback((url) => {
        window.electronAPI?.openExternal?.(url);
    }, []);
    const getConfig = useCallback(async (key) => {
        return await window.electronAPI?.getToolConfig?.(toolId, key);
    }, [toolId]);
    const setConfig = useCallback(async (key, value) => {
        await window.electronAPI?.setToolConfig?.(toolId, key, value);
    }, [toolId]);
    // Context 值
    const contextValue = {
        toolId,
        theme,
        isDark: theme.mode === 'dark',
        locale,
        isVisible,
        isFocused,
        readClipboard,
        writeClipboard,
        showNotification,
        openExternal,
        getConfig,
        setConfig,
    };
    return (_jsx(ToolContext.Provider, { value: contextValue, children: children }));
}
// ==================== Hook ====================
/**
 * 获取工具上下文
 */
export function useToolContext() {
    const context = useContext(ToolContext);
    if (!context) {
        throw new Error('useToolContext must be used within a ToolLifecycleProvider');
    }
    return context;
}
