/**
 * flames.js
 * Pure game logic for the FLAMES compatibility algorithm.
 * No DOM access here — animations.js and main.js consume these functions.
 */

const FLAMES_MEANINGS = {
  F: { word: 'Friends',  desc: 'A bond built on trust and good company.' },
  L: { word: 'Lovers',   desc: "You two have a special connection." },
  A: { word: 'Affection',desc: 'A warm, quiet fondness between you.' },
  M: { word: 'Marriage', desc: 'A future built to last, together.' },
  E: { word: 'Enemies',  desc: 'Sparks fly — but not the romantic kind.' },
  S: { word: 'Soulmates',desc: 'Two halves of the same story.' },
};

/** Normalize a raw name: lowercase, letters only, no spaces/symbols/numbers. */
function normalizeName(raw) {
  return raw.toLowerCase().replace(/[^a-z]/g, '');
}

/** Validate the two raw name inputs. Returns { valid, message }. */
function validateNames(rawYou, rawThem) {
  const you = normalizeName(rawYou || '');
  const them = normalizeName(rawThem || '');

  if (!rawYou || !rawYou.trim() || !rawThem || !rawThem.trim()) {
    return { valid: false, message: 'Both names are required.' };
  }
  if (!you || !them) {
    return { valid: false, message: 'Names must contain letters.' };
  }
  if (you === them) {
    return { valid: false, message: "The two names can't be identical." };
  }
  return { valid: true, message: '' };
}

/**
 * Cancel matching letters one-for-one between the two names.
 * Returns per-letter tagging so the UI can animate matches individually,
 * plus the remaining (uncancelled) letters and total count.
 */
function cancelLetters(nameYou, nameThem) {
  const youArr = nameYou.split('').map((ch) => ({ ch, matched: false }));
  const themArr = nameThem.split('').map((ch) => ({ ch, matched: false }));

  youArr.forEach((youLetter) => {
    const partner = themArr.find((t) => !t.matched && t.ch === youLetter.ch);
    if (partner) {
      youLetter.matched = true;
      partner.matched = true;
    }
  });

  const remaining = [
    ...youArr.filter((l) => !l.matched).map((l) => l.ch),
    ...themArr.filter((l) => !l.matched).map((l) => l.ch),
  ];

  return {
    youTagged: youArr,
    themTagged: themArr,
    remaining,
    count: remaining.length,
  };
}

/**
 * Classic FLAMES elimination: given a starting count n, repeatedly count
 * around the remaining letters and eliminate the one landed on, until one
 * letter remains. Returns the ordered elimination sequence for animation
 * plus the final surviving letter.
 */
function runFlamesElimination(n, letters = ['F', 'L', 'A', 'M', 'E', 'S']) {
  // Guard: a count of 0 can happen if names cancel out completely.
  const safeN = n > 0 ? n : letters.length;
  const arr = letters.slice();
  const eliminationOrder = [];
  let idx = 0;

  while (arr.length > 1) {
    idx = (idx + safeN - 1) % arr.length;
    eliminationOrder.push(arr[idx]);
    arr.splice(idx, 1);
    if (idx === arr.length) idx = 0;
  }

  return { eliminationOrder, survivor: arr[0], countUsed: safeN };
}

/** Full pipeline: raw names in, complete result object out. */
function computeFlamesResult(rawYou, rawThem) {
  const you = normalizeName(rawYou);
  const them = normalizeName(rawThem);
  const cancellation = cancelLetters(you, them);
  const elimination = runFlamesElimination(cancellation.count);
  const meaning = FLAMES_MEANINGS[elimination.survivor];

  return {
    you,
    them,
    rawYou,
    rawThem,
    cancellation,
    elimination,
    resultLetter: elimination.survivor,
    resultWord: meaning.word,
    resultDesc: meaning.desc,
  };
}
