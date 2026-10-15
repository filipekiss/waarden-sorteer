// Interface strings. English is the default; Dutch matches the original worksheet.
export const STRINGS = {
  en: {
    title: 'Values Sorting Exercise',
    intro: (max) =>
      `Drag each value into the right pile. Then choose up to ${max} values from “Very important”, put them in order, and check which ones are already present enough in your life. The address bar always holds your current layout, so the link you share shows exactly this.`,
    copy: 'Copy link',
    copied: 'Link copied',
    reset: 'Start over',
    resetConfirm: 'Start over from scratch?',
    switchTo: 'Switch to Dutch',
    counter: (n) => `${n} of 125 sorted`,
    step1: 'Steps 1–4: sort the values',
    toSort: 'To sort',
    piles: { zeer: 'Very important', belangrijk: 'Important', niet: 'Not so important' },
    step2: (max) => `Steps 5–7: your top ${max}`,
    hint:
      'Drag values from “Very important” here. Drag them within this list to change their order. Check the values that are already present enough in your life.',
    empty: 'No values chosen yet.',
    present: 'already present enough',
    htmlLang: 'en',
  },
  nl: {
    title: 'Waarden Sorteertaak',
    intro: (max) =>
      `Sleep de waarden naar de juiste stapel. Kies daarna maximaal ${max} waarden uit “Zeer belangrijk”, zet ze op volgorde en vink aan welke al voldoende aanwezig zijn. De adresbalk bevat altijd je huidige stand, dus de link die je deelt laat precies dit zien.`,
    copy: 'Kopieer link',
    copied: 'Link gekopieerd',
    reset: 'Opnieuw beginnen',
    resetConfirm: 'Alles opnieuw beginnen?',
    switchTo: 'Switch to English',
    counter: (n) => `${n} van 125 gesorteerd`,
    step1: 'Stap 1–4: sorteer de waarden',
    toSort: 'Nog te sorteren',
    piles: { zeer: 'Zeer belangrijk', belangrijk: 'Belangrijk', niet: 'Niet zo belangrijk' },
    step2: (max) => `Stap 5–7: je top ${max}`,
    hint:
      'Sleep waarden uit “Zeer belangrijk” hierheen. Sleep ze binnen deze lijst om de volgorde te wijzigen. Vink aan welke waarden al voldoende aanwezig zijn in je leven.',
    empty: 'Nog geen waarden gekozen.',
    present: 'voldoende aanwezig',
    htmlLang: 'nl',
  },
};
