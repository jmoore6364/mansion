/* Authors every game character in the editor's hex sprite format, prints the
   paste-ready arrays, and renders a scaled preview montage. Readable letter
   templates + per-sprite color maps; output is hex-per-pixel for drawHexSprite.
   Run: node tools/bake_sprites.js [previewPath]                              */
const fs = require("fs");
const path = require("path");
const { Frame, encodePNG } = require("./pnglib");
const HEX = "0123456789ABCDEF";

function build(name, rows, map){
  const W = Math.max(...rows.map(r=>r.length));
  const out = rows.map(r=>{ r=r.padEnd(W,"."); let s="";
    for(const ch of r){ if(ch!=="."&&!(ch in map)) throw new Error(`${name}: unknown '${ch}'`);
      s += ch==="." ? "." : HEX[map[ch]]; } return s; });
  if(new Set(out.map(r=>r.length)).size!==1) throw new Error(name+": ragged");
  return out;
}
function emit(name, hex){ console.log(`const ${name} = [\n`+hex.map(r=>'  "'+r+'"').join(",\n")+`\n];`); }

/* legend: H hair  S skin  e eye  m mouth  n nose
   T shirt t tie c collar  D dress d dress-shade  b belt  P pants O shoe  h hand
   C coat  g glasses  G ghost  E ear  B body  W tail  */
/* Hugo: black-outlined (k) to match the painted rooms; white shirt with gray
   shading (s), red tie, brown hair with a dark part (d), blue pants with a
   highlight seam (p). */
const HUGO = { k:0, H:6, d:8, S:12, e:0, m:4, T:15, s:7, t:4, b:8, P:1, p:9, O:0 };
const PEN  = { H:14, S:12, e:0, m:4, D:13, d:5, P:13, O:0, h:12 };
const SCI  = { H:7, S:12, e:0, m:4, n:6, C:15, c:7, t:4, g:0, P:8, O:0, h:12 };
const GHO  = { G:15, e:0, m:0 };
const RAT  = { B:8, b:7, W:12, e:0, E:12, O:0 };

const HUGO_A = build("HUGO_A",[
  "....kkkkkk....",
  "...kHHHHHHk...",
  "..kHHHHHHHHk..",
  "..kHHdHHHHHk..",
  "..kHSSSSSSHk..",
  "..kSSSSSSSSk..",
  "..kSeSSSSeSk..",
  "..kSSSSdSSSk..",
  "..kSSmmmmSSk..",
  "...kSSSSSSk...",
  "....kSSSSk....",
  "...kTTttTTk...",
  "..kTTTttTTTk..",
  ".kTkTTttTTkTk.",
  ".kSkTTttTTkSk.",
  ".kSkTsttsTkSk.",
  "..kkTsttsTkk..",
  "..kTTTTTTTTk..",
  "..kbbbbbbbbk..",
  "..kPPPkkPPPk..",
  "..kPpPkkPpPk..",
  "..kPpPkkPpPk..",
  "..kPpPkkPpPk..",
  "..kOOOkkOOOk..",
  ".kOOOOkkOOOOk.",
], HUGO);
const HUGO_B = build("HUGO_B",[
  "....kkkkkk....",
  "...kHHHHHHk...",
  "..kHHHHHHHHk..",
  "..kHHdHHHHHk..",
  "..kHSSSSSSHk..",
  "..kSSSSSSSSk..",
  "..kSeSSSSeSk..",
  "..kSSSSdSSSk..",
  "..kSSmmmmSSk..",
  "...kSSSSSSk...",
  "....kSSSSk....",
  "...kTTttTTk...",
  "..kTTTttTTTkk.",
  ".kTkTTttTTTSk.",
  ".kSkTTttTTkkk.",
  ".kkkTsttsTk...",
  "...kTsttsTk...",
  "..kTTTTTTTTk..",
  "..kbbbbbbbbk..",
  "...kPPPPPPk...",
  "..kPpPkkPpPk..",
  ".kPpPk..kPpPk.",
  ".kPpPk..kPpPk.",
  ".kOOOk..kOOOk.",
  "kOOOOk..kOOOOk",
], HUGO);
const PEN_S = build("PEN",[
  "....HHHHHH....","...HHHHHHHH...","..HHHHHHHHHH..",".HHHSSSSSSHHH.",
  ".HHSSSSSSSSHH.",".HHSSeSSeSSHH.","..HSSSSSSSSH..","..HSSSmmSSSH..",
  "...SSSSSSSS...","...DDDDDDDD...","..DDDDDDDDDD..",".hDDDDDDDDDDh.",
  ".hDDDDDDDDDDh.","..DDDDDDDDDD..","..DDDddddDDD..",".DDDDDDDDDDDD.",
  ".DDDDDDDDDDDD.","DDDDDDDDDDDDDD",".DDDDDDDDDDDD.","..DDDDDDDDDD..",
  "..DDD....DDD..","...DD....DD...","...OO....OO...","..OOO....OOO..",
], PEN);
// Dr. Hammerstein — wild hair, glasses, lab coat, bow tie, arms out
const HAMMER = build("HAMMER",[
  "..H..H..H..H....","H.HHHHHHHHHH.H..",".HHHHHHHHHHHHH..",
  ".HHHSSSSSSSSHH..",".HHSSSSSSSSSSH..",".HSggSSSSggSSH..",
  ".HSSSSSSSSSSSH..",".HSSSSnnSSSSSH..",".HSSSSmmmmSSH..",
  "..SSSSSSSSSSS...","..ScccccccccS...","h.CCCCtttCCCC.h.",
  "hCCCCCtttCCCCCh.","CCCCCCtttCCCCCC.",".CCCCCCCCCCCC...",
  ".CCCCCCCCCCCC...",".CCCCCccCCCCC...",".CCCCCccCCCCC...",
  ".CCCCCccCCCCC...",".CCCCC..CCCCC...",".CCCC....CCCC...",
  "..PPP....PPP....","..PPP....PPP....","..PPP....PPP....",
  "..OOO....OOO....",".OOOO....OOOO...",
], SCI);
// floating ghost
const GHOST = build("GHOST",[
  "...GGGGGG...","..GGGGGGGG..",".GGGGGGGGGG.",".GGGGGGGGGG.",
  ".GGeeGGeeGG.",".GGeeGGeeGG.",".GGGGGGGGGG.",".GGGGmmGGGG.",
  ".GGGGGGGGGG.",".GGGGGGGGGG.",".GGGGGGGGGG.",".GGGGGGGGGG.",
  ".GG.GG.GG.G.",".G..G..G..G.",
], GHO);
// skittering rat
const RATSPR = build("RATSPR",[
  "..E........E....",".EBE......EBE...",".bBBb....bBBbW..",
  ".BBBBBBBBBBBeWW.","bBBBBBBBBBBBBWWW","bBBBBBBBBBBBBb..",
  "..bb..bb..bb....","..OO..OO..OO....",
], RAT);

[["HUGO_A",HUGO_A],["HUGO_B",HUGO_B],["PEN",PEN_S],["HAMMER",HAMMER],
 ["GHOST",GHOST],["RATSPR",RATSPR]].forEach(([n,h])=>emit(n,h));

/* ---- preview montage ---- */
const S=7, GAP=14, items=[HUGO_A,HUGO_B,PEN_S,HAMMER,GHOST,RATSPR];
const totW=items.reduce((a,m)=>a+m[0].length*S+GAP,GAP);
const maxH=Math.max(...items.map(m=>m.length))*S+GAP*2;
const f=Frame(totW,maxH); f.rect(0,0,totW,maxH,3); f.dither(0,0,totW,maxH,3,11);
let ox=GAP;
for(const m of items){ const by=maxH-GAP-m.length*S;
  for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++){ const ch=m[y][x]; if(ch===".")continue;
    f.rect(ox+x*S,by+y*S,S,S,parseInt(ch,16)); }
  ox+=m[0].length*S+GAP; }
const outPath=process.argv[2]||path.join(__dirname,"sprites_preview.png");
fs.writeFileSync(outPath,encodePNG(f));
console.log("// preview -> "+outPath);
