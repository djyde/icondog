import Store from 'electron-store'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

const schema = z.object({
  openai: z.object({
    apiKey: z.string()
  })
})

export const store = new Store({
  // @ts-expect-error
  schema: zodToJsonSchema(schema).definitions
})

export const initRenderer = Store.initRenderer