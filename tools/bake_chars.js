/* Demo: generate NEW character sprites in the editor's hex format, print the
   ready-to-paste arrays, AND render a scaled preview PNG. Shows the sprite
   pipeline can make any character, not just Hugo/Penelope.
   Run: node tools/bake_chars.js                                              */
const fs = require("fs");
const path = require("path");
const { Frame, encodePNG } = require("./pnglib");
const HEX = "0123456789ABCDEF";

function build(rows, map){
  const W = Math.max(...rows.map(r=>r.length));
  return rows.map(r=>{ r=r.padEnd(W,"."); let s="";
    for(const ch of r) s += ch==="." ? "." : HEX[map[ch]]; return s; });
}
function emit(name, hex){ console.log(`const ${name} = [\n`+hex.map(r=>'  "'+r+'"').join(",\n")+`\n];`); }

/* legend: H hair  S skin  e eye  m mouth  C coat  b button  h hand
           P pants O shoe  G ghost-body  T tail  E ear  W whisker  */
const SCI = { H:7, S:12, e:0, m:4, C:15, b:1, h:12, P:8, O:0 };
const GHO = { G:15, e:0, m:0, S:11 };
const RAT = { B:8, T:12, e:0, E:12, O:0 };

// Dr. Hammerstein — mad scientist, arms flung up, wild hair, lab coat
const HAMMER = build([
  "..H...HH...H..",
  ".HHH.HHHH.HHH.",
  "..HHHHHHHHHH..",
  ".HHSSSSSSSSHH.",
  ".HHSSSSSSSSHH.",
  ".HSeSSSSSSeSH.",
  ".HSSSSSSSSSSH.",
  ".HSSSmmmmSSSH.",
  "..SSSSSSSSSS..",
  "h.SSSSSSSSSS.h",
  "hCCCCCCCCCCCCh",
  "hCCCCCbCCCCCCh",
  ".CCCCCbCCCCCC.",
  ".CCCCCbCCCCCC.",
  ".CCCCCbCCCCCC.",
  ".CCCCCCCCCCCC.",
  ".CCCCC..CCCCC.",
  ".CCCC....CCCC.",
  "..PPP....PPP..",
  "..PPP....PPP..",
  "..PPP....PPP..",
  "..OOO....OOO..",
], SCI);

// A floating ghost — wavy sheet, hollow eyes
const GHOST = build([
  "...GGGGGG...",
  "..GGGGGGGG..",
  ".GGGGGGGGGG.",
  ".GGGGGGGGGG.",
  ".GGeeGGeeGG.",
  ".GGeeGGeeGG.",
  ".GGGGGGGGGG.",
  ".GGGGmmGGGG.",
  ".GGGGGGGGGG.",
  ".GGGGGGGGGG.",
  ".GGGGGGGGGG.",
  ".GGGGGGGGGG.",
  ".GG.GG.GG.G.",
  ".G..G..G..G.",
], GHO);

// A skittering rat
const RATSPR = build([
  "..E........E....",
  ".EBE......EBE...",
  ".BBBB....BBBB...",
  "..BBBBBBBBBBe.TT",
  ".BBBBBBBBBBBBTT.",
  ".BBBBBBBBBBBT...",
  "..BB..BB..BB....",
  "..OO..OO..OO....",
], RAT);

emit("HAMMER", HAMMER);
emit("GHOST", GHOST);
emit("RATSPR", RATSPR);

/* ---- render a scaled preview montage ---- */
const S = 7, GAP = 16;
const items = [["HAMMER",HAMMER],["GHOST",GHOST],["RAT",RATSPR]];
const totalW = items.reduce((a,[,m])=>a+m[0].length*S+GAP, GAP);
const maxH = Math.max(...items.map(([,m])=>m.length))*S + GAP*2;
const f = Frame(totalW, maxH);
f.rect(0,0,totalW,maxH,8); f.dither(0,0,totalW,maxH,8,7);   // gray studio bg
let ox = GAP;
for(const [,m] of items){
  const w=m[0].length, h=m.length;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){ const ch=m[y][x]; if(ch===".")continue;
    f.rect(ox+x*S, GAP+y*S, S, S, parseInt(ch,16)); }
  ox += w*S + GAP;
}
const outPath = process.argv[2] || path.join(__dirname,"chars_preview.png");
fs.writeFileSync(outPath, encodePNG(f));
console.log("// preview -> "+outPath);
