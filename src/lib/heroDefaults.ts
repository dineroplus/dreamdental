import type { Locale } from '../i18n/config'

/**
 * Homepage hero fallbacks from CONTENT-DATA.md when the Home singleton is empty.
 * The clinic name lives in the header logo; the hero leads with the slogan.
 */
export type HeroCopy = {
  title: string
  subtitle: string
  bullets: string[]
}

export const HERO_COPY: Record<Locale, HeroCopy> = {
  ka: {
    title: 'თქვენი ღიმილი\nჩვენი რეპუტაციაა',
    subtitle:
      '2013 წლიდან Dream Dental Group ზრუნავს თქვენს ღიმილზე. ერთ სივრცეში გთავაზობთ ყველა სახის სტომატოლოგიურ მომსახურებას: იმპლანტაცია, ორთოპედია, პროთეზირება, ორთოდონტია, პაროდონტოლოგია, ლაზერული გათეთრება, ბავშვთა სტომატოლოგია, 3D დიაგნოსტიკა და სხვა. თანამედროვე ტექნოლოგიები, უმაღლესი ხარისხი, ინდივიდუალური მიდგომა, კომფორტული გარემო და პროფესიონალი გუნდი. გემსახურებით ყოველდღე 10:00-დან 22:00-მდე. თბილისი, ნ. ბარათაშვილის #10',
    bullets: [
      'თქვენზე მორგებული მკურნალობის გეგმა სუფთა და კომფორტულ გარემოში',
      'წინასწარ შეთანხმებული ღირებულება და გადახდის სხვადასხვა ფორმა',
      'პროფესიონალების გუნდური მიდგომა და პერსონალური ყურადღება ყოველ ვიზიტზე',
      'მომსახურების ხარისხის უმაღლესი დონე და თანამედროვე ტექნოლოგიები',
    ],
  },
  en: {
    title: 'Your smile - is our reputation',
    subtitle:
      'Since 2013, Dream Dental Group has been caring for your smile. In one place we offer every kind of dental treatment: implants, prosthodontics, prosthetics, orthodontics, periodontics, laser whitening, children’s dentistry, 3D diagnostics and more. Modern technology, the highest standard of care, an individual approach, a comfortable setting and a professional team. We see you every day from 10:00 to 22:00. Tbilisi, 10 N. Baratashvili St.',
    bullets: [
      'A treatment plan tailored to you, in a clean and comfortable setting',
      'Costs agreed in advance and a choice of payment options',
      'A team of professionals and personal attention at every visit',
      'The highest standard of care and modern technology',
    ],
  },
  ru: {
    title: 'Ваша улыбка\nнаша репутация',
    subtitle:
      'С 2013 года Dream Dental Group заботится о вашей улыбке. В одном пространстве мы предлагаем все виды стоматологической помощи: имплантацию, ортопедию, протезирование, ортодонтию, пародонтологию, лазерное отбеливание, детскую стоматологию, 3D-диагностику и другое. Современные технологии, высочайшее качество, индивидуальный подход, комфортная обстановка и профессиональная команда. Принимаем ежедневно с 10:00 до 22:00. Тбилиси, ул. Н. Бараташвили 10.',
    bullets: [
      'Индивидуальный план лечения в чистой и комфортной обстановке',
      'Заранее согласованная стоимость и разные способы оплаты',
      'Командный подход профессионалов и личное внимание на каждом визите',
      'Высочайший уровень обслуживания и современные технологии',
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
