/**
 * Triple Gelato Triathlon — Main Script
 * ==========================================================================
 */

/* ==========================================================================
   FORM SUBMISSION CONFIGURATION
   Connect the interest form to a live service when ready.

   Options:
   1. Formspree  — set provider to 'formspree' and endpoint to your form URL
   2. Netlify    — set provider to 'netlify' (add netlify attribute to form in HTML)
   3. Supabase   — set provider to 'supabase' and configure endpoint + headers
   4. Custom API — set provider to 'custom' and endpoint to your API URL

   Default: 'prototype' stores submissions in localStorage for local testing only.
   ========================================================================== */
const FORM_CONFIG = {
  provider: 'prototype', // 'prototype' | 'formspree' | 'netlify' | 'supabase' | 'custom'
  endpoint: '',          // e.g. 'https://formspree.io/f/xxxxxxxx'
  headers: {},           // Additional headers for custom/Supabase requests
};

// localStorage key — PROTOTYPE ONLY, not a production database
const STORAGE_KEY = 'tgt_interest_submissions';

/* Language preference — German is the required default for first-time visitors */
const LANG_STORAGE_KEY = 'tgt_preferred_language';
const DEFAULT_LANG = 'de';
const SUPPORTED_LANGS = ['de', 'en', 'it', 'tr', 'ar'];
const RTL_LANGS = ['ar'];

const LANG_GLYPHS = {
  de: '🇩🇪',
  en: '🇬🇧',
  it: '🇮🇹',
  tr: '🇹🇷',
  ar: 'ع',
};

const LANG_SELECT_LABELS = {
  de: 'Deutsch auswählen',
  en: 'Switch to English',
  it: "Passa all'italiano",
  tr: 'Türkçeye geç',
  ar: 'التبديل إلى العربية',
};

let currentLang = DEFAULT_LANG;

/* ==========================================================================
   TRANSLATIONS
   German and English in this file; Italian, Turkish and Arabic in locales-it-tr-ar.js.
   Keys match data-i18n / data-i18n-* attributes in index.html.
   ========================================================================== */
const TRANSLATIONS = {
  de: {
    meta: {
      title: 'Triple Gelato Triathlon — Interesse anmelden',
      description: 'Der Triple Gelato Triathlon ist ein Familienevent mit Schwimmen, Radfahren und Laufen, das derzeit entwickelt wird. An jeder Wechselzone wartet eine andere Eissorte. Zeigt uns euer Interesse und gestaltet die erste Ausgabe mit.',
      ogTitle: 'Triple Gelato Triathlon — Ein mögliches Familienevent',
      ogDescription: 'Schwimmen. Radfahren. Laufen. Und an jeder Wechselzone eine andere Kugel Eis. Gestaltet den ersten Triple Gelato Triathlon mit.',
      jsonLdDescription: 'Triple Gelato Triathlon ist ein Familienevent mit Schwimmen, Radfahren und Laufen, das sich derzeit in der Planungsphase befindet. Mit ersten Interessensbekundungen möchten wir herausfinden, wie die erste Ausgabe aussehen könnte.',
    },
    language: {
      groupLabel: 'Sprache wählen',
      german: 'Deutsch',
      english: 'English',
      italian: 'Italiano',
      turkish: 'Türkçe',
      arabic: 'العربية',
      selectGerman: 'Deutsch auswählen',
      selectEnglish: 'Switch to English',
      selectItalian: 'Passa all\'italiano',
      selectTurkish: 'Türkçeye geç',
      selectArabic: 'التبديل إلى العربية',
      moreLanguages: 'Weitere Sprachen',
      closeLanguages: 'Sprachauswahl schließen',
    },
    a11y: {
      skip: 'Zum Hauptinhalt springen',
      logoHome: 'Triple Gelato Triathlon — Startseite',
      mainNav: 'Hauptnavigation',
      mobileNav: 'Mobile Navigation',
      footerNav: 'Fußzeilennavigation',
    },
    nav: {
      idea: 'Die Idee',
      stages: 'Drei Disziplinen',
      audience: 'Für wen?',
      principles: 'Grundsätze',
      register: 'Interesse anmelden',
      partners: 'Partner',
      faq: 'FAQ',
      cta: 'Ich bin interessiert',
      openMenu: 'Menü öffnen',
      closeMenu: 'Menü schließen',
    },
    banner: {
      title: 'Von Anfang an dabei',
      body: 'Aus einer Idee soll ein neues Familienevent werden: der Triple Gelato Triathlon. Bevor wir mit Veranstaltungsorten, Vereinen, Eisdielen und möglichen Partnern in die konkrete Planung gehen, möchten wir wissen, ob ihr dabei wärt und was euch wichtig ist. Eure Rückmeldungen helfen uns, die erste Ausgabe zu gestalten.',
      cta: 'Ich bin dabei',
    },
    hero: {
      eyebrow: 'Ein neues Familienevent nimmt Form an',
      lead: 'Schwimmen. Radfahren. Laufen. Und nach jeder Etappe wartet eine andere Kugel Eis.',
      support: 'Ein entspannter Triathlon für Familien, bei dem gemeinsames Ankommen wichtiger ist als der erste Platz.',
      ctaPrimary: 'Interesse anmelden',
      ctaSecondary: 'So funktioniert’s',
      status: 'Wir sammeln gerade erste Rückmeldungen',
    },
    idea: {
      heading: 'Drei Disziplinen. Drei Sorten Eis. Ein richtig guter Tag zusammen.',
      lead: 'Die Idee ist einfach: ein inklusives Outdoor-Event für Kinder, Erwachsene, Familien und Gruppen mit ganz unterschiedlicher Sporterfahrung. Geschwommen, Rad gefahren und gelaufen wird auf gut machbaren Distanzen. An jeder Wechselzone wartet eine andere Eissorte.',
      clarification: '<strong>Die Idee befindet sich noch in einer frühen Planungsphase.</strong> Mit einer Interessensbekundung verpflichtet ihr euch weder zur Teilnahme noch zu einer Zahlung. Sie hilft uns lediglich einzuschätzen, ob und wie wir die Veranstaltung weiterentwickeln sollten.',
    },
    stages: {
      heading: 'Die drei Disziplinen',
      swim: {
        title: 'Schwimmen',
        copy: 'Ein entspannter Auftakt, abgestimmt auf den Veranstaltungsort und die Menschen, die teilnehmen.',
        gelato: 'Erste Kugel in der Wechselzone',
        alt: 'Schwimmerinnen und Schwimmer im Pool bei einer familienfreundlichen Einheit',
      },
      cycle: {
        title: 'Radfahren',
        copy: 'Eine familienfreundliche Radrunde, bei der sicheres Mitmachen, gute Gesellschaft und Freude an der Strecke zählen.',
        gelato: 'Zweite Kugel in der Wechselzone',
        alt: 'Radfahrende gemeinsam auf einer landschaftlich schönen Route',
      },
      run: {
        title: 'Laufen',
        copy: 'Ein Finale zum Feiern, bei dem Kinder, Eltern, Freundeskreise und Teams gemeinsam Richtung Ziel laufen können.',
        gelato: 'Die letzte Kugel im Ziel',
        alt: 'Eine Familie läuft gemeinsam im Freien',
      },
    },
    audience: {
      heading: 'Für wen könnte das Event passen?',
      lead: 'Die genauen Kategorien, Altersgrenzen, Distanzen, Angebote zur Barrierefreiheit und der Veranstaltungsort würden gemeinsam mit den passenden Partnern festgelegt.',
      families: 'Familien',
      childrenAdults: 'Kinder in Begleitung Erwachsener',
      firstTimers: 'Alle, die Triathlon zum ersten Mal ausprobieren',
      recreational: 'Freizeitaktive',
      schools: 'Schul- oder Gemeindegruppen',
      friends: 'Freundinnen und Freunde als Team',
      movement: 'Alle, denen Bewegung wichtiger ist als Medaillen',
      icecream: 'Alle, die sich mit Eis ziemlich leicht überzeugen lassen',
    },
    principles: {
      heading: 'Was uns wichtig ist',
      accessible: {
        title: 'Gut machbar',
        copy: 'Distanzen und Formate sollen so gewählt werden, dass Menschen mit unterschiedlicher Sporterfahrung realistisch teilnehmen können.',
      },
      family: {
        title: 'Familienorientiert',
        copy: 'Die Atmosphäre soll Familien und Freundeskreisen Lust darauf machen, gemeinsam teilzunehmen.',
      },
      local: {
        title: 'Lokal verankert',
        copy: 'Wo auch immer die erste Ausgabe stattfindet: Lokale Vereine, Veranstaltungsorte und Eismacher sollen Teil davon sein.',
      },
      joy: {
        title: 'Sportlich, aber entspannt',
        copy: 'Vielleicht gibt es eine Zeitnahme. Entscheidend sind aber der Spaß am Tag und das gemeinsame Ankommen.',
      },
    },
    register: {
      heading: 'Wärt ihr bei der ersten Ausgabe dabei?',
      lead: 'Sagt uns, wie der Triple Gelato Triathlon für euch aussehen müsste. Eure Antworten geben uns eine konkrete Grundlage für Gespräche mit Veranstaltungsorten, Sportvereinen und Eispartnern, wenn wir die erste Ausgabe planen.',
    },
    form: {
      interestTypeLegend: 'Art des Interesses',
      interestParticipant: 'Ich interessiere mich als Teilnehmer/in',
      interestPartner: 'Ich interessiere mich als möglicher Partner',
      stepTitle1: 'Wer wäre dabei?',
      stepTitle2: 'Wie soll sich das Event anfühlen?',
      stepTitle3: 'Wie weit würdet ihr dafür fahren?',
      stepTitle4: 'Und was muss beim Eis beachtet werden?',
      stepTitle5: 'Fast geschafft.',
      stepLabel1: 'Über euch',
      stepLabel2: 'Format',
      stepLabel3: 'Anreise',
      stepLabel4: 'Gelato',
      stepLabel5: 'Kontakt',
      back: 'Zurück',
      next: 'Weiter',
      partnerPanelTitle: 'Partnerangaben',
      progressA11y: 'Fortschritt: Schritt {current} von {total}',
      name: 'Name',
      email: 'E-Mail-Adresse',
      postcode: 'Postleitzahl oder Ort',
      who: 'Wer würde teilnehmen?',
      whoJustMe: 'Nur ich',
      whoMeChild: 'Ich und ein Kind',
      whoFamily: 'Eine Familie',
      whoFriends: 'Eine Freundesgruppe',
      whoOrg: 'Schule, Verein oder Organisation',
      whoPartner: 'Ich interessiere mich als möglicher Partner',
      participants: 'Ungefähre Anzahl der Teilnehmenden',
      age: 'Altersgruppen der Teilnehmenden',
      ageUnder6: 'Unter 6',
      age6to9: '6–9',
      age10to13: '10–13',
      age14to17: '14–17',
      age18plus: '18+',
      format: 'Bevorzugtes Veranstaltungsformat',
      formatShort: 'Sehr kurz und spielerisch',
      formatBeginner: 'Einsteigerfreundlich',
      formatModerate: 'Eine moderate Herausforderung für Familien',
      formatDistances: 'Mehrere Streckenlängen',
      formatUnsure: 'Noch unsicher',
      travel: 'Wie weit würdet ihr anreisen?',
      travel15: 'Bis zu 15 km',
      travel30: 'Bis zu 30 km',
      travel60: 'Bis zu 60 km',
      travelFurther: 'Für die passende Veranstaltung auch weiter',
      time: 'Bevorzugte Jahreszeit',
      timeSpring: 'Frühling',
      timeSummer: 'Sommer',
      timeAutumn: 'Frühherbst',
      timeNone: 'Keine Präferenz',
      dietary: 'Ernährungsbedürfnisse',
      dietaryDairy: 'Laktosefrei / milchfrei',
      dietaryVegan: 'Vegan',
      dietaryNut: 'Nussfrei',
      dietaryGluten: 'Glutenfrei',
      dietaryOther: 'Sonstiges',
      comments: 'Optionale Anmerkungen',
      commentsPlaceholder: 'Teilen Sie uns alles weitere mit, das bei der Gestaltung helfen könnte…',
      commentsPlaceholderStep4: 'Gibt es noch etwas, das uns bei der Planung helfen würde?',
      keepInformed: 'Bitte haltet mich über die Entwicklung des Triple Gelato Triathlon auf dem Laufenden.',
      partnerToggle: 'Ich vertrete einen möglichen Veranstaltungsort, Verein, Verband, eine Gelateria, einen Hersteller oder Sponsor.',
      partnerDetails: 'Partnerangaben',
      orgName: 'Name der Organisation',
      orgType: 'Art der Organisation',
      orgTypeSelect: 'Typ auswählen…',
      orgVenue: 'Veranstaltungsort',
      orgSports: 'Sportverein oder -verband',
      orgGelato: 'Gelateria oder Eiscreme-Hersteller',
      orgCommunity: 'Gemeindeorganisation',
      orgAccessibility: 'Partner für Barrierefreiheit',
      orgSponsor: 'Sponsor',
      orgOther: 'Sonstiges',
      orgWebsite: 'Website',
      orgContribution: 'Wie möchten Sie möglicherweise beitragen?',
      orgPhone: 'Telefonnummer (optional)',
      privacy: 'Ich bin damit einverstanden, dass meine Angaben gespeichert werden, um das Interesse an dieser Veranstaltungsidee auszuwerten.',
      submit: 'Interesse absenden',
      successTitle: 'Danke für dein Interesse!',
      successBody: 'Deine Angaben wurden in diesem Prototyp gespeichert. Sobald der Live-Formulardienst verbunden ist, werden Einsendungen direkt an das Organisationsteam übermittelt.',
      reset: 'Weitere Antwort absenden',
      errorName: 'Bitte geben Sie Ihren Namen ein.',
      errorEmail: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
      errorEmailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      errorPostcode: 'Bitte geben Sie Ihre Postleitzahl oder Ihren Ort ein.',
      errorWho: 'Bitte wählen Sie, wer teilnehmen würde.',
      errorParticipants: 'Bitte geben Sie die ungefähre Anzahl der Teilnehmenden an.',
      errorAge: 'Bitte wählen Sie mindestens eine Altersgruppe.',
      errorFormat: 'Bitte wählen Sie ein bevorzugtes Veranstaltungsformat.',
      errorTravel: 'Bitte wählen Sie, wie weit Sie anreisen würden.',
      errorTime: 'Bitte wählen Sie eine bevorzugte Jahreszeit.',
      errorPrivacy: 'Bitte stimmt der Speicherung eurer Angaben zu, um fortzufahren.',
      errorOrgName: 'Bitte geben Sie den Namen Ihrer Organisation ein.',
      errorOrgType: 'Bitte wählen Sie die Art der Organisation.',
      errorOrgContribution: 'Bitte beschreiben Sie, wie Sie möglicherweise beitragen möchten.',
      errorSubmit: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    },
    partners: {
      heading: 'Eine Strecke braucht ein Zuhause. Und die Wechselzonen brauchen Eis.',
      lead: 'Wir suchen außerdem Menschen und Organisationen, die die erste Ausgabe möglich machen könnten: Schwimmbäder, Sportvereine, lokale Initiativen, Grundstückseigentümer, Kommunen, Eisdielen, Eismanufakturen und weitere Unternehmen, die etwas zum Event beitragen möchten.',
      cta: 'Partnerschaft besprechen',
      host: 'Veranstaltungsort',
      sports: 'Sport- und Streckenpartner',
      gelato: 'Gelato- oder Eiscreme-Partner',
      community: 'Gemeindepartner',
      accessibility: 'Partner für Barrierefreiheit',
      sponsor: 'Sponsor',
    },
    faq: {
      heading: 'Fragen und Antworten',
      q1: 'Ist die Veranstaltung bestätigt?',
      a1: 'Noch nicht. Wir möchten zunächst herausfinden, wie groß das Interesse ist, und anschließend mit möglichen Partnern ins Gespräch gehen.',
      q2: 'Wo wird sie stattfinden?',
      a2: 'Noch nicht. Wenn wir wissen, aus welchen Regionen das Interesse kommt, können wir gezielter nach einem passenden Veranstaltungsort suchen.',
      q3: 'Wie lang wird jede Etappe sein?',
      a3: 'Die Distanzen stehen noch nicht fest. Geplant sind gut machbare Optionen statt einer einzigen Strecke, die nur für erfahrene Sportlerinnen und Sportler passt.',
      q4: 'Wird es Zeitnahme geben?',
      a4: 'Das ist noch offen. Eine Zeitnahme ist möglich, aber Teilnahme, Spaß und ein sicherer Ablauf stehen an erster Stelle.',
      q5: 'Ist es nur für Kinder?',
      a5: 'Nein. Die Idee richtet sich an Kinder, Erwachsene, Familien und gemischte Gruppen. Die endgültigen Alters- und Sicherheitsregeln werden erst in der Planung festgelegt.',
      q6: 'Wird es Alternativen für besondere Ernährungsbedürfnisse geben?',
      a6: 'Das ist unser Ziel. Wo es praktisch möglich ist, sollen milchfreie, vegane und allergiebewusste Alternativen eingeplant werden.',
      q7: 'Kostet die Interessensbekundung etwas?',
      a7: 'Nein. Die Interessensbekundung ist kostenlos und unverbindlich.',
    },
    footer: {
      tagline: 'Ein Familienevent mit Schwimmen, Radfahren und Laufen in Planung',
      disclaimer: 'Die Veranstaltung befindet sich noch in Planung. Termin, Ort, Format und Teilnahmebedingungen stehen noch nicht fest.',
      privacy: 'Datenschutzerklärung',
      imprint: 'Impressum',
      rights: 'Alle Rechte vorbehalten.',
    },
  },

  en: {
    meta: {
      title: 'Triple Gelato Triathlon — Register Your Interest',
      description: 'Triple Gelato Triathlon is a family-friendly swim, cycle and run event in development, with a different gelato treat at every transition. Tell us you\'re interested and help shape the first edition.',
      ogTitle: 'Triple Gelato Triathlon — A Proposed Family Event',
      ogDescription: 'Swim. Cycle. Run. A different scoop at every transition. Help shape the first Triple Gelato Triathlon.',
      jsonLdDescription: 'Triple Gelato Triathlon is a family swim, cycle and run event currently in development. Early expressions of interest will help shape what the first edition could become.',
    },
    language: {
      groupLabel: 'Choose language',
      german: 'Deutsch',
      english: 'English',
      italian: 'Italiano',
      turkish: 'Türkçe',
      arabic: 'العربية',
      selectGerman: 'Deutsch auswählen',
      selectEnglish: 'Switch to English',
      selectItalian: 'Passa all\'italiano',
      selectTurkish: 'Türkçeye geç',
      selectArabic: 'التبديل إلى العربية',
      moreLanguages: 'More languages',
      closeLanguages: 'Close language selection',
    },
    a11y: {
      skip: 'Skip to main content',
      logoHome: 'Triple Gelato Triathlon — home',
      mainNav: 'Main navigation',
      mobileNav: 'Mobile navigation',
      footerNav: 'Footer navigation',
    },
    nav: {
      idea: 'The idea',
      stages: 'Three stages',
      audience: 'Who it\'s for',
      principles: 'Principles',
      register: 'Register interest',
      partners: 'Partners',
      faq: 'FAQ',
      cta: 'I\'m interested',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    banner: {
      title: 'Be part of it from the start',
      body: 'We\'re working to bring the Triple Gelato Triathlon to life as a new family event. Before we approach venues, clubs, gelaterias and potential partners, we\'d love to know if you\'d be interested and hear what you think. Your feedback will help shape the very first event.',
      cta: 'I\'m interested',
    },
    hero: {
      eyebrow: 'A new family event in the making',
      lead: 'Swim. Cycle. Run. And celebrate each stage with a different scoop.',
      support: 'A relaxed, family-friendly take on triathlon, where crossing the finish together matters more than coming first.',
      ctaPrimary: 'Register your interest',
      ctaSecondary: 'See how it works',
      status: 'We\'re gauging interest',
    },
    idea: {
      heading: 'Three activities. Three flavours. One rather brilliant day out.',
      lead: 'The idea is simple: an inclusive outdoor event for children, adults, families and groups with different levels of experience. Swim, cycle and run at approachable distances, with a different gelato treat waiting at each transition.',
      clarification: '<strong>This is still an early-stage idea.</strong> Telling us you\'re interested doesn\'t commit you to attending or paying anything. It simply helps us decide whether the event is worth developing.',
    },
    stages: {
      heading: 'The three stages',
      swim: {
        title: 'Swim',
        copy: 'A friendly opening stage, shaped around the venue and the people taking part.',
        gelato: 'Scoop one at transition',
        alt: 'Swimmers in a pool during a family-friendly session',
      },
      cycle: {
        title: 'Cycle',
        copy: 'A family-friendly ride built around safe participation, good company and enjoying the route.',
        gelato: 'Scoop two at transition',
        alt: 'Cyclists riding together on a scenic route',
      },
      run: {
        title: 'Run',
        copy: 'A final stage worth celebrating, with children, parents, friends and teams able to head for the finish together.',
        gelato: 'Final scoop at the finish',
        alt: 'A family running together outdoors',
      },
    },
    audience: {
      heading: 'Who could take part?',
      lead: 'Exact categories, ages, distances, accessibility arrangements and venue details would be worked out with the right partners.',
      families: 'Families',
      childrenAdults: 'Children with adults',
      firstTimers: 'People trying a triathlon for the first time',
      recreational: 'Recreational athletes',
      schools: 'School or community groups',
      friends: 'Friends entering as a team',
      movement: 'People who care more about moving than medals',
      icecream: 'People who need very little persuading when ice cream is involved',
    },
    principles: {
      heading: 'What matters to us',
      accessible: {
        title: 'Approachable',
        copy: 'Distances and formats should give people with different levels of experience a realistic way to take part.',
      },
      family: {
        title: 'Family-led',
        copy: 'The atmosphere should make it easy for families and friends to join in together.',
      },
      local: {
        title: 'Local',
        copy: 'Wherever the first event lands, we\'d like local clubs, venues and ice-cream makers to be part of it.',
      },
      joy: {
        title: 'Joyfully competitive',
        copy: 'There may be timing, but the point is to enjoy the day and make it to the finish.',
      },
    },
    register: {
      heading: 'Fancy being there for the first one?',
      lead: 'Tell us what would make the Triple Gelato Triathlon work for you. Your answers give us something concrete to take to venues, sports organisations and gelato partners when we start planning the first event.',
    },
    form: {
      interestTypeLegend: 'Type of interest',
      interestParticipant: 'I\'m interested in taking part',
      interestPartner: 'I\'m interested as a potential partner',
      stepTitle1: 'Who would take part?',
      stepTitle2: 'What kind of event would suit you?',
      stepTitle3: 'How far would you travel?',
      stepTitle4: 'And what should we consider for the gelato?',
      stepTitle5: 'Nearly there.',
      stepLabel1: 'About you',
      stepLabel2: 'Format',
      stepLabel3: 'Travel',
      stepLabel4: 'Gelato',
      stepLabel5: 'Contact',
      back: 'Back',
      next: 'Next',
      partnerPanelTitle: 'Partner details',
      progressA11y: 'Progress: step {current} of {total}',
      name: 'Name',
      email: 'Email address',
      postcode: 'Postcode or town',
      who: 'Who would take part?',
      whoJustMe: 'Just me',
      whoMeChild: 'Me and one child',
      whoFamily: 'Family group',
      whoFriends: 'Group of friends',
      whoOrg: 'School, club or organisation',
      whoPartner: 'I am interested as a partner',
      participants: 'Approximate number of participants',
      age: 'Participant age groups',
      ageUnder6: 'Under 6',
      age6to9: '6–9',
      age10to13: '10–13',
      age14to17: '14–17',
      age18plus: '18+',
      format: 'Preferred event format',
      formatShort: 'Very short and playful',
      formatBeginner: 'Beginner-friendly',
      formatModerate: 'A moderate family challenge',
      formatDistances: 'Several distance options',
      formatUnsure: 'Not sure',
      travel: 'How far would you travel?',
      travel15: 'Up to 15 km',
      travel30: 'Up to 30 km',
      travel60: 'Up to 60 km',
      travelFurther: 'Further for the right event',
      time: 'Preferred time',
      timeSpring: 'Spring',
      timeSummer: 'Summer',
      timeAutumn: 'Early autumn',
      timeNone: 'No preference',
      dietary: 'Dietary requirements',
      dietaryDairy: 'Dairy-free',
      dietaryVegan: 'Vegan',
      dietaryNut: 'Nut-free',
      dietaryGluten: 'Gluten-free',
      dietaryOther: 'Other',
      comments: 'Optional comments',
      commentsPlaceholder: 'Tell us anything else that would help shape the event…',
      commentsPlaceholderStep4: 'Anything else that would help us shape the event?',
      keepInformed: 'Please keep me informed about the development of the Triple Gelato Triathlon.',
      partnerToggle: 'I represent a possible venue, club, association, gelateria, manufacturer or sponsor.',
      partnerDetails: 'Partner details',
      orgName: 'Organisation name',
      orgType: 'Organisation type',
      orgTypeSelect: 'Select type…',
      orgVenue: 'Host venue',
      orgSports: 'Sports club or association',
      orgGelato: 'Gelateria or ice-cream manufacturer',
      orgCommunity: 'Community organisation',
      orgAccessibility: 'Accessibility partner',
      orgSponsor: 'Sponsor',
      orgOther: 'Other',
      orgWebsite: 'Website',
      orgContribution: 'How they may wish to contribute',
      orgPhone: 'Contact telephone number',
      privacy: 'I consent to my details being stored for the purpose of gauging interest in this event concept.',
      submit: 'Submit my interest',
      successTitle: 'Thank you for your interest!',
      successBody: 'Your response has been recorded in this prototype. Once the live form service is connected, submissions will be delivered directly to the organising team.',
      reset: 'Submit another response',
      errorName: 'Please enter your name.',
      errorEmail: 'Please enter your email address.',
      errorEmailInvalid: 'Please enter a valid email address.',
      errorPostcode: 'Please enter your postcode or town.',
      errorWho: 'Please select who would take part.',
      errorParticipants: 'Please enter the approximate number of participants.',
      errorAge: 'Please select at least one age group.',
      errorFormat: 'Please select a preferred event format.',
      errorTravel: 'Please select how far you would travel.',
      errorTime: 'Please select a preferred time.',
      errorPrivacy: 'You must consent to continue.',
      errorOrgName: 'Please enter your organisation name.',
      errorOrgType: 'Please select an organisation type.',
      errorOrgContribution: 'Please describe how you may wish to contribute.',
      errorSubmit: 'Something went wrong. Please try again.',
    },
    partners: {
      heading: 'A race needs a home. The transitions need gelato.',
      lead: 'We\'re also looking for people and organisations who could help make the first event possible: swimming facilities, sports clubs, local associations, landowners, municipalities, gelaterias, ice-cream makers and other businesses with something useful to bring to the table.',
      cta: 'Talk partnership',
      host: 'Host venue',
      sports: 'Sports and route partner',
      gelato: 'Gelato or ice-cream partner',
      community: 'Community partner',
      accessibility: 'Accessibility partner',
      sponsor: 'Sponsor',
    },
    faq: {
      heading: 'Questions & answers',
      q1: 'Is the event confirmed?',
      a1: 'Not yet. We\'re currently finding out how much interest there is and speaking to potential partners.',
      q2: 'Where will it take place?',
      a2: 'Not yet. Knowing where interested people are based will help us decide which potential hosts to approach.',
      q3: 'How long will each stage be?',
      a3: 'We haven\'t fixed the distances yet. The aim is to offer approachable options rather than one course that only suits experienced athletes.',
      q4: 'Will it be timed?',
      a4: 'We haven\'t decided yet. There may be timing, but participation, enjoyment and getting everyone round safely come first.',
      q5: 'Is it only for children?',
      a5: 'No. The idea is for children, adults, families and mixed groups, with final age and safety rules to be agreed during planning.',
      q6: 'Will dietary alternatives be available?',
      a6: 'That\'s the intention. We\'d like the planning to include dairy-free, vegan and allergy-aware choices wherever practical.',
      q7: 'Does registering interest cost anything?',
      a7: 'No. It\'s free and doesn\'t commit you to anything.',
    },
    footer: {
      tagline: 'A family swim, cycle and run event in the making',
      disclaimer: 'This event is still in development. Date, venue, format and participation conditions have not yet been confirmed.',
      privacy: 'Privacy notice',
      imprint: 'Imprint / legal notice',
      rights: 'All rights reserved.',
    },
  },
};

if (typeof window.__TGT_EXTRA_LOCALES__ !== 'undefined') {
  Object.assign(TRANSLATIONS, window.__TGT_EXTRA_LOCALES__);
}

/** Resolve a dotted key path against the active translation object. */
function t(key) {
  const parts = key.split('.');
  let node = TRANSLATIONS[currentLang];
  for (const part of parts) {
    if (node == null || typeof node !== 'object') return key;
    node = node[part];
  }
  return typeof node === 'string' ? node : key;
}

function getLanguageTitle(langCode) {
  const titles = {
    de: t('language.german'),
    en: t('language.english'),
    it: t('language.italian'),
    tr: t('language.turkish'),
    ar: t('language.arabic'),
  };
  return titles[langCode] || langCode;
}

function setLangButtonContent(btn, langCode) {
  if (!btn) return;
  if (langCode === 'ar') {
    btn.innerHTML = '<span class="lang-btn-glyph" aria-hidden="true">ع</span>';
  } else {
    btn.textContent = LANG_GLYPHS[langCode] || langCode;
  }
}

function updateLangSwitcherUI(lang) {
  document.querySelectorAll('.lang-btn[data-lang]').forEach((btn) => {
    const code = btn.getAttribute('data-lang');
    const isActive = code === lang;
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.classList.toggle('is-active', isActive);
    if (btn.hasAttribute('aria-selected')) {
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
    btn.setAttribute('aria-label', LANG_SELECT_LABELS[code] || code);
    btn.setAttribute('title', getLanguageTitle(code));
  });

  const currentBtn = document.getElementById('lang-current-btn');
  if (currentBtn) {
    currentBtn.dataset.lang = lang;
    setLangButtonContent(currentBtn, lang);
    currentBtn.setAttribute('aria-label', LANG_SELECT_LABELS[lang] || lang);
    currentBtn.setAttribute('title', getLanguageTitle(lang));
  }
}

function applyTranslations(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;

  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';

  const meta = TRANSLATIONS[lang].meta;
  document.title = meta.title;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', meta.description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.ogTitle);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.ogDescription);

  if (meta.jsonLdDescription) {
    const jsonLdEl = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdEl) {
      try {
        const jsonLd = JSON.parse(jsonLdEl.textContent);
        jsonLd.description = meta.jsonLdDescription;
        jsonLdEl.textContent = `\n  ${JSON.stringify(jsonLd, null, 2).replace(/\n/g, '\n  ')}\n  `;
      } catch (_) {
        /* keep static fallback */
      }
    }
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
  });

  document.querySelectorAll('.btn-arrow').forEach((el) => {
    el.textContent = RTL_LANGS.includes(lang) ? '←' : '→';
  });

  const toggle = document.getElementById('menu-toggle');
  if (toggle) {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', isOpen ? t('nav.closeMenu') : t('nav.openMenu'));
  }

  updateLangSwitcherUI(lang);

  if (typeof window.tgtRefreshFormUI === 'function') {
    window.tgtRefreshFormUI();
  }
}

function closeLangPopover() {
  const popover = document.getElementById('lang-popover');
  const expandBtn = document.getElementById('lang-expand-btn');
  const currentBtn = document.getElementById('lang-current-btn');
  if (!popover || popover.hidden) return;
  popover.hidden = true;
  if (expandBtn) expandBtn.setAttribute('aria-expanded', 'false');
  if (currentBtn) currentBtn.setAttribute('aria-expanded', 'false');
}

function openLangPopover() {
  const popover = document.getElementById('lang-popover');
  const expandBtn = document.getElementById('lang-expand-btn');
  const currentBtn = document.getElementById('lang-current-btn');
  if (!popover) return;
  popover.hidden = false;
  if (expandBtn) expandBtn.setAttribute('aria-expanded', 'true');
  if (currentBtn) currentBtn.setAttribute('aria-expanded', 'true');
}

function selectLanguage(lang) {
  if (!lang || !SUPPORTED_LANGS.includes(lang) || lang === currentLang) {
    closeLangPopover();
    return;
  }
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyTranslations(lang);
  closeLangPopover();
}

function initI18n() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  const initial = SUPPORTED_LANGS.includes(stored) ? stored : DEFAULT_LANG;

  applyTranslations(initial);

  document.querySelectorAll('.lang-btn[data-lang]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.id === 'lang-current-btn') return;
      selectLanguage(btn.getAttribute('data-lang'));
    });
  });

  const expandBtn = document.getElementById('lang-expand-btn');
  const currentBtn = document.getElementById('lang-current-btn');
  const popover = document.getElementById('lang-popover');

  const togglePopover = (e) => {
    e.stopPropagation();
    if (!popover) return;
    if (popover.hidden) openLangPopover();
    else closeLangPopover();
  };

  expandBtn?.addEventListener('click', togglePopover);
  currentBtn?.addEventListener('click', togglePopover);

  document.addEventListener('click', (e) => {
    if (!popover || popover.hidden) return;
    if (e.target.closest('.lang-switcher-compact')) return;
    closeLangPopover();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLangPopover();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initIntroAnimation();
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initHeroReveal();
  initParallax();
  initForm();
  initPartnerCTA();
  initFooterYear();
});

/* --- Intro panel animation --- */
function initIntroAnimation() {
  const panels = document.querySelector('.intro-panels');
  if (!panels) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    panels.classList.add('is-done');
    return;
  }

  setTimeout(() => {
    panels.classList.add('is-animating');
  }, 700);

  setTimeout(() => {
    panels.classList.add('is-done');
  }, 1400);
}

/* --- Header scroll state --- */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- Mobile navigation --- */
function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('mobile-nav');
  if (!toggle || !overlay) return;

  const openMenu = () => {
    closeLangPopover();
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', t('nav.closeMenu'));
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', t('nav.openMenu'));
    overlay.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    const onEnd = () => {
      if (!overlay.classList.contains('is-open')) {
        overlay.hidden = true;
      }
    };
    overlay.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(onEnd, 350);
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
}

/* --- Smooth anchor scrolling --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });

      if (target.tabIndex < 0) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  });
}

/* --- IntersectionObserver scroll reveal --- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --- Hero staggered word reveal --- */
function initHeroReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  reveals.forEach((el) => {
    const delay = parseInt(el.dataset.delay || '0', 10) * 100;
    setTimeout(() => el.classList.add('is-visible'), 900 + delay);
  });
}

/* --- Subtle parallax on hero images --- */
function initParallax() {
  const targets = document.querySelectorAll('.parallax-target');
  if (!targets.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (reducedMotion || coarsePointer) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        targets.forEach((el, i) => {
          const offset = scrollY * (0.03 + i * 0.02);
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* --- Interest form --- */
const FORM_TOTAL_STEPS = 5;

function initForm() {
  const form = document.getElementById('interest-form');
  const success = document.getElementById('form-success');
  const resetBtn = document.getElementById('form-reset');
  const participantWizard = document.getElementById('participant-wizard');
  const partnerPanel = document.getElementById('partner-panel');
  const backBtn = document.getElementById('form-back');
  const nextBtn = document.getElementById('form-next');
  const submitBtn = document.getElementById('form-submit');

  if (!form) return;

  let currentStep = 1;
  let isAnimating = false;

  function getInterestMode() {
    return form.querySelector('input[name="interest-type"]:checked')?.value || 'participant';
  }

  function setInterestMode(mode) {
    const isPartner = mode === 'partner';
    if (participantWizard) participantWizard.hidden = isPartner;
    if (partnerPanel) partnerPanel.hidden = !isPartner;
    if (!isPartner) updateProgressUI();
  }

  function updateProgressUI() {
    if (getInterestMode() !== 'participant') return;

    const countEl = document.getElementById('progress-count');
    const labelEl = document.getElementById('progress-label');
    const fillEl = document.getElementById('progress-fill');
    const barEl = document.getElementById('progress-bar');

    if (countEl) countEl.textContent = `${currentStep} / ${FORM_TOTAL_STEPS}`;
    if (labelEl) labelEl.textContent = t(`form.stepLabel${currentStep}`);
    if (fillEl) fillEl.style.width = `${(currentStep / FORM_TOTAL_STEPS) * 100}%`;
    if (barEl) {
      barEl.setAttribute('aria-valuenow', String(currentStep));
      barEl.setAttribute(
        'aria-label',
        t('form.progressA11y')
          .replace('{current}', currentStep)
          .replace('{total}', FORM_TOTAL_STEPS)
      );
    }

    if (backBtn) backBtn.hidden = currentStep === 1;
    if (nextBtn) nextBtn.hidden = currentStep === FORM_TOTAL_STEPS;
    if (submitBtn) submitBtn.hidden = currentStep !== FORM_TOTAL_STEPS;
  }

  window.tgtRefreshFormUI = updateProgressUI;

  function focusStep(step) {
    const stepEl = document.getElementById(`form-step-${step}`);
    const title = stepEl?.querySelector('.form-step-title');
    const firstInput = stepEl?.querySelector('input:not([type="hidden"]), select, textarea');

    if (title) {
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    } else if (firstInput) {
      firstInput.focus({ preventScroll: true });
    }
  }

  function goToStep(step, animate = true) {
    if (step < 1 || step > FORM_TOTAL_STEPS || step === currentStep || isAnimating) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const currentEl = document.getElementById(`form-step-${currentStep}`);
    const nextEl = document.getElementById(`form-step-${step}`);

    const activate = () => {
      document.querySelectorAll('.form-step').forEach((el) => {
        const stepNum = parseInt(el.dataset.step, 10);
        const active = stepNum === step;
        el.hidden = !active;
        el.classList.toggle('is-active', active);
        if (active) {
          el.setAttribute('aria-current', 'step');
        } else {
          el.removeAttribute('aria-current');
        }
      });
      currentStep = step;
      updateProgressUI();
      focusStep(step);
    };

    if (!animate || reducedMotion || !currentEl || !nextEl) {
      activate();
      return;
    }

    isAnimating = true;
    currentEl.classList.add('form-step--exit');

    setTimeout(() => {
      currentEl.classList.remove('form-step--exit', 'is-active');
      currentEl.hidden = true;
      nextEl.hidden = false;
      nextEl.classList.add('form-step--enter');
      activate();
      requestAnimationFrame(() => {
        nextEl.classList.remove('form-step--enter');
        isAnimating = false;
      });
    }, 250);
  }

  function clearStepErrors(step) {
    const stepEl = document.getElementById(`form-step-${step}`);
    if (!stepEl) return;
    stepEl.querySelectorAll('.form-error').forEach((el) => { el.textContent = ''; });
    stepEl.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  }

  form.querySelectorAll('input[name="interest-type"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      clearAllErrors(form);
      setInterestMode(radio.value);
    });
  });

  backBtn?.addEventListener('click', () => {
    clearStepErrors(currentStep);
    goToStep(currentStep - 1);
  });

  nextBtn?.addEventListener('click', () => {
    clearStepErrors(currentStep);
    const errors = validateStep(currentStep, collectFormData(form));
    if (Object.keys(errors).length > 0) {
      displayErrors(errors);
      focusFirstError(form, errors);
      return;
    }
    goToStep(currentStep + 1);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const data = collectFormData(form);
    const isPartner = getInterestMode() === 'partner';
    const errors = isPartner ? validatePartnerForm(data) : validateStep(5, data);

    if (Object.keys(errors).length > 0) {
      displayErrors(errors);
      focusFirstError(form, errors);
      return;
    }

    try {
      await submitForm(data);
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      console.error('Form submission error:', err);
      alert(t('form.errorSubmit'));
    }
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    currentStep = 1;
    const participantRadio = form.querySelector('input[name="interest-type"][value="participant"]');
    if (participantRadio) participantRadio.checked = true;
    setInterestMode('participant');
    goToStep(1, false);
    clearAllErrors(form);
    form.hidden = false;
    success.hidden = true;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  setInterestMode('participant');
  goToStep(1, false);

  window.tgtSetPartnerMode = () => {
    const partnerRadio = form.querySelector('input[name="interest-type"][value="partner"]');
    if (partnerRadio) {
      partnerRadio.checked = true;
      setInterestMode('partner');
    }
  };
}

function collectFormData(form) {
  const fd = new FormData(form);
  const age = fd.getAll('age');
  const dietary = fd.getAll('dietary');
  const interestType = fd.get('interest-type') || 'participant';
  const isPartner = interestType === 'partner';

  return {
    interestType,
    name: isPartner
      ? fd.get('partner-name')?.trim() || ''
      : fd.get('name')?.trim() || '',
    email: isPartner
      ? fd.get('partner-email')?.trim() || ''
      : fd.get('email')?.trim() || '',
    postcode: isPartner ? '' : fd.get('postcode')?.trim() || '',
    who: isPartner ? '' : fd.get('who') || '',
    participants: isPartner ? '' : fd.get('participants') || '',
    age: isPartner ? [] : age,
    format: isPartner ? '' : fd.get('format') || '',
    travel: isPartner ? '' : fd.get('travel') || '',
    time: isPartner ? '' : fd.get('time') || '',
    dietary: isPartner ? [] : dietary,
    comments: isPartner ? '' : fd.get('comments')?.trim() || '',
    keepInformed: isPartner ? false : fd.get('keep-informed') === 'yes',
    partnerInterest: isPartner,
    orgName: fd.get('org-name')?.trim() || '',
    orgType: fd.get('org-type') || '',
    orgWebsite: fd.get('org-website')?.trim() || '',
    orgContribution: fd.get('org-contribution')?.trim() || '',
    orgPhone: fd.get('org-phone')?.trim() || '',
    privacyConsent: isPartner
      ? fd.get('partner-privacy-consent') === 'yes'
      : fd.get('privacy-consent') === 'yes',
    language: currentLang,
    submittedAt: new Date().toISOString(),
  };
}

function validateStep(step, data) {
  const errors = {};

  if (step === 1) {
    if (!data.who) errors.who = t('form.errorWho');
    if (!data.participants || parseInt(data.participants, 10) < 1) {
      errors.participants = t('form.errorParticipants');
    }
    if (!data.age.length) errors.age = t('form.errorAge');
  } else if (step === 2) {
    if (!data.format) errors.format = t('form.errorFormat');
  } else if (step === 3) {
    if (!data.travel) errors.travel = t('form.errorTravel');
    if (!data.time) errors.time = t('form.errorTime');
  } else if (step === 5) {
    if (!data.name) errors.name = t('form.errorName');
    if (!data.email) {
      errors.email = t('form.errorEmail');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = t('form.errorEmailInvalid');
    }
    if (!data.postcode) errors.postcode = t('form.errorPostcode');
    if (!data.privacyConsent) errors.privacy = t('form.errorPrivacy');
  }

  return errors;
}

function validatePartnerForm(data) {
  const errors = {};

  if (!data.orgName) errors['org-name'] = t('form.errorOrgName');
  if (!data.orgType) errors['org-type'] = t('form.errorOrgType');
  if (!data.orgContribution) errors['org-contribution'] = t('form.errorOrgContribution');
  if (!data.name) errors['partner-name'] = t('form.errorName');
  if (!data.email) {
    errors['partner-email'] = t('form.errorEmail');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors['partner-email'] = t('form.errorEmailInvalid');
  }
  if (!data.privacyConsent) errors['partner-privacy'] = t('form.errorPrivacy');

  return errors;
}

function validateForm(data, isPartner) {
  if (isPartner) return validatePartnerForm(data);

  const errors = {};
  for (let step = 1; step <= 5; step += 1) {
    Object.assign(errors, validateStep(step, data));
  }
  return errors;
}

function displayErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = document.getElementById(`${field}-error`);
    const inputEl = document.getElementById(field) ||
      document.querySelector(`[name="${field}"]`);

    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('is-invalid');
  });
}

function clearAllErrors(form) {
  form.querySelectorAll('.form-error').forEach((el) => { el.textContent = ''; });
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
}

function focusFirstError(form, errors) {
  const firstKey = Object.keys(errors)[0];
  const fieldMap = {
    who: '#who-fieldset input',
    age: '#age-fieldset input',
    format: '#format-fieldset input',
    travel: '#travel-fieldset input',
    time: '#time-fieldset input',
    privacy: '#privacy-consent',
    'partner-privacy': '#partner-privacy-consent',
    'partner-name': '#partner-name',
    'partner-email': '#partner-email',
  };

  const selector = fieldMap[firstKey] || `#${firstKey}`;
  const el = form.querySelector(selector);
  el?.focus?.();
}

async function submitForm(data) {
  switch (FORM_CONFIG.provider) {
    case 'formspree':
    case 'custom':
    case 'supabase':
      return submitToEndpoint(data);
    case 'netlify':
      return submitNetlify(data);
    case 'prototype':
    default:
      return submitPrototype(data);
  }
}

/**
 * PROTOTYPE ONLY — stores submissions in localStorage for local testing.
 * Do not treat this as a production database.
 */
function submitPrototype(data) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  existing.push(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return Promise.resolve();
}

async function submitToEndpoint(data) {
  if (!FORM_CONFIG.endpoint) {
    throw new Error('Form endpoint not configured. Update FORM_CONFIG in script.js.');
  }

  const response = await fetch(FORM_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...FORM_CONFIG.headers,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Submission failed: ${response.status}`);
}

async function submitNetlify(data) {
  const form = document.getElementById('interest-form');
  const formData = new FormData(form);
  formData.append('form-name', 'interest');

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString(),
  });

  if (!response.ok) throw new Error(`Netlify submission failed: ${response.status}`);
}

/* --- Partner CTA scrolls to form and enables partner mode --- */
function initPartnerCTA() {
  const cta = document.getElementById('partner-cta');
  if (!cta) return;

  cta.addEventListener('click', () => {
    setTimeout(() => {
      if (typeof window.tgtSetPartnerMode === 'function') {
        window.tgtSetPartnerMode();
      }
      document.getElementById('partner-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  });
}

/* --- Footer year --- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
