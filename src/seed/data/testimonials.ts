import type { Localized } from './services'

export type SeedTestimonial = {
  patientName: Localized<string>
  quote: Localized<string>
  country: Localized<string>
  countryCode: string
  rating: number
  source: 'facebook' | 'instagram' | 'google' | 'clinic' | 'madloba'
  featured: boolean
  order: number
}

/**
 * Verbatim, named reviews from public listings. Aggregates (Madloba 131,
 * SmileJet 260, Facebook 79) are shown as platform scores; only attributable
 * quotes become cards, so we never invent social proof.
 */
export const testimonials: SeedTestimonial[] = [
  {
    patientName: { ka: 'ნათანი', en: 'Nathan', ru: 'Натан' },
    quote: {
      ka: 'მივედი Dream Dental-ში დოქტორ ბაჩოსთან. ამომიღეს ოთხი კბილი, დამიდგეს ოთხი იმპლანტი და გამიკეთეს ძვლის გადანერგვა. მკურნალობა ნამდვილად უმაღლესი დონის იყო. ძალიან კმაყოფილი ვარ და აუცილებლად დავბრუნდები მკურნალობის გასაგრძელებლად. დიდი მადლობა!',
      en: 'I came to Dream Dental to see Dr. Bacho. I had four teeth extracted, four implants placed and a bone graft. The treatment was truly of the highest standard. I’m very satisfied and will definitely return to continue my treatment. Thank you very much!',
      ru: 'Я пришёл в Dream Dental к доктору Бачо. Мне удалили четыре зуба, установили четыре импланта и сделали костную пластику. Лечение было действительно высочайшего уровня. Я очень доволен и обязательно вернусь, чтобы продолжить лечение. Большое спасибо!',
    },
    country: { ka: 'ისრაელი', en: 'Israel', ru: 'Израиль' },
    countryCode: 'IL',
    rating: 5,
    source: 'facebook',
    featured: true,
    order: 10,
  },
  {
    patientName: { ka: 'მატეუს დიასი', en: 'Mateus Dias', ru: 'Матеус Диас' },
    quote: {
      ka: 'ეს საუკეთესო სტომატოლოგიური კლინიკაა, რაც საქართველოში გვინახავს. ჩემს მეუღლეს სასწრაფო დახმარება სჭირდებოდა, მეგობარმა აქ გვირჩია. დავურეკე და იმავე დღეს მიგვიღეს. პრობლემა სწრაფად და კარგ ფასად მოგვარეს. მომსახურება გამორჩეული იყო - პერსონალი შესანიშნავად ლაპარაკობს ინგლისურად, ძალიან მეგობრული იყო და თავს კომფორტულად გვაგრძნობინებდა. გარემო ოჯახებისთვის თბილია და ბავშვებთან კარგად მუშაობენ. აბსოლუტური 10/10!',
      en: 'This is by far the best dental clinic we’ve experienced in Georgia. My wife needed immediate care, and a friend recommended this place. I reached out and managed to get an appointment the same day. The problem was quickly addressed at a great price. Their customer service was outstanding; the staff spoke excellent English, were very friendly, and ensured we felt at ease. The atmosphere is welcoming for families, and they are great with children. Absolutely a 10/10!',
      ru: 'Это лучшая стоматология, в которой мы были в Грузии. Жене нужна была срочная помощь, друг посоветовал эту клинику. Я позвонил, и нас приняли в тот же день. Проблему решили быстро и по хорошей цене. Сервис выдающийся: персонал отлично говорит по-английски, очень дружелюбный, нам было спокойно. Атмосфера семейная, с детьми работают замечательно. Абсолютные 10 из 10!',
    },
    country: { ka: 'ბრაზილია', en: 'Brazil', ru: 'Бразилия' },
    countryCode: 'BR',
    rating: 5,
    source: 'madloba',
    featured: true,
    order: 20,
  },
  {
    patientName: { ka: 'ანა მაკარჩუკი', en: 'Anna Makarchuk', ru: 'Анна Макарчук' },
    quote: {
      ka: '52 წლის ასაკში ბევრ ექიმთან მკურნალობა მაქვს ნანახი, მაგრამ ამ კლინიკამ ყველა მოლოდინი გადააჭარბა. ზარზე ჩაწერიდან რეცეფციამდე ყველაფერი გასაგები და ადამიანური იყო. დოქტორი ბაჩო კი უბრალოდ განსაცვიფრებელია - ყურადღებიანი, მაღალი პროფესიონალიზმის და ამასთან თბილი. ყოველ ნაბიჯს დეტალურად მიხსნიდა, მკურნალობა კი თითქმის უმტკივნეულო იყო, პულპიტის მიუხედავად. ბაჩო არა მხოლოდ ექიმი იყო, არამედ ჩემი კბილის ადვოკატიც - გულწრფელად ეცადა ნერვის შენარჩუნებას. როცა გაირკვა, რომ არხის მკურნალობა მაინც დასჭირდებოდა, ამ რთულ პროცედურაზე თანხა არ აიღო. წარმოგიდგენიათ? ახლა სერიოზულად ვფიქრობ, რომ შემდეგ ჯერზე სპეციალურად ჩავფრინდე თბილისში, მხოლოდ Dream Dental-ში და მხოლოდ დოქტორ ბაჩოსთან.',
      en: 'At 52, I’ve had my teeth treated by many doctors, but this clinic exceeded all my expectations! From the phone appointment to the reception staff – everything was so clear and so human! And Dr. Bacho is simply amazing! Attentive, highly professional, and on top of all that, so warm and charming! He thoroughly explained every step of the treatment, and the treatment itself caused almost no discomfort (and this was for pulpitis!). Bacho wasn’t just a doctor, but also an advocate for my tooth, sincerely giving it a chance to save the nerve! And then, when it finally became clear I’d have to have a root canal, he didn’t charge me for this complicated procedure. Can you imagine? Now I’m seriously considering making a special trip to Tbilisi next time I need dental treatment, only to Dream Dental, and only to Dr. Bacho!',
      ru: 'В 52 года я лечила зубы у многих врачей, но эта клиника превзошла все ожидания. От записи по телефону до ресепшен - всё было понятно и по-человечески. А доктор Бачо просто потрясающий: внимательный, высокопрофессиональный и при этом тёплый. Он подробно объяснял каждый шаг, само лечение почти не вызвало дискомфорта - хотя это был пульпит. Бачо был не просто врачом, а адвокатом моего зуба: искренне дал нерву шанс. Когда стало ясно, что канал всё же придётся лечить, за эту сложную процедуру он не взял денег. Представляете? Теперь я всерьёз думаю специально приезжать в Тбилиси к Dream Dental и только к доктору Бачо.',
    },
    country: { ka: 'უკრაინა', en: 'Ukraine', ru: 'Украина' },
    countryCode: 'UA',
    rating: 5,
    source: 'google',
    featured: true,
    order: 30,
  },
  {
    patientName: { ka: 'ლალი მღებრიშვილი', en: 'Lali Mghebrishvili', ru: 'Лали Мгебришвили' },
    quote: {
      ka: 'კლინიკაში პროცედურებით ძალიან კმაყოფილი ვარ. მომსახურება, პროფესიონალი ექიმები და სისუფთავე ძალიან მომეწონა. უდიდესი მადლობა ჩემს ექიმს ნინო ბერიძეს და ასევე ნათიას და ანანოს მეგობრული დახვედრისთვის. დიდი რეკომენდაცია, აუცილებლად მოვბრუნდები.',
      en: 'I am very satisfied with the procedures at the clinic. I really liked the service, the professional doctors and the cleanliness. Huge thanks to my doctor Nino Beridze, and also to Natia and Anano for the warm welcome. Strongly recommended - I will definitely be back.',
      ru: 'Очень довольна процедурами в клинике. Сервис, профессиональные врачи и чистота мне очень понравились. Огромное спасибо моему врачу Нино Беридзе, а также Натии и Анано за тёплый приём. Большая рекомендация, обязательно вернусь.',
    },
    country: { ka: 'საქართველო', en: 'Georgia', ru: 'Грузия' },
    countryCode: 'GE',
    rating: 5,
    source: 'madloba',
    featured: true,
    order: 40,
  },
  {
    patientName: { ka: 'სანი ჯონსტონი', en: 'Sunny Johnston', ru: 'Санни Джонстон' },
    quote: {
      ka: 'ეს ჩემს ცხოვრებაში საუკეთესო ჰიგიენური წმენდა იყო. ნინიმ ისეთი წმენდა გამიკეთა, როგორიც არასდროს მქონია. ოფისის ატმოსფერო შესანიშნავი იყო - ყველა ისეთი თბილი და დამხმარე. ყავაც შემოგვთავაზეს და ქურთუკებისთვის ადგილიც. აი ეს არის ხუთვარსკვლავიანი გამოცდილება. ისე მომეწონა, რომ შემდეგი წმენდა წინასწარ დავჯავშნე. უბრალოდ განსაცვიფრებელია.',
      en: 'Omg this was the best cleaning of my life. Nini gave me the best cleaning I ever had. The office atmosphere was wonderful. Everybody was so welcoming and helpful. They even offered us coffee and a place to put our jackets. This is what you call a five-star experience. I like it so much I tried to schedule an appointment early to have my teeth cleaned again. Simply amazing.',
      ru: 'Это была лучшая чистка в моей жизни. Нини сделала её так, как мне ещё никогда не делали. Атмосфера в клинике прекрасная: все такие приветливые и отзывчивые. Нам даже предложили кофе и место для курток. Вот это сервис на пять звёзд. Мне так понравилось, что я сразу попыталась записаться на следующую чистку. Просто потрясающе.',
    },
    country: { ka: 'აშშ', en: 'United States', ru: 'США' },
    countryCode: 'US',
    rating: 5,
    source: 'google',
    featured: true,
    order: 50,
  },
  {
    patientName: { ka: 'გიორგი არჩაია', en: 'Giorgi Archaia', ru: 'Гиорги Арчайя' },
    quote: {
      ka: 'კლინიკის აქციით ვისარგებლე და საუკეთესო ექიმ ბაჩოსთან ხუთი კბილი დამიდგეს იმპლანტებით. დიდი მადლობა საუკეთესო იმპლანტოლოგ ბაჩოს, ადმინისტრატორ ნათიას და ნინის.',
      en: 'I took advantage of the clinic’s promotion and had 5 teeth implanted with the best doctor Bacho. Thank you very much to the best implantologist Bacho, administrator Natia and Nini.',
      ru: 'Воспользовался акцией клиники и поставил пять имплантов у лучшего врача Бачо. Большое спасибо лучшему имплантологу Бачо, администратору Натии и Нини.',
    },
    country: { ka: 'საქართველო', en: 'Georgia', ru: 'Грузия' },
    countryCode: 'GE',
    rating: 5,
    source: 'google',
    featured: true,
    order: 60,
  },
  {
    patientName: { ka: 'პიტერ გაბუზდა', en: 'Peter Gabuzda', ru: 'Питер Габузда' },
    quote: {
      ka: 'ექიმ შორენას საქმე სრულყოფილი იყო. პროცედურა უმტკივნეულო და ძალიან პროფესიონალური. ვურჩევ ყველას, ვინც თბილისში იქნება. და არ დამავიწყდეს რეცეფციის გოგოების სასიამოვნო და პროფესიონალური დამოკიდებულება.',
      en: 'Perfect work by the dentist Shorena. The procedure was painless and very professional. I recommend it to anyone who will be in Tbilisi. And let me not forget the pleasant and professional approach of the girls at the reception.',
      ru: 'Безупречная работа доктора Шорены. Процедура прошла без боли и очень профессионально. Рекомендую всем, кто будет в Тбилиси. И нельзя не отметить приятный, профессиональный подход девушек на ресепшен.',
    },
    country: { ka: 'საერთაშორისო პაციენტი', en: 'International patient', ru: 'Пациент из-за рубежа' },
    countryCode: '',
    rating: 5,
    source: 'google',
    featured: false,
    order: 70,
  },
  {
    patientName: { ka: 'ნატალია ბეგლარიშვილი', en: 'Natalia Beglarishvili', ru: 'Наталия Бегларишвили' },
    quote: {
      ka: 'ჩავიტარე ჰიგიენური წმენდა. ძალიან თბილი გარემო და საოცარი სისუფთავე. გოგონები ანანო და თაკო ძალიან კარგი არიან, ხოლო ექიმი სოფო პროფესიონალიზმით, ყურადღებით და სწორი რჩევებით გამოირჩევა.',
      en: 'I had a hygiene cleaning. Very warm atmosphere and remarkable cleanliness. Anano and Tako at reception are wonderful, and Dr. Sofo stands out for her professionalism, care and the right advice.',
      ru: 'Сделала гигиеническую чистку. Очень тёплая атмосфера и удивительная чистота. Девушки Анано и Тако замечательные, а доктор Софо выделяется профессионализмом, вниманием и точными рекомендациями.',
    },
    country: { ka: 'საქართველო', en: 'Georgia', ru: 'Грузия' },
    countryCode: 'GE',
    rating: 5,
    source: 'madloba',
    featured: false,
    order: 80,
  },
  {
    patientName: { ka: 'ნინო კოჩლამაზაშვილი', en: 'Nino Kochlamazashvili', ru: 'Нино Кочламазашвили' },
    quote: {
      ka: 'ჩავიტარე კბილების პროფესიონალური გაწმენდის პროცედურა. ძალიან მომეწონა მეგობრული და სასიამოვნო გარემო. პერსონალი ყურადღებიანი და პროფესიონალი იყო. პროცედურა კომფორტულად ჩაიარა და შედეგით ძალიან კმაყოფილი ვარ. დიდი მადლობა შესანიშნავი მომსახურებისთვის! ნინი ექიმს და ადმინისტრატორ ნათიას ❤️',
      en: 'I had a professional teeth cleaning. I really liked the friendly, pleasant atmosphere. The staff were attentive and professional. The procedure was comfortable and I am very happy with the result. Thank you so much for the excellent service - Dr. Nini and administrator Natia.',
      ru: 'Сделала профессиональную чистку зубов. Очень понравилась дружелюбная, приятная атмосфера. Персонал внимательный и профессиональный. Процедура прошла комфортно, результатом очень довольна. Большое спасибо за отличный сервис доктору Нини и администратору Натии.',
    },
    country: { ka: 'საქართველო', en: 'Georgia', ru: 'Грузия' },
    countryCode: 'GE',
    rating: 5,
    source: 'madloba',
    featured: false,
    order: 90,
  },
]
