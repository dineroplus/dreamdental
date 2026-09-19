import type { Localized, SeedFaq } from './services'

type TextBlock = {
  type: 'richText'
  heading?: Localized<string>
  content: Localized<string[]>
  width?: 'narrow' | 'wide'
}

type FeatureBlock = {
  type: 'featureGrid'
  heading: Localized<string>
  items: Localized<Array<{ title: string; description: string }>>
}

type CtaBlock = {
  type: 'cta'
  heading: Localized<string>
  text: Localized<string>
  buttonLabel: Localized<string>
  buttonHref: string
}

export type SeedBlock = TextBlock | FeatureBlock | CtaBlock

export type SeedPage = {
  slug: string
  title: Localized<string>
  subtitle: Localized<string>
  /** Key into the media map built by the seed runner. */
  heroImage?: string
  layout: SeedBlock[]
  faq: Localized<SeedFaq[]>
}

export const pages: SeedPage[] = [
  {
    slug: 'about',
    heroImage: 'facade',
    title: { ka: 'ჩვენ შესახებ', en: 'About us', ru: 'О нас' },
    subtitle: {
      ka: '2013 წლის სექტემბერში გავხსენით კარი ბარათაშვილის #10-ში. 13 წელიწადში ჩვენთან დაახლოებით 50 ქვეყნიდან ჩამოვიდნენ პაციენტები.',
      en: 'We opened our doors at Baratashvili St. 10 in September 2013. In thirteen years patients from around fifty countries have come to us.',
      ru: 'Мы открыли двери на ул. Бараташвили 10 в сентябре 2013 года. За тринадцать лет к нам приехали пациенты примерно из пятидесяти стран.',
    },
    layout: [
      {
        type: 'richText',
        heading: {
          ka: '13 წელი ერთ მისამართზე',
          en: 'Thirteen years at one address',
          ru: 'Тринадцать лет по одному адресу',
        },
        content: {
          ka: [
            'Dream Dental & Aesthetic Group დაარსდა 2013 წლის სექტემბერში თბილისის ისტორიულ ცენტრში. ერთი კაბინეტიდან დავიწყეთ; დღეს კლინიკაში რვა ცალკე ბოქსი, საკუთარი სარენტგენო ოთახი და საკუთარი სატექნიკო ლაბორატორიაა.',
            'ჩვენი მთავარი პრინციპი ცამეტი წლის განმავლობაში არ შეცვლილა: **თქვენი ღიმილი ჩვენი რეპუტაციაა**. ეს არ არის სლოგანი - ეს არის მიზეზი, რის გამოც პაციენტების უმეტესობა ჩვენთან რეკომენდაციით მოდის.',
            '## რას ნიშნავს ერთ ადგილას ყველაფერი',
            'სტომატოლოგიაში ყველაზე მეტ დროსა და ნერვს პაციენტი კლინიკებს შორის გადაადგილებაში კარგავს: რენტგენი ერთგან, ქირურგი მეორეგან, ლაბორატორია მესამეგან. ჩვენთან ეს ჯაჭვი ერთ შენობაშია - CBCT დიაგნოსტიკა, ყბა-სახის ქირურგია, ორთოდონტია, სატექნიკო ლაბორატორია და ალერგოლოგიც კი.',
            'შედეგად ორთოპედიული სამუშაოები უფრო სწრაფად სრულდება, ხოლო რთული ქეისები - ძვლის გადანერგვით ან სრული ყბის აღდგენით - არ საჭიროებს გადამისამართებას.',
            '## ვისთვის ვმუშაობთ',
            'ჩვენი პაციენტების მნიშვნელოვანი ნაწილი საზღვარგარეთიდან ჩამოდის - ისრაელიდან, ევროპიდან, პოსტსაბჭოთა ქვეყნებიდან. სწორედ ამიტომ გუნდი მუშაობს შვიდ ენაზე და კლინიკა ღიაა ყოველდღე დილის 10-დან საღამოს 10 საათამდე, უქმეების ჩათვლით.',
          ],
          en: [
            'Dream Dental & Aesthetic Group was founded in September 2013 in the historic centre of Tbilisi. We started with a single surgery; today the clinic has eight separate treatment boxes, its own X-ray room and its own dental laboratory.',
            'Our core principle has not changed in thirteen years: **your smile is our reputation**. That is not a slogan - it is the reason most of our patients arrive on someone else’s recommendation.',
            '## What “everything in one place” actually means',
            'In dentistry patients lose most of their time and patience travelling between clinics: X-rays in one place, the surgeon in another, the laboratory in a third. Here that chain sits inside a single building - CBCT diagnostics, maxillofacial surgery, orthodontics, the dental laboratory and even an allergist.',
            'As a result prosthetic work is completed faster, and complex cases involving bone grafting or full-arch reconstruction never need a referral elsewhere.',
            '## Who we work with',
            'A significant share of our patients travel from abroad - Israel, Europe and the post-Soviet countries. That is why the team works in seven languages and the clinic is open every day from 10 in the morning until 10 at night, public holidays included.',
          ],
          ru: [
            'Dream Dental & Aesthetic Group была основана в сентябре 2013 года в историческом центре Тбилиси. Мы начинали с одного кабинета; сегодня в клинике восемь отдельных боксов, собственный рентген-кабинет и собственная зуботехническая лаборатория.',
            'Наш главный принцип не изменился за тринадцать лет: **ваша улыбка - наша репутация**. Это не слоган, а причина, по которой большинство пациентов приходит к нам по рекомендации.',
            '## Что значит «всё в одном месте»',
            'В стоматологии пациент теряет больше всего времени и нервов на переезды между клиниками: рентген в одном месте, хирург в другом, лаборатория в третьем. У нас вся эта цепочка находится в одном здании - КЛКТ-диагностика, челюстно-лицевая хирургия, ортодонтия, зуботехническая лаборатория и даже аллерголог.',
            'В результате ортопедические работы выполняются быстрее, а сложные случаи с костной пластикой или полным восстановлением челюсти не требуют направления в другое учреждение.',
            '## Для кого мы работаем',
            'Значительная часть наших пациентов приезжает из-за рубежа - из Израиля, Европы, постсоветских стран. Поэтому команда работает на семи языках, а клиника открыта ежедневно с 10 утра до 10 вечера, включая праздники.',
          ],
        },
      },
      {
        type: 'featureGrid',
        heading: {
          ka: 'კლინიკის ინფრასტრუქტურა',
          en: 'Inside the clinic',
          ru: 'Инфраструктура клиники',
        },
        items: {
          ka: [
            { title: '8 ცალკე ბოქსი', description: 'თითოეული პაციენტი მკურნალობას იღებს დახურულ, ცალკე სივრცეში.' },
            { title: 'სარენტგენო ოთახი', description: 'პანორამული სურათი, პრიცელური სნიმკი და CBCT (3D) ტომოგრაფია ადგილზე.' },
            { title: 'საკუთარი სატექნიკო ლაბორატორია', description: 'გვირგვინები, ხიდები და პროთეზები მზადდება კლინიკაშივე.' },
            { title: 'Dream Land', description: 'ბავშვების ბოქსი - საჩუქარი ყოველი ვიზიტის ბოლოს და სუპერ ღიმილის სიგელი.' },
            { title: 'Dream Box', description: 'VIP კაბინეტი: მუსიკის არჩევა, 3D სათვალეები, ცხელი პირსახოცები.' },
            { title: 'ალერგოლოგიური კაბინეტი', description: 'ალერგიული სინჯები ტარდება ადგილზე, ანესთეზიის უსაფრთხოებისთვის.' },
          ],
          en: [
            { title: 'Eight separate boxes', description: 'Every patient is treated in a closed, private space of their own.' },
            { title: 'X-ray room', description: 'Panoramic and periapical imaging plus CBCT (3D) scanning on site.' },
            { title: 'Our own laboratory', description: 'Crowns, bridges and prosthetics are made inside the clinic.' },
            { title: 'Dream Land', description: 'The children’s box - a gift at the end of every visit and a Super Smile certificate.' },
            { title: 'Dream Box', description: 'The VIP suite: your choice of music, 3D glasses and hot towels.' },
            { title: 'Allergy room', description: 'Allergy testing is done on site, for safer anaesthesia.' },
          ],
          ru: [
            { title: 'Восемь отдельных боксов', description: 'Каждый пациент получает лечение в закрытом отдельном пространстве.' },
            { title: 'Рентген-кабинет', description: 'Панорамные и прицельные снимки, а также КЛКТ (3D) прямо на месте.' },
            { title: 'Собственная лаборатория', description: 'Коронки, мосты и протезы изготавливаются внутри клиники.' },
            { title: 'Dream Land', description: 'Детский бокс - подарок в конце каждого визита и сертификат супер-улыбки.' },
            { title: 'Dream Box', description: 'VIP-кабинет: выбор музыки, 3D-очки, горячие полотенца.' },
            { title: 'Аллергологический кабинет', description: 'Аллергопробы проводятся на месте - для безопасной анестезии.' },
          ],
        },
      },
      {
        type: 'cta',
        heading: {
          ka: 'მოდით გაგვიცანით',
          en: 'Come and meet us',
          ru: 'Приходите знакомиться',
        },
        text: {
          ka: 'პირველი კონსულტაცია უფასოა. მოდით, დაათვალიერეთ კლინიკა და ერთად შევადგინოთ თქვენი მკურნალობის გეგმა.',
          en: 'The first consultation is free. Come and see the clinic, and we will build your treatment plan together.',
          ru: 'Первая консультация бесплатна. Приходите, посмотрите клинику - и мы вместе составим ваш план лечения.',
        },
        buttonLabel: { ka: 'ჩაწერა კონსულტაციაზე', en: 'Book a consultation', ru: 'Записаться на консультацию' },
        buttonHref: '/contact',
      },
    ],
    faq: {
      ka: [
        {
          question: 'სად მდებარეობთ და როგორ მოვხვდე?',
          answer:
            'ნიკოლოზ ბარათაშვილის ქუჩა #10, თბილისის ისტორიული ცენტრი (0105). ვმომსახურებთ თბილისს, წყნეთსა და კოჯორს. მარშრუტისთვის ისარგებლეთ ღილაკით „მარშრუტი" კონტაქტის გვერდზე.',
        },
        {
          question: 'რა სამუშაო საათები გაქვთ?',
          answer: 'ვმუშაობთ ყოველდღე, კვირის შვიდივე დღეს, 10:00-დან 22:00-მდე, უქმეების ჩათვლით.',
        },
        {
          question: 'რა ენებზე მემსახურებით?',
          answer:
            'ქართული, ინგლისური, რუსული, გერმანული, იტალიური, არაბული და თურქული. კონსულტაციის დაჯავშნისას მიუთითეთ სასურველი ენა.',
        },
        {
          question: 'იღებთ სადაზღვევოს?',
          answer:
            'ვთანამშრომლობთ მსხვილ სადაზღვევო კომპანიებთან. გთხოვთ დაგვირეკოთ თქვენი პოლისის დასაზუსტებლად - ასევე ხელმისაწვდომია საბანკო და შიდა განვადება.',
        },
      ],
      en: [
        {
          question: 'Where are you and how do I get there?',
          answer:
            'Nikoloz Baratashvili St. 10, in the historic centre of Tbilisi (0105). We serve Tbilisi, Tskneti and Kojori. Use the “Directions” button on the contact page for the route.',
        },
        {
          question: 'What are your opening hours?',
          answer: 'We are open every day of the week from 10:00 to 22:00, public holidays included.',
        },
        {
          question: 'What languages do you speak?',
          answer:
            'Georgian, English, Russian, German, Italian, Arabic and Turkish. Mention your preferred language when you book.',
        },
        {
          question: 'Do you accept insurance?',
          answer:
            'We work with the major insurance companies. Please call us to check your specific policy - bank and in-house instalment plans are also available.',
        },
      ],
      ru: [
        {
          question: 'Где вы находитесь и как добраться?',
          answer:
            'Ул. Николоза Бараташвили 10, исторический центр Тбилиси (0105). Обслуживаем Тбилиси, Цкнети и Коджори. Маршрут доступен по кнопке «Маршрут» на странице контактов.',
        },
        {
          question: 'Какой у вас график работы?',
          answer: 'Мы работаем ежедневно, все семь дней недели, с 10:00 до 22:00, включая праздничные дни.',
        },
        {
          question: 'На каких языках вы принимаете?',
          answer:
            'Грузинский, английский, русский, немецкий, итальянский, арабский и турецкий. Укажите предпочитаемый язык при записи.',
        },
        {
          question: 'Принимаете ли вы страховку?',
          answer:
            'Мы сотрудничаем с крупными страховыми компаниями. Пожалуйста, позвоните, чтобы уточнить условия вашего полиса - также доступны банковская и внутренняя рассрочка.',
        },
      ],
    },
  },

  {
    slug: 'dental-tourism',
    title: {
      ka: 'დენტალური ტურიზმი საქართველოში',
      en: 'Dental tourism in Georgia',
      ru: 'Дентальный туризм в Грузии',
    },
    subtitle: {
      ka: 'პაციენტები ~50 ქვეყნიდან ჩამოდიან თბილისში მკურნალობისთვის. ვგეგმავთ ვიზიტს ისე, რომ ყველაფერი რამდენიმე დღეში მოთავსდეს.',
      en: 'Patients from around 50 countries travel to Tbilisi for treatment. We plan the visit so that everything fits into a few days.',
      ru: 'Пациенты примерно из 50 стран приезжают в Тбилиси на лечение. Мы планируем визит так, чтобы всё уместилось в несколько дней.',
    },
    layout: [
      {
        type: 'richText',
        heading: {
          ka: 'რატომ ჩამოდიან საქართველოში',
          en: 'Why patients come to Georgia',
          ru: 'Почему пациенты приезжают в Грузию',
        },
        content: {
          ka: [
            'დასავლეთ ევროპასა და ისრაელში იმპლანტაციისა და პროთეზირების ღირებულება ხშირად რამდენჯერმე აღემატება საქართველოში იმავე ხარისხის მკურნალობის ფასს. ამას ემატება ის, რომ საქართველოში შესვლა ვიზის გარეშეა შესაძლებელი ქვეყნების დიდი ნაწილისთვის, ხოლო ფრენა ევროპიდან 3–4 საათია.',
            'ჩვენთან პაციენტები ჩამოდიან ისრაელიდან, გერმანიიდან, იტალიიდან, რუსეთიდან, უკრაინიდან, ყაზახეთიდან, აშშ-დან და არაბული ქვეყნებიდან. სწორედ ამიტომ მუშაობს გუნდი შვიდ ენაზე.',
            '## როგორ ვგეგმავთ ვიზიტს',
            '- **ჩამოსვლამდე.** გამოგვიგზავნეთ არსებული სნიმკები ან ფოტოები WhatsApp-ზე. ვაკეთებთ წინასწარ შეფასებას, გიგზავნით სავარაუდო გეგმასა და ბიუჯეტს, და ვთანხმდებით თარიღებს.',
            '- **პირველი დღე.** CBCT (3D) ტომოგრაფია, კონსულტაცია და საბოლოო გეგმის დამტკიცება. ჩვეულებრივ ამავე დღეს იწყება მკურნალობა.',
            '- **ქირურგიული ეტაპი.** მრავლობითი იმპლანტაცია ერთ ვიზიტში სრულდება, საჭიროების შემთხვევაში სედაციით.',
            '- **ოსეოინტეგრაცია.** 3–6 თვე. ამ პერიოდში პაციენტი ბრუნდება სახლში დროებითი კონსტრუქციით.',
            '- **მეორე ჩამოსვლა.** ციფრული ანაბეჭდი და მუდმივი გვირგვინების ფიქსაცია. ჩვენივე ლაბორატორია აჩქარებს ამ ეტაპს, ასე რომ ხშირად 4–6 დღე საკმარისია.',
            '## რას ვუზრუნველყოფთ',
            'ვეხმარებით სასტუმროს შერჩევაში კლინიკასთან ახლოს და ვაწყობთ ვიზიტების განრიგს ისე, რომ თბილისის დათვალიერებისთვისაც დაგრჩეთ დრო. კლინიკა ძველი თბილისის ცენტრშია - ბარათაშვილის ხიდი, აბანოთუბანი და რუსთაველის გამზირი ფეხით მისადგომია.',
          ],
          en: [
            'In Western Europe and Israel the cost of implants and prosthetics is often several times higher than treatment of the same quality in Georgia. Add to that visa-free entry for most countries and a three to four hour flight from Europe.',
            'Our patients travel from Israel, Germany, Italy, Russia, Ukraine, Kazakhstan, the United States and the Arab world. That is precisely why the team works in seven languages.',
            '## How we plan the visit',
            '- **Before you travel.** Send us any existing X-rays or photos over WhatsApp. We make a preliminary assessment, send you an indicative plan and budget, and agree the dates.',
            '- **Day one.** CBCT (3D) imaging, consultation and sign-off on the final plan. Treatment usually begins the same day.',
            '- **The surgical stage.** Multiple implants are placed in a single visit, with sedation if you want it.',
            '- **Osseointegration.** Three to six months, during which you go home with a temporary restoration.',
            '- **Second trip.** Digital impressions and fitting of the permanent crowns. Our in-house laboratory speeds this stage up, so four to six days is often enough.',
            '## What we arrange',
            'We help you choose a hotel close to the clinic and schedule appointments so you still have time to see Tbilisi. The clinic sits in the centre of the old city - Baratashvili Bridge, the sulphur baths district and Rustaveli Avenue are all within walking distance.',
          ],
          ru: [
            'В Западной Европе и Израиле стоимость имплантации и протезирования часто в несколько раз выше, чем лечение того же качества в Грузии. К этому добавляется безвизовый въезд для большинства стран и перелёт из Европы за 3–4 часа.',
            'К нам приезжают пациенты из Израиля, Германии, Италии, России, Украины, Казахстана, США и арабских стран. Именно поэтому команда работает на семи языках.',
            '## Как мы планируем визит',
            '- **До приезда.** Пришлите имеющиеся снимки или фотографии в WhatsApp. Мы делаем предварительную оценку, отправляем ориентировочный план и бюджет и согласовываем даты.',
            '- **Первый день.** КЛКТ (3D), консультация и утверждение окончательного плана. Лечение обычно начинается в тот же день.',
            '- **Хирургический этап.** Множественная имплантация выполняется за один визит, при желании - под седацией.',
            '- **Остеоинтеграция.** 3–6 месяцев, в течение которых вы возвращаетесь домой с временной конструкцией.',
            '- **Второй приезд.** Цифровые слепки и фиксация постоянных коронок. Собственная лаборатория ускоряет этот этап, поэтому часто хватает 4–6 дней.',
            '## Что мы организуем',
            'Мы помогаем подобрать отель рядом с клиникой и составляем график приёмов так, чтобы у вас осталось время посмотреть Тбилиси. Клиника находится в центре старого города - мост Бараташвили, серные бани и проспект Руставели в пешей доступности.',
          ],
        },
      },
      {
        type: 'cta',
        heading: {
          ka: 'გამოგვიგზავნეთ თქვენი სნიმკი',
          en: 'Send us your X-ray',
          ru: 'Пришлите нам свой снимок',
        },
        text: {
          ka: 'მიიღებთ წინასწარ შეფასებას, სავარაუდო ბიუჯეტსა და ვიზიტის განრიგს ჩამოსვლამდე.',
          en: 'You will receive a preliminary assessment, an indicative budget and a visit schedule before you travel.',
          ru: 'Вы получите предварительную оценку, ориентировочный бюджет и график визита ещё до поездки.',
        },
        buttonLabel: { ka: 'დაგვიკავშირდით', en: 'Contact us', ru: 'Связаться с нами' },
        buttonHref: '/contact',
      },
    ],
    faq: {
      ka: [
        {
          question: 'რამდენი დღე უნდა დავრჩე თბილისში?',
          answer:
            'იმპლანტაციის ქირურგიული ეტაპისთვის ჩვეულებრივ 3–5 დღეა საკმარისი. პროთეზირების ეტაპზე - 4–6 დღე. ვინირებისა და გათეთრებისთვის 4–5 დღე.',
        },
        {
          question: 'ვინ დამეხმარება ენის ბარიერში?',
          answer:
            'გუნდი მუშაობს ქართულ, ინგლისურ, რუსულ, გერმანულ, იტალიურ, არაბულ და თურქულ ენებზე. კონსულტაცია და ყველა დოკუმენტი მიიღება თქვენთვის გასაგებ ენაზე.',
        },
        {
          question: 'რა მოხდება, თუ სახლში დაბრუნების შემდეგ პრობლემა შემექმნება?',
          answer:
            'დაგვიკავშირდით WhatsApp-ზე - ვაფასებთ სიტუაციას დისტანციურად და, საჭიროების შემთხვევაში, ვთანამშრომლობთ თქვენს ადგილობრივ ექიმთან.',
        },
      ],
      en: [
        {
          question: 'How many days do I need in Tbilisi?',
          answer:
            'The surgical stage of implant treatment usually takes three to five days. The prosthetic stage takes four to six. Veneers and whitening need four to five days.',
        },
        {
          question: 'What about the language barrier?',
          answer:
            'The team works in Georgian, English, Russian, German, Italian, Arabic and Turkish. Your consultation and all documents are provided in a language you understand.',
        },
        {
          question: 'What if something goes wrong after I fly home?',
          answer:
            'Message us on WhatsApp - we assess the situation remotely and, where needed, coordinate with your local dentist.',
        },
      ],
      ru: [
        {
          question: 'Сколько дней нужно провести в Тбилиси?',
          answer:
            'Хирургический этап имплантации обычно занимает 3–5 дней. Этап протезирования - 4–6 дней. Виниры и отбеливание - 4–5 дней.',
        },
        {
          question: 'Как быть с языковым барьером?',
          answer:
            'Команда работает на грузинском, английском, русском, немецком, итальянском, арабском и турецком. Консультация и все документы предоставляются на понятном вам языке.',
        },
        {
          question: 'Что делать, если проблема возникнет после возвращения домой?',
          answer:
            'Напишите нам в WhatsApp - мы оценим ситуацию дистанционно и при необходимости скоординируемся с вашим местным врачом.',
        },
      ],
    },
  },
]

export type SeedPost = {
  slug: string
  publishedAt: string
  title: Localized<string>
  excerpt: Localized<string>
  body: Localized<string[]>
}

export const posts: SeedPost[] = [
  {
    slug: 'implant-cost-tbilisi',
    publishedAt: '2026-08-12',
    title: {
      ka: 'რა ღირს დენტალური იმპლანტი თბილისში 2026 წელს',
      en: 'How much does a dental implant cost in Tbilisi in 2026',
      ru: 'Сколько стоит дентальный имплант в Тбилиси в 2026 году',
    },
    excerpt: {
      ka: 'რისგან შედგება იმპლანტის საბოლოო ფასი, რატომ განსხვავდება ციფრები კლინიკებს შორის და რა კითხვები უნდა დასვათ კონსულტაციაზე.',
      en: 'What actually makes up the final price of an implant, why the numbers differ between clinics, and which questions to ask at the consultation.',
      ru: 'Из чего складывается итоговая цена импланта, почему цифры у клиник различаются и какие вопросы задать на консультации.',
    },
    body: {
      ka: [
        'იმპლანტის ფასზე კითხვა ყველაზე ხშირად დასმული კითხვაა და ამავე დროს ყველაზე ხშირად არასწორად გაგებული. პრობლემა ისაა, რომ „იმპლანტის ფასი" ხშირად მხოლოდ ერთ კომპონენტს ნიშნავს, საბოლოო ანგარიში კი სამი ნაწილისგან შედგება.',
        '## სამი კომპონენტი',
        '- **იმპლანტი** - თვითონ ტიტანის ხრახნი. ფასი დამოკიდებულია სისტემაზე (პრემიუმ ევროპული, კორეული, ისრაელური).',
        '- **აბატმენტი** - გარდამავალი ელემენტი იმპლანტსა და გვირგვინს შორის. სტანდარტული ან ინდივიდუალური.',
        '- **გვირგვინი** - ცირკონის, მეტალოკერამიკის ან E-max. სწორედ ეს განსაზღვრავს ესთეტიკას.',
        'როცა რეკლამაში ხედავთ ძალიან დაბალ ციფრს, თითქმის ყოველთვის მხოლოდ პირველი კომპონენტია ნაგულისხმევი.',
        '## რა შეიძლება დაემატოს',
        'თუ კბილი დიდი ხნის დაკარგულია და ძვალი დაკლებულია, საჭიროა ავგმენტაცია ან სინუს-ლიფტინგი. ეს რეალური ქირურგიული პროცედურაა საკუთარი ღირებულებით. ამიტომაც CBCT ტომოგრაფიის გარეშე გაცემული ფასი მხოლოდ სავარაუდოა.',
        '## რა ვკითხოთ კონსულტაციაზე',
        '- რომელ იმპლანტ სისტემას იყენებთ და აქვს თუ არა საერთაშორისო გარანტია?',
        '- ფასში შედის აბატმენტი და გვირგვინი?',
        '- CBCT-ის მიხედვით საჭიროა თუ არა ძვლის გადანერგვა?',
        '- სად მზადდება გვირგვინი - კლინიკაში თუ გარე ლაბორატორიაში?',
        '- რამდენი ვიზიტი და რამდენი თვე დასჭირდება?',
        'Dream Dental-ში კონსულტაცია და მკურნალობის გეგმის შედგენა უფასოა, ხოლო საბოლოო ფასი ფიქსირდება CBCT-ისა და გეგმის დამტკიცების შემდეგ - ანუ მკურნალობის განმავლობაში ციფრი აღარ იცვლება.',
      ],
      en: [
        'The price of an implant is the most frequently asked question in dentistry, and also the most frequently misunderstood. The problem is that “the price of an implant” often refers to one component only, while the final bill has three parts.',
        '## The three components',
        '- **The implant** - the titanium screw itself. Price depends on the system (premium European, Korean, Israeli).',
        '- **The abutment** - the connector between the implant and the crown. Either stock or custom-made.',
        '- **The crown** - zirconia, porcelain-fused-to-metal or E-max. This is what determines the aesthetics.',
        'When you see a very low figure in an advertisement, it almost always refers to the first component alone.',
        '## What may be added',
        'If the tooth has been missing for a long time and the bone has receded, augmentation or a sinus lift is required. That is a real surgical procedure with its own cost. This is why any price quoted without a CBCT scan is only indicative.',
        '## Questions to ask at the consultation',
        '- Which implant system do you use, and does it carry an international guarantee?',
        '- Does the price include the abutment and the crown?',
        '- Does the CBCT show that bone grafting is needed?',
        '- Where is the crown made - in the clinic or an external laboratory?',
        '- How many visits and how many months will it take?',
        'At Dream Dental the consultation and treatment plan are free, and the final price is fixed once the CBCT is done and the plan is approved - so the figure does not move during treatment.',
      ],
      ru: [
        'Вопрос о цене импланта задают чаще всего - и чаще всего понимают неправильно. Проблема в том, что «цена импланта» нередко означает лишь один компонент, тогда как итоговый счёт состоит из трёх частей.',
        '## Три компонента',
        '- **Имплант** - сам титановый винт. Цена зависит от системы (премиальная европейская, корейская, израильская).',
        '- **Абатмент** - переходник между имплантом и коронкой. Стандартный или индивидуальный.',
        '- **Коронка** - цирконий, металлокерамика или E-max. Именно она определяет эстетику.',
        'Когда в рекламе вы видите очень низкую цифру, почти всегда имеется в виду только первый компонент.',
        '## Что может добавиться',
        'Если зуб утрачен давно и кость убыла, потребуется аугментация или синус-лифтинг. Это полноценная хирургическая процедура со своей стоимостью. Поэтому любая цена без КЛКТ - только ориентировочная.',
        '## Что спросить на консультации',
        '- Какую имплант-систему вы используете и есть ли международная гарантия?',
        '- Входят ли в цену абатмент и коронка?',
        '- Показывает ли КЛКТ необходимость костной пластики?',
        '- Где изготавливается коронка - в клинике или во внешней лаборатории?',
        '- Сколько визитов и сколько месяцев потребуется?',
        'В Dream Dental консультация и составление плана лечения бесплатны, а итоговая цена фиксируется после КЛКТ и утверждения плана - то есть в ходе лечения цифра не меняется.',
      ],
    },
  },
  {
    slug: 'veneers-or-whitening',
    publishedAt: '2026-07-03',
    title: {
      ka: 'ვინირები თუ გათეთრება - რომელი გჭირდებათ სინამდვილეში',
      en: 'Veneers or whitening - which do you actually need',
      ru: 'Виниры или отбеливание - что вам действительно нужно',
    },
    excerpt: {
      ka: 'ორივე ანათებს ღიმილს, მაგრამ სხვადასხვა პრობლემას წყვეტს. მოკლე გზამკვლევი, რომელიც დაგეხმარებათ კონსულტაციამდე გაერკვეთ.',
      en: 'Both brighten a smile, but they solve different problems. A short guide to help you work it out before the consultation.',
      ru: 'Оба осветляют улыбку, но решают разные задачи. Краткое руководство, которое поможет разобраться до консультации.',
    },
    body: {
      ka: [
        'ეს ორი პროცედურა ხშირად ერთმანეთში აირევა, თუმცა მათ შორის პრინციპული განსხვავებაა: გათეთრება **აშორებს** შეფერილობას, ვინირი კი **ფარავს** მას და ამავდროულად ცვლის ფორმას.',
        '## აირჩიეთ გათეთრება, თუ',
        '- კბილები სწორია და ფორმა გაწყობთ',
        '- შეფერილობა ყავის, ჩაის, წითელი ღვინის ან მოწევის შედეგია',
        '- გინდათ შედეგი ერთ ვიზიტში და მინიმალური ბიუჯეტით',
        '## აირჩიეთ ვინირები, თუ',
        '- კბილებს შორის ღრიჭოა',
        '- კიდეები არათანაბარია ან კბილი ნაცვეთია',
        '- შეფერილობა შიდაა (მაგ. ტეტრაციკლინური ან დევიტალიზებული კბილი) და გათეთრებას არ ემორჩილება',
        '- გსურთ ღიმილის ფორმის სრული ცვლილება',
        '## მნიშვნელოვანი დეტალი',
        'თუ ვინირებს გეგმავთ და ამავე დროს დანარჩენი კბილების გათეთრება გინდათ, **ჯერ გაითეთრეთ**. ვინირის ფერი შეირჩევა უკვე გათეთრებული მეზობელი კბილების მიხედვით - პირიქით აღარ მუშაობს, რადგან კერამიკა არ ნათდება.',
        'კონსულტაციაზე ვაკეთებთ ციფრულ ღიმილის დიზაინს, სადაც ორივე სცენარს ერთმანეთის გვერდით ნახავთ, სანამ რაიმე გადაწყვეტილებას მიიღებთ.',
      ],
      en: [
        'These two treatments are often confused, but the difference is fundamental: whitening **removes** discolouration, whereas a veneer **covers** it and changes the shape at the same time.',
        '## Choose whitening if',
        '- Your teeth are straight and you are happy with their shape',
        '- The discolouration comes from coffee, tea, red wine or smoking',
        '- You want a result in one visit and on a modest budget',
        '## Choose veneers if',
        '- There are gaps between your teeth',
        '- The edges are uneven or the teeth are worn',
        '- The discolouration is internal (tetracycline staining or a non-vital tooth) and does not respond to whitening',
        '- You want to change the shape of your smile entirely',
        '## One important detail',
        'If you are planning veneers and also want to whiten the remaining teeth, **whiten first**. The veneer shade is matched to the already-whitened neighbouring teeth - it does not work the other way round, because ceramic does not lighten.',
        'At the consultation we produce a digital smile design showing both scenarios side by side, before you commit to anything.',
      ],
      ru: [
        'Эти две процедуры часто путают, хотя разница принципиальная: отбеливание **удаляет** потемнение, а винир **закрывает** его и одновременно меняет форму.',
        '## Выбирайте отбеливание, если',
        '- Зубы ровные и форма вас устраивает',
        '- Потемнение вызвано кофе, чаем, красным вином или курением',
        '- Вам нужен результат за один визит и при небольшом бюджете',
        '## Выбирайте виниры, если',
        '- Между зубами есть щели',
        '- Края неровные или зубы стёрты',
        '- Потемнение внутреннее (тетрациклиновое или депульпированный зуб) и не поддаётся отбеливанию',
        '- Вы хотите полностью изменить форму улыбки',
        '## Важная деталь',
        'Если вы планируете виниры и одновременно хотите отбелить остальные зубы, **сначала отбеливайте**. Оттенок винира подбирается под уже отбеленные соседние зубы - в обратном порядке это не работает, потому что керамика не осветляется.',
        'На консультации мы делаем цифровой дизайн улыбки, где оба сценария показаны рядом, ещё до принятия решения.',
      ],
    },
  },
  {
    slug: 'childs-first-dental-visit',
    publishedAt: '2026-06-05',
    title: {
      ka: 'ბავშვის პირველი ვიზიტი სტომატოლოგთან: როგორ მოვამზადოთ',
      en: 'Your child’s first dental visit: how to prepare',
      ru: 'Первый визит ребёнка к стоматологу: как подготовить',
    },
    excerpt: {
      ka: 'რა ასაკში მივიყვანოთ, რა ვთქვათ სახლში და რა სიტყვები უნდა ავარიდოთ თავი - პრაქტიკული რჩევები მშობლებს.',
      en: 'When to bring them, what to say at home and which words to avoid - practical advice for parents.',
      ru: 'В каком возрасте вести, что говорить дома и каких слов избегать - практические советы родителям.',
    },
    body: {
      ka: [
        'ბავშვის დამოკიდებულება სტომატოლოგისადმი თითქმის მთლიანად პირველი ორი-სამი ვიზიტით ყალიბდება. კარგი ამბავი ისაა, რომ მშობელს ამაზე გავლენის დიდი ნაწილი აქვს - ჯერ კიდევ სახლში.',
        '## როდის მივიდეთ პირველად',
        'რეკომენდებულია პირველი ვიზიტი პირველი კბილის ამოსვლიდან ექვსი თვის განმავლობაში, ანუ დაახლოებით ერთი წლის ასაკში. ეს ვიზიტი მკურნალობას არ ნიშნავს - ეს გაცნობაა და მშობლისთვის ინსტრუქტაჟი.',
        '## რა ვთქვათ სახლში',
        'ილაპარაკეთ მშვიდად და მოკლედ: „წავალთ, ექიმი დათვლის კბილებს". არ დაპირდეთ, რომ „არაფერს გაგიკეთებენ" - თუ რამე მაინც გაკეთდა, ნდობა ირღვევა.',
        '## რომელი სიტყვები ავარიდოთ',
        'თავი აარიდეთ სიტყვებს **ტკივილი**, **ნემსი**, **ამოღება**, **გაბურღვა** - მაშინაც კი, როცა ამბობთ „არ გეტკინება". ბავშვი უარყოფას არ იგებს, მაგრამ სიტყვა „ტკივილი" რჩება.',
        'ასევე ნუ ეტყვით: „თუ არ იქნები კარგი ბიჭი, ექიმთან წაგიყვან". სტომატოლოგი სასჯელი არ უნდა იყოს.',
        '## რას ვაკეთებთ ჩვენ',
        'Dream Land ცალკე ბოქსია, რომელიც მხოლოდ ბავშვებისთვისაა. პირველ ვიზიტზე ვიცნობთ, ვაჩვენებთ ინსტრუმენტებს და ვთვლით კბილებს. ყოველი ვიზიტი მთავრდება საჩუქრით, ხოლო დასრულებული მკურნალობა - სუპერ ღიმილის სიგელით.',
        'თუ ბავშვი ძალიან შემშინებულია ან საჭიროა ვრცელი მკურნალობა, ხელმისაწვდომია სედაცია ანესთეზიოლოგის კონტროლით.',
      ],
      en: [
        'A child’s attitude to the dentist is formed almost entirely during the first two or three visits. The good news is that parents control much of that - starting at home.',
        '## When to come first',
        'The recommended first visit is within six months of the first tooth appearing, so around the age of one. That visit is not about treatment - it is an introduction, and a briefing for the parent.',
        '## What to say at home',
        'Keep it calm and short: “We’re going to see the dentist, who will count your teeth.” Do not promise that “nothing will be done” - if something is done after all, trust is broken.',
        '## Words to avoid',
        'Avoid **pain**, **needle**, **extraction** and **drill** - even in the form “it won’t hurt”. Children do not process the negation, but the word “hurt” stays.',
        'Equally, never say “if you are not a good boy I will take you to the dentist”. The dentist must not be a punishment.',
        '## What we do',
        'Dream Land is a separate treatment box that belongs to children alone. On the first visit we get to know each other, show the instruments and count teeth. Every visit ends with a gift, and completed treatment earns a Super Smile certificate.',
        'If a child is very anxious or extensive treatment is needed, sedation is available under the supervision of an anaesthesiologist.',
      ],
      ru: [
        'Отношение ребёнка к стоматологу формируется практически полностью за первые два-три визита. Хорошая новость в том, что большая часть этого в руках родителей - ещё дома.',
        '## Когда прийти впервые',
        'Первый визит рекомендуется в течение шести месяцев после прорезывания первого зуба, то есть примерно в год. Этот визит не о лечении - это знакомство и инструктаж для родителя.',
        '## Что говорить дома',
        'Говорите спокойно и коротко: «Пойдём, доктор посчитает зубки». Не обещайте, что «ничего делать не будут» - если что-то всё же сделают, доверие разрушится.',
        '## Каких слов избегать',
        'Избегайте слов **боль**, **укол**, **удаление**, **сверлить** - даже в форме «не будет больно». Ребёнок не считывает отрицание, но слово «больно» остаётся.',
        'И никогда не говорите: «будешь плохо себя вести - отведу к стоматологу». Врач не должен быть наказанием.',
        '## Что делаем мы',
        'Dream Land - отдельный бокс, который принадлежит только детям. На первом визите мы знакомимся, показываем инструменты и считаем зубы. Каждый визит заканчивается подарком, а завершённое лечение - сертификатом супер-улыбки.',
        'Если ребёнок очень боится или требуется объёмное лечение, доступна седация под контролем анестезиолога.',
      ],
    },
  },
]
