import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text, blob, unique } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

export const iconSets = sqliteTable('icon-sets', {
  prefix: text("prefix").primaryKey(),
  name: text("title").unique(),
  license: text("license"),
  licenseUrl: text("license_url"),
  samples: blob("samples", {mode: "json"}).default([]).$type<string[]>(),
  version: text("version"),
})

export const iconSetsRelations = relations(iconSets, ({many}) => ({
  icons: many(icons)
}))

export const icons = sqliteTable('icons', {
  id: text("id").primaryKey().$defaultFn(() => uuid()),
  iconSetPrefix: text("icon_set_prefix"),
  name: text("name"),
  iconSet: text("icon_set").references(() => iconSets.prefix, {onDelete: 'cascade'}).notNull(),
  svg: text("svg")
}, t => ({
  unq: unique().on(t.iconSetPrefix, t.name)
}))

export const iconRelations = relations(icons, ({one}) => ({
  iconSet: one(iconSets, {
    fields: [icons.iconSetPrefix],
    references: [iconSets.prefix]
  })
}))