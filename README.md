# Hugo IV: The Antique Shop of Horrors

An unofficial, lovingly retro **sequel-in-spirit** to David P. Gray's 1990 shareware
classic *Hugo's House of Horrors*. Same vibe, same era: **16-color EGA graphics**,
chunky **320×200** pixels scaled up crisp, **PC-speaker-style square-wave bleeps**,
a **CRT scanline filter**, and the old Sierra-style control scheme — **walk with the
arrow keys, type commands with the parser.**

This time Hugo's beloved Penelope has vanished while appraising a haunted curio at
**Ye Olde Antiques**, and a cursed grandfather clock holds the way down...

## ▶ Play online

Once GitHub Pages finishes its first deploy, the game is live at:

**https://jmoore6364.github.io/mansion/**

> First-time setup: the included Actions workflow tries to enable Pages
> automatically. If the first run is blocked, open
> **Settings → Pages → Build and deployment → Source: GitHub Actions**, then
> re-run the *Deploy to GitHub Pages* workflow.

## Play locally

Just open `index.html` in any modern browser. No build step, no dependencies —
it's a single self-contained file.

```
# from the repo root
open index.html        # macOS
xdg-open index.html    # Linux
# or drag the file into your browser
```

## Controls

| Input | Action |
|-------|--------|
| **Click / tap an object** | Interact with it (the smart default action) |
| **Click / tap the floor** | Walk there (point-and-click) |
| **Arrow keys / D-pad** | Walk Hugo around |
| **Type + Enter** | Issue a parser command |
| **I / ITEMS button** | Open the inventory panel (tap an item to examine) |
| **M** | Toggle sound |
| **T** | Toggle the CRT scanline filter |
| **C** (title) | Continue a saved game |

You can play the whole game **without typing** — tap objects and the floor — or
use the classic text parser, whichever you prefer.

### Parser verbs

`LOOK` · `GET` · `OPEN` · `USE` · `WIND` · `INVENTORY` · `GO` · `SAVE` · `LOAD` · `HELP`

Two-word commands work the classic way: `LOOK MAT`, `OPEN DOOR`, `GET BOX`,
`USE OIL`, `USE COIN`, `WIND MUSIC BOX`. Walk into doorways and screen edges to
travel between rooms.

## The adventure

A six-room quest in two acts to rescue Penelope, scored out of **160 points**:

1. **Cobblestone Street** — find the brass key hidden under the welcome mat,
   unlock the shop door.
2. **Inside the Antique Shop** — take the antique music box, grab the oil can,
   oil the cursed grandfather clock, and open it to reveal a hidden stair.
   *(Curiosity about the scratching crate is... not advised.)*
3. **The Upstairs Parlor** — climb the stairs and take the lit **lantern** from
   the side table; the catacombs below are pitch black without a light.
4. **The Catacombs** — by lantern-light, lift the silver coin from the
   sarcophagus lid (don't open it!), feed it to the barred gate's coin slot, and
   head east.
5. **The Forgotten Crypt** — wind Penelope's lullaby on the music box to free
   her... which awakens **Dr. Hammerstein** and grinds open a door to the east.
6. **Hammerstein's Laboratory** (Act II finale) — Penelope now follows you. Grab
   the rubber **gloves** from the workbench, then throw the machine's power lever
   to defeat the doctor and escape. *(Pulling it bare-handed is a shocking
   mistake.)* **The End.**

Features the full Hugo experience: a **Sierra-style score** and **death counter**,
**sudden deaths with a respawn screen**, a **companion who follows you** in Act II,
a **save/restore system**, autosave on every room change, and a victory ending
that rates a flawless run.

## Tech notes

- **Graphics:** the authentic EGA 16-color palette, all scenes drawn from pixel
  primitives plus a hand-built 5×7 bitmap font. Nearest-neighbor scaling keeps
  every pixel sharp. A CSS **CRT overlay** adds scanlines, a vignette, and a faint
  flicker.
- **Sound:** `AudioContext` square-wave oscillators emulate the PC speaker —
  beeps, footsteps, pickup jingles, a death dirge, a lullaby, and a jaunty-but-
  spooky title theme.
- **Saves & score:** progress, score, and death count stored in the browser via
  `localStorage`.
- **Mobile:** auto-detected touch UI — on-screen D-pad, tappable command bar that
  raises the keyboard, contextual screen buttons, and haptic rumble on
  pickups/deaths via the Vibration API.
- **No assets, no libraries:** everything (art, font, audio, parser, engine) lives
  in `index.html`.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) publishes the
repo root to **GitHub Pages** on every push to the working branch. A `.nojekyll`
file ensures files are served verbatim.

## Roadmap ideas

- More rooms, NPCs, and inventory puzzles
- An in-game inventory panel and a verb/hotspot tap interface
- Landscape-optimized mobile layout

---

*A fan homage. Hugo and the original games are the creations of David P. Gray.*
