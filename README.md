# 💌 FLAMES — A Little Love Game

An interactive, paper-letter-themed take on the classic FLAMES compatibility game.
Enter two names, watch the matching letters get crossed out, then watch the
FLAMES elimination count down to your result.

## Running it

No build step — it's plain HTML/CSS/JS.

1. Open `index.html` directly in a browser, **or**
2. Serve it locally (recommended, so `localStorage` and fonts behave consistently):
   ```bash
   cd FLAMES-Love-Game
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

## What's implemented (Phase 1 + 2 + partial Phase 3)

- ✅ Name input with validation (empty, letters-only, no identical names)
- ✅ Letter cancellation with animated ink-stamp crossing-out
- ✅ Remaining-letter count screen
- ✅ Classic FLAMES elimination algorithm with animated countdown
- ✅ Result reveal with wax-seal animation
- ✅ Three themes: Cute pastel, Valentine, Midnight romance (top-right dots)
- ✅ Love History via `localStorage` (drawer icon, top-left)
- ✅ Copy-result button (for sharing)
- ✅ Mobile-responsive layout
- ✅ Reduced-motion support

## About the audio

The original plan called for recorded `stamp.mp3` / `click.mp3` files. To keep
the project runnable with zero external assets, `js/audio.js` synthesizes all
sound effects live with the Web Audio API. If you'd rather use real recordings:

1. Drop files into `assets/sounds/`.
2. In `audio.js`, replace the `tone(...)` calls inside `click()`, `stamp()`,
   `paperFlip()`, `eliminate()`, and `sparkle()` with an `<audio>` element or
   `new Audio('assets/sounds/yourfile.mp3').play()`.

Same idea applies to `assets/images/` — the paper texture and hearts are done
in pure CSS/emoji right now so there's nothing to source before it runs.

## Project structure

```
FLAMES-Love-Game/
├── index.html
├── css/
│   ├── style.css        (tokens, layout, components)
│   └── animations.css   (keyframes: stamps, elimination, seal, hearts)
├── js/
│   ├── flames.js        (pure logic: normalize, cancel, eliminate — no DOM)
│   ├── audio.js         (synthesized sound effects)
│   ├── animations.js     (DOM animation helpers)
│   └── main.js           (scene state machine, wires everything together)
├── assets/
│   ├── images/           (empty — see note above)
│   └── sounds/           (empty — see note above)
└── README.md
```

## Next up (Phase 4 ideas from the original plan)

- Generate a downloadable/shareable result *image* (canvas or html-to-image)
- Port to React if you want componentized state instead of the vanilla JS
  scene machine in `main.js`
- Add a backend + accounts if you want history to sync across devices
  instead of living in each browser's `localStorage`

## Git

```bash
git init
git add .
git commit -m "Initial FLAMES game: algorithm, scenes, animations, themes"
```
