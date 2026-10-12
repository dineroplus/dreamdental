export const locales = ['ka', 'en', 'ru', 'he', 'ar'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ka'

export const localeLabels: Record<Locale, string> = {
  ka: 'ქართული',
  en: 'English',
  ru: 'Русский',
  he: 'עברית',
  ar: 'العربية',
}

export const localeShortLabels: Record<Locale, string> = {
  ka: 'KA',
  en: 'EN',
  ru: 'RU',
  he: 'HE',
  ar: 'AR',
}

/** BCP 47 tags used for `lang`, `hreflang` and Open Graph `locale`. */
export const htmlLang: Record<Locale, string> = {
  ka: 'ka-GE',
  en: 'en',
  ru: 'ru',
  he: 'he',
  ar: 'ar',
}

export const ogLocale: Record<Locale, string> = {
  ka: 'ka_GE',
  en: 'en_US',
  ru: 'ru_RU',
  he: 'he_IL',
  ar: 'ar_AR',
}

/** Hebrew and Arabic read right to left. Every other locale stays left to right. */
export function localeDir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' || locale === 'ar' ? 'rtl' : 'ltr'
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
