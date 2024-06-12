import { ElectronAPI } from '@electron-toolkit/preload'
import { getIconSets, getIconsByPrefix } from '../main/actions'
type WithoutEvent<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getIconSets: WithoutEvent<typeof getIconSets>
      getIconsByPrefix: WithoutEvent<typeof getIconsByPrefix>
    }
  }
}
