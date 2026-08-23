#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const mdPath = path.join(root, 'triple-gelato-localisation-replacement.md');

function parseReplacementMd(text) {
  const sections = text.split(/\n## /).slice(1);
  const data = {};
  let jsonLd = null;

  for (const section of sections) {
    const nl = section.indexOf('\n');
    const title = section.slice(0, nl).trim();
    const body = section.slice(nl + 1);

    if (title === 'Hard-coded strings to update') {
      const m = body.match(
        /### JSON-LD Organization description\s*\n\s*DE:\s*\n([\s\S]*?)\n\s*EN:\s*\n([\s\S]*?)\n\s*IT:\s*\n([\s\S]*?)\n\s*TR:\s*\n([\s\S]*?)\n\s*AR:\s*\n([\s\S]*?)\n\s*### Important/
      );
      if (m) {
        jsonLd = {
          de: m[1].trim(),
          en: m[2].trim(),
          it: m[3].trim(),
          tr: m[4].trim(),
          ar: m[5].trim(),
        };
      }
      continue;
    }

    const langs = ['EN', 'DE', 'IT', 'TR', 'AR'];
    const langMap = { EN: 'en', DE: 'de', IT: 'it', TR: 'tr', AR: 'ar' };
    data[title] = {};
    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i];
      const re = new RegExp(
        `${lang}:\\s*\\n([\\s\\S]*?)(?=\\n(?:${langs.slice(i + 1).join('|')}|---|$))`
      );
      const match = body.match(re);
      if (match) data[title][langMap[lang]] = match[1].replace(/\n$/, '');
    }
  }

  return { data, jsonLd };
}

function setNested(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function escapeJsString(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function serializeValue(value, indent) {
  const pad = ' '.repeat(indent);
  const inner = ' '.repeat(indent + 2);

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value);
    if (!entries.length) return '{}';
    const lines = entries.map(([key, val]) => {
      const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `'${escapeJsString(key)}'`;
      return `${inner}${safeKey}: ${serializeValue(val, indent + 2)},`;
    });
    return `{\n${lines.join('\n')}\n${pad}}`;
  }

  return `'${escapeJsString(value)}'`;
}

function loadTranslations() {
  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  const localesFile = fs.readFileSync(path.join(root, 'locales-it-tr-ar.js'), 'utf8');
  const context = { window: {} };
  vm.runInNewContext(localesFile, context);
  const match = script.match(/const TRANSLATIONS = \{[\s\S]*?\n\};/);
  if (!match) throw new Error('TRANSLATIONS block not found');
  const TRANSLATIONS = vm.runInNewContext(`${match[0]}; TRANSLATIONS;`, context);
  Object.assign(TRANSLATIONS, context.window.__TGT_EXTRA_LOCALES__ || {});
  return { script, TRANSLATIONS };
}

function main() {
  const md = fs.readFileSync(mdPath, 'utf8');
  const { data, jsonLd } = parseReplacementMd(md);
  const { script, TRANSLATIONS } = loadTranslations();

  for (const [key, langs] of Object.entries(data)) {
    for (const [lang, value] of Object.entries(langs)) {
      if (TRANSLATIONS[lang]) setNested(TRANSLATIONS[lang], key, value);
    }
  }

  if (jsonLd) {
    for (const [lang, value] of Object.entries(jsonLd)) {
      setNested(TRANSLATIONS[lang], 'meta.jsonLdDescription', value);
    }
  }

  const deStart = script.indexOf('  de: {');
  const transEnd = script.indexOf('\n};', deStart);
  if (deStart < 0 || transEnd < 0) throw new Error('Could not locate TRANSLATIONS de/en block');

  const replacement =
    `  de: ${serializeValue(TRANSLATIONS.de, 2)},\n\n  en: ${serializeValue(TRANSLATIONS.en, 2)},`;
  const newScript = script.slice(0, deStart) + replacement + script.slice(transEnd);
  fs.writeFileSync(path.join(root, 'script.js'), newScript);

  const localesContent = `window.__TGT_EXTRA_LOCALES__ = {
  it: ${serializeValue(TRANSLATIONS.it, 2)},
  tr: ${serializeValue(TRANSLATIONS.tr, 2)},
  ar: ${serializeValue(TRANSLATIONS.ar, 2)},
};
`;
  fs.writeFileSync(path.join(root, 'locales-it-tr-ar.js'), localesContent);

  console.log(`Applied ${Object.keys(data).length} translation keys`);
  if (jsonLd) console.log('Added meta.jsonLdDescription for all locales');
}

main();
