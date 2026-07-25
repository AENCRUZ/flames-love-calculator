/**
 * animations.js
 * DOM-facing animation helpers. Talks to the page; math lives in flames.js.
 */

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Continuously spawn floating hearts into the ambient background layer. */
function startAmbientHearts(container) {
  const glyphs = ['💗', '💌', '✨', '🌸', '💞'];
  function spawn() {
    const el = document.createElement('span');
    el.className = 'heart';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${8 + Math.random() * 6}s`;
    el.style.fontSize = `${0.9 + Math.random() * 1.1}rem`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 15000);
  }
  spawn();
  return setInterval(spawn, 1800);
}

/** Crossfade between two scene sections. */
function switchScene(fromEl, toEl) {
  if (fromEl) {
    fromEl.classList.remove('scene--active');
    fromEl.classList.add('scene--leaving');
    setTimeout(() => fromEl.classList.remove('scene--leaving'), 300);
  }
  toEl.classList.add('scene--active');
}

/** Build a static row of letter tiles (used for the "remaining" screen). */
function renderStaticTiles(container, letters) {
  container.innerHTML = '';
  letters.forEach((ch, i) => {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.style.animationDelay = `${i * 0.05}s`;
    tile.textContent = ch.toUpperCase();
    container.appendChild(tile);
  });
}

/**
 * Render a name's letters as tiles, then sequentially animate the "stamp"
 * for every matched letter with a small delay between each. Resolves once
 * every matched stamp has played.
 */
async function renderAndStampRow(container, taggedLetters, { onStamp } = {}) {
  container.innerHTML = '';
  const tileEls = taggedLetters.map((entry, i) => {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.style.animationDelay = `${i * 0.04}s`;
    tile.textContent = entry.ch.toUpperCase();

    const stamp = document.createElement('span');
    stamp.className = 'stamp';
    stamp.textContent = '✕';
    tile.appendChild(stamp);

    container.appendChild(tile);
    return tile;
  });

  await wait(taggedLetters.length * 40 + 150);

  for (let i = 0; i < taggedLetters.length; i += 1) {
    if (taggedLetters[i].matched) {
      tileEls[i].classList.add('is-matched');
      if (onStamp) onStamp();
      await wait(220);
    }
  }
}

/** Build the six FLAMES tiles up front, returning references keyed by letter. */
function renderFlamesTiles(container, meanings) {
  container.innerHTML = '';
  const tiles = {};
  Object.keys(meanings).forEach((letter, i) => {
    const tile = document.createElement('div');
    tile.className = 'flame-letter';
    tile.style.animationDelay = `${i * 0.06}s`;
    tile.innerHTML = `
      <span class="flame-letter__letter">${letter}</span>
      <span class="flame-letter__word">${meanings[letter].word}</span>
    `;
    container.appendChild(tile);
    tiles[letter] = tile;
  });
  return tiles;
}

/**
 * Animate the FLAMES elimination sequence: highlight the active letter,
 * pause dramatically, then mark it eliminated — repeating for every letter
 * in eliminationOrder. Resolves once only the survivor remains.
 */
async function animateFlamesElimination(tiles, eliminationOrder, countingEl, { onEliminate } = {}) {
  for (let i = 0; i < eliminationOrder.length; i += 1) {
    const letter = eliminationOrder[i];
    const tile = tiles[letter];

    tile.classList.add('is-active');
    countingEl.textContent = `counting… ${letter}`;
    await wait(280);
    tile.classList.remove('is-active');
    tile.classList.add('is-eliminated');
    if (onEliminate) onEliminate();
    countingEl.textContent = `${letter} is out`;
    await wait(420);
  }
  countingEl.textContent = 'and the answer is…';
  await wait(600);
}
