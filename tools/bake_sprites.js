/* Designs the larger 12x24 hero/heroine sprites in the editor's hex format and
   prints ready-to-paste JS arrays. Authoring is done with a readable letter
   template + per-sprite color map; output is hex-per-pixel for drawHexSprite().
   Run: node tools/bake_sprites.js                                            */
const HEX = "0123456789ABCDEF";
function build(name, rows, map){
  const W = Math.max(...rows.map(r=>r.length));
  const out = rows.map(r=>{
    r = r.padEnd(W, ".");
    let s="";
    for(const ch of r){ s += ch==="." ? "." : HEX[map[ch]]; }
    return s;
  });
  // sanity: rectangular
  if(new Set(out.map(r=>r.length)).size!==1) throw new Error(name+": ragged rows");
  const body = out.map(r=>'  "'+r+'"').join(",\n");
  return `const ${name} = [\n${body}\n];`;
}

/* legend:
   H hair  S skin/face  e eye  m mouth
   T shirt  t tie  h hand  P pants  O shoe
   D dress  d dress-shade                                                    */
const HUGO_COL = { H:6, S:12, e:0, m:4, T:7, t:4, h:12, P:1, O:0 };
const PEN_COL  = { H:14, S:12, e:0, m:4, D:13, d:5, h:12, O:0 };

const HUGO_A = [
  "............",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HSSSSSSH..",
  "..HSSSSSSH..",
  "..HSeSSeSH..",
  "..HSSSSSSH..",
  "..HSSmmSSH..",
  "...SSSSSS...",
  "...TTTTTT...",
  "..TTTttTTT..",
  ".hTTTttTTTh.",
  ".hTTTttTTTh.",
  ".hTTTttTTTh.",
  "..TTTttTTT..",
  "..TTTTTTTT..",
  "..PPPPPPPP..",
  "..PPPPPPPP..",
  "..PPP..PPP..",
  "..PPP..PPP..",
  "..PPP..PPP..",
  "..PPP..PPP..",
  "..OOO..OOO..",
  ".OOOO..OOOO."
];
const HUGO_B = [
  "............",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HSSSSSSH..",
  "..HSSSSSSH..",
  "..HSeSSeSH..",
  "..HSSSSSSH..",
  "..HSSmmSSH..",
  "...SSSSSS...",
  "...TTTTTT...",
  "..TTTttTTT..",
  ".hTTTttTTTh.",
  ".hTTTttTTTh.",
  ".hTTTttTTTh.",
  "..TTTttTTT..",
  "..TTTTTTTT..",
  "..PPPPPPPP..",
  "..PPPPPPPP..",
  "...PPPPPP...",
  "...PP..PP...",
  "...PP..PP...",
  "...PP..PP...",
  "...OO..OO...",
  "..OOO..OOO.."
];
const PEN = [
  "............",
  "...HHHHHH...",
  "..HHHHHHHH..",
  ".HHSSSSSSHH.",
  ".HHSSSSSSHH.",
  "..HSeSSeSH..",
  "..HSSSSSSH..",
  "..HSSmmSSH..",
  "...SSSSSS...",
  "...DDDDDD...",
  "..DDDDDDDD..",
  ".hDDDDDDDDh.",
  ".hDDDDDDDDh.",
  "..DDDDDDDD..",
  "..DDDddDDD..",
  ".DDDDddDDDD.",
  ".DDDDDDDDDD.",
  ".DDDDDDDDDD.",
  ".DDDDDDDDDD.",
  "..DDDDDDDD..",
  "..DDD..DDD..",
  "...D....D...",
  "...O....O...",
  "..OO....OO.."
];

console.log(build("HUGO_A", HUGO_A, HUGO_COL));
console.log(build("HUGO_B", HUGO_B, HUGO_COL));
console.log(build("PEN",    PEN,    PEN_COL));
