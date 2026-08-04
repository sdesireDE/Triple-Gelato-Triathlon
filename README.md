# Triple Gelato Triathlon — Interest Registration Landing Page

A one-page website for gauging public interest in the proposed **Triple Gelato Triathlon** — a family-friendly swim, cycle and run event with a gelato scoop at every transition.

The site supports **German** (default) and **English**, switched via flag buttons in the header.

## How to open the site

No build process is required. Open the page directly in any modern browser:

```bash
open index.html
```

Or serve it locally for the best experience:

```bash
# Python 3
python3 -m http.server 8080

# Then visit http://localhost:8080
```

## Project structure

```
Triple Gelato Triathlon/
├── index.html          # Main page (German source content by default)
├── styles.css          # All styles
├── script.js           # Interactions, form logic and translations
├── assets/
│   └── images/
│       ├── gelato-cones.jpg      # Hero gelato imagery
│       ├── family-running.jpg    # Run stage / hero (outdoor running)
│       ├── family-cycling.jpg    # Cycle stage
│       ├── family-swimming.jpg   # Swim stage
│       └── og-image.jpg          # Social sharing preview
└── README.md
```

## Language support (German / English)

- **Default language:** German (`de`) for first-time visitors
- **Switcher:** Compact 🇩🇪 / 🇬🇧 buttons in the fixed header (visible on desktop and mobile)
- **Persistence:** Choice is stored in `localStorage` under `tgt_preferred_language`
- Behaviour:
  - First visit → German
  - Switch to English → English immediately, and on later visits
  - Switch back to German → German subsequently
- Browser language is **not** used to override the German default
- Source HTML is written in German to avoid a visible language flash on first load

### Where translations live

All strings are in the `TRANSLATIONS` object at the top of `script.js`:

```javascript
const TRANSLATIONS = {
  de: { ... },
  en: { ... }
};
```

HTML elements use attributes such as:

- `data-i18n="hero.eyebrow"` — text content
- `data-i18n-html="idea.clarification"` — HTML content (e.g. bold phrases)
- `data-i18n-placeholder="form.commentsPlaceholder"`
- `data-i18n-aria-label="nav.openMenu"`
- `data-i18n-alt="stages.run.alt"`
- `data-i18n-title="…"`

To add or edit a string: update both `de` and `en` keys in `TRANSLATIONS`, then add the matching `data-i18n*` attribute in `index.html` if it is a new element.

`document.documentElement.lang`, `document.title`, meta description and Open Graph tags update when the language changes.

## Image assets

Place final photography in `assets/images/` using these filenames:

| Filename | Intended subject |
|---|---|
| `gelato-cones.jpg` | Three gelato cones |
| `family-running.jpg` | Family / recreational running outdoors |
| `family-cycling.jpg` | Cyclists on a family-friendly route |
| `family-swimming.jpg` | Family swimming session |
| `og-image.jpg` | Open Graph / social preview (1200×630 recommended) |

**Current images are temporary Unsplash stand-ins** used only so the layout can be reviewed. They do not represent final event photography. Replace them with your supplied images before showing the site to partners or the public.

The running image (`family-running.jpg`) has been corrected to show outdoor recreational running (not gym/sit-ups). Cropping uses `object-position` separately in the hero collage and the Run stage card.

Aim for images at least 1200px wide for best quality on retina displays. `object-fit: cover` is already applied.

## Replacing placeholder content

Search for `TODO` comments in the source files:

- **Contact email** — footer currently uses `hello@triplegelatotriathlon.example`
- **Privacy notice** — footer link is a placeholder (`#privacy`); create a real page before launch
- **Imprint / legal notice** — footer link is a placeholder (`#imprint`); required in many EU jurisdictions
- **Organisation URL** — update the `url` field in the JSON-LD structured data in `index.html`
- **Open Graph image** — replace `assets/images/og-image.jpg` with a branded social preview

## Connecting the form to a real submission service

The form currently runs in **prototype mode**, storing submissions in `localStorage` for local testing only. This is not suitable for production.

Open `script.js` and update the `FORM_CONFIG` object at the top of the file:

### Formspree

```javascript
const FORM_CONFIG = {
  provider: 'formspree',
  endpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  headers: {},
};
```

### Netlify Forms

1. Add `data-netlify="true"` and `name="interest"` attributes to the `<form>` element in `index.html`.
2. Add a hidden input: `<input type="hidden" name="form-name" value="interest">`.
3. Set `provider: 'netlify'` in `FORM_CONFIG`.

### Supabase

```javascript
const FORM_CONFIG = {
  provider: 'supabase',
  endpoint: 'https://YOUR_PROJECT.supabase.co/rest/v1/interest_registrations',
  headers: {
    apikey: 'YOUR_ANON_KEY',
    Authorization: 'Bearer YOUR_ANON_KEY',
    Prefer: 'return=minimal',
  },
};
```

Create a matching table in Supabase to receive the JSON payload fields.

### Custom API

```javascript
const FORM_CONFIG = {
  provider: 'custom',
  endpoint: 'https://your-api.example.com/register-interest',
  headers: {
    Authorization: 'Bearer YOUR_TOKEN',
  },
};
```

After connecting a live service, remove or disable the `submitPrototype` function and the `localStorage` storage key for form submissions (`tgt_interest_submissions`). Do not remove the language key (`tgt_preferred_language`).

## Legal and privacy details still needed before publication

Before making the site public, you should add:

1. **Privacy policy** — explain what data is collected, how it is stored, retention period, and user rights under GDPR or applicable law
2. **Imprint / legal notice** — required in Germany, Austria, and several other EU countries; include organiser name, address, and contact details
3. **Cookie notice** — only needed if you add analytics or third-party embeds (Google Fonts loads from Google; consider self-hosting fonts for stricter privacy compliance)
4. **Real contact email** — replace the placeholder address in the footer
5. **Data processing agreement** — if using Formspree, Netlify, or Supabase, ensure their terms cover your use case
6. **Consent wording review** — have the privacy consent checkbox text reviewed against your actual data handling practices
7. **Confirmed event details** — do not publish dates, venues, or ticket information until the event is confirmed; update structured data accordingly

## Browser support

Tested for modern browsers (Chrome, Firefox, Safari, Edge). Uses progressive enhancement with `prefers-reduced-motion` fallbacks throughout.

## Development notes

- Form submissions in prototype mode are stored under `tgt_interest_submissions` in `localStorage`.
- Language preference is stored under `tgt_preferred_language` (`de` or `en`).
- The opening animation uses three colour panels representing swim (blue), cycle (green), and run (pink). It is disabled entirely when reduced motion is preferred.
