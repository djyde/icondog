import path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`

// function reactVirtualized() {
//   const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`

//   return {
//     name: 'my:react-virtualized',
//     async configResolved() {
//       const reactVirtualizedPath = path.dirname(
//         fileURLToPath(import.meta.resolve('react-virtualized'))
//       )

//       const brokenFilePath = path.join(
//         reactVirtualizedPath,
//         '..', // back to dist
//         'es',
//         'WindowScroller',
//         'utils',
//         'onScroll.js'
//       )
//       const brokenCode = fs.readFileSync(brokenFilePath, 'utf-8')

//       const fixedCode = brokenCode.replace(WRONG_CODE, '')
//       writeFileSync(brokenFilePath, fixedCode)
//     }
//   }
// }
export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['electron-store']
      })
    ],
    resolve: {
      alias: {
        '@shared': path.resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['electron-store']
      })
    ],
    resolve: {
      alias: {
        '@shared': path.resolve('src/shared')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': path.resolve('src/renderer/src'),
        '@shared': path.resolve('src/shared')
      }
    },
    plugins: [react()]
  }
})
