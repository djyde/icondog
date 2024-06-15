import fs from 'node:fs'
import type { IconifyInfo, IconifyIcons, IconifyIcon, IconifyJSON } from '@iconify/types'
import { getSVGViewBox, iconToHTML, iconToSVG } from '@iconify/utils'
import OpenAI from 'openai'
import axios from 'axios'
import { ENDPOINT } from '@shared/constants'
import { store } from '@shared/store'
import { iconSetPath } from './utils'
import path from 'node:path'
import { glob } from 'glob'
import { IpcMain, dialog } from 'electron'
export const getIconSets = async (e) => {
  const collections = (await axios.get<IconifyInfo>(`${ENDPOINT}/collections`)).data

  return Object.keys(collections).map((prefix) => {
    return {
      prefix: prefix,
      ...collections[prefix]
    } as {
      prefix: string
    } & IconifyInfo
  })
}

export const getIconsByPrefix = async (e, prefix: string) => {
  const json = JSON.parse(
    fs.readFileSync(path.join(iconSetPath, `${prefix}.json`), { encoding: 'utf-8' })
  ) as IconifyJSON

  const icons = json.icons

  return Object.keys(icons)
    .map((name) => {
      const icon = icons[name]
      const svg = iconToSVG(icon, {
        height: json.height || 'auto',
        width: json.width || 'auto'
      })
      svg.attributes.viewBox = getSVGViewBox(
        `0 0 ${json.width || json.info?.height} ${json.height || json.info?.height}`
      )!.join(' ')
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

export const getLabelsByDescription = async (e, description: string) => {
  const openaiKey = store.get('openai-key') as string

  if (!openaiKey) {
    dialog.showErrorBox('OpenAI Error', 'OpenAI key is not set')
    return
  }

  const openai = new OpenAI({
    apiKey: store.get('openai-key') as string
  })

  const searchPrompt = `I'll give you a sentence describing what kind of icon I'm looking for, you come up with some icon name from the description to search for icon as much as possible (don't include the "icon" label itself), at least 10 keywords. Answer keywords directly, separated by commas without space`
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          // @ts-expect-error
          content: [
            {
              type: 'text',
              text: searchPrompt
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: description
            }
          ]
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })

    const labels = response.choices[0].message.content as string
    return labels
  } catch (e: any) {
    dialog.showErrorBox('OpenAI Error', e.message)
  }
}

export const downloadIconSet = async (e, prefix: string) => {
  const iconifyJson = await axios.get<IconifyJSON>(
    `https://unpkg.com/@iconify/json@2.2.219/json/${prefix}.json`
  )
  // save to local
  if (fs.existsSync(iconSetPath) === false) {
    fs.mkdirSync(iconSetPath)
  }

  fs.writeFileSync(
    path.join(iconSetPath, `${prefix}.json`),
    JSON.stringify(iconifyJson.data, null, 2)
  )
}

export const getLocalIconSets = async (e, prefix?: string) => {
  if (prefix) {
    const file = path.join(iconSetPath, `${prefix}.json`)
    if (fs.existsSync(file)) {
      return JSON.parse(
        fs.readFileSync(file, {
          encoding: 'utf-8'
        })
      ) as IconifyJSON
    } else {
      return null
    }
  }

  const files = await glob('*.json', { cwd: iconSetPath })
  if (files.length === 0) {
    return null
  }

  return files
    .map(
      (file) =>
        JSON.parse(
          fs.readFileSync(path.join(iconSetPath, file), { encoding: 'utf-8' })
        ) as IconifyJSON
    )
    .map((item) => ({
      prefix: item.prefix,
      info: item.info
    }))
}
