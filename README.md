# Hugo IV: The Antique Shop of Horrors

An unofficial, lovingly retro **sequel-in-spirit** to David P. Gray's 1990 shareware
classic *Hugo's House of Horrors*. Same vibe, same era: **16-color EGA graphics**,
chunky **320×200** pixels scaled up crisp, **PC-speaker-style square-wave bleeps**,
and the old Sierra-style control scheme — **walk with the arrow keys, type commands
with the parser.**

This time Hugo's beloved Penelope has vanished while appraising a haunted curio at
**Ye Olde Antiques**, and a cursed grandfather clock holds the way down...

## Play

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
| **Arrow keys** | Walk Hugo around |
| **Type + Enter** | Issue a parser command |
| **M** | Toggle sound |

### Parser verbs

`LOOK` · `GET` · `OPEN` · `USE` · `WIND` · `INVENTORY` · `GO` · `HELP`

Two-word commands work the classic way: `LOOK MAT`, `OPEN DOOR`, `GET BOX`,
`WIND MUSIC BOX`. Walk into doorways and screen edges to travel between rooms.

## What's in this slice

This is a small **vertical slice** proving out the engine and the look:

1. **Cobblestone Street** — find the brass key hidden under the welcome mat,
   unlock the shop door.
2. **Inside the Antique Shop** — take the antique music box, investigate the
   cursed grandfather clock, and uncover the hidden stair.

It ends on a cliffhanger — the catacombs below are the next chapter.

## Tech notes

- **Graphics:** the authentic EGA 16-color palette, all scenes drawn from pixel
  primitives plus a hand-built 5×7 bitmap font. Nearest-neighbor scaling keeps
  every pixel sharp.
- **Sound:** `AudioContext` square-wave oscillators emulate the PC speaker —
  beeps, footsteps, a pickup jingle, and a jaunty-but-spooky title theme.
- **No assets, no libraries:** everything (art, font, audio, parser, engine) lives
  in `index.html`.

## Roadmap ideas

- The catacombs beneath the clock (oil can puzzle, the coin, a locked gate)
- More rooms, NPCs, and a death-and-respawn screen (very Hugo)
- A save/restore system using `localStorage`
- Title-screen scanline/CRT shader for extra 1990 authenticity

---

*A fan homage. Hugo and the original games are the creations of David P. Gray.*
