import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { store } from '@shared/store'

// Custom APIs for renderer
const api = {
  getIconSets: (...args) => ipcRenderer.invoke('getIconSets', ...args),
  getIconsByPrefix: (...args) => ipcRenderer.invoke('getIconsByPrefix', ...args),
  downloadIconSet: (...args) => ipcRenderer.invoke('downloadIconSet', ...args),
  getLocalIconSets: (...args) => ipcRenderer.invoke('getLocalIconSets', ...args),
  getLabelsByDescription: (...args) => ipcRenderer.invoke('getLabelsByDescription', ...args),
  store: {
    get(key: string) {
      return store.get(key)
    },
    set(key: string, value: any) {
      return store.set(key, value)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
