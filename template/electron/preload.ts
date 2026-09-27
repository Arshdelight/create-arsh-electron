import { ipcRenderer, contextBridge } from 'electron'

// Listeners registered through on() are wrapped, so offloading must go through
// the unsubscribe function that on() returns.
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel: string, listener: (...args: unknown[]) => void) {
    const wrapped = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => listener(_event, ...args)
    ipcRenderer.on(channel, wrapped)
    return () => {
      ipcRenderer.off(channel, wrapped)
    }
  },
  send(channel: string, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args)
  },
  invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T> {
    return ipcRenderer.invoke(channel, ...args)
  },
})
