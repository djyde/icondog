import fs from 'node:fs'
import iconifyCollections from '@iconify/json/collections.json'
import type { IconifyInfo, IconifyIcons, IconifyIcon, IconifyJSON } from '@iconify/types'
import { getSVGViewBox, iconToHTML, iconToSVG } from '@iconify/utils'

export const getIconSets = async (e) => {
  const collecitons = Object.keys(iconifyCollections).map((prefix) => {
    return {
      prefix: prefix,
      ...iconifyCollections[prefix]
    } as {
      prefix: string
    } & IconifyInfo
  })
  return collecitons
}

export const getIconsByPrefix = async (e, prefix: string) => {
  const jsonIconFilePath = require.resolve(`@iconify/json/json/${prefix}.json`)
  const json = JSON.parse(fs.readFileSync(jsonIconFilePath, { encoding: 'utf-8' })) as IconifyJSON
  const icons = json.icons

  return Object.keys(icons)
    .map((name) => {
      const icon = icons[name]
      const svg = iconToSVG(icon, {
        height: json.height || 'auto',
        width: json.width || 'auto'
      })
      svg.attributes.viewBox = getSVGViewBox(`0 0 ${json.width} ${json.height}`)!.join(' ')
      const html = iconToHTML(svg.body, svg.attributes)
      const dataUrl = `data:image/svg+xml,${encodeURIComponent(html)}`
      return {
        prefix: prefix,
        name: name,
        dataUrl: dataUrl,
        html: html,
        svg,
        ...icons[name]
      }
    })
    .filter((_) => Boolean(_.dataUrl))
}
