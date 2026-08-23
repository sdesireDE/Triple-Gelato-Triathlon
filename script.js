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
      description: 'Ein geplantes familienfreundliches Event mit Schwimmen, Radfahren und Laufen — und einer Kugel Gelato nach jeder Etappe. Melden Sie Ihr Interesse an und helfen Sie mit, den ersten Triple Gelato Triathlon zu gestalten.',
      ogTitle: 'Triple Gelato Triathlon — Ein mögliches Familienevent',
      ogDescription: 'Schwimmen. Radfahren. Laufen. Und nach jeder Etappe wartet eine andere Kugel Eis. Melden Sie Ihr Interesse an diesem inklusiven Outdoor-Konzept an.',
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
      selectItalian: "Passa all'italiano",
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
      title: 'Konzeptvorschau',
      body: 'Sie sehen einen frühen Entwurf der Triple Gelato Triathlon Idee. Zurzeit sammeln wir Interesse und Feedback, bevor wir mit Veranstaltungsorten, Vereinen, Gelaterias und möglichen Partnern ins Gespräch gehen. Ihre Rückmeldung hilft dabei, aus dieser Idee eine echte Veranstaltung zu machen.',
      cta: 'Interesse anmelden',
    },
    hero: {
      eyebrow: 'Ein mögliches neues Familienevent',
      lead: 'Schwimmen. Radfahren. Laufen. Und nach jeder Etappe wartet eine andere Kugel Eis.',
      support: 'Ein entspanntes, familienfreundliches Triathlon-Konzept, bei dem das gemeinsame Ankommen wichtiger ist als der erste Platz.',
      ctaPrimary: 'Interesse anmelden',
      ctaSecondary: 'So funktioniert’s',
      status: 'Wir prüfen derzeit das Interesse',
    },
    idea: {
      heading: 'Drei Disziplinen. Drei Sorten. Ein ziemlich großartiger Tag.',
      lead: 'Der Triple Gelato Triathlon wird als inklusives Outdoor-Event für Kinder, Erwachsene, Familien und gemischte Gruppen erkundet. Teilnehmende absolvieren ein zugängliches Schwimmen, Radfahren und Laufen — und an jeder Wechselzone wartet ein anderes Gelato-Erlebnis.',
      clarification: '<strong>Dieses Veranstaltungskonzept befindet sich noch in einer frühen Planungsphase.</strong> Eine Interessensbekundung verpflichtet Sie weder zur Teilnahme noch zu einer Zahlung. Ihre Rückmeldung hilft uns zu verstehen, ob das Event weiterentwickelt werden sollte.',
    },
    stages: {
      heading: 'Die drei Disziplinen',
      swim: {
        title: 'Schwimmen',
        copy: 'Eine einladende erste Etappe, die an den gewählten Ort und die passenden Teilnehmenden-Gruppen angepasst wird.',
        gelato: 'Erste Kugel in der Wechselzone',
        alt: 'Schwimmerinnen und Schwimmer im Pool bei einer familienfreundlichen Einheit',
      },
      cycle: {
        title: 'Radfahren',
        copy: 'Eine familienfreundliche Strecke mit Fokus auf Freude, sichere Teilnahme und gemeinsamen Schwung.',
        gelato: 'Zweite Kugel in der Wechselzone',
        alt: 'Radfahrende gemeinsam auf einer landschaftlich schönen Route',
      },
      run: {
        title: 'Laufen',
        copy: 'Eine feierliche Schlussetappe, bei der Kinder, Eltern, Freundinnen und Freunde sowie Teams gemeinsam ins Ziel kommen können.',
        gelato: 'Die letzte Kugel im Ziel',
        alt: 'Eine Familie läuft gemeinsam im Freien',
      },
    },
    audience: {
      heading: 'Für wen ist die Veranstaltung gedacht?',
      lead: 'Endgültige Kategorien, Altersgrenzen, Distanzen, Barrierefreiheit und Ortsdetails würden gemeinsam mit geeigneten Partnern festgelegt.',
      families: 'Familien',
      childrenAdults: 'Kinder in Begleitung Erwachsener',
      firstTimers: 'Erstmalige Triathletinnen und Triathleten',
      recreational: 'Freizeitaktive',
      schools: 'Schul- oder Gemeindegruppen',
      friends: 'Freundinnen und Freunde als Team',
      movement: 'Menschen, die Bewegung mehr schätzen als Medaillen',
      icecream: 'Menschen, die stark durch Eiscreme motiviert sind',
    },
    principles: {
      heading: 'Unsere Grundsätze',
      accessible: {
        title: 'Zugänglich',
        copy: 'Distanzen und Formate würden so gestaltet, dass ein breites Spektrum an Fähigkeiten willkommen ist.',
      },
      family: {
        title: 'Familienorientiert',
        copy: 'Die Atmosphäre soll Familien und Freundinnen sowie Freunde dazu ermutigen, gemeinsam teilzunehmen.',
      },
      local: {
        title: 'Lokal verankert',
        copy: 'Das Konzept soll lokale Vereine, Veranstaltungsorte und Eiscreme-Partner einbinden.',
      },
      joy: {
        title: 'Sportlich, aber entspannt',
        copy: 'Zeitnahme mag es geben — Freude und das Ankommen stehen jedoch im Mittelpunkt.',
      },
    },
    register: {
      heading: 'Sollen wir das gemeinsam möglich machen?',
      lead: 'Sagen Sie uns, wie Ihr idealer Triple Gelato Triathlon aussehen würde. Frühe Interessensbekundungen helfen uns, Veranstaltungsorte, Sportverbände und Gelato-Partner mit echtem Interesse zu überzeugen.',
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
      travel: 'Wie weit würden Sie anreisen?',
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
      keepInformed: 'Bitte halten Sie mich über die Entwicklung des Triple Gelato Triathlons auf dem Laufenden.',
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
      privacy: 'Ich willige ein, dass meine Angaben zum Zweck der Interessensermittlung für dieses Veranstaltungskonzept gespeichert werden.',
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
      errorPrivacy: 'Sie müssen der Verarbeitung zustimmen, um fortzufahren.',
      errorOrgName: 'Bitte geben Sie den Namen Ihrer Organisation ein.',
      errorOrgType: 'Bitte wählen Sie die Art der Organisation.',
      errorOrgContribution: 'Bitte beschreiben Sie, wie Sie möglicherweise beitragen möchten.',
      errorSubmit: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    },
    partners: {
      heading: 'Eine Strecke braucht einen Ort. Eine Wechselzone braucht Gelato.',
      lead: 'Wir freuen uns auch über Rückmeldungen von Schwimmbädern, Sportvereinen, lokalen Verbänden, Grundstückseigentümern, Kommunen, Gelaterien, Eiscreme-Herstellern und Unternehmen, die das erste Event mitgestalten möchten.',
      cta: 'Über eine Partnerschaft sprechen',
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
      a1: 'Nein. Sie befindet sich derzeit in der Phase der Interessensermittlung und Partnerentwicklung.',
      q2: 'Wo wird sie stattfinden?',
      a2: 'Es ist noch kein Veranstaltungsort ausgewählt. Interesse nach Region hilft bei Gesprächen mit möglichen Gastgebern.',
      q3: 'Wie lang wird jede Etappe sein?',
      a3: 'Die Distanzen sind noch nicht festgelegt. Ziel ist es, zugängliche Optionen zu schaffen — keine einschüchternde Einheitsstrecke.',
      q4: 'Wird es Zeitnahme geben?',
      a4: 'Das ist noch nicht entschieden. Im Vordergrund stehen Teilnahme, Freude und ein sicheres Ankommen.',
      q5: 'Ist es nur für Kinder?',
      a5: 'Nein. Das Konzept richtet sich an Familien, Erwachsene, Kinder und gemischte Gruppen — vorbehaltlich endgültiger Sicherheits- und Altersregelungen.',
      q6: 'Wird es Alternativen für besondere Ernährungsbedürfnisse geben?',
      a6: 'Der Planungsprozess sollte wo immer praktikabel milchfreie, vegane und allergiebewusste Optionen vorsehen.',
      q7: 'Kostet die Interessensbekundung etwas?',
      a7: 'Nein. Sie ist kostenlos und begründet keine Verpflichtung.',
    },
    footer: {
      tagline: 'Ein geplantes Familien-Event mit Schwimmen, Radfahren und Laufen',
      disclaimer: 'Das Veranstaltungskonzept befindet sich derzeit in Entwicklung. Termin, Veranstaltungsort, Format und Teilnahmebedingungen stehen noch nicht fest.',
      privacy: 'Datenschutzerklärung',
      imprint: 'Impressum',
      rights: 'Alle Rechte vorbehalten.',
    },
  },

  en: {
    meta: {
      title: 'Triple Gelato Triathlon — Register Your Interest',
      description: 'A proposed family-friendly swim, cycle and run event with a gelato scoop at every transition. Register your interest to help shape the first Triple Gelato Triathlon.',
      ogTitle: 'Triple Gelato Triathlon — A Proposed Family Event',
      ogDescription: 'Swim. Cycle. Run. Then celebrate every stage with a different scoop. Register your interest in this inclusive outdoor event concept.',
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
      selectItalian: "Passa all'italiano",
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
      audience: "Who it's for",
      principles: 'Principles',
      register: 'Register interest',
      partners: 'Partners',
      faq: 'FAQ',
      cta: "I'm interested",
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    banner: {
      title: 'Concept Preview',
      body: 'You are viewing an early concept for the Triple Gelato Triathlon. We are currently gathering interest and feedback before approaching venues, clubs, gelaterias and potential partners. Your feedback will help shape the first event.',
      cta: 'Register your interest',
    },
    hero: {
      eyebrow: 'A possible new family event',
      lead: 'Swim. Cycle. Run. Then celebrate every stage with a different scoop.',
      support: 'A relaxed, family-friendly triathlon concept where finishing together matters more than finishing first.',
      ctaPrimary: 'Register your interest',
      ctaSecondary: 'See how it works',
      status: 'Currently gauging interest',
    },
    idea: {
      heading: 'Three activities. Three flavours. One rather brilliant day out.',
      lead: 'The Triple Gelato Triathlon is being explored as an inclusive outdoor event for children, adults, families and mixed-ability groups. Participants would complete an accessible swim, cycle and run, with a different gelato experience waiting at each transition.',
      clarification: '<strong>This is an early-stage event concept.</strong> Registering interest does not commit you to attending or paying anything. Your response helps us understand whether the event should be developed.',
    },
    stages: {
      heading: 'The three stages',
      swim: {
        title: 'Swim',
        copy: 'A welcoming first stage designed around the chosen venue and suitable participant groups.',
        gelato: 'Scoop one at transition',
        alt: 'Swimmers in a pool during a family-friendly session',
      },
      cycle: {
        title: 'Cycle',
        copy: 'A family-friendly route focused on enjoyment, safe participation and shared momentum.',
        gelato: 'Scoop two at transition',
        alt: 'Cyclists riding together on a scenic route',
      },
      run: {
        title: 'Run',
        copy: 'A celebratory final stage where children, parents, friends and teams can reach the finish together.',
        gelato: 'Final scoop at the finish',
        alt: 'A family running together outdoors',
      },
    },
    audience: {
      heading: 'Who the event is for',
      lead: 'Final categories, age limits, distances, accessibility arrangements and venue details would be determined with suitable partners.',
      families: 'Families',
      childrenAdults: 'Children with adults',
      firstTimers: 'First-time triathletes',
      recreational: 'Recreational athletes',
      schools: 'School or community groups',
      friends: 'Friends entering as a team',
      movement: 'People who enjoy movement more than medals',
      icecream: 'People strongly motivated by ice cream',
    },
    principles: {
      heading: 'Event principles',
      accessible: {
        title: 'Accessible',
        copy: 'Distances and formats would be designed to welcome a broad range of abilities.',
      },
      family: {
        title: 'Family-led',
        copy: 'The atmosphere should encourage families and friends to participate together.',
      },
      local: {
        title: 'Local',
        copy: 'The concept is intended to involve local clubs, venues and ice-cream partners.',
      },
      joy: {
        title: 'Joyfully competitive',
        copy: 'Timing may exist, but enjoyment and completion are the heart of the event.',
      },
    },
    register: {
      heading: 'Should we make this happen?',
      lead: 'Tell us what your ideal Triple Gelato Triathlon would look like. Early registrations will help us approach venues, sporting associations and gelato partners with real evidence of interest.',
    },
    form: {
      interestTypeLegend: 'Type of interest',
      interestParticipant: "I'm interested in taking part",
      interestPartner: "I'm interested as a potential partner",
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
      heading: 'A course needs a place. A transition needs gelato.',
      lead: 'We are also interested in hearing from swimming facilities, sports clubs, local associations, landowners, municipalities, gelaterias, ice-cream manufacturers and businesses interested in helping shape the first event.',
      cta: 'Discuss a partnership',
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
      a1: 'No. It is currently at the interest-gauging and partner-development stage.',
      q2: 'Where will it take place?',
      a2: 'No venue has been selected. Interest by location will help guide conversations with possible hosts.',
      q3: 'How long will each stage be?',
      a3: 'Distances have not yet been fixed. The intention is to create accessible options rather than one intimidating course.',
      q4: 'Will it be timed?',
      a4: 'That has not yet been decided. The primary focus is participation, enjoyment and completing the event safely.',
      q5: 'Is it only for children?',
      a5: 'No. The concept is intended for families, adults, children and mixed groups, subject to final safety and age arrangements.',
      q6: 'Will dietary alternatives be available?',
      a6: 'The planning process should include dairy-free, vegan and allergy-conscious options wherever practical.',
      q7: 'Does registering interest cost anything?',
      a7: 'No. It is free and creates no obligation.',
    },
    footer: {
      tagline: 'A proposed family swim, cycle and run event',
      disclaimer: 'Event concept currently under development. Dates, venue, format and participation conditions are not yet confirmed.',
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
