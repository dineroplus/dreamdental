/**
 * Converts Mkhedruli letters to Mtavruli (Unicode capital Georgian).
 * CSS `text-transform: uppercase` is inconsistent across fonts/browsers for ka.
 */
export function toMtavruli(text: string): string {
  return text.replace(/[\u10D0-\u10FF]/g, (ch) =>
    String.fromCodePoint(ch.codePointAt(0)! + 0xbc0),
  )
}

/** Apply Mtavruli only for the Georgian locale; leave other locales unchanged. */
export function uiCaps(text: string, locale: string): string {
  return locale === 'ka' ? toMtavruli(text) : text
}
