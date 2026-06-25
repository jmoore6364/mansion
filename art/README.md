# Art pipeline

Painted **room backgrounds** live here as 320×200 PNGs in the authentic EGA
palette. The game loads them automatically and falls back to the old procedural
scene if a file is missing, so nothing breaks if you delete one.

## Make art with the built-in editor

Open **`editor.html`** in a browser (it's a single self-contained file — no
install). It has:

- the exact 16-color EGA palette + transparency,
- Pencil / Line / Rect / Fill / Erase / Eyedropper, zoom, grid, flip-preview, undo,
- presets for sprites (11×19 Hugo, 16×16, 32×32…) and full **320×200 scenes**,
- **PNG import** — drop a PNG (drawn in Aseprite, Piskel, GrafX2, anything) and it
  snaps every pixel to the nearest EGA color,
- **export**: copy a sprite array, or **Download PNG**.

## Add a painted background to a room

1. In `editor.html`, pick the **Scene 320×200** preset and paint (or import + tweak).
2. **Download PNG**, name it after the room, and drop it in this folder
   (`art/<room>.png`, e.g. `art/shop.png`).
3. In `index.html`, on that room object add:
   ```js
   bg: "art/shop.png",
   over(){ /* repaint only the flag-dependent bits, e.g. an open door */ },
   ```
   `over()` runs on top of the PNG each frame; use it for anything that changes
   with game state (items still on the floor, an opened gate, etc.). The room's
   existing `draw()` stays as the fallback when the PNG hasn't loaded.

`art/street.png` is a worked example (see `tools/bake_street.js`, which bakes it
from code). Repaint over it in the editor anytime.

## Add a sprite

Paint at sprite size, click **Sprite array**, paste the `const NAME = [...]` block
into the sprites section of `index.html`, and draw it with:

```js
drawHexSprite(NAME, x, y);        // add a 4th arg `true` to mirror horizontally
```

Each character is an EGA index `0`–`9`/`A`–`F`; `.` is transparent.
