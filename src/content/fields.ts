import { z } from 'zod'
import { defaultLocale, locales, type Locale } from '../i18n/config'

/**
 * A single description of every content field, used three ways: the admin
 * renders forms from it, `zodFor` validates writes against it, and the `Doc`
 * types below are derived from it. Adding a field is therefore one edit in
 * `schema.ts` and nothing else - there is no SQL migration because documents
 * are stored as JSON.
 */

export type Option = { value: string; label: string }

type Base = {
  /** Georgian label shown in the admin. */
  label: string
  hint?: string
  /** Stored as `{ ka, en, ru }` and edited under the locale tabs. */
  localized?: boolean
  required?: boolean
  /** Renders in the narrow side column instead of the main form. */
  sidebar?: boolean
}

export type Field =
  | (Base & { kind: 'text'; maxLength?: number })
  | (Base & { kind: 'textarea'; rows?: number })
  | (Base & { kind: 'markdown' })
  | (Base & { kind: 'slug' })
  | (Base & { kind: 'url' })
  | (Base & { kind: 'color' })
  | (Base & { kind: 'date' })
  | (Base & { kind: 'number'; min?: number; max?: number })
  | (Base & { kind: 'boolean' })
  | (Base & { kind: 'select'; options: readonly Option[] })
  | (Base & { kind: 'multiselect'; options: readonly Option[] })
  | (Base & { kind: 'image' })
  | (Base & { kind: 'imageList' })
  | (Base & { kind: 'relation'; to: string })
  | (Base & { kind: 'relationList'; to: string })
  | (Base & { kind: 'list'; of: Field; addLabel?: string })
  | (Base & { kind: 'objectList'; fields: FieldMap; addLabel?: string; titleKey?: string })
  | (Base & { kind: 'group'; fields: FieldMap })
  | (Base & { kind: 'blocks'; blocks: Record<string, BlockDef> })

export type FieldMap = { readonly [key: string]: Field }

export type BlockDef = { label: string; fields: FieldMap }

/* -------------------------------------------------------------------------- */
/* Derived TypeScript types                                                   */
/* -------------------------------------------------------------------------- */

type Leaf<F> = F extends {
  kind: 'text' | 'textarea' | 'markdown' | 'slug' | 'url' | 'color' | 'date'
}
  ? string
  : F extends { kind: 'number' }
    ? number
    : F extends { kind: 'boolean' }
      ? boolean
      : F extends { kind: 'select'; options: readonly { value: infer V }[] }
        ? V
        : F extends { kind: 'multiselect'; options: readonly { value: infer V }[] }
          ? V[]
          : F extends { kind: 'image' | 'relation' }
            ? number
            : F extends { kind: 'imageList' | 'relationList' }
              ? number[]
              : F extends { kind: 'list'; of: infer I }
                ? Value<I>[]
                : F extends { kind: 'objectList'; fields: infer M }
                  ? Shape<M>[]
                  : F extends { kind: 'group'; fields: infer M }
                    ? Shape<M>
                    : F extends { kind: 'blocks'; blocks: infer B }
                      ? BlockValue<B>[]
                      : never

type BlockValue<B> = {
  [K in keyof B]: { type: K; id: string } & (B[K] extends { fields: infer M } ? Shape<M> : never)
}[keyof B]

/** Localised fields hold one value per locale; `ka` acts as the fallback. */
export type Localized<T> = Partial<Record<Locale, T>>

export type Value<F> = F extends { localized: true } ? Localized<Leaf<F>> : Leaf<F>

/**
 * Every key is optional. Documents are edited incrementally and older rows
 * predate newer fields, so pages must treat any value as possibly missing -
 * exactly how they already behaved with the previous CMS.
 */
export type Shape<M> = { [K in keyof M]?: Value<M[K]> }

/* -------------------------------------------------------------------------- */
/* Runtime validation                                                          */
/* -------------------------------------------------------------------------- */

function leafSchema(field: Field): z.ZodTypeAny {
  switch (field.kind) {
    case 'text':
    case 'textarea':
    case 'markdown':
    case 'slug':
    case 'url':
    case 'color':
    case 'date':
      return field.required ? z.string().trim().min(1) : z.string()
    case 'number': {
      let schema = z.number()
      if (field.min !== undefined) schema = schema.min(field.min)
      if (field.max !== undefined) schema = schema.max(field.max)
      return schema
    }
    case 'boolean':
      return z.boolean()
    case 'select':
      return z.enum(field.options.map((option) => option.value) as [string, ...string[]])
    case 'multiselect':
      return z.array(z.enum(field.options.map((option) => option.value) as [string, ...string[]]))
    case 'image':
    case 'relation':
      return z.number().int().positive()
    case 'imageList':
    case 'relationList':
      return z.array(z.number().int().positive())
    case 'list':
      return z.array(zodFor(field.of))
    case 'objectList':
      return z.array(zodForMap(field.fields))
    case 'group':
      return zodForMap(field.fields)
    case 'blocks':
      return z.array(blocksSchema(field.blocks))
  }
}

function blocksSchema(blocks: Record<string, BlockDef>): z.ZodTypeAny {
  const members = Object.entries(blocks).map(([type, block]) =>
    z.object({ type: z.literal(type), id: z.string() }).extend(shapeOf(block.fields)),
  )
  // A single block type cannot form a discriminated union.
  if (members.length === 1) return members[0]
  return z.discriminatedUnion('type', members as [z.ZodObject, z.ZodObject, ...z.ZodObject[]])
}

function localizedSchema(inner: z.ZodTypeAny, required?: boolean): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const code of locales) {
    shape[code] = required && code === defaultLocale ? inner : inner.optional()
  }
  return z.object(shape)
}

export function zodFor(field: Field): z.ZodTypeAny {
  const base = leafSchema(field)
  if (field.localized) {
    const schema = localizedSchema(base, field.required)
    return field.required ? schema : schema.optional()
  }
  return field.required ? base : base.optional()
}

function shapeOf(fields: FieldMap): Record<string, z.ZodTypeAny> {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const [name, field] of Object.entries(fields)) shape[name] = zodFor(field)
  return shape
}

export function zodForMap(fields: FieldMap): z.ZodObject {
  // Unknown keys are dropped rather than rejected so removing a field from the
  // schema never blocks saving a document that still carries the old value.
  return z.object(shapeOf(fields))
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Reads a localised value, falling back to Georgian and then to any locale. */
export function pick<T>(value: Localized<T> | undefined | null, locale: Locale): T | undefined {
  if (!value) return undefined
  return value[locale] ?? value[defaultLocale] ?? Object.values(value).find((v) => v != null)
}

/** Same as `pick` but guarantees a string, which is what most callers want. */
export function text(value: Localized<string> | undefined | null, locale: Locale): string {
  return pick(value, locale) ?? ''
}

/** The blank value a freshly added field or list row starts from. */
export function emptyValue(field: Field): unknown {
  if (field.localized) return {}
  switch (field.kind) {
    case 'number':
      return undefined
    case 'boolean':
      return false
    case 'multiselect':
    case 'imageList':
    case 'relationList':
    case 'list':
    case 'objectList':
    case 'blocks':
      return []
    case 'select':
      return field.options[0]?.value
    case 'group':
      return emptyShape(field.fields)
    case 'image':
    case 'relation':
      return undefined
    default:
      return ''
  }
}

export function emptyShape(fields: FieldMap): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [name, field] of Object.entries(fields)) out[name] = emptyValue(field)
  return out
}
