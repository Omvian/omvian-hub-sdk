/**
 * Omvian SDK - 生命周期组件
 * 提供 React Context 包装，管理工具生命周期
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { OmvianTheme, VisibilityState } from '../types'

// ==================== Context 定义 ====================

interface ToolContextValue {
    // 工具信息
    toolId: string

    // 主题
    theme: OmvianTheme
    isDark: boolean

    // 语言
    locale: string

    // 可见性
    isVisible: boolean
    isFocused: boolean

    // API
    readClipboard: () => Promise<string>
    writeClipboard: (text: string) => Promise<void>
    showNotification: (title: string, body: string) => Promise<void>
    openExternal: (url: string) => void

    // 配置
    getConfig: <T = any>(key: string) => Promise<T | null>
    setConfig: (key: string, value: any) => Promise<void>
}

const ToolContext = createContext<ToolContextValue | null>(null)

// ==================== Provider 组件 ====================

interface ToolLifecycleProviderProps {
    children: ReactNode
    toolId?: string
    onMount?: () => void
    onUnmount?: () => void
    onThemeChange?: (theme: OmvianTheme) => void
    onLanguageChange?: (locale: string) => void
    onVisibilityChange?: (state: VisibilityState) => void
}

export function ToolLifecycleProvider({
    children,
    toolId: propToolId,
    onMount,
    onUnmount,
    onThemeChange,
    onLanguageChange,
    onVisibilityChange,
}: ToolLifecycleProviderProps) {
    // 工具 ID
    const [toolId] = useState(() => {
        if (propToolId) return propToolId
        return (window as any).__TOOL_ID__ || 'unknown'
    })

    // 主题状态
    const [theme, setTheme] = useState<OmvianTheme>(() => {
        if (window.omvianTheme) return window.omvianTheme
        return {
            mode: 'light',
            primaryColor: '#1677ff',
            glassEnabled: true,
            glassStyle: 'blur',
        }
    })

    // 语言状态
    const [locale, setLocale] = useState('zh-CN')

    // 可见性状态
    const [isVisible, setIsVisible] = useState(true)
    const [isFocused, setIsFocused] = useState(true)

    // 初始化
    useEffect(() => {
        // 获取初始主题
        window.electronAPI?.getCurrentTheme?.().then((t) => {
            if (t) setTheme(t as OmvianTheme)
        })

        // 获取初始语言
        window.electronAPI?.getCurrentLanguage?.().then((l) => {
            if (l) setLocale(l)
        })

        // 调用 onMount
        onMount?.()

        return () => {
            onUnmount?.()
        }
    }, [onMount, onUnmount])

    // 监听主题变化
    useEffect(() => {
        const handleThemeChange = (newTheme: OmvianTheme) => {
            setTheme(newTheme)
            onThemeChange?.(newTheme)
        }

        window.electronAPI?.onThemeChange?.(handleThemeChange)
        return () => {
            window.electronAPI?.removeThemeChangeListener?.()
        }
    }, [onThemeChange])

    // 监听语言变化
    useEffect(() => {
        const handleLanguageChange = (newLocale: string) => {
            setLocale(newLocale)
            onLanguageChange?.(newLocale)
        }

        window.electronAPI?.onLanguageChange?.(handleLanguageChange)
        return () => {
            window.electronAPI?.removeLanguageChangeListener?.()
        }
    }, [onLanguageChange])

    // 监听可见性变化
    useEffect(() => {
        const handleVisibility = () => {
            const visible = document.visibilityState === 'visible'
            setIsVisible(visible)
            onVisibilityChange?.({ visible, focused: isFocused })
        }

        const handleFocus = (focused: boolean) => {
            setIsFocused(focused)
            onVisibilityChange?.({ visible: isVisible, focused })
        }

        document.addEventListener('visibilitychange', handleVisibility)
        window.electronAPI?.onWindowFocusChange?.(handleFocus)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility)
            window.electronAPI?.removeWindowFocusChangeListener?.()
        }
    }, [isVisible, isFocused, onVisibilityChange])

    // API 方法
    const readClipboard = useCallback(async () => {
        return (await window.electronAPI?.readClipboard?.()) || ''
    }, [])

    const writeClipboard = useCallback(async (text: string) => {
        await window.electronAPI?.writeClipboard?.(text)
    }, [])

    const showNotification = useCallback(async (title: string, body: string) => {
        await window.electronAPI?.showNotification?.(title, body)
    }, [])

    const openExternal = useCallback((url: string) => {
        window.electronAPI?.openExternal?.(url)
    }, [])

    const getConfig = useCallback(async <T = any>(key: string): Promise<T | null> => {
        return await window.electronAPI?.getToolConfig?.(toolId, key)
    }, [toolId])

    const setConfig = useCallback(async (key: string, value: any) => {
        await window.electronAPI?.setToolConfig?.(toolId, key, value)
    }, [toolId])

    // Context 值
    const contextValue: ToolContextValue = {
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
    }

    return (
        <ToolContext.Provider value={contextValue}>
            {children}
        </ToolContext.Provider>
    )
}

// ==================== Hook ====================

/**
 * 获取工具上下文
 */
export function useToolContext() {
    const context = useContext(ToolContext)
    if (!context) {
        throw new Error('useToolContext must be used within a ToolLifecycleProvider')
    }
    return context
}
