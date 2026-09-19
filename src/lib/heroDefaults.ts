import type { Locale } from '../i18n/config'

/**
 * Homepage hero fallbacks from CONTENT-DATA.md when the Home singleton is empty.
 * Brand stays the hero-level signal; slogan + tagline fill the empty frame.
 */
export type HeroCopy = {
  brand: string
  title: string
  subtitle: string
  bullets: string[]
}

export const HERO_COPY: Record<Locale, HeroCopy> = {
  ka: {
    brand: 'Dream Dental & Aesthetic Group',
    title: 'თქვენი ღიმილი ჩვენი რეპუტაციაა',
    subtitle:
      'თანამედროვე სტომატოლოგია თბილისის გულში - 2013 წლიდან, Golden Brand და პაციენტები ~50 ქვეყნიდან.',
    bullets: [
      'თანამედროვე ტექნოლოგიები და ინდივიდუალური მიდგომა',
      'ცენტრალური მდებარეობა · მრავალენოვანი გუნდი',
      'ყოველდღე 10:00–22:00',
      'ნაღდი, ბარათი და განვადება',
    ],
  },
  en: {
    brand: 'Dream Dental & Aesthetic Group',
    title: 'Your smile is our reputation',
    subtitle:
      'Modern dentistry in the heart of Tbilisi - since 2013, Golden Brand, patients from nearly 50 countries.',
    bullets: [
      'Advanced technology & personalized care',
      'Central location · multilingual team',
      'Open every day, 10:00–22:00',
      'Cash, cards, and installment options',
    ],
  },
  ru: {
    brand: 'Dream Dental & Aesthetic Group',
    title: 'Ваша улыбка - наша репутация',
    subtitle:
      'Современная стоматология в центре Тбилиси - с 2013 года, Golden Brand и пациенты почти из 50 стран.',
    bullets: [
      'Современные технологии и индивидуальный подход',
      'Центр города · многоязычная команда',
      'Ежедневно 10:00–22:00',
      'Наличные, карты и рассрочка',
    ],
  },
}

/** Phrases from the clinic’s multilingual “Dream & Smile” wall. */
export const DREAM_SMILE_PHRASES = [
  'Dream & Smile',
  'იოცნებე და გაიღიმე',
  'Мечтай и улыбайся',
  'Rêve et souris',
  'Träume und lächle',
  'Sogna e sorridi',
  'Sueña y sonríe',
  'חלום וחייך',
  'احلم وابتسم',
  '梦想与微笑',
  'Hayal et ve gülümse',
  'Ονειρέψου και χαμογέλα',
]
