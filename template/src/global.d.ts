export {}

declare global {
  interface Window {
    /** The bridge exposed by electron/preload.ts */
    ipcRenderer?: {
      /** Registers a listener and returns its unsubscribe function */
      on(channel: string, listener: (...args: unknown[]) => void): () => void
      send(channel: string, ...args: unknown[]): void
      invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T>
    }
  }
}
