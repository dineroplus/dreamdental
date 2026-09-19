import { getTheme } from '../lib/data'

const RADIUS: Record<string, string> = {
  sharp: '0.25rem',
  soft: '1.25rem',
  pill: '2rem',
}

const HEADING_SCALE: Record<string, string> = {
  compact: '0.92',
  balanced: '1',
  bold: '1.12',
}

/**
 * Emits the Theme global as CSS custom properties before first paint, so the
 * clinic's colour choices apply without a flash of the default palette.
 */
export async function ThemeStyle() {
  const theme = await getTheme().catch(() => null)

  const vars: Record<string, string | undefined> = {
    '--c-primary': theme?.primary || undefined,
    '--c-accent': theme?.accent || undefined,
    '--c-gold': theme?.gold || undefined,
    '--c-background': theme?.background || undefined,
    '--c-surface': theme?.surface || undefined,
    '--c-text': theme?.text || undefined,
    '--r-card': RADIUS[theme?.radius ?? 'soft'],
    '--heading-scale': HEADING_SCALE[theme?.headingScale ?? 'balanced'],
    '--motion-scale': theme?.motionLevel === 'off' ? '0' : undefined,
    '--motion-reveal': theme?.motionLevel === 'subtle' ? '0.4' : undefined,
  }

  const css = Object.entries(vars)
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

  if (!css) return null

  return <style dangerouslySetInnerHTML={{ __html: `:root{${css}}` }} />
}
