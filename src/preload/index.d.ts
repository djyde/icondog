import { ElectronAPI } from '@electron-toolkit/preload'
import { store } from '@shared/store'
import {
  downloadIconSet,
  getIconSets,
  getIconsByPrefix,
  getLabelsByDescription,
  getLocalIconSets
} from '../main/actions'
type WithoutEvent<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getIconSets: WithoutEvent<typeof getIconSets>
      getIconsByPrefix: WithoutEvent<typeof getIconsByPrefix>
      getLocalIconSets: WithoutEvent<typeof getLocalIconSets>
      downloadIconSet: WithoutEvent<typeof downloadIconSet>
      deleteIconSet: WithoutEvent<typeof deleteIconSet>
      getLabelsByDescription: WithoutEvent<typeof getLabelsByDescription>
      store: {
        get(key: string): ReturnType<(typeof store)['get']>
        set(key: string, value: any): ReturnType<(typeof store)['set']>
      }
    }
  }
}
