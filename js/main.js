/**
 * main.js
 * Orchestrates the six scenes, owns current-game state, and wires up
 * history / theming / audio controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  const scenes = {
    1: document.getElementById('scene-1'),
    2: document.getElementById('scene-2'),
    3: document.getElementById('scene-3'),
    4: document.getElementById('scene-4'),
    5: document.getElementById('scene-5'),
    6: document.getElementById('scene-6'),
  };
  let currentScene = 1;
  let game = null; // holds the computeFlamesResult() output for the active round

  function goTo(sceneNumber) {
    switchScene(scenes[currentScene], scenes[sceneNumber]);
    currentScene = sceneNumber;
  }

  // ---------- Scene 1: Startup ----------
  startAmbientHearts(document.getElementById('ambient'));

  const envelope = document.getElementById('envelope');
  document.getElementById('startBtn').addEventListener('click', () => {
    GameAudio.paperFlip();
    envelope.classList.add('is-open');
    setTimeout(() => goTo(2), 300);
  });

  // ---------- Scene 2: Name input ----------
  const nameYouInput = document.getElementById('nameYou');
  const nameThemInput = document.getElementById('nameThem');
  const formError = document.getElementById('formError');

  function submitNames() {
    const { valid, message } = validateNames(nameYouInput.value, nameThemInput.value);
    formError.textContent = valid ? '' : message;
    if (!valid) {
      GameAudio.click();
      return;
    }
    game = computeFlamesResult(nameYouInput.value, nameThemInput.value);
    GameAudio.paperFlip();
    goTo(3);
    runMatchingScene();
  }

  document.getElementById('continueBtn2').addEventListener('click', submitNames);
  [nameYouInput, nameThemInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitNames();
    });
  });

  // ---------- Scene 3: Letter matching ----------
  const continueBtn3 = document.getElementById('continueBtn3');

  async function runMatchingScene() {
    continueBtn3.disabled = true;
    const rowYou = document.getElementById('matchRowYou');
    const rowThem = document.getElementById('matchRowThem');
    const { youTagged, themTagged } = game.cancellation;

    await renderAndStampRow(rowYou, youTagged, { onStamp: () => GameAudio.stamp() });
    await renderAndStampRow(rowThem, themTagged, { onStamp: () => GameAudio.stamp() });

    continueBtn3.disabled = false;
  }

  continueBtn3.addEventListener('click', () => {
    GameAudio.click();
    goTo(4);
    renderRemainingScene();
  });

  // ---------- Scene 4: Remaining letters ----------
  function renderRemainingScene() {
    const { remaining, count } = game.cancellation;
    renderStaticTiles(document.getElementById('remainingRow'), remaining);
    document.getElementById('remainingCount').textContent = count;
  }

  document.getElementById('continueBtn4').addEventListener('click', () => {
    GameAudio.click();
    goTo(5);
    runFlamesScene();
  });

  // ---------- Scene 5: FLAMES elimination ----------
  async function runFlamesScene() {
    const container = document.getElementById('flamesRow');
    const countingEl = document.getElementById('flamesCounting');
    const tiles = renderFlamesTiles(container, FLAMES_MEANINGS);

    await wait(400);
    await animateFlamesElimination(
      tiles,
      game.elimination.eliminationOrder,
      countingEl,
      { onEliminate: () => GameAudio.eliminate() }
    );

    GameAudio.sparkle();
    goTo(6);
    renderResultScene();
  }

  // ---------- Scene 6: Result ----------
  function renderResultScene() {
    document.getElementById('resultWord').textContent = game.resultWord.toUpperCase();
    document.getElementById('resultDesc').textContent = game.resultDesc;
    document.getElementById('resultNames').textContent = `${capitalize(game.rawYou.trim())} + ${capitalize(game.rawThem.trim())}`;
    document.getElementById('waxSealEmoji').textContent = sealEmojiFor(game.resultLetter);
    saveToHistory(game);
    renderHistoryList();
  }

  function sealEmojiFor(letter) {
    return { F: '🤝', L: '💗', A: '💞', M: '💍', E: '⚔️', S: '✨' }[letter] || '💌';
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }

  document.getElementById('againBtn').addEventListener('click', () => {
    GameAudio.click();
    nameYouInput.value = '';
    nameThemInput.value = '';
    formError.textContent = '';
    goTo(1);
    envelope.classList.remove('is-open');
  });

  document.getElementById('copyBtn').addEventListener('click', async () => {
    const text = `FLAMES result — ${capitalize(game.rawYou)} + ${capitalize(game.rawThem)}: ${game.resultWord.toUpperCase()} 💌`;
    try {
      await navigator.clipboard.writeText(text);
      GameAudio.sparkle();
      const btn = document.getElementById('copyBtn');
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    } catch (err) {
      // Clipboard API can be blocked (permissions, insecure context); fail silently in UI.
      console.warn('Clipboard copy failed:', err);
    }
  });

  // ---------- Love History (localStorage) ----------
  const HISTORY_KEY = 'flames-love-history';

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (err) {
      return [];
    }
  }

  function saveToHistory(result) {
    const history = loadHistory();
    history.unshift({
      you: capitalize(result.rawYou.trim()),
      them: capitalize(result.rawThem.trim()),
      word: result.resultWord,
      when: new Date().toLocaleDateString(),
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  }

  function renderHistoryList() {
    const list = document.getElementById('historyList');
    const empty = document.getElementById('historyEmpty');
    const history = loadHistory();

    list.innerHTML = '';
    empty.style.display = history.length ? 'none' : 'block';

    history.forEach((entry) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${entry.you} + ${entry.them}</span><strong>${entry.word}</strong>`;
      list.appendChild(li);
    });
  }

  document.getElementById('historyBtn').addEventListener('click', () => {
    renderHistoryList();
    document.getElementById('historyDrawer').classList.add('is-open');
    document.getElementById('drawerBackdrop').classList.add('is-open');
  });

  function closeDrawer() {
    document.getElementById('historyDrawer').classList.remove('is-open');
    document.getElementById('drawerBackdrop').classList.remove('is-open');
  }
  document.getElementById('closeHistory').addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);

  document.getElementById('clearHistory').addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistoryList();
  });

  // ---------- Theme picker ----------
  document.querySelectorAll('.theme-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      document.body.setAttribute('data-theme', dot.dataset.theme);
      GameAudio.click();
    });
  });

  // ---------- Mute toggle ----------
  const muteBtn = document.getElementById('muteBtn');
  muteBtn.addEventListener('click', () => {
    const nowMuted = !GameAudio.isMuted();
    GameAudio.setMuted(nowMuted);
    muteBtn.textContent = nowMuted ? '🔇' : '🔊';
  });
});
