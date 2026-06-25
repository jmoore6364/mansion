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

Every room is already painted: `street`, `shop`, `upstairs`, `catacombs`,
`crypt`, and `lab`. They're baked from code as a starting point —
`tools/bake_street.js` does the street, `tools/bake_rooms.js` does the five
interiors (shared encoder in `tools/pnglib.js`). The animated bits (torch and
candle flames, the sparking coil, Hammerstein, the lever) and flag-dependent
items (the coin, the open clock/gate, the lantern, the glass case) are **not**
baked — each room's `over()` redraws those on top every frame, and the
catacombs use `bgWhen: () => hasItem("lantern")` so they stay pitch black until
you bring a light. Repaint any of these in the editor and re-export over the PNG.

Character sprites (`HUGO_A`, `HUGO_B`, `PEN`) are authored in `tools/bake_sprites.js`
and live in `index.html` in the hex format described below.

## Add a sprite

Paint at sprite size, click **Sprite array**, paste the `const NAME = [...]` block
into the sprites section of `index.html`, and draw it with:

```js
drawHexSprite(NAME, x, y);        // add a 4th arg `true` to mirror horizontally
```

Each character is an EGA index `0`–`9`/`A`–`F`; `.` is transparent.
