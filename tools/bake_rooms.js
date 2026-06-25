/* Bakes painted EGA backgrounds for the interior rooms into art/<room>.png.
   Only the STATIC layers are baked here; animated bits (torch/candle flames,
   electric arcs, the lever, Hammerstein) and flag-dependent items (the coin,
   the open clock/gate, the lantern, the glass case) are redrawn each frame by
   the room's over() in index.html, and text labels are drawn there too (no font
   in Node). Alignment matches each room's hotspots. Repaint in editor.html and
   re-export over these files anytime.   Run: node tools/bake_rooms.js          */
const fs = require("fs");
const path = require("path");
const { Frame, encodePNG } = require("./pnglib");
const W = 320, H = 200;
const outDir = path.join(__dirname, "..", "art");
fs.mkdirSync(outDir, { recursive: true });
function save(name, fr){
  fs.writeFileSync(path.join(outDir, name+".png"), encodePNG(fr));
  console.log("art/"+name+".png");
}

/* ---------------- SHOP ---------------- */
(() => {
  const f = Frame(W,H);
  f.rect(0,0,W,160,6); f.dither(0,0,W,160,6,8);
  // back-wall clutter: faint shelves & vases (decorative dithering)
  for(let x=4;x<300;x+=64){ f.dither(x,30,40,10,8,6); f.rect(x,40,40,1,0); }
  f.dither(0,150,W,10,8,6);                         // skirting shadow
  // floorboards
  f.rect(0,160,W,40,8); for(let x=0;x<W;x+=24) f.rect(x,160,1,40,0); f.rect(0,160,W,2,0);
  f.dither(0,160,W,6,7,8);
  // EXIT doorway (left)
  f.rect(8,96,40,64,0); f.rect(12,100,32,56,1); f.dither(12,100,32,56,1,9);
  // staircase UP (right)
  f.rect(286,40,34,120,0); for(let i=0;i<7;i++) f.rect(290,150-i*16,26,6,8);
  // shelf board
  f.rect(210,70,72,10,0); f.rect(210,80,72,2,8);
  // grandfather clock (closed)
  f.rect(150,40,44,118,6); f.rect(152,42,40,114,0); f.rect(154,44,36,40,1); f.dither(154,44,36,40,1,9);
  f.rect(160,50,24,24,15); f.line(172,62,172,54,0); f.line(172,62,180,62,0);
  f.rect(162,92,20,56,1); f.rect(170,96,4,44,14); f.rect(166,140,12,8,14);
  // crate
  f.rect(60,128,40,32,6); f.rect(60,128,40,2,14); f.rect(60,158,40,2,0);
  f.line(60,128,100,160,8); f.line(100,128,60,160,8);
  // cobwebs
  f.line(0,0,30,30,7); f.line(30,0,0,30,7); f.line(W,0,W-30,30,7);
  save("shop", f);
})();

/* ---------------- UPSTAIRS PARLOR ---------------- */
(() => {
  const f = Frame(W,H);
  f.rect(0,0,W,160,5); f.dither(0,0,W,160,5,1);
  for(let x=8;x<W;x+=20) f.rect(x,0,2,160,1);       // wallpaper stripes
  f.rect(0,160,W,40,6); for(let x=0;x<W;x+=24) f.rect(x,160,1,40,0); f.rect(0,160,W,2,0);
  f.dither(0,160,W,5,8,6);
  // stairs DOWN (right)
  f.rect(286,40,34,120,0); for(let i=0;i<7;i++) f.rect(290,52+i*16,26,6,8);
  // tall moonlit window
  f.rect(40,30,52,70,0); f.dither(44,34,44,62,1,9); f.dither(60,40,18,40,9,11);
  f.line(66,34,66,96,0); f.line(44,64,88,64,0);
  // creepy portrait
  f.rect(150,36,40,46,6); f.rect(154,40,32,38,8);
  f.rect(160,48,8,8,15); f.rect(172,48,8,8,15);
  f.rect(162,50,4,4,0); f.rect(174,50,4,4,0); f.rect(160,66,20,4,4);
  // side table (lantern is dynamic -> over())
  f.rect(210,120,56,8,6); f.rect(214,128,6,30,6); f.rect(256,128,6,30,6);
  f.line(0,0,28,28,7); f.line(W,0,W-28,28,7);
  save("upstairs", f);
})();

/* ---------------- CATACOMBS (lit) ---------------- */
(() => {
  const f = Frame(W,H);
  f.rect(0,0,W,160,0); f.dither(0,0,W,160,8,0);
  // mortar suggestion on the stone
  for(let y=18;y<150;y+=22) f.dither(0,y,W,2,8,0);
  f.rect(0,160,W,40,8); for(let x=0;x<W;x+=32) f.rect(x,160,1,40,0); f.rect(0,160,W,2,0);
  // stair UP (left)
  f.rect(6,96,34,64,0); for(let i=0;i<6;i++) f.rect(10,150-i*8,28,4,7);
  // torch sconces (flames are dynamic)
  f.rect(96,60,4,16,6); f.rect(220,60,4,16,6);
  // gargoyle body (eyes are dynamic)
  f.rect(52,96,28,22,8); f.rect(48,90,8,9,8); f.rect(76,90,8,9,8); f.rect(58,112,16,2,0);
  f.dither(52,96,28,22,8,7);
  // sarcophagus (closed; coin is dynamic)
  f.rect(120,118,70,40,8); f.rect(122,120,66,36,7); f.dither(122,120,66,36,7,8);
  f.rect(140,124,30,16,15); f.rect(146,128,4,4,0); f.rect(160,128,4,4,0); f.rect(152,133,6,4,0);
  // gate opening (bars / open state drawn by over())
  f.rect(264,80,48,80,6); f.rect(266,82,44,76,0);
  save("catacombs", f);
})();

/* ---------------- CRYPT ---------------- */
(() => {
  const f = Frame(W,H);
  f.rect(0,0,W,160,0); f.dither(0,0,W,160,1,0);
  for(let y=20;y<150;y+=24) f.dither(0,y,W,2,8,0);
  f.rect(0,160,W,40,8); for(let x=0;x<W;x+=32) f.rect(x,160,1,40,0); f.rect(0,160,W,2,0);
  // gate WEST
  f.rect(8,96,30,64,0); f.dither(10,98,26,60,0,8);
  // candle sticks (flames dynamic)
  f.rect(70,120,4,30,15); f.rect(250,120,4,30,15);
  // altar
  f.rect(120,120,80,40,8); f.rect(120,120,80,4,7); f.dither(122,126,76,32,8,0);
  // glass case frame (inner contents drawn by over())
  f.rect(132,70,56,52,11);
  save("crypt", f);
})();

/* ---------------- LAB ---------------- */
(() => {
  const f = Frame(W,H);
  f.rect(0,0,W,160,0); f.dither(0,0,W,160,1,0);
  // riveted metal wall hints
  for(let y=16;y<150;y+=20) for(let x=8;x<W;x+=20) f.px(x,y,8);
  f.rect(0,160,W,40,8); for(let x=0;x<W;x+=28) f.rect(x,160,1,40,0); f.rect(0,160,W,2,0);
  f.dither(0,160,W,5,7,8);
  // WEST door
  f.rect(6,96,30,64,0); f.dither(8,98,26,60,0,8);
  // workbench
  f.rect(40,128,46,30,6); f.rect(40,128,46,3,14); f.dither(40,131,46,27,6,8);
  // the great machine (body; coil/dials/lever drawn by over())
  f.rect(120,40,70,80,8); f.dither(120,40,70,80,8,7); f.rect(124,44,62,40,1); f.dither(124,44,62,40,1,9);
  // lever post base
  f.rect(150,84,30,40,0); f.rect(162,88,6,30,7);
  save("lab", f);
})();

console.log("done.");
