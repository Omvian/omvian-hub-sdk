/**
 * Omvian SDK - React Hooks
 * 提供便捷的 React Hooks 封装，用于工具开发
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type {
    OmvianTheme,
    VisibilityState,
    ConfigValue,
    NotificationOptions,
    FileSelectOptions,
    FileSaveOptions,
    FileSelectResult,
    FileSaveResult,
} from './types'

// ==================== 生命周期 Hooks ====================
/**
 * 工具生命周期 Hook
 * 管理工具的挂载、卸载、可见性等生命周期事件
 */
export function useToolLifecycle() {
    const [isMounted, setIsMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [isFocused, setIsFocused] = useState(true)

    useEffect(() => {
        setIsMounted(true)

        // 监听窗口焦点变化
        const handleFocusChange = (focused: boolean) => {
            setIsFocused(focused)
        }

        // 监听可见性变化
        const handleVisibilityChange = () => {
            setIsVisible(document.visibilityState === 'visible')
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.electronAPI?.onWindowFocusChange?.(handleFocusChange)

        return () => {
            setIsMounted(false)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.electronAPI?.removeWindowFocusChangeListener?.()
        }
    }, [])

    return {
        isMounted,
        isVisible,
        isFocused,
        visibilityState: { visible: isVisible, focused: isFocused } as VisibilityState,
    }
}

// ==================== 主题 Hooks ====================
/**
 * 主题 Hook
 * 获取当前主题并监听主题变化
 */
export function useTheme() {
    const [theme, setTheme] = useState<OmvianTheme>(() => {
        // 尝试从 window.omvianTheme 获取初始主题
        if (typeof window !== 'undefined' && window.omvianTheme) {
            return window.omvianTheme
        }
        return {
            mode: 'light',
            primaryColor: '#1677ff',
            glassEnabled: true,
            glassStyle: 'blur',
        }
    })

    useEffect(() => {
        // 从主进程获取当前主题
        window.electronAPI?.getCurrentTheme?.().then((currentTheme) => {
            if (currentTheme) {
                setTheme(currentTheme as OmvianTheme)
            }
        })

        // 监听主题变化
        const handleThemeChange = (newTheme: OmvianTheme) => {
            setTheme(newTheme)
        }

        window.electronAPI?.onThemeChange?.(handleThemeChange)

        return () => {
            window.electronAPI?.removeThemeChangeListener?.()
        }
    }, [])

    return {
        theme,
        isDark: theme.mode === 'dark',
        primaryColor: theme.primaryColor,
    }
}

// ==================== 语言 Hooks ====================

/**
 * 语言 Hook
 * 获取当前语言并监听语言变化
 */
export function useLanguage() {
    const [locale, setLocale] = useState<string>('zh-CN')

    useEffect(() => {
        // 从主进程获取当前语言
        window.electronAPI?.getCurrentLanguage?.().then((currentLocale) => {
            if (currentLocale) {
                setLocale(currentLocale)
            }
        })

        // 监听语言变化
        const handleLanguageChange = (newLocale: string) => {
            setLocale(newLocale)
        }

        window.electronAPI?.onLanguageChange?.(handleLanguageChange)

        return () => {
            window.electronAPI?.removeLanguageChangeListener?.()
        }
    }, [])

    return {
        locale,
        isZhCN: locale === 'zh-CN',
        isEnUS: locale === 'en-US',
    }
}

// ==================== 配置存储 Hooks ====================

/**
 * 配置存储 Hook
 * 读写工具配置，支持自动同步
 */
export function useConfig<T = ConfigValue>(
    key: string,
    defaultValue?: T
): {
    value: T | null
    loading: boolean
    error: Error | null
    setValue: (value: T) => Promise<void>
    deleteValue: () => Promise<void>
    refresh: () => Promise<void>
} {
    const [value, setValueState] = useState<T | null>(defaultValue ?? null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const toolIdRef = useRef<string>('')

    // 从 window 获取 toolId
    useEffect(() => {
        const toolIdMatch = window.location.href.match(/toolId=([^&]+)/)
        if (toolIdMatch) {
            toolIdRef.current = toolIdMatch[1]
        } else {
            // 尝试从 parent postMessage 获取
            toolIdRef.current = (window as any).__TOOL_ID__ || 'unknown'
        }
    }, [])

    const refresh = useCallback(async () => {
        if (!toolIdRef.current) return

        setLoading(true)
        setError(null)

        try {
            const result = await window.electronAPI?.getToolConfig?.(toolIdRef.current, key)
            setValueState(result ?? defaultValue ?? null)
        } catch (err) {
            setError(err as Error)
        } finally {
            setLoading(false)
        }
    }, [key, defaultValue])

    useEffect(() => {
        refresh()
    }, [refresh])

    const setValue = useCallback(async (newValue: T) => {
        if (!toolIdRef.current) return

        try {
            await window.electronAPI?.setToolConfig?.(toolIdRef.current, key, newValue)
            setValueState(newValue)
        } catch (err) {
            setError(err as Error)
            throw err
        }
    }, [key])

    const deleteValue = useCallback(async () => {
        if (!toolIdRef.current) return

        try {
            await window.electronAPI?.deleteToolConfig?.(toolIdRef.current, key)
            setValueState(defaultValue ?? null)
        } catch (err) {
            setError(err as Error)
            throw err
        }
    }, [key, defaultValue])

    return { value, loading, error, setValue, deleteValue, refresh }
}

// ==================== 剪贴板 Hooks ====================

/**
 * 剪贴板 Hook
 * 读写系统剪贴板
 */
export function useClipboard() {
    const [text, setText] = useState<string>('')
    const [error, setError] = useState<Error | null>(null)

    const read = useCallback(async () => {
        try {
            const content = await window.electronAPI?.readClipboard?.()
            setText(content || '')
            setError(null)
            return content || ''
        } catch (err) {
            setError(err as Error)
            throw err
        }
    }, [])

    const write = useCallback(async (content: string) => {
        try {
            await window.electronAPI?.writeClipboard?.(content)
            setText(content)
            setError(null)
        } catch (err) {
            setError(err as Error)
            throw err
        }
    }, [])

    const copy = useCallback(async (content: string) => {
        await write(content)
    }, [write])

    return { text, error, read, write, copy }
}

// ==================== 通知 Hooks ====================

/**
 * 系统通知 Hook
 */
export function useNotification() {
    const [error, setError] = useState<Error | null>(null)

    const show = useCallback(async (
        title: string,
        body: string,
        options?: NotificationOptions
    ) => {
        try {
            await window.electronAPI?.showNotification?.(title, body, options)
            setError(null)
        } catch (err) {
            setError(err as Error)
            throw err
        }
    }, [])

    return { show, error }
}

// ==================== 文件操作 Hooks ====================

/**
 * 文件选择 Hook
 */
export function useFileSelect() {
    const [result, setResult] = useState<FileSelectResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const select = useCallback(async (options?: FileSelectOptions) => {
        setLoading(true)
        setError(null)

        try {
            const res = await window.electronAPI?.selectFile?.(options)
            setResult(res || null)
            return res
        } catch (err) {
            setError(err as Error)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { result, loading, error, select }
}

/**
 * 文件保存 Hook
 */
export function useFileSave() {
    const [result, setResult] = useState<FileSaveResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const save = useCallback(async (
        content: string | Uint8Array,
        options?: FileSaveOptions
    ) => {
        setLoading(true)
        setError(null)

        try {
            const res = await window.electronAPI?.saveFileDialog?.(content, options)
            setResult(res || null)
            return res
        } catch (err) {
            setError(err as Error)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { result, loading, error, save }
}

// ==================== 错误上报 Hooks ====================

/**
 * 错误上报 Hook
 */
export function useErrorReporter() {
    const toolIdRef = useRef<string>((window as any).__TOOL_ID__ || 'unknown')

    const report = useCallback(async (
        error: Error | string,
        context?: Record<string, any>
    ) => {
        const errorMessage = typeof error === 'string' ? error : error.message
        await window.electronAPI?.reportToolError?.(toolIdRef.current, errorMessage, context)
    }, [])

    return { report }
}

// ==================== 埋点统计 Hooks ====================

/**
 * 埋点统计 Hook
 */
export function useTracking() {
    const toolIdRef = useRef<string>((window as any).__TOOL_ID__ || 'unknown')

    const trackEvent = useCallback(async (
        eventName: string,
        properties?: Record<string, any>
    ) => {
        await window.electronAPI?.trackToolEvent?.(toolIdRef.current, eventName, properties)
    }, [])

    const trackTiming = useCallback(async (
        eventName: string,
        durationMs: number
    ) => {
        await window.electronAPI?.trackToolTiming?.(toolIdRef.current, eventName, durationMs)
    }, [])

    return { trackEvent, trackTiming }
}
