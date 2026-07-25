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

## What's implemented 

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

## Git

```bash
git init
git add .
git commit -m "Initial FLAMES game: algorithm, scenes, animations, themes"
```
