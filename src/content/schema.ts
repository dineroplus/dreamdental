import type { FieldMap, Shape } from './fields'

/**
 * The whole content model of the site. Collections become rows in `documents`
 * and singletons rows in `singletons`; both keep their editable fields in a
 * JSON column, so the only thing needed to add a field is an entry here.
 *
 * Fields that the site queries or sorts by - slug, order, featured, status -
 * are real columns instead, declared through the flags on each collection.
 */

/* -------------------------------------------------------------------------- */
/* Shared option lists                                                         */
/* -------------------------------------------------------------------------- */

const HIGHLIGHT_ICONS = [
  { value: 'check', label: 'მონიშვნა' },
  { value: 'tooth', label: 'კბილი' },
  { value: 'shield', label: 'ფარი' },
  { value: 'clock', label: 'საათი' },
  { value: 'sparkle', label: 'ბზინვარება' },
  { value: 'heart', label: 'გული' },
  { value: 'scan', label: '3D სკანი' },
  { value: 'microscope', label: 'მიკროსკოპი' },
  { value: 'lab', label: 'ლაბორატორია' },
  { value: 'child', label: 'ბავშვი' },
  { value: 'braces', label: 'ბრეკეტები' },
  { value: 'globe', label: 'გლობუსი' },
  { value: 'wallet', label: 'საფულე' },
  { value: 'pin', label: 'მისამართი' },
] as const

const SERVICE_ICONS = [
  { value: 'implant', label: 'იმპლანტი' },
  { value: 'veneer', label: 'ვინირი' },
  { value: 'whitening', label: 'გათეთრება' },
  { value: 'braces', label: 'ბრეკეტები' },
  { value: 'surgery', label: 'ქირურგია' },
  { value: 'filling', label: 'ბჟენი' },
  { value: 'child', label: 'ბავშვი' },
  { value: 'crown', label: 'გვირგვინი' },
  { value: 'scan', label: 'სკანი' },
  { value: 'tooth', label: 'კბილი' },
  { value: 'sparkle', label: 'ჰიგიენა' },
  { value: 'lab', label: 'ლაბორატორია' },
  { value: 'microscope', label: 'მიკროსკოპი' },
] as const

const DOCTOR_LANGUAGES = [
  { value: 'ka', label: 'ქართული' },
  { value: 'en', label: 'ინგლისური' },
  { value: 'ru', label: 'რუსული' },
  { value: 'de', label: 'გერმანული' },
  { value: 'tr', label: 'თურქული' },
  { value: 'ar', label: 'არაბული' },
] as const

const GALLERY_CATEGORIES = [
  { value: 'interior', label: 'კლინიკის ინტერიერი' },
  { value: 'equipment', label: 'აპარატურა' },
  { value: 'team', label: 'გუნდი' },
  { value: 'kids', label: 'საბავშვო ოთახი (Dream Land)' },
  { value: 'vip', label: 'VIP ოთახი (Dream Box)' },
] as const

const TESTIMONIAL_SOURCES = [
  { value: 'clinic', label: 'კლინიკაში შევსებული' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google' },
  { value: 'madloba', label: 'Madloba' },
] as const

/* -------------------------------------------------------------------------- */
/* Shared field groups                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Repeating lists are deliberately not localised: one row holds all three
 * languages, so an editor adds an item once instead of keeping three lists
 * the same length by hand.
 */
const faqField = {
  kind: 'objectList',
  label: 'ხშირად დასმული კითხვები',
  hint: 'ჩანს გვერდზე და იგზავნება Google-ში FAQ structured data-დ.',
  addLabel: 'კითხვის დამატება',
  titleKey: 'question',
  fields: {
    question: { kind: 'text', label: 'კითხვა', localized: true, required: true },
    answer: { kind: 'textarea', label: 'პასუხი', localized: true, required: true },
  },
} as const satisfies FieldMap[string]

const seoField = {
  kind: 'group',
  label: 'SEO',
  hint: 'განსაზღვრავს, რას აჩვენებს Google და სოციალური ქსელები. ცარიელი დატოვე ავტომატურისთვის.',
  fields: {
    title: { kind: 'text', label: 'სათაური', localized: true, hint: '50–60 სიმბოლო.' },
    description: { kind: 'textarea', label: 'აღწერა', localized: true, hint: '140–160 სიმბოლო.' },
    keywords: { kind: 'text', label: 'საკვანძო სიტყვები', localized: true },
    image: { kind: 'image', label: 'გაზიარების სურათი', hint: '1200×630 საუკეთესოა.' },
    noindex: { kind: 'boolean', label: 'დამალვა საძიებოსგან' },
  },
} as const satisfies FieldMap[string]

/* -------------------------------------------------------------------------- */
/* Collections                                                                 */
/* -------------------------------------------------------------------------- */

const serviceFields = {
  title: { kind: 'text', label: 'დასახელება', localized: true, required: true },
  shortTitle: {
    kind: 'text',
    label: 'მოკლე დასახელება',
    localized: true,
    hint: 'გამოიყენება მენიუსა და ბარათებში, როცა სრული სათაური გრძელია.',
  },
  excerpt: {
    kind: 'textarea',
    label: 'მოკლე აღწერა',
    localized: true,
    required: true,
    hint: 'ერთი-ორი წინადადება ბარათებისა და ძიების შედეგებისთვის.',
  },
  body: {
    kind: 'markdown',
    label: 'ძირითადი ტექსტი',
    localized: true,
    hint: 'გრძელი, სასარგებლო ტექსტი უკეთ რანჟირდება — მიზანი 600+ სიტყვა თითო ენაზე.',
  },
  highlights: {
    kind: 'objectList',
    label: 'მთავარი უპირატესობები',
    addLabel: 'პუნქტის დამატება',
    titleKey: 'text',
    fields: {
      text: { kind: 'text', label: 'ტექსტი', localized: true, required: true },
      icon: { kind: 'select', label: 'იკონი', options: HIGHLIGHT_ICONS },
    },
  },
  faq: faqField,
  image: { kind: 'image', label: 'მთავარი სურათი' },
  gallery: { kind: 'imageList', label: 'გალერეა' },
  icon: { kind: 'select', label: 'იკონი', options: SERVICE_ICONS, sidebar: true },
  priceFrom: {
    kind: 'number',
    label: 'ფასი დან (₾)',
    sidebar: true,
    hint: 'ცარიელი დატოვე ფასის დასამალად.',
  },
  priceTo: { kind: 'number', label: 'ფასი მდე (₾)', sidebar: true },
  priceNote: { kind: 'text', label: 'შენიშვნა ფასზე', localized: true },
  duration: { kind: 'text', label: 'ხანგრძლივობა', localized: true, hint: 'მაგ.: 1–2 ვიზიტი.' },
  relatedDoctors: { kind: 'relationList', label: 'ექიმები', to: 'doctors', sidebar: true },
  seo: seoField,
} as const satisfies FieldMap

const doctorFields = {
  name: {
    kind: 'text',
    label: 'სახელი და გვარი',
    localized: true,
    required: true,
    hint: 'თითოეული ენის დამწერლობით.',
  },
  specialty: {
    kind: 'text',
    label: 'სპეციალობა',
    localized: true,
    required: true,
    hint: 'მაგ.: ორთოდონტი, იმპლანტოლოგი.',
  },
  role: {
    kind: 'text',
    label: 'თანამდებობა',
    localized: true,
    hint: 'მაგ.: მთავარი ექიმი. ჩვეულებრივი პერსონალისთვის ცარიელი დატოვე.',
  },
  photo: { kind: 'image', label: 'ფოტო' },
  bio: { kind: 'markdown', label: 'ბიოგრაფია', localized: true },
  experienceSince: {
    kind: 'number',
    label: 'პრაქტიკის დაწყების წელი',
    sidebar: true,
    hint: 'გამოიყენება გამოცდილების წლების საჩვენებლად.',
  },
  languages: { kind: 'multiselect', label: 'ენები', options: DOCTOR_LANGUAGES, sidebar: true },
  credentials: {
    kind: 'list',
    label: 'განათლება და სერტიფიკატები',
    addLabel: 'ჩანაწერის დამატება',
    of: { kind: 'text', label: 'ჩანაწერი', localized: true, required: true },
  },
  seo: seoField,
} as const satisfies FieldMap

const caseFields = {
  title: {
    kind: 'text',
    label: 'დასახელება',
    localized: true,
    required: true,
    hint: 'მაგ.: ზედა ყბის იმპლანტაცია და ცირკონის გვირგვინები.',
  },
  beforeImage: {
    kind: 'image',
    label: 'ფოტო "მდე"',
    required: true,
    hint: 'გადაიღე ორივე ფოტო ერთი კუთხიდან, რომ სლაიდერი დაემთხვეს.',
  },
  afterImage: { kind: 'image', label: 'ფოტო "შემდეგ"', required: true },
  description: { kind: 'textarea', label: 'აღწერა', localized: true, hint: 'რა იყო პრობლემა და როგორ გადაწყდა.' },
  treatment: { kind: 'relation', label: 'მკურნალობა', to: 'services', sidebar: true },
  doctor: { kind: 'relation', label: 'ექიმი', to: 'doctors', sidebar: true },
  duration: { kind: 'text', label: 'ხანგრძლივობა', localized: true, hint: 'მაგ.: 6 თვე, 3 ვიზიტი.' },
  patientConsent: {
    kind: 'boolean',
    label: 'პაციენტის თანხმობა',
    sidebar: true,
    required: true,
    hint: 'დაადასტურე, რომ პაციენტმა წერილობით დართო ნება ფოტოების გამოქვეყნებაზე.',
  },
} as const satisfies FieldMap

const testimonialFields = {
  patientName: { kind: 'text', label: 'პაციენტის სახელი', localized: true, required: true },
  quote: {
    kind: 'textarea',
    label: 'გამოხმაურება',
    localized: true,
    required: true,
    hint: 'პაციენტის საკუთარი სიტყვები — შეძლებისდაგვარად უცვლელად.',
  },
  country: { kind: 'text', label: 'ქვეყანა', localized: true, hint: 'მაგ.: ისრაელი.' },
  countryCode: {
    kind: 'text',
    label: 'ქვეყნის კოდი',
    maxLength: 2,
    sidebar: true,
    hint: 'ორასოიანი ISO კოდი დროშისთვის: IL, DE, ES, GE.',
  },
  rating: { kind: 'number', label: 'შეფასება', min: 1, max: 5, sidebar: true },
  treatment: { kind: 'relation', label: 'მკურნალობა', to: 'services', sidebar: true },
  doctor: { kind: 'relation', label: 'ექიმი', to: 'doctors', sidebar: true },
  photo: { kind: 'image', label: 'ფოტო' },
  videoUrl: { kind: 'url', label: 'ვიდეო (YouTube)' },
  source: { kind: 'select', label: 'წყარო', options: TESTIMONIAL_SOURCES, sidebar: true },
  isPublicFigure: {
    kind: 'boolean',
    label: 'ცნობილი სტუმარი',
    sidebar: true,
    hint: 'გამოყოფს ბარათს — სპორტსმენებისთვის, შეფ-მზარეულებისთვის და ა.შ.',
  },
} as const satisfies FieldMap

const galleryFields = {
  title: { kind: 'text', label: 'დასახელება', localized: true },
  image: { kind: 'image', label: 'სურათი', required: true },
  category: { kind: 'select', label: 'კატეგორია', options: GALLERY_CATEGORIES, sidebar: true },
  description: { kind: 'textarea', label: 'აღწერა', localized: true },
} as const satisfies FieldMap

const pageBlocks = {
  richText: {
    label: 'ტექსტი',
    fields: {
      heading: { kind: 'text', label: 'სათაური', localized: true },
      content: { kind: 'markdown', label: 'ტექსტი', localized: true },
      width: {
        kind: 'select',
        label: 'სიგანე',
        options: [
          { value: 'narrow', label: 'ვიწრო (კითხვისთვის)' },
          { value: 'wide', label: 'ფართო' },
        ],
      },
    },
  },
  imageText: {
    label: 'სურათი + ტექსტი',
    fields: {
      heading: { kind: 'text', label: 'სათაური', localized: true },
      content: { kind: 'markdown', label: 'ტექსტი', localized: true },
      image: { kind: 'image', label: 'სურათი', required: true },
      imagePosition: {
        kind: 'select',
        label: 'სურათის მხარე',
        options: [
          { value: 'right', label: 'მარჯვნივ' },
          { value: 'left', label: 'მარცხნივ' },
        ],
      },
    },
  },
  featureGrid: {
    label: 'უპირატესობების ბადე',
    fields: {
      heading: { kind: 'text', label: 'სათაური', localized: true },
      items: {
        kind: 'objectList',
        label: 'პუნქტები',
        addLabel: 'პუნქტის დამატება',
        titleKey: 'title',
        fields: {
          title: { kind: 'text', label: 'სათაური', localized: true, required: true },
          description: { kind: 'textarea', label: 'აღწერა', localized: true },
        },
      },
    },
  },
  gallery: {
    label: 'სურათების გალერეა',
    fields: {
      heading: { kind: 'text', label: 'სათაური', localized: true },
      images: { kind: 'imageList', label: 'სურათები' },
    },
  },
  cta: {
    label: 'მოწოდება მოქმედებისკენ',
    fields: {
      heading: { kind: 'text', label: 'სათაური', localized: true, required: true },
      text: { kind: 'textarea', label: 'ტექსტი', localized: true },
      buttonLabel: { kind: 'text', label: 'ღილაკის წარწერა', localized: true },
      buttonHref: { kind: 'text', label: 'ღილაკის ბმული' },
    },
  },
} as const satisfies Record<string, { label: string; fields: FieldMap }>

const pageFields = {
  title: { kind: 'text', label: 'სათაური', localized: true, required: true },
  subtitle: { kind: 'textarea', label: 'ქვესათაური', localized: true },
  heroImage: { kind: 'image', label: 'მთავარი სურათი' },
  layout: { kind: 'blocks', label: 'გვერდის შიგთავსი', blocks: pageBlocks },
  faq: faqField,
  showInSitemap: { kind: 'boolean', label: 'sitemap-ში ჩვენება', sidebar: true },
  seo: seoField,
} as const satisfies FieldMap

const postFields = {
  title: { kind: 'text', label: 'სათაური', localized: true, required: true },
  excerpt: { kind: 'textarea', label: 'მოკლე აღწერა', localized: true, required: true },
  coverImage: { kind: 'image', label: 'გარეკანის სურათი' },
  body: { kind: 'markdown', label: 'სტატია', localized: true },
  faq: faqField,
  publishedAt: { kind: 'date', label: 'გამოქვეყნების თარიღი', sidebar: true, required: true },
  author: { kind: 'relation', label: 'ავტორი', to: 'doctors', sidebar: true },
  relatedServices: { kind: 'relationList', label: 'დაკავშირებული სერვისები', to: 'services', sidebar: true },
  seo: seoField,
} as const satisfies FieldMap

export type CollectionDef = {
  label: string
  singular: string
  /** Field shown as the row title in list views. */
  titleKey: string
  /** Adds the URL slug column and its editor. */
  slug: boolean
  /** Adds the manual `order` column and drag sorting. */
  ordered: boolean
  /** Adds the "show on the home page" checkbox. */
  featurable: boolean
  fields: FieldMap
}

export const collections = {
  services: {
    label: 'სერვისები',
    singular: 'სერვისი',
    titleKey: 'title',
    slug: true,
    ordered: true,
    featurable: true,
    fields: serviceFields,
  },
  doctors: {
    label: 'ექიმები',
    singular: 'ექიმი',
    titleKey: 'name',
    slug: true,
    ordered: true,
    featurable: true,
    fields: doctorFields,
  },
  cases: {
    label: 'მდე / შემდეგ',
    singular: 'ქეისი',
    titleKey: 'title',
    slug: false,
    ordered: true,
    featurable: true,
    fields: caseFields,
  },
  testimonials: {
    label: 'გამოხმაურებები',
    singular: 'გამოხმაურება',
    titleKey: 'patientName',
    slug: false,
    ordered: true,
    featurable: true,
    fields: testimonialFields,
  },
  gallery: {
    label: 'გალერეა',
    singular: 'ფოტო',
    titleKey: 'title',
    slug: false,
    ordered: true,
    featurable: false,
    fields: galleryFields,
  },
  pages: {
    label: 'გვერდები',
    singular: 'გვერდი',
    titleKey: 'title',
    slug: true,
    ordered: false,
    featurable: false,
    fields: pageFields,
  },
  posts: {
    label: 'ბლოგი',
    singular: 'სტატია',
    titleKey: 'title',
    slug: true,
    ordered: false,
    featurable: false,
    fields: postFields,
  },
} as const satisfies Record<string, CollectionDef>

export type CollectionName = keyof typeof collections

/* -------------------------------------------------------------------------- */
/* Singletons                                                                  */
/* -------------------------------------------------------------------------- */

const homeFields = {
  heroEyebrow: { kind: 'text', label: 'ზედა წარწერა', localized: true },
  heroTitle: { kind: 'text', label: 'მთავარი სათაური', localized: true, required: true },
  heroSubtitle: { kind: 'textarea', label: 'ქვესათაური', localized: true },
  heroImage: { kind: 'image', label: 'მთავარი სურათი' },
  heroVideoUrl: {
    kind: 'url',
    label: 'ფონური ვიდეო',
    hint: 'არასავალდებულო. 5 წამზე ნაკლები და უხმო.',
  },
  heroBullets: {
    kind: 'list',
    label: 'მოკლე პუნქტები',
    addLabel: 'პუნქტის დამატება',
    of: { kind: 'text', label: 'ტექსტი', localized: true, required: true },
  },
  primaryCtaLabel: { kind: 'text', label: 'ღილაკის წარწერა', localized: true },
  primaryCtaHref: { kind: 'text', label: 'ღილაკის ბმული' },
  sections: {
    kind: 'objectList',
    label: 'სექციების თანმიმდევრობა',
    hint: 'გადაათრიე რიგის შესაცვლელად. მონიშვნის მოხსნა მალავს სექციას წაშლის გარეშე.',
    addLabel: 'სექციის დამატება',
    titleKey: 'blockType',
    fields: {
      blockType: {
        kind: 'select',
        label: 'სექცია',
        required: true,
        options: [
          { value: 'stats', label: 'ნდობის მაჩვენებლები' },
          { value: 'services', label: 'სერვისების ბადე' },
          { value: 'whyUs', label: 'რატომ ჩვენ' },
          { value: 'cases', label: 'მდე / შემდეგ სლაიდერი' },
          { value: 'doctors', label: 'ჩვენი ექიმები' },
          { value: 'testimonials', label: 'პაციენტების გამოხმაურებები' },
          { value: 'kids', label: 'ბავშვთა სტომატოლოგია' },
          { value: 'tourism', label: 'დენტალური ტურიზმი' },
          { value: 'gallery', label: 'გალერეის ზოლი' },
          { value: 'contact', label: 'კონტაქტი და რუკა' },
        ],
      },
      enabled: { kind: 'boolean', label: 'ჩართული' },
      heading: { kind: 'text', label: 'სათაური', localized: true },
      subheading: { kind: 'textarea', label: 'ქვესათაური', localized: true },
    },
  },
  advantages: {
    kind: 'objectList',
    label: 'რატომ ჩვენ',
    addLabel: 'უპირატესობის დამატება',
    titleKey: 'title',
    fields: {
      title: { kind: 'text', label: 'სათაური', localized: true, required: true },
      description: { kind: 'textarea', label: 'აღწერა', localized: true },
      icon: { kind: 'select', label: 'იკონი', options: HIGHLIGHT_ICONS },
    },
  },
  seo: seoField,
} as const satisfies FieldMap

const settingsFields = {
  identity: {
    kind: 'group',
    label: 'იდენტობა',
    fields: {
      clinicName: { kind: 'text', label: 'კლინიკის სახელი', localized: true },
      tagline: { kind: 'text', label: 'სლოგანი', localized: true },
      logo: { kind: 'image', label: 'ლოგო' },
      favicon: { kind: 'image', label: 'Favicon' },
      defaultShareImage: {
        kind: 'image',
        label: 'გაზიარების სურათი',
        hint: 'სათადარიგო სურათი გვერდებისთვის, რომლებსაც საკუთარი არ აქვთ.',
      },
    },
  },
  contact: {
    kind: 'group',
    label: 'კონტაქტი',
    fields: {
      phonePrimary: { kind: 'text', label: 'ძირითადი ტელეფონი' },
      phoneSecondary: { kind: 'text', label: 'დამატებითი ტელეფონი' },
      whatsapp: { kind: 'text', label: 'WhatsApp', hint: 'მხოლოდ ციფრები, ქვეყნის კოდით.' },
      email: { kind: 'text', label: 'ელფოსტა' },
      addressLine: { kind: 'text', label: 'მისამართი', localized: true },
      city: { kind: 'text', label: 'ქალაქი', localized: true },
      latitude: { kind: 'number', label: 'განედი' },
      longitude: { kind: 'number', label: 'გრძედი' },
      mapUrl: { kind: 'url', label: 'Google Maps ბმული' },
    },
  },
  hours: {
    kind: 'group',
    label: 'სამუშაო საათები',
    fields: {
      openEveryDay: { kind: 'boolean', label: 'ყოველდღე ღიაა' },
      opensAt: { kind: 'text', label: 'იხსნება' },
      closesAt: { kind: 'text', label: 'იკეტება' },
      hoursNote: { kind: 'text', label: 'შენიშვნა', localized: true },
    },
  },
  social: {
    kind: 'group',
    label: 'სოციალური ქსელები',
    fields: {
      facebook: { kind: 'url', label: 'Facebook' },
      instagram: { kind: 'url', label: 'Instagram' },
      youtube: { kind: 'url', label: 'YouTube' },
      tiktok: { kind: 'url', label: 'TikTok' },
    },
  },
  stats: {
    kind: 'objectList',
    label: 'ნდობის მაჩვენებლები',
    hint: 'ანიმირებული მრიცხველები მთავარ გვერდზე.',
    addLabel: 'მაჩვენებლის დამატება',
    titleKey: 'label',
    fields: {
      value: { kind: 'text', label: 'მნიშვნელობა', required: true, hint: 'მაგ.: 13' },
      suffix: { kind: 'text', label: 'სუფიქსი', hint: 'მაგ.: + ან %' },
      label: { kind: 'text', label: 'წარწერა', localized: true, required: true },
    },
  },
  insurancePartners: {
    kind: 'objectList',
    label: 'სადაზღვევო პარტნიორები',
    addLabel: 'პარტნიორის დამატება',
    titleKey: 'name',
    fields: {
      name: { kind: 'text', label: 'დასახელება', required: true },
      logo: { kind: 'image', label: 'ლოგო' },
    },
  },
  awards: {
    kind: 'objectList',
    label: 'ჯილდოები',
    addLabel: 'ჯილდოს დამატება',
    titleKey: 'title',
    fields: {
      title: { kind: 'text', label: 'დასახელება', localized: true, required: true },
      year: { kind: 'text', label: 'წელი' },
      image: { kind: 'image', label: 'სურათი' },
    },
  },
  analytics: {
    kind: 'group',
    label: 'ანალიტიკა',
    fields: {
      googleAnalyticsId: { kind: 'text', label: 'Google Analytics ID', hint: 'მაგ.: G-XXXXXXXXXX' },
      googleSiteVerification: { kind: 'text', label: 'Google Search Console' },
      metaPixelId: { kind: 'text', label: 'Meta Pixel ID' },
    },
  },
} as const satisfies FieldMap

const navigationLink = {
  label: { kind: 'text', label: 'წარწერა', localized: true, required: true },
  href: { kind: 'text', label: 'ბმული', required: true, hint: 'ენის პრეფიქსის გარეშე, მაგ.: /services' },
} as const satisfies FieldMap

const navigationFields = {
  header: {
    kind: 'objectList',
    label: 'ზედა მენიუ',
    addLabel: 'პუნქტის დამატება',
    titleKey: 'href',
    fields: {
      ...navigationLink,
      children: {
        kind: 'objectList',
        label: 'ჩამოსაშლელი პუნქტები',
        addLabel: 'ქვეპუნქტის დამატება',
        titleKey: 'href',
        fields: navigationLink,
      },
    },
  },
  footerColumns: {
    kind: 'objectList',
    label: 'ფუტერის სვეტები',
    addLabel: 'სვეტის დამატება',
    titleKey: 'title',
    fields: {
      title: { kind: 'text', label: 'სათაური', localized: true, required: true },
      links: {
        kind: 'objectList',
        label: 'ბმულები',
        addLabel: 'ბმულის დამატება',
        titleKey: 'href',
        fields: navigationLink,
      },
    },
  },
} as const satisfies FieldMap

const themeFields = {
  primary: { kind: 'color', label: 'ძირითადი ფერი', hint: 'სათაურები და მთავარი ღილაკები.' },
  accent: { kind: 'color', label: 'აქცენტი', hint: 'გამოკვეთა, ბეჯები, hover.' },
  gold: { kind: 'color', label: 'ოქროსფერი', hint: 'ლოგოს აქცენტი და გამყოფები.' },
  background: { kind: 'color', label: 'ფონი' },
  surface: { kind: 'color', label: 'ბარათების ფონი' },
  text: { kind: 'color', label: 'ტექსტის ფერი' },
  headingScale: {
    kind: 'select',
    label: 'სათაურების ზომა',
    options: [
      { value: 'compact', label: 'კომპაქტური' },
      { value: 'balanced', label: 'დაბალანსებული' },
      { value: 'bold', label: 'მსხვილი' },
    ],
  },
  radius: {
    kind: 'select',
    label: 'კუთხეების მომრგვალება',
    options: [
      { value: 'sharp', label: 'მკვეთრი' },
      { value: 'soft', label: 'რბილი' },
      { value: 'pill', label: 'მრგვალი' },
    ],
  },
  motionLevel: {
    kind: 'select',
    label: 'ანიმაციები',
    hint: 'მომხმარებლის "reduce motion" პარამეტრი ყოველთვის უპირატესია.',
    options: [
      { value: 'full', label: 'სრული — პარალაქსი, გამოჩენა, მრიცხველები' },
      { value: 'subtle', label: 'შერბილებული — მხოლოდ გადასვლები' },
      { value: 'off', label: 'გამორთული' },
    ],
  },
} as const satisfies FieldMap

export type SingletonDef = { label: string; fields: FieldMap }

export const singletons = {
  home: { label: 'მთავარი გვერდი', fields: homeFields },
  settings: { label: 'კლინიკის პარამეტრები', fields: settingsFields },
  navigation: { label: 'მენიუები', fields: navigationFields },
  theme: { label: 'დიზაინი და თემა', fields: themeFields },
} as const satisfies Record<string, SingletonDef>

export type SingletonName = keyof typeof singletons

/* -------------------------------------------------------------------------- */
/* Document types used across the site                                         */
/* -------------------------------------------------------------------------- */

export type DocMeta = {
  id: number
  slug: string
  order: number
  featured: boolean
  status: 'draft' | 'published'
  updatedAt: string
}

export type Service = DocMeta & Shape<typeof serviceFields>
export type Doctor = DocMeta & Shape<typeof doctorFields>
export type CaseStudy = DocMeta & Shape<typeof caseFields>
export type Testimonial = DocMeta & Shape<typeof testimonialFields>
export type GalleryItem = DocMeta & Shape<typeof galleryFields>
export type Page = DocMeta & Shape<typeof pageFields>
export type Post = DocMeta & Shape<typeof postFields>

export type Home = Shape<typeof homeFields>
export type Settings = Shape<typeof settingsFields>
export type Navigation = Shape<typeof navigationFields>
export type Theme = Shape<typeof themeFields>

export type DocOf<T extends CollectionName> = {
  services: Service
  doctors: Doctor
  cases: CaseStudy
  testimonials: Testimonial
  gallery: GalleryItem
  pages: Page
  posts: Post
}[T]

export type SingletonOf<T extends SingletonName> = {
  home: Home
  settings: Settings
  navigation: Navigation
  theme: Theme
}[T]
