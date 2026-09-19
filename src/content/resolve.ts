import type { Locale } from '../i18n/config'
import { pick, type Field, type FieldMap, type Localized } from './fields'

/**
 * Turns a stored document into the shape pages consume: every localised value
 * is replaced by the requested language, falling back to Georgian.
 *
 * The walk is driven by the field descriptions rather than by guessing at the
 * data, so a text value that genuinely contains a `ka` key can never be
 * mistaken for a translation map.
 */
export function resolveFields(
  fields: FieldMap,
  data: Record<string, unknown> | null | undefined,
  locale: Locale,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (!data) return out

  for (const [name, field] of Object.entries(fields)) {
    const value = resolveField(field, data[name], locale)
    if (value !== undefined) out[name] = value
  }

  return out
}

function resolveField(field: Field, value: unknown, locale: Locale): unknown {
  if (value === undefined || value === null) return undefined

  if (field.localized) {
    const picked = pick(value as Localized<unknown>, locale)
    return picked === undefined ? undefined : resolveInner(field, picked, locale)
  }

  return resolveInner(field, value, locale)
}

/** Handles the container kinds once localisation has been unwrapped. */
function resolveInner(field: Field, value: unknown, locale: Locale): unknown {
  switch (field.kind) {
    case 'list': {
      if (!Array.isArray(value)) return undefined
      const items = value.map((item) => resolveField(field.of, item, locale))
      return items.filter((item) => item !== undefined)
    }
    case 'objectList': {
      if (!Array.isArray(value)) return undefined
      return value.map((item) => resolveFields(field.fields, item as Record<string, unknown>, locale))
    }
    case 'group':
      return resolveFields(field.fields, value as Record<string, unknown>, locale)
    case 'blocks': {
      if (!Array.isArray(value)) return undefined
      return value
        .map((block) => {
          const raw = block as Record<string, unknown>
          const definition = field.blocks[raw.type as string]
          if (!definition) return undefined
          return { ...resolveFields(definition.fields, raw, locale), type: raw.type, id: raw.id }
        })
        .filter(Boolean)
    }
    default:
      return value
  }
}
