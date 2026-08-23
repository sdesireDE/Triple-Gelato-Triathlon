#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const locales = fs.readFileSync(path.join(root, 'locales-it-tr-ar.js'), 'utf8');

function flatten(obj, prefix = '') {
  const keys = [];
  for (const k of Object.keys(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys.push(...flatten(obj[k], p));
    } else {
      keys.push(p);
    }
  }
  return keys.sort();
}

const context = { window: {} };
vm.runInNewContext(locales, context);
const match = script.match(/const TRANSLATIONS = \{[\s\S]*?\n\};/);
if (!match) {
  console.error('TRANSLATIONS block not found');
  process.exit(1);
}
const TRANSLATIONS = vm.runInNewContext(`${match[0]}; TRANSLATIONS;`, context);
Object.assign(TRANSLATIONS, context.window.__TGT_EXTRA_LOCALES__ || {});

const langs = ['de', 'en', 'it', 'tr', 'ar'];
const sets = {};
for (const lang of langs) {
  sets[lang] = new Set(flatten(TRANSLATIONS[lang]));
  console.log(`${lang}: ${sets[lang].size} keys`);
}

let ok = true;
for (const lang of langs) {
  if (lang === 'de') continue;
  const missing = [...sets.de].filter((k) => !sets[lang].has(k));
  if (missing.length) {
    ok = false;
    console.error(`${lang} missing ${missing.length} keys:`, missing.slice(0, 10));
  }
}

process.exit(ok ? 0 : 1);
