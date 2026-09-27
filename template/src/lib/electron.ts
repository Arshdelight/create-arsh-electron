/**
 * Native (Electron) bridge detection.
 *
 * UI primitives must render correctly in plain web apps too. Anything that
 * needs the Electron preload bridge (window controls) checks this first and
 * degrades gracefully when it is absent.
 */
export const hasNativeBridge =
  typeof window !== 'undefined' &&
  typeof (window as { ipcRenderer?: unknown }).ipcRenderer !== 'undefined'

interface MinimalIpcRenderer {
  /** Registers a listener and returns its unsubscribe function */
  on(channel: string, listener: (...args: unknown[]) => void): () => void
  send(channel: string, ...args: unknown[]): void
  invoke<R = unknown>(channel: string, ...args: unknown[]): Promise<R>
}

export function getIpc(): MinimalIpcRenderer | null {
  if (!hasNativeBridge) return null
  return (window as unknown as { ipcRenderer: MinimalIpcRenderer }).ipcRenderer
}
