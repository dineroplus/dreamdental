import type { Doctor } from '../content/schema'
import { mediaUrl } from './utils'

/**
 * Cut-out portraits from `src/components/teampictures`, served from /public/team.
 * Used when a doctor has no CMS photo yet (and on Vercel before R2 is wired).
 */
export const DOCTOR_PHOTOS: Record<string, string> = {
  'bacho-jimsheleishvili': '/team/bacho-jimsheleishvili.webp',
  'nino-beridze': '/team/nino-beridze.webp',
  'nino-bitsadze': '/team/nino-bitsadze.webp',
  'nino-mikaberidze': '/team/nino-mikaberidze.webp',
  'sofo-kikishvili': '/team/sofo-kikishvili.webp',
  'alexandr-bespalov': '/team/alexandr-bespalov.webp',
  'marika-ivanidze': '/team/marika-ivanidze.webp',
}

export function doctorPhotoUrl(
  doctor: Pick<Doctor, 'slug' | 'photo'>,
  size?: 'thumb' | 'card' | 'wide' | 'hero',
): string | null {
  return mediaUrl(doctor.photo, size) || DOCTOR_PHOTOS[doctor.slug] || null
}
