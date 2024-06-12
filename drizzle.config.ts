import type { Config } from 'drizzle-kit'

export default {
  schema: './src/renderer/src/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
} satisfies Config
