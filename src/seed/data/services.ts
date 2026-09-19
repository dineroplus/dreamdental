import type { Locale } from '../../i18n/config'

export type Localized<T> = Record<Locale, T>

export type SeedHighlight = { text: string; icon: string }
export type SeedFaq = { question: string; answer: string }

export type SeedService = {
  slug: string
  icon: string
  order: number
  featured: boolean
  priceFrom?: number
  priceTo?: number
  /** Key into the media map built by the seed runner. */
  image?: string
  title: Localized<string>
  shortTitle: Localized<string>
  excerpt: Localized<string>
  duration: Localized<string>
  priceNote: Localized<string>
  highlights: Localized<SeedHighlight[]>
  body: Localized<string[]>
  faq: Localized<SeedFaq[]>
}

const PRICE_NOTE: Localized<string> = {
  ka: 'საბოლოო ღირებულება დგინდება უფასო კონსულტაციისა და დიაგნოსტიკის შემდეგ. ხელმისაწვდომია საბანკო და შიდა განვადება.',
  en: 'The final price is set after a free consultation and diagnosis. Bank and in-house instalment plans are available.',
  ru: 'Итоговая стоимость определяется после бесплатной консультации и диагностики. Доступны банковская и внутренняя рассрочка.',
}

export const services: SeedService[] = [
  {
    slug: 'implants',
    icon: 'implant',
    order: 10,
    featured: true,
    priceFrom: 900,
    image: 'implants',
    title: {
      ka: 'დენტალური იმპლანტაცია',
      en: 'Dental Implants',
      ru: 'Дентальная имплантация',
    },
    shortTitle: { ka: 'იმპლანტაცია', en: 'Implants', ru: 'Имплантация' },
    excerpt: {
      ka: 'დაკარგული კბილის სრული აღდგენა ტიტანის იმპლანტით - ბუნებრივი იერსახე, სრული საღეჭი ფუნქცია და შედეგი, რომელიც ათწლეულებს ძლებს.',
      en: 'A complete replacement for a missing tooth with a titanium implant - natural appearance, full chewing function and a result that lasts decades.',
      ru: 'Полное восстановление утраченного зуба титановым имплантом - естественный вид, полноценная жевательная функция и результат на десятилетия.',
    },
    duration: { ka: '2–4 ვიზიტი · 3–6 თვე', en: '2–4 visits · 3–6 months', ru: '2–4 визита · 3–6 месяцев' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'ციფრული 3D დაგეგმვა CBCT ტომოგრაფიით', icon: 'scan' },
        { text: 'ძვლის გადანერგვა (ავგმენტაცია) საჭიროების შემთხვევაში', icon: 'shield' },
        { text: 'საკუთარი სატექნიკო ლაბორატორია - გვირგვინი უფრო სწრაფად', icon: 'clock' },
        { text: 'სედაცია და ზოგადი გაუტკივარება მოთხოვნისამებრ', icon: 'heart' },
      ],
      en: [
        { text: 'Digital 3D planning with CBCT imaging', icon: 'scan' },
        { text: 'Bone grafting and augmentation when needed', icon: 'shield' },
        { text: 'In-house laboratory - your crown arrives sooner', icon: 'clock' },
        { text: 'Sedation and general anaesthesia on request', icon: 'heart' },
      ],
      ru: [
        { text: 'Цифровое 3D-планирование с КЛКТ', icon: 'scan' },
        { text: 'Костная пластика при необходимости', icon: 'shield' },
        { text: 'Собственная лаборатория - коронка быстрее', icon: 'clock' },
        { text: 'Седация и общий наркоз по запросу', icon: 'heart' },
      ],
    },
    body: {
      ka: [
        'დენტალური იმპლანტი არის ტიტანის ხრახნი, რომელიც ყბის ძვალში ინერგება და დაკარგული კბილის ფესვს ანაცვლებს. მასზე ფიქსირდება გვირგვინი, ხიდი ან სრული პროთეზი. ეს დღეს ერთადერთი მეთოდია, რომელიც კბილს არა მარტო ვიზუალურად, არამედ ფუნქციურადაც სრულად აღადგენს - ძვალი განაგრძობს დატვირთვის მიღებას და არ იწყებს ატროფიას.',
        '## როგორ მიმდინარეობს მკურნალობა',
        'პირველი ვიზიტი იწყება უფასო კონსულტაციითა და CBCT (3D) ტომოგრაფიით. ჩვენ ვზომავთ ძვლის სიმაღლესა და სისქეს, ვსაზღვრავთ ნერვის მდებარეობას და ციფრულად ვგეგმავთ იმპლანტის ზუსტ პოზიციას ჩადგმამდე. ეს ამცირებს ოპერაციის დროს და ხდის შედეგს პროგნოზირებადს.',
        'იმპლანტის ჩადგმა ხდება ადგილობრივი გაუტკივარებით და საშუალოდ 30–40 წუთს გრძელდება ერთ კბილზე. თუ პაციენტს აქვს სტომატოლოგიური შიში, ვთავაზობთ სედაციას ან ზოგად ანესთეზიას - ეს განსაკუთრებით აქტუალურია მრავლობითი იმპლანტაციისას.',
        'შემდეგ იწყება ოსეოინტეგრაციის პერიოდი - 3-დან 6 თვემდე, როცა ძვალი იმპლანტს ირგვლივ ერწყმის. ამ პერიოდში პაციენტი დადის დროებითი კონსტრუქციით, ანუ ესთეტიკის გარეშე არასდროს რჩება.',
        'ბოლო ეტაპზე ვიღებთ ციფრულ ანაბეჭდს და ჩვენივე სატექნიკო ლაბორატორიაში მზადდება ინდივიდუალური გვირგვინი - ცირკონის ან მეტალოკერამიკის. ლაბორატორია კლინიკაშივეა, რაც ორთოპედიულ სამუშაოებს მნიშვნელოვნად აჩქარებს.',
        '## ძვლის დეფიციტი არ არის უკუჩვენება',
        'თუ კბილი დიდი ხნის დაკარგულია, ძვალი ხშირად დაკლებულია. ამ შემთხვევაში ვასრულებთ ძვლის გადანერგვას (ავგმენტაციას) ან სინუს-ლიფტინგს. ეს ერთი-ორი თვით ახანგრძლივებს მკურნალობას, მაგრამ აძლევს იმპლანტს სტაბილურ საყრდენს.',
        '## რატომ Dream Dental',
        'იმპლანტოლოგია კლინიკის ერთ-ერთი ძირითადი მიმართულებაა 2013 წლიდან. მთავარი ექიმი ბაჩო ჯიმშელეიშვილი არის ყბა-სახის ქირურგი და იმპლანტოლოგი, რაც ნიშნავს, რომ რთული ქეისებიც - ძვლის გადანერგვით, სინუს-ლიფტინგით ან სრული ყბის აღდგენით - ერთ კლინიკაში წყდება, გადამისამართების გარეშე.',
      ],
      en: [
        'A dental implant is a titanium screw placed into the jawbone to replace the root of a missing tooth. A crown, bridge or full denture is then fixed onto it. It is currently the only method that restores a tooth both visually and functionally - the bone keeps receiving load and does not begin to atrophy.',
        '## How the treatment works',
        'The first visit starts with a free consultation and a CBCT (3D) scan. We measure the height and thickness of the bone, locate the nerve and plan the exact position of the implant digitally before anything is placed. This shortens surgery time and makes the outcome predictable.',
        'Placement is done under local anaesthesia and takes around 30–40 minutes for a single tooth. For patients with dental anxiety we offer sedation or general anaesthesia, which is particularly relevant when several implants are placed in one session.',
        'Next comes osseointegration - three to six months during which the bone fuses around the implant. Throughout this period you wear a temporary restoration, so you are never left without a tooth in the aesthetic zone.',
        'At the final stage we take a digital impression and our in-house laboratory produces an individual zirconia or porcelain-fused-to-metal crown. Because the laboratory is inside the clinic, prosthetic work moves noticeably faster than with an external lab.',
        '## Insufficient bone is not a contraindication',
        'When a tooth has been missing for a long time the bone often recedes. In those cases we perform bone grafting (augmentation) or a sinus lift. This extends treatment by a month or two but gives the implant a stable foundation.',
        '## Why Dream Dental',
        'Implantology has been one of the clinic’s core disciplines since 2013. Our chief doctor, Bacho Jimsheleishvili, is a maxillofacial surgeon and implantologist, which means complex cases - bone grafting, sinus lifts, full-arch reconstruction - are handled in one clinic without referrals elsewhere.',
      ],
      ru: [
        'Дентальный имплант - это титановый винт, который устанавливается в челюстную кость и заменяет корень утраченного зуба. На него фиксируется коронка, мост или полный протез. Сегодня это единственный метод, который восстанавливает зуб не только визуально, но и функционально - кость продолжает получать нагрузку и не атрофируется.',
        '## Как проходит лечение',
        'Первый визит начинается с бесплатной консультации и КЛКТ (3D) томографии. Мы измеряем высоту и толщину кости, определяем положение нерва и цифрово планируем точную позицию импланта ещё до установки. Это сокращает время операции и делает результат предсказуемым.',
        'Установка проходит под местной анестезией и занимает около 30–40 минут на один зуб. Пациентам с дентофобией мы предлагаем седацию или общий наркоз - особенно при установке нескольких имплантов за один приём.',
        'Далее следует остеоинтеграция - от трёх до шести месяцев, пока кость срастается с имплантом. Всё это время вы носите временную конструкцию и никогда не остаётесь без зуба в зоне улыбки.',
        'На последнем этапе мы снимаем цифровой слепок, и наша собственная лаборатория изготавливает индивидуальную коронку из циркония или металлокерамики. Лаборатория находится прямо в клинике, поэтому ортопедические работы выполняются заметно быстрее.',
        '## Недостаток кости - не противопоказание',
        'Если зуб утрачен давно, кость часто убывает. В таких случаях мы выполняем костную пластику (аугментацию) или синус-лифтинг. Это удлиняет лечение на один-два месяца, но обеспечивает импланту устойчивую опору.',
        '## Почему Dream Dental',
        'Имплантология - одно из ключевых направлений клиники с 2013 года. Главный врач Бачо Джимшелеишвили - челюстно-лицевой хирург и имплантолог, поэтому сложные случаи с костной пластикой, синус-лифтингом или полным восстановлением челюсти решаются в одной клинике, без направлений в другие центры.',
      ],
    },
    faq: {
      ka: [
        {
          question: 'რამდენ ხანს ძლებს იმპლანტი?',
          answer:
            'სწორი ჰიგიენისა და რეგულარული პროფილაქტიკური ვიზიტების პირობებში იმპლანტი ათწლეულებს ძლებს. გვირგვინი შეიძლება 10–15 წელიწადში შეიცვალოს, თვითონ იმპლანტი კი ძვალში რჩება.',
        },
        {
          question: 'მტკივნეულია პროცედურა?',
          answer:
            'ჩადგმა ხდება ადგილობრივი გაუტკივარებით და პაციენტი ტკივილს არ გრძნობს. პროცედურის შემდეგ 2–3 დღე შესაძლებელია მცირე შეშუპება, რაც ჩვეულებრივი ტკივილგამაყუჩებლით იმართება. მოთხოვნისამებრ ხელმისაწვდომია სედაცია.',
        },
        {
          question: 'შემიძლია ერთ დღეში მივიღო კბილი?',
          answer:
            'ზოგიერთ შემთხვევაში დიახ - მყისიერი დატვირთვის პროტოკოლით დროებითი გვირგვინი იმავე ვიზიტზე იდგმება. ეს დამოკიდებულია ძვლის ხარისხზე და წყდება CBCT-ის შემდეგ.',
        },
      ],
      en: [
        {
          question: 'How long does an implant last?',
          answer:
            'With proper hygiene and regular check-ups an implant lasts for decades. The crown may need replacing after 10–15 years, while the implant itself stays in the bone.',
        },
        {
          question: 'Is the procedure painful?',
          answer:
            'Placement is done under local anaesthesia and you feel no pain. Mild swelling for two or three days afterwards is normal and managed with ordinary painkillers. Sedation is available on request.',
        },
        {
          question: 'Can I get a tooth in a single day?',
          answer:
            'In some cases yes - with an immediate loading protocol a temporary crown is fitted at the same visit. This depends on bone quality and is decided after the CBCT scan.',
        },
      ],
      ru: [
        {
          question: 'Сколько служит имплант?',
          answer:
            'При правильной гигиене и регулярных осмотрах имплант служит десятилетиями. Коронку может потребоваться заменить через 10–15 лет, сам имплант остаётся в кости.',
        },
        {
          question: 'Больно ли это?',
          answer:
            'Установка проходит под местной анестезией, боли вы не почувствуете. Лёгкий отёк в течение двух-трёх дней - норма и снимается обычными обезболивающими. По запросу доступна седация.',
        },
        {
          question: 'Можно получить зуб за один день?',
          answer:
            'В некоторых случаях да - по протоколу немедленной нагрузки временная коронка ставится в тот же визит. Это зависит от качества кости и решается после КЛКТ.',
        },
      ],
    },
  },

  {
    slug: 'veneers',
    icon: 'veneer',
    order: 20,
    featured: true,
    priceFrom: 450,
    image: 'veneers',
    title: { ka: 'ვინირები', en: 'Veneers', ru: 'Виниры' },
    shortTitle: { ka: 'ვინირები', en: 'Veneers', ru: 'Виниры' },
    excerpt: {
      ka: 'თხელი კერამიკული ფირფიტები, რომლებიც ასწორებს ფერს, ფორმასა და მცირე ღრიჭოებს - ბუნებრივი და ესთეტიკური ღიმილი ხანგრძლივი შედეგით.',
      en: 'Thin ceramic shells that correct colour, shape and small gaps - a natural, aesthetic smile with a long-lasting result.',
      ru: 'Тонкие керамические пластинки, исправляющие цвет, форму и небольшие щели - естественная эстетичная улыбка с долговременным результатом.',
    },
    duration: { ka: '2–3 ვიზიტი · 2–3 კვირა', en: '2–3 visits · 2–3 weeks', ru: '2–3 визита · 2–3 недели' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'ციფრული Smile Design - შედეგს ხედავთ დაწყებამდე', icon: 'sparkle' },
        { text: 'მინიმალური ჩარევა კბილის ქსოვილში', icon: 'shield' },
        { text: 'ინდივიდუალური ფერის შერჩევა', icon: 'check' },
      ],
      en: [
        { text: 'Digital smile design - see the result before we start', icon: 'sparkle' },
        { text: 'Minimal reduction of natural tooth tissue', icon: 'shield' },
        { text: 'Individually matched shade', icon: 'check' },
      ],
      ru: [
        { text: 'Цифровой Smile Design - результат виден заранее', icon: 'sparkle' },
        { text: 'Минимальное препарирование зуба', icon: 'shield' },
        { text: 'Индивидуальный подбор оттенка', icon: 'check' },
      ],
    },
    body: {
      ka: [
        'ვინირი არის თხელი, ინდივიდუალურად დამზადებული კერამიკული ფირფიტა, რომელიც კბილის წინა ზედაპირზე ფიქსირდება. ის ერთდროულად წყვეტს რამდენიმე ესთეტიკურ პრობლემას: შეფერილობას, რომელიც გათეთრებას არ ემორჩილება, მცირე ღრიჭოებს, არათანაბარ კიდეებს, ოდნავ მოტრიალებულ კბილს და ნაცვეთ ზედაპირს.',
        '## ციფრული დაგეგმვა',
        'მუშაობას ვიწყებთ ფოტოპროტოკოლითა და ციფრული ღიმილის დიზაინით. თქვენ ხედავთ მომავალ შედეგს ეკრანზე ჯერ კიდევ მაშინ, როცა კბილს არავინ შეხებია - და შეგიძლიათ მოითხოვოთ ცვლილება ფორმაში, სიგრძეში ან ფერში. მხოლოდ შეთანხმების შემდეგ ვიწყებთ პრეპარირებას.',
        '## მინიმალური ჩარევა',
        'თანამედროვე მასალები საშუალებას გვაძლევს ვინირი 0.3–0.5 მმ სისქის გავაკეთოთ, რაც ნიშნავს, რომ კბილის საკუთარი ქსოვილის უმეტესი ნაწილი ხელუხლებელი რჩება. ზოგიერთ შემთხვევაში პრეპარირება საერთოდ არ არის საჭირო.',
        '## შედეგის ხანგრძლივობა',
        'კერამიკული ვინირი არ იფერება ყავის, ჩაის ან სიგარეტისგან - მისი ზედაპირი ბუნებრივ მინანქარზე გლუვია. სწორი მოვლის პირობებში ვინირები 10–15 წელი და მეტიც ძლებს. მთავარი პირობა ღამის კბილთა კრაჭუნის (ბრუქსიზმის) კონტროლია - ასეთ შემთხვევაში ვნიშნავთ ღამის კაპას.',
      ],
      en: [
        'A veneer is a thin, individually made ceramic shell bonded to the front surface of a tooth. It solves several aesthetic problems at once: discolouration that whitening cannot lift, small gaps, uneven edges, slightly rotated teeth and worn surfaces.',
        '## Digital planning',
        'We begin with a photo protocol and a digital smile design. You see the intended result on screen before anything is done to your teeth, and you can ask for changes to shape, length or shade. Preparation only starts once you have approved the design.',
        '## Minimal intervention',
        'Modern materials let us make veneers 0.3–0.5 mm thick, which means most of your own tooth tissue stays untouched. In some cases no preparation is required at all.',
        '## How long the result lasts',
        'Ceramic veneers do not stain from coffee, tea or cigarettes - their surface is smoother than natural enamel. With proper care veneers last 10–15 years and often longer. The main condition is controlling night-time grinding (bruxism); where present we fit a night guard.',
      ],
      ru: [
        'Винир - это тонкая керамическая пластинка индивидуального изготовления, которая фиксируется на переднюю поверхность зуба. Она решает сразу несколько эстетических задач: потемнение, не поддающееся отбеливанию, небольшие щели, неровные края, слегка повёрнутые зубы и стёртые поверхности.',
        '## Цифровое планирование',
        'Работа начинается с фотопротокола и цифрового дизайна улыбки. Вы видите будущий результат на экране ещё до того, как к зубам кто-то прикоснулся, и можете попросить изменить форму, длину или оттенок. Препарирование начинается только после вашего согласования.',
        '## Минимальное вмешательство',
        'Современные материалы позволяют делать виниры толщиной 0,3–0,5 мм, то есть большая часть собственных тканей зуба остаётся нетронутой. В части случаев препарирование не требуется вовсе.',
        '## Долговечность результата',
        'Керамические виниры не окрашиваются от кофе, чая и сигарет - их поверхность глаже натуральной эмали. При правильном уходе виниры служат 10–15 лет и дольше. Главное условие - контроль ночного скрежета (бруксизма); при его наличии мы изготавливаем ночную капу.',
      ],
    },
    faq: {
      ka: [
        {
          question: 'რამდენი ვინირია საჭირო?',
          answer:
            'დამოკიდებულია იმაზე, რამდენი კბილი ჩანს ღიმილისას. ყველაზე ხშირად კეთდება 6, 8 ან 10 ვინირი ზედა ყბაზე. ზუსტ რაოდენობას ციფრული დიზაინის ეტაპზე ერთად ვადგენთ.',
        },
        {
          question: 'ვინირი აზიანებს კბილს?',
          answer:
            'თანამედროვე მინიმალურ-ინვაზიური პროტოკოლით ჩამოიშლება მინანქრის მხოლოდ 0.3–0.5 მმ. ეს შეუქცევადია, მაგრამ კბილის სიცოცხლისუნარიანობას არ აზიანებს.',
        },
      ],
      en: [
        {
          question: 'How many veneers do I need?',
          answer:
            'It depends on how many teeth are visible when you smile. Most often 6, 8 or 10 veneers are made for the upper jaw. We agree the exact number together during the digital design stage.',
        },
        {
          question: 'Do veneers damage the tooth?',
          answer:
            'With a modern minimally invasive protocol only 0.3–0.5 mm of enamel is reduced. This is irreversible but does not affect the vitality of the tooth.',
        },
      ],
      ru: [
        {
          question: 'Сколько виниров нужно?',
          answer:
            'Зависит от того, сколько зубов видно при улыбке. Чаще всего изготавливают 6, 8 или 10 виниров на верхнюю челюсть. Точное количество мы определяем вместе на этапе цифрового дизайна.',
        },
        {
          question: 'Портят ли виниры зубы?',
          answer:
            'При современном малоинвазивном протоколе снимается лишь 0,3–0,5 мм эмали. Это необратимо, но не влияет на жизнеспособность зуба.',
        },
      ],
    },
  },

  {
    slug: 'teeth-whitening',
    icon: 'whitening',
    order: 30,
    featured: true,
    priceFrom: 250,
    image: 'whitening',
    title: { ka: 'კბილების გათეთრება', en: 'Teeth Whitening', ru: 'Отбеливание зубов' },
    shortTitle: { ka: 'გათეთრება', en: 'Whitening', ru: 'Отбеливание' },
    excerpt: {
      ka: 'უსაფრთხო პროფესიული გათეთრება, რომელიც აშორებს ყავის, ჩაისა და მოწევის კვალს მინანქრის დაზიანების გარეშე.',
      en: 'Safe professional whitening that removes stains from coffee, tea and smoking without damaging the enamel.',
      ru: 'Безопасное профессиональное отбеливание, которое удаляет следы кофе, чая и курения без вреда для эмали.',
    },
    duration: { ka: '1 ვიზიტი · 60–90 წუთი', en: '1 visit · 60–90 minutes', ru: '1 визит · 60–90 минут' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'მინანქრის ჯანმრთელობის დაცვა', icon: 'shield' },
        { text: 'მგრძნობელობის მინიმიზაცია რემინერალიზაციით', icon: 'heart' },
        { text: 'შედეგი ერთ ვიზიტში', icon: 'clock' },
      ],
      en: [
        { text: 'Enamel health is preserved', icon: 'shield' },
        { text: 'Sensitivity minimised with remineralisation', icon: 'heart' },
        { text: 'Visible result in a single visit', icon: 'clock' },
      ],
      ru: [
        { text: 'Сохранение здоровья эмали', icon: 'shield' },
        { text: 'Минимизация чувствительности реминерализацией', icon: 'heart' },
        { text: 'Результат за один визит', icon: 'clock' },
      ],
    },
    body: {
      ka: [
        'პროფესიული გათეთრება ეფექტური და უსაფრთხო ესთეტიკური პროცედურაა, რომელიც ანათებს ღიმილს და აშორებს ყავის, ჩაის, წითელი ღვინის, მოწევისა და ყოველდღიური ჩვევებით გამოწვეულ შეფერილობას.',
        '## მომზადება აუცილებელი ეტაპია',
        'გათეთრებამდე ყოველთვის ვასრულებთ პროფესიულ ჰიგიენას. ნადებისა და კბილის ქვის მოცილების გარეშე შედეგი არათანაბარი იქნება. ამავე ვიზიტზე ვამოწმებთ, არის თუ არა კარიესი ან ღრძილის ანთება - ორივე გათეთრების უკუჩვენებაა სანამ არ განიკურნება.',
        '## პროცედურა',
        'ღრძილს ვიცავთ დამცავი ბარიერით, კბილზე ვდებთ გელს და ვააქტიურებთ ლამპით. ციკლი 15 წუთია და მეორდება 2–4-ჯერ, სასურველი შედეგის მიხედვით. საშუალოდ კბილი 3–8 ტონით ნათდება.',
        '## მგრძნობელობის მართვა',
        'გათეთრების შემდეგ დროებითი მგრძნობელობა ნორმალურია და 24–48 საათში ქრება. მისი შესამცირებლად პროცედურის ბოლოს ვატარებთ რემინერალიზაციას ფტორისა და კალციუმის შემცველი პრეპარატებით.',
        '## როგორ შევინარჩუნოთ შედეგი',
        'პირველი 48 საათი მნიშვნელოვანია - ამ პერიოდში მინანქრის ფორები ღიაა. თავი აარიდეთ ყავას, შავ ჩაის, წითელ ღვინოს, სოიოს სოუსსა და მოწევას. შემდგომში შედეგი საშუალოდ 1–2 წელი ინარჩუნებს, ჩვევებზე დამოკიდებულებით.',
      ],
      en: [
        'Professional whitening is an effective and safe cosmetic treatment that brightens your smile and removes stains caused by coffee, tea, red wine, smoking and everyday lifestyle factors.',
        '## Preparation is part of the treatment',
        'We always perform professional hygiene before whitening. Without removing plaque and calculus the result would be uneven. At the same visit we check for decay or gum inflammation - both are contraindications until treated.',
        '## The procedure',
        'The gums are isolated with a protective barrier, whitening gel is applied and activated with a lamp. Each cycle lasts 15 minutes and is repeated two to four times depending on the target shade. Teeth typically lighten by three to eight shades.',
        '## Managing sensitivity',
        'Temporary sensitivity after whitening is normal and passes within 24–48 hours. To reduce it we finish the session with a remineralisation treatment containing fluoride and calcium.',
        '## Keeping the result',
        'The first 48 hours matter most, as the pores of the enamel are still open. Avoid coffee, black tea, red wine, soy sauce and smoking. After that the result typically holds for one to two years depending on your habits.',
      ],
      ru: [
        'Профессиональное отбеливание - эффективная и безопасная эстетическая процедура, которая осветляет улыбку и удаляет пятна от кофе, чая, красного вина, курения и повседневных привычек.',
        '## Подготовка - обязательный этап',
        'Перед отбеливанием мы всегда проводим профессиональную гигиену. Без снятия налёта и камня результат получится неравномерным. На этом же приёме проверяем наличие кариеса и воспаления дёсен - и то, и другое является противопоказанием до излечения.',
        '## Процедура',
        'Дёсны изолируются защитным барьером, на зубы наносится гель и активируется лампой. Один цикл длится 15 минут и повторяется два-четыре раза в зависимости от желаемого оттенка. В среднем зубы светлеют на 3–8 тонов.',
        '## Контроль чувствительности',
        'Временная чувствительность после отбеливания - это норма, она проходит за 24–48 часов. Чтобы её уменьшить, в конце приёма мы проводим реминерализацию препаратами с фтором и кальцием.',
        '## Как сохранить результат',
        'Первые 48 часов самые важные - поры эмали ещё открыты. Избегайте кофе, чёрного чая, красного вина, соевого соуса и курения. Далее результат сохраняется в среднем один-два года в зависимости от привычек.',
      ],
    },
    faq: {
      ka: [
        {
          question: 'აზიანებს თუ არა გათეთრება მინანქარს?',
          answer:
            'პროფესიული პროტოკოლით - არა. გელის კონცენტრაცია და ექსპოზიციის დრო კონტროლირებადია, ხოლო ბოლოს ტარდება რემინერალიზაცია. საშინაო „ხალხური" მეთოდები (სოდა, ლიმონი, აქტივირებული ნახშირი) ბევრად უფრო საშიშია.',
        },
      ],
      en: [
        {
          question: 'Does whitening damage enamel?',
          answer:
            'Not with a professional protocol. Gel concentration and exposure time are controlled, and the session ends with remineralisation. Home remedies such as baking soda, lemon or activated charcoal are far more damaging.',
        },
      ],
      ru: [
        {
          question: 'Портит ли отбеливание эмаль?',
          answer:
            'При профессиональном протоколе - нет. Концентрация геля и время экспозиции контролируются, а приём завершается реминерализацией. Домашние «народные» методы (сода, лимон, активированный уголь) гораздо опаснее.',
        },
      ],
    },
  },

  {
    slug: 'orthodontics',
    icon: 'braces',
    order: 40,
    featured: true,
    priceFrom: 1800,
    image: 'orthodontics',
    title: { ka: 'ორთოდონტია', en: 'Orthodontics', ru: 'Ортодонтия' },
    shortTitle: { ka: 'ორთოდონტია', en: 'Orthodontics', ru: 'Ортодонтия' },
    excerpt: {
      ka: 'ბრეკეტები, ელაინერები და რეტეინერები - კბილების სწორება და ნაკბენის კორექცია ბავშვებსა და მოზრდილებში.',
      en: 'Braces, aligners and retainers - straightening teeth and correcting the bite for both children and adults.',
      ru: 'Брекеты, элайнеры и ретейнеры - выравнивание зубов и коррекция прикуса у детей и взрослых.',
    },
    duration: { ka: '6–24 თვე', en: '6–24 months', ru: '6–24 месяца' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'მეტალის, კერამიკული და საფირონის ბრეკეტები', icon: 'braces' },
        { text: 'თვითლიგირებადი სისტემები - ნაკლები ვიზიტი', icon: 'clock' },
        { text: 'გამჭვირვალე ელაინერები მოზრდილებისთვის', icon: 'sparkle' },
        { text: 'ინდივიდუალური რეტეინერები შედეგის შესანარჩუნებლად', icon: 'shield' },
      ],
      en: [
        { text: 'Metal, ceramic and sapphire braces', icon: 'braces' },
        { text: 'Self-ligating systems - fewer appointments', icon: 'clock' },
        { text: 'Clear aligners for adults', icon: 'sparkle' },
        { text: 'Custom retainers to hold the result', icon: 'shield' },
      ],
      ru: [
        { text: 'Металлические, керамические и сапфировые брекеты', icon: 'braces' },
        { text: 'Самолигирующие системы - меньше визитов', icon: 'clock' },
        { text: 'Прозрачные элайнеры для взрослых', icon: 'sparkle' },
        { text: 'Индивидуальные ретейнеры для удержания результата', icon: 'shield' },
      ],
    },
    body: {
      ka: [
        'ორთოდონტიული მკურნალობა ასწორებს არასწორად განლაგებულ კბილებს, ნაკბენის პრობლემებსა და ყბის პოზიციას. ეს არა მხოლოდ ესთეტიკის საკითხია - არასწორი ნაკბენი იწვევს მინანქრის არათანაბარ ცვეთას, ღრძილის რეცესიას, საფეთქელ-ქვედაყბის სახსრის ტკივილსა და კარიესის მაღალ რისკს იმ ადგილებში, სადაც ჯაგრისი ვერ აღწევს.',
        '## რა სისტემებს ვთავაზობთ',
        'კლინიკაში ხელმისაწვდომია მეტალის ბრეკეტები, კერამიკული და საფირონის ესთეტიკური ბრეკეტები, თვითლიგირებადი სისტემები და გამჭვირვალე ელაინერები. არჩევანი დამოკიდებულია ქეისის სირთულეზე, ასაკსა და თქვენს ცხოვრების წესზე - ელაინერები, მაგალითად, მოსახსნელია და საჯარო პროფესიის ადამიანებისთვის მოსახერხებელი, მაგრამ ყველა ქეისს არ ერგება.',
        '## დიაგნოსტიკა და დაგეგმვა',
        'მკურნალობა იწყება პანორამული სურათით, ცეფალომეტრიული ანალიზითა და ციფრული ანაბეჭდით. ამ მონაცემებზე დაყრდნობით ორთოდონტი ადგენს გეგმას და გიჩვენებთ სავარაუდო ვადას. საშუალო ხანგრძლივობა 12–18 თვეა, მსუბუქი ქეისები 6 თვეშიც სრულდება.',
        '## რეტენციის ფაზა - ყველაზე ხშირად უგულებელყოფილი ეტაპი',
        'ბრეკეტების მოხსნის შემდეგ კბილებს აქვთ საწყის პოზიციაზე დაბრუნების ტენდენცია. სწორედ ამიტომ ვამზადებთ ინდივიდუალურ რეტეინერს - ფიქსირებულს კბილების უკანა ზედაპირზე ან მოსახსნელს ღამით სატარებლად. რეტენციის უგულებელყოფა წლების შრომას აქარწყლებს.',
        '## მოზრდილებისთვის',
        'ორთოდონტიას ასაკობრივი ზღვარი არ აქვს. მთავარია ღრძილისა და ძვლის ჯანმრთელობა - თუ პაროდონტის მდგომარეობა სტაბილურია, კბილები ნებისმიერ ასაკში მოძრაობს.',
      ],
      en: [
        'Orthodontic treatment corrects misaligned teeth, bite problems and jaw positioning. This is not only an aesthetic matter - a bad bite causes uneven enamel wear, gum recession, jaw joint pain and a higher risk of decay in areas a brush cannot reach.',
        '## The systems we offer',
        'The clinic provides metal braces, aesthetic ceramic and sapphire braces, self-ligating systems and clear aligners. The choice depends on case complexity, age and your lifestyle - aligners, for instance, are removable and convenient for people in public-facing roles, but they are not suitable for every case.',
        '## Diagnosis and planning',
        'Treatment starts with a panoramic X-ray, cephalometric analysis and a digital impression. Based on this the orthodontist builds a plan and shows you the expected timeline. Average duration is 12–18 months; mild cases can finish in six.',
        '## Retention - the most frequently neglected stage',
        'After braces come off, teeth tend to drift back toward their original position. This is why we make an individual retainer, either fixed to the back surfaces of the teeth or removable for night-time wear. Skipping retention undoes years of work.',
        '## For adults',
        'Orthodontics has no age limit. What matters is the health of the gums and bone - if the periodontal condition is stable, teeth can be moved at any age.',
      ],
      ru: [
        'Ортодонтическое лечение исправляет неправильно расположенные зубы, проблемы прикуса и положение челюсти. Это вопрос не только эстетики - неправильный прикус приводит к неравномерному стиранию эмали, рецессии дёсен, болям в височно-нижнечелюстном суставе и высокому риску кариеса там, где щётка не достаёт.',
        '## Какие системы мы предлагаем',
        'В клинике доступны металлические брекеты, эстетические керамические и сапфировые брекеты, самолигирующие системы и прозрачные элайнеры. Выбор зависит от сложности случая, возраста и вашего образа жизни - элайнеры, например, съёмные и удобны для публичных профессий, но подходят не для всех случаев.',
        '## Диагностика и планирование',
        'Лечение начинается с панорамного снимка, цефалометрического анализа и цифрового слепка. На основе этих данных ортодонт составляет план и показывает предполагаемые сроки. Средняя длительность - 12–18 месяцев, лёгкие случаи завершаются за шесть.',
        '## Ретенция - самый часто игнорируемый этап',
        'После снятия брекетов зубы стремятся вернуться в исходное положение. Поэтому мы изготавливаем индивидуальный ретейнер - фиксированный на внутренней поверхности зубов или съёмный для ношения ночью. Пренебрежение ретенцией сводит на нет годы работы.',
        '## Для взрослых',
        'У ортодонтии нет возрастных ограничений. Важно состояние дёсен и кости - если пародонт стабилен, зубы перемещаются в любом возрасте.',
      ],
    },
    faq: {
      ka: [
        {
          question: 'რამდენად ხშირად უნდა მივიდე ვიზიტზე?',
          answer:
            'კლასიკური ბრეკეტების შემთხვევაში - ყოველ 4–6 კვირაში. თვითლიგირებადი სისტემებით ინტერვალი 8–10 კვირამდე იზრდება, რაც ხელსაყრელია საზღვარგარეთ მცხოვრები პაციენტებისთვის.',
        },
      ],
      en: [
        {
          question: 'How often do I need appointments?',
          answer:
            'With conventional braces, every four to six weeks. Self-ligating systems extend the interval to eight to ten weeks, which suits patients living abroad.',
        },
      ],
      ru: [
        {
          question: 'Как часто нужно приходить на приём?',
          answer:
            'С классическими брекетами - каждые 4–6 недель. Самолигирующие системы увеличивают интервал до 8–10 недель, что удобно для пациентов, живущих за рубежом.',
        },
      ],
    },
  },

  {
    slug: 'oral-surgery',
    icon: 'surgery',
    order: 50,
    featured: true,
    priceFrom: 120,
    image: 'surgery',
    title: { ka: 'ქირურგია', en: 'Oral Surgery', ru: 'Хирургия' },
    shortTitle: { ka: 'ქირურგია', en: 'Surgery', ru: 'Хирургия' },
    excerpt: {
      ka: 'კბილის ექსტრაქცია, სიბრძნის კბილის ამოღება, ძვლის გადანერგვა და ღრძილის ქირურგია - თანამედროვე ტექნიკით და კომფორტული აღდგენით.',
      en: 'Extractions, wisdom tooth removal, bone grafting and gum surgery - modern techniques and a comfortable recovery.',
      ru: 'Удаление зубов, удаление зубов мудрости, костная пластика и хирургия дёсен - современные техники и комфортное восстановление.',
    },
    duration: { ka: '1 ვიზიტი · 30–90 წუთი', en: '1 visit · 30–90 minutes', ru: '1 визит · 30–90 минут' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'ყბა-სახის ქირურგი კლინიკაში', icon: 'shield' },
        { text: 'სედაცია და ზოგადი გაუტკივარება', icon: 'heart' },
        { text: 'CBCT დიაგნოსტიკა ოპერაციამდე', icon: 'scan' },
      ],
      en: [
        { text: 'Maxillofacial surgeon on site', icon: 'shield' },
        { text: 'Sedation and general anaesthesia', icon: 'heart' },
        { text: 'CBCT imaging before surgery', icon: 'scan' },
      ],
      ru: [
        { text: 'Челюстно-лицевой хирург в клинике', icon: 'shield' },
        { text: 'Седация и общий наркоз', icon: 'heart' },
        { text: 'КЛКТ-диагностика перед операцией', icon: 'scan' },
      ],
    },
    body: {
      ka: [
        'სტომატოლოგიური ქირურგია მოიცავს პროცედურების ფართო სპექტრს, რომელიც მიმართულია პირის ღრუს ჯანმრთელობის, ფუნქციისა და კომფორტის აღდგენაზე: კბილის ექსტრაქცია, სიბრძნის კბილის ამოღება, ძვლის გადანერგვა, ღრძილის ქირურგია და იმპლანტაციისთვის მომზადება.',
        '## სიბრძნის კბილი',
        'რვიანი ხშირად რჩება ძვალში ან ამოდის არასწორი კუთხით, რაც აზიანებს მეზობელ კბილს და იწვევს განმეორებად ანთებას. ამოღებამდე ყოველთვის ვასრულებთ CBCT-ს - ის ზუსტად აჩვენებს ფესვების ურთიერთობას ქვედა ყბის ნერვთან და გაიდლენდ სინუსთან, რაც გართულებების რისკს მკვეთრად ამცირებს.',
        '## გაუტკივარება და კომფორტი',
        'პაციენტების ნაწილისთვის ქირურგიული ჩარევა ფსიქოლოგიურად რთულია. კლინიკაში ხელმისაწვდომია სედაცია და ზოგადი გაუტკივარება - ეს განსაკუთრებით სასარგებლოა მაშინ, როცა ერთ ვიზიტში რამდენიმე კბილის ამოღება ან ვრცელი ჩარევაა საჭირო.',
        '## ძვლის გადანერგვა',
        'კბილის ამოღების შემდეგ ალვეოლური ძვალი პირველი 6 თვის განმავლობაში ყველაზე აქტიურად იკლებს. თუ მომავალში იმპლანტს გეგმავთ, რეკომენდებულია ამოღებისთანავე ძვლის შენარჩუნება (socket preservation) - ეს ბევრად იაფი და მარტივია, ვიდრე მოგვიანებით სრული ავგმენტაცია.',
        '## აღდგენის პერიოდი',
        'ყოველი პაციენტი იღებს წერილობით ინსტრუქციას: რა ჭამოს, როგორ გაიკეთოს პირის ღრუს ჰიგიენა, რა შემთხვევაში დაგვირეკოს. პირველი 24 საათი გადამწყვეტია სისხლის კოლტის შესანარჩუნებლად - სწორედ მისი დაკარგვა იწვევს მშრალ ბუდეს (alveolar osteitis).',
      ],
      en: [
        'Oral surgery covers a broad range of procedures aimed at restoring oral health, function and comfort: extractions, wisdom tooth removal, bone grafting, gum surgery and preparation for implants.',
        '## Wisdom teeth',
        'Third molars often stay trapped in the bone or erupt at an angle, damaging the neighbouring tooth and causing recurring inflammation. We always take a CBCT scan before removal - it shows exactly how the roots relate to the mandibular nerve and the maxillary sinus, which sharply reduces the risk of complications.',
        '## Anaesthesia and comfort',
        'For some patients surgery is psychologically difficult. Sedation and general anaesthesia are available at the clinic, which is particularly useful when several teeth are removed in one session or the procedure is extensive.',
        '## Bone grafting',
        'After an extraction the alveolar bone resorbs fastest during the first six months. If you are planning an implant later, socket preservation at the time of extraction is strongly recommended - it is far cheaper and simpler than a full augmentation afterwards.',
        '## Recovery',
        'Every patient receives written aftercare instructions: what to eat, how to clean the area, and when to call us. The first 24 hours are decisive for keeping the blood clot in place - losing it is what causes dry socket (alveolar osteitis).',
      ],
      ru: [
        'Стоматологическая хирургия включает широкий спектр процедур, направленных на восстановление здоровья, функции и комфорта полости рта: удаление зубов, удаление зубов мудрости, костную пластику, хирургию дёсен и подготовку к имплантации.',
        '## Зубы мудрости',
        'Восьмёрки часто остаются в кости или прорезываются под углом, повреждая соседний зуб и вызывая повторяющиеся воспаления. Перед удалением мы всегда выполняем КЛКТ - снимок точно показывает отношение корней к нижнечелюстному нерву и гайморовой пазухе, что резко снижает риск осложнений.',
        '## Анестезия и комфорт',
        'Для части пациентов хирургическое вмешательство психологически тяжело. В клинике доступны седация и общий наркоз - это особенно полезно, когда за один приём удаляется несколько зубов или требуется объёмное вмешательство.',
        '## Костная пластика',
        'После удаления альвеолярная кость убывает активнее всего в первые шесть месяцев. Если вы планируете имплант в будущем, рекомендуется сохранение лунки (socket preservation) сразу при удалении - это значительно дешевле и проще, чем полная аугментация позже.',
        '## Период восстановления',
        'Каждый пациент получает письменную инструкцию: что есть, как ухаживать за полостью рта, в каких случаях звонить нам. Первые 24 часа решающие для сохранения кровяного сгустка - именно его потеря приводит к сухой лунке (альвеолиту).',
      ],
    },
    faq: {
      ka: [
        {
          question: 'რამდენ ხანში ვრჩები სახლში ამოღების შემდეგ?',
          answer:
            'მარტივი ექსტრაქციის შემდეგ იმავე დღეს უბრუნდებით ჩვეულ რეჟიმს. რთული სიბრძნის კბილის ამოღების შემდეგ რეკომენდებულია 1–2 დღე ფიზიკური დატვირთვის გარეშე.',
        },
      ],
      en: [
        {
          question: 'How much downtime should I expect?',
          answer:
            'After a simple extraction you return to normal the same day. After a complex wisdom tooth removal we recommend one to two days without physical exertion.',
        },
      ],
      ru: [
        {
          question: 'Сколько времени нужно на восстановление?',
          answer:
            'После простого удаления вы возвращаетесь к обычному режиму в тот же день. После сложного удаления зуба мудрости рекомендуется один-два дня без физических нагрузок.',
        },
      ],
    },
  },

  {
    slug: 'restoration-fillings',
    icon: 'filling',
    order: 60,
    featured: true,
    priceFrom: 90,
    image: 'restoration',
    title: {
      ka: 'რესტავრაცია და ბჟენი',
      en: 'Restoration & Fillings',
      ru: 'Реставрация и пломбирование',
    },
    shortTitle: { ka: 'რესტავრაცია', en: 'Restoration', ru: 'Реставрация' },
    excerpt: {
      ka: 'დაზიანებული, ნაცვეთი ან კარიესით დაზარალებული კბილის აღდგენა კბილის ფერის მასალებით - სიმტკიცე, ფუნქცია და ბუნებრივი იერსახე.',
      en: 'Rebuilding damaged, worn or decayed teeth with tooth-coloured materials - strength, function and a natural appearance.',
      ru: 'Восстановление повреждённых, стёртых или поражённых кариесом зубов материалами под цвет зуба - прочность, функция и естественный вид.',
    },
    duration: { ka: '1 ვიზიტი · 40–60 წუთი', en: '1 visit · 40–60 minutes', ru: '1 визит · 40–60 минут' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'კბილის ფერის კომპოზიტური მასალები', icon: 'sparkle' },
        { text: 'მინიმალურ-ინვაზიური მიდგომა', icon: 'shield' },
        { text: 'ერთ ვიზიტში დასრულებული შედეგი', icon: 'clock' },
      ],
      en: [
        { text: 'Tooth-coloured composite materials', icon: 'sparkle' },
        { text: 'Minimally invasive approach', icon: 'shield' },
        { text: 'Completed in a single visit', icon: 'clock' },
      ],
      ru: [
        { text: 'Композитные материалы под цвет зуба', icon: 'sparkle' },
        { text: 'Малоинвазивный подход', icon: 'shield' },
        { text: 'Результат за один визит', icon: 'clock' },
      ],
    },
    body: {
      ka: [
        'ესთეტიკური აღმდგენი სტომატოლოგია მიმართულია დაზიანებული, ნაცვეთი ან კარიესით დაზარალებული კბილის აღდგენაზე ისე, რომ შენარჩუნდეს ბუნებრივი და მიმზიდველი იერსახე.',
        '## მასალა და ფერი',
        'ვიყენებთ თანამედროვე კომპოზიტურ მასალებს, რომელთა ფერი ინდივიდუალურად შეირჩევა თქვენი კბილის ბუნებრივი ტონის მიხედვით. სწორად შესრულებული რესტავრაცია ვიზუალურად არ განსხვავდება საკუთარი კბილისგან.',
        '## მინიმალურ-ინვაზიური პრინციპი',
        'რაც უფრო მეტი საკუთარი ქსოვილი შენარჩუნდება, მით უფრო ხანგრძლივია კბილის სიცოცხლე. ჩვენ ვაშორებთ მხოლოდ დაზიანებულ ნაწილს და ვტოვებთ ჯანმრთელ სტრუქტურას. დიდი დანაკარგის შემთხვევაში კომპოზიტის ნაცვლად ვთავაზობთ კერამიკულ ინლეის ან გვირგვინს - ისინი უფრო მდგრადია საღეჭი დატვირთვის მიმართ.',
        '## როდის აღარ არის ბჟენი საკმარისი',
        'თუ კბილის კრონის ნახევარზე მეტი დაკარგულია, ან ჩატარებულია ფესვის არხების მკურნალობა, კომპოზიტური ბჟენი დროთა განმავლობაში იბზარება. ასეთ შემთხვევაში სწორი გადაწყვეტილებაა კერამიკული გვირგვინი - მას ჩვენივე ლაბორატორია ამზადებს.',
      ],
      en: [
        'Aesthetic restorative dentistry focuses on rebuilding damaged, worn or decayed teeth while preserving a natural and attractive appearance.',
        '## Material and shade',
        'We use modern composite materials whose shade is individually matched to the natural tone of your teeth. A well-executed restoration is visually indistinguishable from your own tooth.',
        '## The minimally invasive principle',
        'The more of your own tissue is preserved, the longer the tooth survives. We remove only the damaged part and leave healthy structure intact. Where the loss is extensive we recommend a ceramic inlay or crown instead of composite, as they withstand chewing load far better.',
        '## When a filling is no longer enough',
        'If more than half the crown of the tooth is gone, or the root canals have been treated, a composite filling will eventually crack. In those cases a ceramic crown is the correct solution - and ours are made in our own laboratory.',
      ],
      ru: [
        'Эстетическая восстановительная стоматология направлена на реконструкцию повреждённых, стёртых или поражённых кариесом зубов с сохранением естественного и привлекательного вида.',
        '## Материал и оттенок',
        'Мы используем современные композитные материалы, оттенок которых подбирается индивидуально под естественный тон ваших зубов. Качественно выполненная реставрация визуально неотличима от собственного зуба.',
        '## Принцип минимальной инвазивности',
        'Чем больше собственных тканей сохранено, тем дольше живёт зуб. Мы удаляем только повреждённую часть и оставляем здоровую структуру. При значительной потере тканей вместо композита мы предлагаем керамическую вкладку или коронку - они гораздо устойчивее к жевательной нагрузке.',
        '## Когда пломбы уже недостаточно',
        'Если утрачено более половины коронки зуба или пролечены корневые каналы, композитная пломба со временем даст трещину. В таких случаях правильное решение - керамическая коронка, которую изготавливает наша собственная лаборатория.',
      ],
    },
    faq: {
      ka: [
        {
          question: 'რამდენ ხანს ძლებს კომპოზიტური ბჟენი?',
          answer:
            'საშუალოდ 5–8 წელი, დამოკიდებულია ზომაზე, მდებარეობასა და ჰიგიენაზე. საღეჭ კბილებზე დიდი რესტავრაციები უფრო სწრაფად ცვდება, ვიდრე წინა კბილებზე მცირე ბჟენი.',
        },
      ],
      en: [
        {
          question: 'How long does a composite filling last?',
          answer:
            'Typically five to eight years, depending on size, location and hygiene. Large restorations on chewing teeth wear faster than small fillings on front teeth.',
        },
      ],
      ru: [
        {
          question: 'Сколько служит композитная пломба?',
          answer:
            'В среднем 5–8 лет в зависимости от размера, расположения и гигиены. Большие реставрации на жевательных зубах изнашиваются быстрее, чем небольшие пломбы на передних.',
        },
      ],
    },
  },

  {
    slug: 'kids-dentistry',
    icon: 'child',
    order: 70,
    featured: true,
    priceFrom: 60,
    title: {
      ka: 'ბავშვთა სტომატოლოგია',
      en: 'Children’s Dentistry',
      ru: 'Детская стоматология',
    },
    shortTitle: { ka: 'ბავშვები', en: 'Kids', ru: 'Дети' },
    excerpt: {
      ka: 'Dream Land - ბავშვების საკუთარი ბოქსი, საჩუქარი ყოველი ვიზიტის ბოლოს და „სუპერ ღიმილის სიგელი“. ვქმნით ისეთ გამოცდილებას, რომ ბავშვს სტომატოლოგის არ ეშინოდეს.',
      en: 'Dream Land - a treatment box that belongs to the children, a gift at the end of every visit and a Super Smile certificate. We build an experience that leaves no room for dental fear.',
      ru: 'Dream Land - отдельный детский бокс, подарок в конце каждого визита и «Сертификат супер-улыбки». Мы создаём опыт, после которого ребёнок не боится стоматолога.',
    },
    duration: { ka: '1 ვიზიტი · 20–40 წუთი', en: '1 visit · 20–40 minutes', ru: '1 визит · 20–40 минут' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'Dream Land - ბავშვებისთვის გამოყოფილი ბოქსი', icon: 'child' },
        { text: 'საჩუქარი და სერტიფიკატი ყოველი ვიზიტის ბოლოს', icon: 'sparkle' },
        { text: 'თერაპია, ქირურგია, ორთოდონტია და ორთოპედია', icon: 'tooth' },
        { text: 'სედაცია განსაკუთრებით შემშინებული ბავშვებისთვის', icon: 'heart' },
      ],
      en: [
        { text: 'Dream Land - a box dedicated to children', icon: 'child' },
        { text: 'A gift and a certificate at the end of every visit', icon: 'sparkle' },
        { text: 'Therapy, surgery, orthodontics and prosthetics', icon: 'tooth' },
        { text: 'Sedation for particularly anxious children', icon: 'heart' },
      ],
      ru: [
        { text: 'Dream Land - отдельный детский бокс', icon: 'child' },
        { text: 'Подарок и сертификат в конце каждого визита', icon: 'sparkle' },
        { text: 'Терапия, хирургия, ортодонтия и ортопедия', icon: 'tooth' },
        { text: 'Седация для особенно тревожных детей', icon: 'heart' },
      ],
    },
    body: {
      ka: [
        'ბავშვის პირველი გამოცდილება სტომატოლოგთან განსაზღვრავს მის დამოკიდებულებას კბილის მკურნალობისადმი მთელი ცხოვრების განმავლობაში. სწორედ ამიტომ შევქმენით **Dream Land** - ცალკე ბოქსი, რომელიც მხოლოდ ბავშვებისთვისაა და სადაც გარემო არაფრით ჰგავს კლასიკურ სამედიცინო კაბინეტს.',
        '## პირველი ვიზიტი - გაცნობითი',
        'პირველად მოსულ ბავშვს არაფერს ვუკეთებთ ძალით. ვიცნობთ, ვაჩვენებთ ინსტრუმენტებს, ვთვლით კბილებს. ხშირად ეს პირველი შეხვედრა მთლიანად თამაშად გადაიქცევა - და სწორედ ეს არის მიზანი.',
        '## საჩუქარი და სუპერ ღიმილის სიგელი',
        'ყოველი ვიზიტის ბოლოს ბავშვი იღებს საჩუქარს, ხოლო წარმატებით დასრულებული მკურნალობის შემდეგ - **სუპერ ღიმილის სიგელს**. ეს პატარა რიტუალი ვიზიტს სასჯელიდან მიღწევად აქცევს.',
        '## რას ვმკურნალობთ',
        '- რძის კბილების კარიესი და მისი გართულებები',
        '- პროფილაქტიკური ჰერმეტიზაცია (ფისურების დალუქვა)',
        '- ფტორირება და რემინერალიზაცია',
        '- ბავშვთა ქირურგია - რძის კბილის ამოღება',
        '- ადრეული ორთოდონტიული კორექცია',
        '- ბავშვთა ორთოპედია',
        '## სედაცია',
        'თუ ბავშვი ძალიან შემშინებულია ან საჭიროა ვრცელი მკურნალობა ერთ ვიზიტში, ხელმისაწვდომია სედაცია და ზოგადი გაუტკივარება ანესთეზიოლოგის კონტროლით.',
      ],
      en: [
        'A child’s first experience at the dentist shapes their attitude to dental care for life. That is why we built **Dream Land** - a separate treatment box that belongs to children alone, where nothing about the room resembles a clinical surgery.',
        '## The first visit is just an introduction',
        'We never force treatment on a child’s first visit. We get to know each other, show the instruments and count the teeth. That first appointment often turns into pure play - which is exactly the point.',
        '## The gift and the Super Smile certificate',
        'Every visit ends with a gift, and a completed course of treatment earns a **Super Smile certificate**. This small ritual turns the appointment from a punishment into an achievement.',
        '## What we treat',
        '- Decay in baby teeth and its complications',
        '- Preventive fissure sealing',
        '- Fluoride application and remineralisation',
        '- Paediatric surgery, including baby tooth extraction',
        '- Early orthodontic correction',
        '- Paediatric prosthetics',
        '## Sedation',
        'If a child is very anxious, or extensive treatment needs to be completed in one session, sedation and general anaesthesia are available under the supervision of an anaesthesiologist.',
      ],
      ru: [
        'Первый опыт ребёнка у стоматолога определяет его отношение к лечению зубов на всю жизнь. Именно поэтому мы создали **Dream Land** - отдельный бокс, который принадлежит только детям и в котором обстановка ничем не напоминает классический медицинский кабинет.',
        '## Первый визит - знакомство',
        'В первый раз мы ничего не делаем через силу. Знакомимся, показываем инструменты, считаем зубы. Часто эта первая встреча целиком превращается в игру - и это именно то, что нужно.',
        '## Подарок и «Сертификат супер-улыбки»',
        'В конце каждого визита ребёнок получает подарок, а после успешно завершённого лечения - **сертификат супер-улыбки**. Этот маленький ритуал превращает визит из наказания в достижение.',
        '## Что мы лечим',
        '- Кариес молочных зубов и его осложнения',
        '- Профилактическую герметизацию фиссур',
        '- Фторирование и реминерализацию',
        '- Детскую хирургию - удаление молочных зубов',
        '- Раннюю ортодонтическую коррекцию',
        '- Детскую ортопедию',
        '## Седация',
        'Если ребёнок очень боится или требуется объёмное лечение за один приём, доступны седация и общий наркоз под контролем анестезиолога.',
      ],
    },
    faq: {
      ka: [
        {
          question: 'რა ასაკში უნდა მოვიყვანო ბავშვი პირველად?',
          answer:
            'პირველი ვიზიტი რეკომენდებულია პირველი კბილის ამოსვლიდან 6 თვის განმავლობაში, ანუ დაახლოებით 1 წლის ასაკში. ეს გაცნობითი ვიზიტია და მშობელსაც აძლევს რჩევებს მოვლაზე.',
        },
        {
          question: 'რძის კბილს ხომ არ სჭირდება მკურნალობა, თუ მაინც ამოვარდება?',
          answer:
            'სჭირდება. რძის კბილის ინფექცია გადადის მუდმივი კბილის ჩანასახზე და აზიანებს მას. გარდა ამისა, ნაადრევად დაკარგული რძის კბილი შემდეგში ორთოდონტიულ პრობლემას ქმნის.',
        },
      ],
      en: [
        {
          question: 'At what age should I bring my child for the first time?',
          answer:
            'The first visit is recommended within six months of the first tooth appearing, so around the age of one. It is an introductory appointment and also gives parents guidance on home care.',
        },
        {
          question: 'Do baby teeth really need treating if they fall out anyway?',
          answer:
            'Yes. Infection in a baby tooth spreads to the developing permanent tooth beneath it and damages it. A baby tooth lost too early also creates orthodontic problems later.',
        },
      ],
      ru: [
        {
          question: 'В каком возрасте впервые привести ребёнка?',
          answer:
            'Первый визит рекомендуется в течение шести месяцев после прорезывания первого зуба, то есть примерно в год. Это ознакомительный приём, на котором родители также получают рекомендации по уходу.',
        },
        {
          question: 'Нужно ли лечить молочные зубы, если они всё равно выпадут?',
          answer:
            'Нужно. Инфекция молочного зуба переходит на зачаток постоянного и повреждает его. Кроме того, преждевременно утраченный молочный зуб создаёт ортодонтические проблемы в будущем.',
        },
      ],
    },
  },

  {
    slug: 'hygiene-prevention',
    icon: 'sparkle',
    order: 80,
    featured: false,
    priceFrom: 80,
    title: {
      ka: 'პროფესიული ჰიგიენა და პროფილაქტიკა',
      en: 'Professional Hygiene & Prevention',
      ru: 'Профессиональная гигиена и профилактика',
    },
    shortTitle: { ka: 'ჰიგიენა', en: 'Hygiene', ru: 'Гигиена' },
    excerpt: {
      ka: 'ულტრაბგერითი წმენდა, Air Flow, ვექტორული და ლაზერული თერაპია - ყველაზე იაფი გზა, რომ მომავალში ძვირადღირებული მკურნალობა აირიდოთ.',
      en: 'Ultrasonic scaling, Air Flow, Vector and laser therapy - the cheapest way to avoid expensive treatment later.',
      ru: 'Ультразвуковая чистка, Air Flow, вектор- и лазерная терапия - самый дешёвый способ избежать дорогого лечения в будущем.',
    },
    duration: { ka: '1 ვიზიტი · 45–60 წუთი', en: '1 visit · 45–60 minutes', ru: '1 визит · 45–60 минут' },
    priceNote: PRICE_NOTE,
    highlights: {
      ka: [
        { text: 'ულტრაბგერითი წმენდა და Air Flow', icon: 'sparkle' },
        { text: 'ვექტორული და ლაზერული თერაპია პაროდონტისთვის', icon: 'microscope' },
        { text: 'ფტორირება და ფისურების დალუქვა', icon: 'shield' },
      ],
      en: [
        { text: 'Ultrasonic scaling and Air Flow', icon: 'sparkle' },
        { text: 'Vector and laser therapy for the gums', icon: 'microscope' },
        { text: 'Fluoride application and fissure sealing', icon: 'shield' },
      ],
      ru: [
        { text: 'Ультразвуковая чистка и Air Flow', icon: 'sparkle' },
        { text: 'Вектор- и лазерная терапия пародонта', icon: 'microscope' },
        { text: 'Фторирование и герметизация фиссур', icon: 'shield' },
      ],
    },
    body: {
      ka: [
        'პროფესიული ჰიგიენა ყველაზე დაბალფასიანი პროცედურაა სტომატოლოგიაში და ამავე დროს ის, რომელიც ყველაზე მეტ ფულს გიზოგავთ. კბილის ქვა და რბილი ნადები ვერ ცილდება ჯაგრისით - დროთა განმავლობაში ისინი იწვევენ ღრძილის ანთებას, პაროდონტიტს და საბოლოოდ სრულიად ჯანმრთელი კბილის მოშლას.',
        '## რას მოიცავს ვიზიტი',
        '- ულტრაბგერითი წმენდა - კბილის ქვის მოცილება ღრძილის ზემოთ და ქვემოთ',
        '- Air Flow - პიგმენტური ნადების მოცილება ჰაერისა და ფხვნილის ნაკადით',
        '- პოლირება და ფტორირება',
        '- ჰიგიენის ინდივიდუალური ინსტრუქტაჟი',
        '## ვექტორული და ლაზერული თერაპია',
        'პაროდონტის ღრმა ჯიბეების შემთხვევაში კლასიკური წმენდა საკმარისი არ არის. ვექტორული სისტემა და ლაზერი საშუალებას იძლევა გაიწმინდოს ჯიბე ქირურგიული ჩარევის გარეშე და შემცირდეს ბაქტერიული დატვირთვა.',
        '## რამდენად ხშირად',
        'უმეტესობისთვის - წელიწადში ორჯერ. მწეველებს, ორთოდონტიული აპარატის მატარებლებსა და პაროდონტიტის ისტორიის მქონე პაციენტებს ვურჩევთ ყოველ 3–4 თვეში.',
      ],
      en: [
        'Professional hygiene is the cheapest procedure in dentistry and at the same time the one that saves you the most money. Calculus and soft plaque cannot be removed with a brush - over time they cause gum inflammation, periodontitis and eventually the loss of perfectly healthy teeth.',
        '## What the appointment includes',
        '- Ultrasonic scaling above and below the gum line',
        '- Air Flow - removing pigmented deposits with a jet of air and powder',
        '- Polishing and fluoride application',
        '- Individual hygiene coaching',
        '## Vector and laser therapy',
        'Where periodontal pockets are deep, conventional scaling is not enough. The Vector system and laser allow the pocket to be cleaned without surgery and reduce the bacterial load.',
        '## How often',
        'For most people, twice a year. Smokers, patients in orthodontic treatment and anyone with a history of periodontitis should come every three to four months.',
      ],
      ru: [
        'Профессиональная гигиена - самая недорогая процедура в стоматологии и одновременно та, что экономит больше всего денег. Зубной камень и мягкий налёт невозможно удалить щёткой - со временем они приводят к воспалению дёсен, пародонтиту и в итоге к потере совершенно здоровых зубов.',
        '## Что входит в приём',
        '- Ультразвуковая чистка над и под десной',
        '- Air Flow - удаление пигментированного налёта струёй воздуха и порошка',
        '- Полировка и фторирование',
        '- Индивидуальный инструктаж по гигиене',
        '## Вектор- и лазерная терапия',
        'При глубоких пародонтальных карманах обычной чистки недостаточно. Система Vector и лазер позволяют очистить карман без хирургического вмешательства и снизить бактериальную нагрузку.',
        '## Как часто',
        'Большинству - дважды в год. Курильщикам, пациентам с брекетами и всем, у кого в анамнезе пародонтит, рекомендуется каждые 3–4 месяца.',
      ],
    },
    faq: {
      ka: [
        {
          question: 'მტკივნეულია პროფესიული წმენდა?',
          answer:
            'ჯანმრთელი ღრძილის შემთხვევაში - არა. თუ ღრძილი ანთებულია ან არის მგრძნობელობა, ვიყენებთ ადგილობრივ ანესთეზიას გელის ან ინექციის სახით.',
        },
      ],
      en: [
        {
          question: 'Is professional cleaning painful?',
          answer:
            'With healthy gums, no. If the gums are inflamed or the teeth are sensitive, we use local anaesthesia in gel or injected form.',
        },
      ],
      ru: [
        {
          question: 'Больно ли делать профессиональную чистку?',
          answer:
            'При здоровых дёснах - нет. Если дёсны воспалены или есть чувствительность, мы применяем местную анестезию в виде геля или инъекции.',
        },
      ],
    },
  },
]
