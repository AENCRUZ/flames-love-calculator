# 🕹️ FLAMES — A Little Love Game (Retro Arcade Edition)

An interactive, retro-arcade take on the classic FLAMES compatibility game — think pixel fonts, chunky 8-bit dialog boxes, and NES-style sound effects.

Enter two names, watch matching letters get cleared like an arcade puzzle level, then face the FLAMES "final boss" elimination countdown as the game reveals your result.

This project transforms the classic Filipino love game into a small interactive experience with animations, arcade-themed skins, sound effects, and a playful pixel-art interface.

---

## ✨ Features

- ✅ Name input with validation (empty fields, letters-only, and identical name checks)
- ✅ Animated letter cancellation ("Level 2: Clear the Matches")
- ✅ Remaining-letter score screen
- ✅ Classic FLAMES elimination algorithm as an animated "boss fight" countdown
- ✅ "You Win!" result reveal with a pixel trophy/seal
- ✅ Three arcade-cabinet themes:
  - 🍄 Mario World (default) — sky blue, coin gold, fireball red
  - 👻 Pac-Man Arcade — black cabinet with neon pink & yellow
  - 👾 Space Invaders — phosphor-green terminal glow
- ✅ Love History system using `localStorage`
- ✅ Copy-result button for sharing results
- ✅ Mobile-responsive layout
- ✅ Reduced-motion support for accessibility

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** — page structure and UI elements
- **CSS3** — styling, layouts, themes, and animations
- **JavaScript (ES6)** — game logic, interactions, and state management

### APIs & Browser Features
- **LocalStorage API** — saves previous FLAMES results locally
- **Web Audio API** — generates sound effects without external audio files

### Development Tools
- **Visual Studio Community**
- **Git & GitHub** — version control and project hosting

---

## 🧠 How It Works

The game follows the traditional FLAMES algorithm:

### 1. Name Processing

The entered names are normalized by:
- Converting all letters to lowercase
- Removing spaces and unnecessary characters

Example:

```
Taylor → taylor
```

---

### 2. Letter Cancellation

The game compares both names and removes matching letters.

Example:

```
TAYLOR
TRAVIS

Common letters:
T, A, R

Remaining letters:
YLO + VIS
```

Each removed letter is displayed with an animated ink-stamp cross effect.

---

### 3. Remaining Letter Count

The remaining letters are counted.

This number determines how the FLAMES elimination process works.

---

### 4. FLAMES Elimination

The game starts with:

```
F L A M E S
```

Each letter represents:

| Letter | Meaning |
|--------|---------|
| F | Friends |
| L | Lovers |
| A | Affection |
| M | Marriage |
| E | Enemies |
| S | Soulmates |

The remaining letter count is used to eliminate letters one by one until only one result remains.

---

### 5. Result Reveal

The final result is revealed through an animated paper and wax-seal effect.

---

## 🚀 Running It

No build step required — this is a pure HTML/CSS/JavaScript project.

### Option 1: Open directly

Open:

```
index.html
```

in any modern browser.

### Option 2: Run a local server (recommended)

Using Python:

```bash
cd FLAMES-Love-Game
python3 -m http.server 8000
```

Then open:

```
http://localhost:8000
```

Running locally ensures features like `localStorage` and custom fonts work consistently.

---

## 📁 Project Structure

```
FLAMES-Love-Game/
│
├── index.html
│
├── css/
│   ├── style.css        (tokens, layout, components, themes)
│   └── animations.css   (stamps, elimination, seal, heart effects)
│
├── js/
│   ├── flames.js        (pure FLAMES logic: normalize, cancel, eliminate)
│   ├── audio.js         (synthesized sound effects)
│   ├── animations.js    (DOM animation helpers)
│   └── main.js          (scene state management and app logic)
│
├── assets/
│   ├── images/
│   └── sounds/
│
└── README.md
```

---

## 🔮 Future Improvements

Possible future additions:

- 💌 Generate downloadable result cards
- 🎨 Add more paper and seasonal themes
- 🌐 Deploy as a public website
- 👥 Add multiplayer/shared results
- 📊 Add more compatibility mini-games

---

## 📌 Git Setup

```bash
git init
git add .
git commit -m "Initial FLAMES game: algorithm, scenes, animations, themes"
```

---

## 📄 License

This project is open source and available under the MIT License.
