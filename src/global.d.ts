interface AuthCallbackData {
    code?: string
    state?: string
    error?: string
}

interface ElectronAPI {
    saveTool: (toolId: string, data: Uint8Array, toolName: string) => Promise<boolean>
    installTool: (toolData: { toolId: string; name: string; version: string; data: Uint8Array; metadata: any; verifySignature?: boolean }) => Promise<{ success: boolean; error?: string }>
    runTool: (toolId: string, toolType: string) => Promise<boolean>
    openToolFolder: (toolId: string) => Promise<boolean>
    uninstallTool: (toolId: string) => Promise<boolean>
    readSandboxFile: (toolId: string, path: string) => Promise<Uint8Array>
    writeSandboxFile: (toolId: string, path: string, content: Uint8Array) => Promise<boolean>
    callBackendApi: (endpoint: string, data: any, toolType: string) => Promise<any>
    onBackendMessage: (callback: (message: string) => void) => void
    removeBackendMessageListener: () => void
    windowControl: (action: 'minimize' | 'maximize' | 'close') => void
    openExternal: (url: string) => void
    openAuthWindow: () => Promise<void>
    closeAuthWindow: () => Promise<void>
    onOAuthCallbackListener: (callback: (data: AuthCallbackData) => void) => void
    removeOAuthCallbackListener: () => void
    onMainLog: (callback: (message: string, type: string) => void) => void
    removeMainLogListener: () => void
    saveAuthData: (data: Record<string, any>) => Promise<boolean>
    getAuthData: () => Promise<Record<string, any> | null>
    initializeDirectories: () => Promise<{ name: string; path: string; created: boolean; existed: boolean }[]>

    // SDK API
    readClipboard: () => Promise<string>
    writeClipboard: (text: string) => Promise<void>
    showNotification: (title: string, body: string, options?: { icon?: string; silent?: boolean; urgency?: 'normal' | 'critical' | 'low' }) => Promise<void>
    executeShell: (payload: { toolId: string; command: string; args?: string[]; options?: { timeoutMs?: number } }) => Promise<{ stdout: string; stderr: string; exitCode: number | null }>
    callElectronApi: (payload: { toolId: string; module: string; method: string; args?: any[] }) => Promise<any>
    getToolConfig: (toolId: string, key: string) => Promise<any>
    setToolConfig: (toolId: string, key: string, value: any) => Promise<void>
    deleteToolConfig: (toolId: string, key: string) => Promise<void>
    selectFile: (options?: { title?: string; defaultPath?: string; filters?: Array<{ name: string; extensions: string[] }>; multiSelect?: boolean }) => Promise<{ canceled: boolean; filePaths: string[] }>
    saveFileDialog: (content: string | Uint8Array, options?: { title?: string; defaultPath?: string; filters?: Array<{ name: string; extensions: string[] }> }) => Promise<{ canceled: boolean; filePath?: string }>
    onThemeChange: (callback: (theme: any) => void) => void
    removeThemeChangeListener: () => void
    onLanguageChange: (callback: (locale: string) => void) => void
    removeLanguageChangeListener: () => void
    onWindowFocusChange: (callback: (focused: boolean) => void) => void
    removeWindowFocusChangeListener: () => void
    getCurrentTheme: () => Promise<{ mode: 'light' | 'dark'; primaryColor: string; glassEnabled: boolean; glassStyle: string }>
    getCurrentLanguage: () => Promise<string>
    reportToolError: (toolId: string, error: string, context?: Record<string, any>) => Promise<void>
    trackToolEvent: (toolId: string, eventName: string, properties?: Record<string, any>) => Promise<void>
    trackToolTiming: (toolId: string, eventName: string, durationMs: number) => Promise<void>

    ipcRenderer: {
        send: (channel: string, data?: any) => void
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
        removeAllListeners: (channel: string) => void
    }
}

interface Window {
    electronAPI: ElectronAPI
}
