import type { Localized } from './services'

export type SeedDoctor = {
  slug: string
  order: number
  featured: boolean
  experienceSince?: number
  languages: string[]
  role?: Localized<string>
  name: Localized<string>
  specialty: Localized<string>
  bio: Localized<string[]>
}

/**
 * Team list reconciled from the previous site, the dentos.ge profile and the
 * clinic's Instagram. Specialties marked as general dentistry are the ones the
 * clinic still needs to confirm - they are safe and accurate as written, and
 * can be sharpened in /admin without touching code.
 */
export const doctors: SeedDoctor[] = [
  {
    slug: 'bacho-jimsheleishvili',
    order: 10,
    featured: true,
    experienceSince: 2008,
    languages: ['ka', 'en', 'ru'],
    role: { ka: 'მთავარი ექიმი', en: 'Chief Doctor', ru: 'Главный врач' },
    name: {
      ka: 'ბაჩო ჯიმშელეიშვილი',
      en: 'Bacho Jimsheleishvili',
      ru: 'Бачо Джимшелеишвили',
    },
    specialty: {
      ka: 'ყბა-სახის ქირურგი, იმპლანტოლოგი',
      en: 'Maxillofacial Surgeon, Implantologist',
      ru: 'Челюстно-лицевой хирург, имплантолог',
    },
    bio: {
      ka: [
        'Dream Dental & Aesthetic Group-ის მთავარი ექიმი და დამფუძნებელი. სპეციალიზირებულია იმპლანტოლოგიასა და ყბა-სახის ქირურგიაში - ძვლის გადანერგვა, სინუს-ლიფტინგი და სრული ყბის აღდგენა.',
        'სწორედ მისი ხელმძღვანელობით გახდა კლინიკა 2013 წლიდან დენტალური ტურიზმის ერთ-ერთი მისამართი საქართველოში: პაციენტები ისრაელიდან, ევროპიდან და პოსტსაბჭოთა ქვეყნებიდან სპეციალურად მრავლობითი იმპლანტაციისთვის ჩამოდიან.',
      ],
      en: [
        'Chief doctor and founder of Dream Dental & Aesthetic Group. He specialises in implantology and maxillofacial surgery - bone grafting, sinus lifts and full-arch reconstruction.',
        'Under his direction the clinic has become one of Georgia’s dental tourism destinations since 2013: patients travel from Israel, Europe and the post-Soviet countries specifically for multiple-implant treatment.',
      ],
      ru: [
        'Главный врач и основатель Dream Dental & Aesthetic Group. Специализируется на имплантологии и челюстно-лицевой хирургии - костная пластика, синус-лифтинг и полное восстановление челюсти.',
        'Именно под его руководством клиника с 2013 года стала одним из адресов дентального туризма в Грузии: пациенты из Израиля, Европы и постсоветских стран приезжают специально на множественную имплантацию.',
      ],
    },
  },
  {
    slug: 'nino-beridze',
    order: 20,
    featured: true,
    languages: ['ka', 'en', 'ru'],
    name: { ka: 'ნინო ბერიძე', en: 'Nino Beridze', ru: 'Нино Беридзе' },
    specialty: {
      ka: 'ესთეტიკური სტომატოლოგი, ენდოდონტი',
      en: 'Cosmetic Dentist, Endodontist',
      ru: 'Эстетический стоматолог, эндодонт',
    },
    bio: {
      ka: [
        'მუშაობს ესთეტიკურ სტომატოლოგიასა და ენდოდონტიაში. ატარებს ვინირებით ღიმილის დიზაინს, კომპოზიტურ რესტავრაციასა და ფესვის არხების მკურნალობას მიკროსკოპული სიზუსტით.',
        'ხშირად ის არის პირველი ექიმი, რომელსაც პაციენტი კონსულტაციაზე ხვდება - და სწორედ ამ ეტაპზე იგება მკურნალობის სრული გეგმა.',
      ],
      en: [
        'Works in aesthetic dentistry and endodontics, covering veneer-based smile design, composite restoration and root canal treatment with microscopic precision.',
        'She is often the first doctor a patient meets at consultation - the stage where the full treatment plan is put together.',
      ],
      ru: [
        'Работает в области эстетической стоматологии и эндодонтии: дизайн улыбки винирами, композитная реставрация и лечение корневых каналов с микроскопической точностью.',
        'Часто именно она первой встречает пациента на консультации - на этом этапе и составляется полный план лечения.',
      ],
    },
  },
  {
    slug: 'nino-bitsadze',
    order: 30,
    featured: true,
    languages: ['ka', 'en', 'ru'],
    name: { ka: 'ნინო ბიწაძე', en: 'Nino Bitsadze', ru: 'Нино Бицадзе' },
    specialty: { ka: 'ორთოდონტი', en: 'Orthodontist', ru: 'Ортодонт' },
    bio: {
      ka: [
        'ორთოდონტი. მუშაობს ბრეკეტების ყველა ტიპთან - მეტალის, კერამიკული, საფირონის და თვითლიგირებადი სისტემები - და გამჭვირვალე ელაინერებთან.',
        'მისი ქეისები ბავშვების ადრეული კორექციიდან მოზრდილების რთულ ნაკბენის პრობლემებამდე მერყეობს; შედეგები რეგულარულად ქვეყნდება კლინიკის სოციალურ ქსელებში ვადის მითითებით.',
      ],
      en: [
        'Orthodontist working with every type of brace - metal, ceramic, sapphire and self-ligating systems - as well as clear aligners.',
        'Her cases range from early correction in children to complex adult bite problems; the results are published regularly on the clinic’s social channels with the treatment time stated.',
      ],
      ru: [
        'Ортодонт. Работает со всеми типами брекетов - металлическими, керамическими, сапфировыми и самолигирующими - а также с прозрачными элайнерами.',
        'Её случаи охватывают всё: от ранней коррекции у детей до сложных проблем прикуса у взрослых; результаты регулярно публикуются в соцсетях клиники с указанием сроков.',
      ],
    },
  },
  {
    slug: 'nini-kikabidze',
    order: 40,
    featured: false,
    languages: ['ka', 'en', 'ru'],
    name: { ka: 'ნინი კიკაბიძე', en: 'Nini Kikabidze', ru: 'Нини Кикабидзе' },
    specialty: {
      ka: 'ზოგადი სტომატოლოგი, ქირურგი',
      en: 'General Dentist, Oral Surgeon',
      ru: 'Стоматолог общей практики, хирург',
    },
    bio: {
      ka: [
        'ზოგადი სტომატოლოგი და პირის ღრუს ქირურგი. ატარებს თერაპიულ მკურნალობას, ექსტრაქციასა და სიბრძნის კბილის ამოღებას.',
      ],
      en: [
        'General dentist and oral surgeon, covering restorative treatment, extractions and wisdom tooth removal.',
      ],
      ru: [
        'Стоматолог общей практики и хирург: терапевтическое лечение, удаление зубов и зубов мудрости.',
      ],
    },
  },
  {
    slug: 'shorena-razmadze',
    order: 50,
    featured: false,
    languages: ['ka', 'ru'],
    name: { ka: 'შორენა რაზმაძე', en: 'Shorena Razmadze', ru: 'Шорена Размадзе' },
    specialty: {
      ka: 'თერაპევტი, ქირურგი',
      en: 'Therapist, Oral Surgeon',
      ru: 'Терапевт, хирург',
    },
    bio: {
      ka: ['თერაპევტი და ქირურგი. ატარებს კონსულტაციებს და თერაპიულ-ქირურგიულ მკურნალობას.'],
      en: ['Therapist and oral surgeon, providing consultations alongside restorative and surgical treatment.'],
      ru: ['Терапевт и хирург. Проводит консультации, терапевтическое и хирургическое лечение.'],
    },
  },
  {
    slug: 'sofo-kikishvili',
    order: 60,
    featured: true,
    languages: ['ka', 'ru'],
    name: { ka: 'სოფიკო ყიყიშვილი', en: 'Sofo Kikishvili', ru: 'Софико Кикишвили' },
    specialty: { ka: 'თერაპევტი, ენდოდონტი', en: 'Therapist, Endodontist', ru: 'Терапевт, эндодонт' },
    bio: {
      ka: ['თერაპევტი და ენდოდონტი. სპეციალიზირებულია ფესვის არხების მკურნალობასა და კბილის შენარჩუნებაზე.'],
      en: ['Therapist and endodontist, specialising in root canal treatment and saving compromised teeth.'],
      ru: ['Терапевт и эндодонт. Специализируется на лечении корневых каналов и сохранении зубов.'],
    },
  },
  {
    slug: 'tamuna-chokheli',
    order: 70,
    featured: false,
    languages: ['ka', 'ru'],
    name: { ka: 'თამუნა ჩოხელი', en: 'Tamuna Chokheli', ru: 'Тамуна Чохели' },
    specialty: { ka: 'რადიოლოგი', en: 'Radiologist', ru: 'Рентгенолог' },
    bio: {
      ka: [
        'რადიოლოგი. ხელმძღვანელობს კლინიკის სარენტგენო ოთახს - პანორამული სურათები, პრიცელური სნიმკები და CBCT (3D) ტომოგრაფია.',
      ],
      en: [
        'Radiologist running the clinic’s imaging room - panoramic X-rays, periapical images and CBCT (3D) scans.',
      ],
      ru: [
        'Рентгенолог. Руководит рентген-кабинетом клиники - панорамные снимки, прицельные снимки и КЛКТ (3D).',
      ],
    },
  },
  {
    slug: 'nana-berikashvili',
    order: 80,
    featured: false,
    languages: ['ka', 'ru'],
    name: { ka: 'ნანა ბერიკაშვილი', en: 'Nana Berikashvili', ru: 'Нана Берикашвили' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი. ატარებს კონსულტაციებსა და თერაპიულ მკურნალობას.'],
      en: ['A member of the Dream Dental team, providing consultations and restorative treatment.'],
      ru: ['Член команды Dream Dental. Проводит консультации и терапевтическое лечение.'],
    },
  },
  {
    slug: 'alexandr-bespalov',
    order: 90,
    featured: true,
    languages: ['ka', 'ru', 'en'],
    name: { ka: 'ალექსანდრე ბესპალოვი', en: 'Alexandr Bespalov', ru: 'Александр Беспалов' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი. მუშაობს ქართულ, რუსულ და ინგლისურ ენებზე.'],
      en: ['A member of the Dream Dental team, consulting in Georgian, Russian and English.'],
      ru: ['Член команды Dream Dental. Ведёт приём на грузинском, русском и английском.'],
    },
  },
  {
    slug: 'nestan-merabishvili',
    order: 100,
    featured: false,
    languages: ['ka', 'ru'],
    name: { ka: 'ნესტან მერაბიშვილი', en: 'Nestan Merabishvili', ru: 'Нестан Мерабишвили' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი.'],
      en: ['A member of the Dream Dental team.'],
      ru: ['Член команды Dream Dental.'],
    },
  },
  {
    slug: 'marika-ivanidze',
    order: 110,
    featured: true,
    languages: ['ka', 'ru'],
    name: { ka: 'მარიკა ივანიძე', en: 'Marika Ivanidze', ru: 'Марика Иванидзе' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი.'],
      en: ['A member of the Dream Dental team.'],
      ru: ['Член команды Dream Dental.'],
    },
  },
  {
    slug: 'vakhtang-beradze',
    order: 120,
    featured: false,
    languages: ['ka', 'ru'],
    name: { ka: 'ვახტანგ ბერაძე', en: 'Vakhtang Beradze', ru: 'Вахтанг Берадзе' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი.'],
      en: ['A member of the Dream Dental team.'],
      ru: ['Член команды Dream Dental.'],
    },
  },
  {
    slug: 'nino-mikaberidze',
    order: 130,
    featured: true,
    languages: ['ka', 'ru'],
    name: { ka: 'ნინო მიქაბერიძე', en: 'Nino Mikaberidze', ru: 'Нино Микаберидзе' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი.'],
      en: ['A member of the Dream Dental team.'],
      ru: ['Член команды Dream Dental.'],
    },
  },
  {
    slug: 'badri-antauri',
    order: 140,
    featured: false,
    languages: ['ka', 'ru'],
    name: { ka: 'ბადრი ანთაური', en: 'Badri Antauri', ru: 'Бадри Антаури' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი.'],
      en: ['A member of the Dream Dental team.'],
      ru: ['Член команды Dream Dental.'],
    },
  },
  {
    slug: 'mari-korkotadze',
    order: 150,
    featured: false,
    experienceSince: 2023,
    languages: ['ka', 'en'],
    name: { ka: 'მარი ქორქოტაძე', en: 'Mari Korkotadze', ru: 'Мари Коркотадзе' },
    specialty: { ka: 'სტომატოლოგი', en: 'Dentist', ru: 'Стоматолог' },
    bio: {
      ka: ['Dream Dental-ის გუნდის წევრი 2023 წლიდან.'],
      en: ['A member of the Dream Dental team since 2023.'],
      ru: ['Член команды Dream Dental с 2023 года.'],
    },
  },
]
