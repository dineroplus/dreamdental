import type { Localized } from './services'

/** Trust counters shown on the home page and the About page. */
export const stats: Localized<Array<{ value: string; suffix?: string; label: string }>> = {
  ka: [
    { value: '13', suffix: '+', label: 'წელი თბილისის ცენტრში' },
    { value: '50', suffix: '+', label: 'ქვეყანა, საიდანაც პაციენტები ჩამოდიან' },
    { value: '4.9', suffix: '/5', label: 'საშუალო შეფასება მიმოხილვის პლატფორმებზე' },
    { value: '500', suffix: '+', label: 'გამოქვეყნებული მიმოხილვა' },
  ],
  en: [
    { value: '13', suffix: '+', label: 'years in the centre of Tbilisi' },
    { value: '50', suffix: '+', label: 'countries our patients travel from' },
    { value: '4.9', suffix: '/5', label: 'average rating across review platforms' },
    { value: '500', suffix: '+', label: 'published patient reviews' },
  ],
  ru: [
    { value: '13', suffix: '+', label: 'лет в центре Тбилиси' },
    { value: '50', suffix: '+', label: 'стран, откуда приезжают пациенты' },
    { value: '4.9', suffix: '/5', label: 'средняя оценка на площадках отзывов' },
    { value: '500', suffix: '+', label: 'опубликованных отзывов' },
  ],
}

export const settings = {
  clinicName: {
    ka: 'Dream Dental & Aesthetic Group',
    en: 'Dream Dental & Aesthetic Group',
    ru: 'Dream Dental & Aesthetic Group',
  } as Localized<string>,
  tagline: {
    ka: 'თქვენი ღიმილი - ჩვენი რეპუტაცია',
    en: 'Your smile is our reputation',
    ru: 'Ваша улыбка - наша репутация',
  } as Localized<string>,
  addressLine: {
    ka: 'ნიკოლოზ ბარათაშვილის ქუჩა #10',
    en: 'Nikoloz Baratashvili St. #10',
    ru: 'Ул. Николоза Бараташвили 10',
  } as Localized<string>,
  city: { ka: 'თბილისი', en: 'Tbilisi', ru: 'Тбилиси' } as Localized<string>,
  hoursNote: {
    ka: 'ვმუშაობთ ყოველდღე, უქმეების ჩათვლით.',
    en: 'Open every day, public holidays included.',
    ru: 'Работаем ежедневно, включая праздничные дни.',
  } as Localized<string>,
  mapUrl: 'https://maps.google.com/?q=Dream+Dental+Group+Baratashvili+10+Tbilisi',
  stats,
}

/**
 * Advantages from the clinic's own "Advantages" series on social plus the
 * infrastructure that genuinely differentiates it from other Tbilisi clinics.
 */
export const advantages: Localized<Array<{ title: string; description: string; icon: string }>> = {
  ka: [
    {
      title: 'ინდივიდუალური მიდგომა',
      description: 'თითოეულ პაციენტს აქვს საკუთარი მკურნალობის გეგმა, რომელსაც კონსულტაციაზე ერთად ვადგენთ.',
      icon: 'heart',
    },
    {
      title: 'საკუთარი სატექნიკო ლაბორატორია',
      description: 'გვირგვინები და პროთეზები კლინიკაშივე მზადდება - ორთოპედიული სამუშაოები საგრძნობლად სწრაფია.',
      icon: 'lab',
    },
    {
      title: 'თანამედროვე აპარატურა',
      description: 'CBCT (3D) ტომოგრაფია, ციფრული ანაბეჭდი, ვექტორული და ლაზერული სისტემები.',
      icon: 'microscope',
    },
    {
      title: 'სტერილიზაციის უმაღლესი დონე',
      description: 'ISO სერტიფიცირება და ეპიდემიოლოგის მიერ კონტროლირებადი სტერილიზაციის ციკლი.',
      icon: 'shield',
    },
    {
      title: 'Dream Land - ბავშვების სამყარო',
      description: 'ცალკე ბოქსი ბავშვებისთვის, საჩუქარი ყოველი ვიზიტის ბოლოს და სუპერ ღიმილის სიგელი.',
      icon: 'child',
    },
    {
      title: 'Dream Box - VIP კაბინეტი',
      description: 'მუსიკის არჩევანი, 3D სათვალეები და ცხელი პირსახოცები მათთვის, ვისაც მაქსიმალური კომფორტი სურს.',
      icon: 'sparkle',
    },
    {
      title: 'მრავალენოვანი გუნდი',
      description: 'ქართული, ინგლისური, რუსული, გერმანული, იტალიური, არაბული და თურქული.',
      icon: 'globe',
    },
    {
      title: 'ალერგოლოგი ადგილზე',
      description: 'ალერგიული სინჯები ტარდება კლინიკაშივე, სხვა დაწესებულებაში გადამისამართების გარეშე.',
      icon: 'microscope',
    },
    {
      title: 'საბანკო და შიდა განვადება',
      description: 'ვრცელი მკურნალობა ნაწილდება თვეებზე - მათ შორის კლინიკის საკუთარი განვადებით.',
      icon: 'wallet',
    },
    {
      title: 'ცენტრალური ადგილმდებარეობა',
      description: 'ბარათაშვილის #10 - თბილისის ისტორიულ ცენტრში, მეტროსა და ტრანსპორტთან ახლოს.',
      icon: 'pin',
    },
    {
      title: 'ყოველდღე 10:00–22:00',
      description: 'ვმუშაობთ კვირის შვიდივე დღეს, გვიან საღამომდე - ვიზიტი სამუშაო დღის შემდეგაც შესაძლებელია.',
      icon: 'clock',
    },
    {
      title: 'სახლში გამოძახების სერვისი',
      description: 'შეზღუდული მობილობის მქონე პაციენტებისთვის ხელმისაწვდომია ვიზიტი ადგილზე.',
      icon: 'check',
    },
  ],
  en: [
    {
      title: 'An individual approach',
      description: 'Every patient gets their own treatment plan, built together with you at the consultation.',
      icon: 'heart',
    },
    {
      title: 'Our own dental laboratory',
      description: 'Crowns and prosthetics are made inside the clinic, which makes prosthetic work noticeably faster.',
      icon: 'lab',
    },
    {
      title: 'Modern equipment',
      description: 'CBCT (3D) imaging, digital impressions, Vector and laser systems.',
      icon: 'microscope',
    },
    {
      title: 'Sterilisation at the highest level',
      description: 'ISO certification and a sterilisation cycle supervised by an epidemiologist.',
      icon: 'shield',
    },
    {
      title: 'Dream Land - a world for children',
      description: 'A dedicated kids’ box, a gift at the end of every visit and a Super Smile certificate.',
      icon: 'child',
    },
    {
      title: 'Dream Box - the VIP suite',
      description: 'Your choice of music, 3D glasses and hot towels for patients who want maximum comfort.',
      icon: 'sparkle',
    },
    {
      title: 'A multilingual team',
      description: 'Georgian, English, Russian, German, Italian, Arabic and Turkish.',
      icon: 'globe',
    },
    {
      title: 'An allergist on site',
      description: 'Allergy testing is carried out in the clinic itself, with no referral to another facility.',
      icon: 'microscope',
    },
    {
      title: 'Bank and in-house instalments',
      description: 'Extensive treatment can be spread over months, including through the clinic’s own plan.',
      icon: 'wallet',
    },
    {
      title: 'A central location',
      description: 'Baratashvili St. 10 - in the historic centre of Tbilisi, close to the metro and transport.',
      icon: 'pin',
    },
    {
      title: 'Open every day, 10:00–22:00',
      description: 'We work all seven days until late evening, so you can come after your working day.',
      icon: 'clock',
    },
    {
      title: 'Home visit service',
      description: 'For patients with limited mobility, treatment at home can be arranged.',
      icon: 'check',
    },
  ],
  ru: [
    {
      title: 'Индивидуальный подход',
      description: 'У каждого пациента свой план лечения, который мы составляем вместе на консультации.',
      icon: 'heart',
    },
    {
      title: 'Собственная зуботехническая лаборатория',
      description: 'Коронки и протезы изготавливаются прямо в клинике - ортопедические работы заметно быстрее.',
      icon: 'lab',
    },
    {
      title: 'Современное оборудование',
      description: 'КЛКТ (3D) томография, цифровые слепки, системы Vector и лазерные аппараты.',
      icon: 'microscope',
    },
    {
      title: 'Высочайший уровень стерилизации',
      description: 'Сертификация ISO и цикл стерилизации под контролем эпидемиолога.',
      icon: 'shield',
    },
    {
      title: 'Dream Land - мир для детей',
      description: 'Отдельный детский бокс, подарок в конце каждого визита и сертификат супер-улыбки.',
      icon: 'child',
    },
    {
      title: 'Dream Box - VIP-кабинет',
      description: 'Выбор музыки, 3D-очки и горячие полотенца для тех, кому нужен максимальный комфорт.',
      icon: 'sparkle',
    },
    {
      title: 'Многоязычная команда',
      description: 'Грузинский, английский, русский, немецкий, итальянский, арабский и турецкий.',
      icon: 'globe',
    },
    {
      title: 'Аллерголог на месте',
      description: 'Аллергопробы проводятся в самой клинике, без направления в другое учреждение.',
      icon: 'microscope',
    },
    {
      title: 'Банковская и внутренняя рассрочка',
      description: 'Объёмное лечение можно распределить на месяцы, в том числе по собственной рассрочке клиники.',
      icon: 'wallet',
    },
    {
      title: 'Центральное расположение',
      description: 'Ул. Бараташвили 10 - в историческом центре Тбилиси, рядом с метро и транспортом.',
      icon: 'pin',
    },
    {
      title: 'Ежедневно 10:00–22:00',
      description: 'Работаем все семь дней до позднего вечера - прийти можно и после рабочего дня.',
      icon: 'clock',
    },
    {
      title: 'Выезд на дом',
      description: 'Для пациентов с ограниченной мобильностью возможен приём на дому.',
      icon: 'check',
    },
  ],
}

export const home = {
  heroEyebrow: {
    ka: '2013 წლიდან · ბარათაშვილის #10, თბილისი',
    en: 'Since 2013 · Baratashvili St. 10, Tbilisi',
    ru: 'С 2013 года · ул. Бараташвили 10, Тбилиси',
  } as Localized<string>,
  heroTitle: {
    ka: 'თქვენი ღიმილი - ჩვენი რეპუტაცია',
    en: 'Your smile is our reputation',
    ru: 'Ваша улыбка - наша репутация',
  } as Localized<string>,
  heroSubtitle: {
    ka: 'სტომატოლოგიური კლინიკა, რომელიც გემსახურებათ ყოველდღე 10:00-დან 22:00-მდე. პროფესიონალების გუნდი, თანამედროვე აპარატურა და გარემო, სადაც მკურნალობის შიში აღარ რჩება.',
    en: 'A dental clinic open every day from 10:00 to 22:00. A team of professionals, modern equipment and an atmosphere that leaves no room for dental fear.',
    ru: 'Стоматологическая клиника, работающая ежедневно с 10:00 до 22:00. Команда профессионалов, современное оборудование и атмосфера, в которой не остаётся места страху перед лечением.',
  } as Localized<string>,
  heroBullets: {
    ka: [
      '13 წელი გამოცდილება · ~50 ქვეყნიდან ჩამოსული პაციენტი',
      'საკუთარი სატექნიკო ლაბორატორია და CBCT 3D დიაგნოსტიკა',
      'საბანკო და შიდა განვადება',
    ],
    en: [
      '13 years of practice · patients from around 50 countries',
      'In-house laboratory and CBCT 3D diagnostics',
      'Bank and in-house instalment plans',
    ],
    ru: [
      '13 лет практики · пациенты примерно из 50 стран',
      'Собственная лаборатория и КЛКТ 3D-диагностика',
      'Банковская и внутренняя рассрочка',
    ],
  } as Localized<string[]>,
  primaryCtaLabel: {
    ka: 'დაჯავშნე უფასო კონსულტაცია',
    en: 'Book a free consultation',
    ru: 'Записаться на бесплатную консультацию',
  } as Localized<string>,
  sectionHeadings: {
    services: {
      ka: { heading: 'სერვისები', subheading: 'იმპლანტაციიდან ბავშვთა სტომატოლოგიამდე - სრული სპექტრი ერთ კლინიკაში.' },
      en: { heading: 'Our services', subheading: 'From implants to children’s dentistry - the full range under one roof.' },
      ru: { heading: 'Наши услуги', subheading: 'От имплантации до детской стоматологии - полный спектр в одной клинике.' },
    },
    whyUs: {
      ka: { heading: 'რატომ Dream Dental', subheading: 'ის, რაც ჩვენ სხვა კლინიკებისგან გვასხვავებს - და რასაც პაციენტები ყველაზე ხშირად აღნიშნავენ.' },
      en: { heading: 'Why Dream Dental', subheading: 'What sets us apart from other clinics - and what our patients mention most often.' },
      ru: { heading: 'Почему Dream Dental', subheading: 'То, что отличает нас от других клиник - и что пациенты отмечают чаще всего.' },
    },
    cases: {
      ka: { heading: 'შედეგები - ადრე და შემდეგ', subheading: 'რეალური პაციენტები, რეალური ვადები. ყველა ფოტო გამოქვეყნებულია თანხმობით.' },
      en: { heading: 'Results - before and after', subheading: 'Real patients, real timelines. Every photo is published with consent.' },
      ru: { heading: 'Результаты - до и после', subheading: 'Реальные пациенты, реальные сроки. Каждое фото опубликовано с согласия.' },
    },
    doctors: {
      ka: { heading: 'ჩვენი ექიმები', subheading: 'თერაპევტები, ქირურგები, იმპლანტოლოგები, ორთოდონტები და რადიოლოგები ერთ გუნდში.' },
      en: { heading: 'Our doctors', subheading: 'Therapists, surgeons, implantologists, orthodontists and radiologists in one team.' },
      ru: { heading: 'Наши врачи', subheading: 'Терапевты, хирурги, имплантологи, ортодонты и рентгенологи в одной команде.' },
    },
    testimonials: {
      ka: { heading: 'რას ამბობენ პაციენტები', subheading: '4.9/5 საშუალო შეფასება 500-ზე მეტი მიმოხილვის საფუძველზე.' },
      en: { heading: 'What patients say', subheading: 'An average of 4.9/5 across more than 500 published reviews.' },
      ru: { heading: 'Что говорят пациенты', subheading: 'Средняя оценка 4.9/5 более чем по 500 опубликованным отзывам.' },
    },
    gallery: {
      ka: { heading: 'შემოგვიხედეთ', subheading: 'რვა ცალკე ბოქსი, სარენტგენო ოთახი, საკუთარი ლაბორატორია, Dream Land და Dream Box.' },
      en: { heading: 'Look inside', subheading: 'Eight separate boxes, an X-ray room, our own laboratory, Dream Land and Dream Box.' },
      ru: { heading: 'Загляните к нам', subheading: 'Восемь отдельных боксов, рентген-кабинет, своя лаборатория, Dream Land и Dream Box.' },
    },
    contact: {
      ka: { heading: 'დაჯავშნეთ ვიზიტი', subheading: 'შეავსეთ ფორმა ან დაგვირეკეთ - ყოველდღე 10:00-დან 22:00-მდე.' },
      en: { heading: 'Book your visit', subheading: 'Fill in the form or call us - every day from 10:00 to 22:00.' },
      ru: { heading: 'Запишитесь на приём', subheading: 'Заполните форму или позвоните - ежедневно с 10:00 до 22:00.' },
    },
  } as Record<string, Localized<{ heading: string; subheading: string }>>,
  seo: {
    ka: {
      title: 'Dream Dental Group - სტომატოლოგიური კლინიკა თბილისის ცენტრში',
      description:
        'სტომატოლოგიური კლინიკა ბარათაშვილის #10-ზე. იმპლანტაცია, ვინირები, ორთოდონტია და ბავშვთა სტომატოლოგია. ყოველდღე 10:00–22:00. ☎ 579 50 10 10',
    },
    en: {
      title: 'Dream Dental Group - Dental Clinic in Central Tbilisi',
      description:
        'Dental clinic at Baratashvili St. 10, Tbilisi. Implants, veneers, orthodontics and children’s dentistry. Open every day 10:00–22:00. ☎ +995 579 50 10 10',
    },
    ru: {
      title: 'Dream Dental Group - стоматологическая клиника в центре Тбилиси',
      description:
        'Стоматологическая клиника на ул. Бараташвили 10, Тбилиси. Импланты, виниры, ортодонтия и детская стоматология. Ежедневно 10:00–22:00. ☎ +995 579 50 10 10',
    },
  } as Localized<{ title: string; description: string }>,
}

type NavLink = { label: Localized<string>; href: string }

export const navigation: { header: NavLink[]; footer: Array<{ title: Localized<string>; links: NavLink[] }> } = {
  header: [
    { label: { ka: 'ჩვენ შესახებ', en: 'About us', ru: 'О нас' }, href: '/about' },
    { label: { ka: 'სერვისები', en: 'Services', ru: 'Услуги' }, href: '/services' },
    { label: { ka: 'ექიმები', en: 'Doctors', ru: 'Врачи' }, href: '/doctors' },
    { label: { ka: 'შედეგები', en: 'Results', ru: 'Результаты' }, href: '/cases' },
    { label: { ka: 'გალერეა', en: 'Gallery', ru: 'Галерея' }, href: '/gallery' },
    { label: { ka: 'ბლოგი', en: 'Blog', ru: 'Блог' }, href: '/blog' },
    { label: { ka: 'კონტაქტი', en: 'Contact', ru: 'Контакты' }, href: '/contact' },
  ],
  footer: [
    {
      title: { ka: 'სერვისები', en: 'Services', ru: 'Услуги' },
      links: [
        { label: { ka: 'იმპლანტაცია', en: 'Implants', ru: 'Имплантация' }, href: '/services/implants' },
        { label: { ka: 'ვინირები', en: 'Veneers', ru: 'Виниры' }, href: '/services/veneers' },
        { label: { ka: 'გათეთრება', en: 'Whitening', ru: 'Отбеливание' }, href: '/services/teeth-whitening' },
        { label: { ka: 'ორთოდონტია', en: 'Orthodontics', ru: 'Ортодонтия' }, href: '/services/orthodontics' },
        { label: { ka: 'ქირურგია', en: 'Oral surgery', ru: 'Хирургия' }, href: '/services/oral-surgery' },
        {
          label: { ka: 'ბავშვთა სტომატოლოგია', en: 'Children’s dentistry', ru: 'Детская стоматология' },
          href: '/services/kids-dentistry',
        },
      ],
    },
    {
      title: { ka: 'კლინიკა', en: 'Clinic', ru: 'Клиника' },
      links: [
        { label: { ka: 'ჩვენ შესახებ', en: 'About us', ru: 'О нас' }, href: '/about' },
        { label: { ka: 'ექიმები', en: 'Doctors', ru: 'Врачи' }, href: '/doctors' },
        { label: { ka: 'შედეგები', en: 'Results', ru: 'Результаты' }, href: '/cases' },
        { label: { ka: 'გალერეა', en: 'Gallery', ru: 'Галерея' }, href: '/gallery' },
        {
          label: { ka: 'დენტალური ტურიზმი', en: 'Dental tourism', ru: 'Дентальный туризм' },
          href: '/dental-tourism',
        },
        { label: { ka: 'ბლოგი', en: 'Blog', ru: 'Блог' }, href: '/blog' },
      ],
    },
  ],
}
