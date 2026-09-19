/**
 * Canonical host. Every other domain the clinic owns 301-redirects here (see
 * next.config.ts) so Google only ever indexes one hostname and link equity from
 * the older domains is not split across duplicates.
 */
export const PRIMARY_DOMAIN = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || 'dreamdental.ge'

export const REDIRECT_DOMAINS = [
  'dream.com.ge',
  'www.dream.com.ge',
  'www.dreamdental.ge',
  'dreamtbilisi.ge',
  'www.dreamtbilisi.ge',
]

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || `https://${PRIMARY_DOMAIN}`

export const SITE_NAME = 'Dream Dental Group'

/**
 * Fallbacks used before the Settings global is populated in /admin, and as the
 * source of truth for structured data that must never be empty.
 */
export const CLINIC = {
  legalName: 'Dream Dental & Aesthetic Group',
  foundedYear: 2013,
  phonePrimary: '+995579501010',
  phonePrimaryDisplay: '579 50 10 10',
  phoneSecondary: '+995322991200',
  phoneSecondaryDisplay: '0322 99 12 00',
  whatsapp: '995579501010',
  email: 'info@dream.com.ge',
  street: 'N. Baratashvili St. #10',
  city: 'Tbilisi',
  postalCode: '0105',
  country: 'GE',
  latitude: 41.6977,
  longitude: 44.8015,
  opensAt: '10:00',
  closesAt: '22:00',
  instagram: 'https://www.instagram.com/dreamtbilisi/',
  facebook: 'https://www.facebook.com/DreamTbilisi',
} as const
