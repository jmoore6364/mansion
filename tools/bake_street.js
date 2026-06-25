/* Bakes art/street.png — a richer, dithered EGA street scene aligned to the
   street room's hotspots. Demonstrates the painted-background pipeline. This is
   only a starter: repaint it in editor.html and re-export over this file.
   Run: node tools/bake_street.js                                            */
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const W = 320, H = 200;
const EGA = [
  [0,0,0],[0,0,170],[0,170,0],[0,170,170],
  [170,0,0],[170,0,170],[170,85,0],[170,170,170],
  [85,85,85],[85,85,255],[85,255,85],[85,255,255],
  [255,85,85],[255,85,255],[255,255,85],[255,255,255]
];
const buf = new Uint8Array(W*H*4); // RGBA, starts transparent
function px(x,y,c){ x|=0; y|=0; if(x<0||y<0||x>=W||y>=H) return;
  const i=(y*W+x)*4, e=EGA[c]; buf[i]=e[0]; buf[i+1]=e[1]; buf[i+2]=e[2]; buf[i+3]=255; }
function rect(x,y,w,h,c){ for(let j=0;j<h;j++) for(let i=0;i<w;i++) px(x+i,y+j,c); }
function dither(x,y,w,h,c1,c2){ for(let j=0;j<h;j++) for(let i=0;i<w;i++) px(x+i,y+j, ((i+j)&1)?c1:c2); }
function line(x0,y0,x1,y1,c){ let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;
  for(;;){ px(x0,y0,c); if(x0===x1&&y0===y1)break; const e2=2*e; if(e2>=dy){e+=dy;x0+=sx;} if(e2<=dx){e+=dx;y0+=sy;} } }

// --- sky: banded gradient with dithering (black -> dark blue -> blue) ---
rect(0,0,W,120,1);
dither(0,0,W,30, 0,1);          // deep top
dither(0,30,W,30, 1,0);
dither(0,84,W,36, 1,9);         // brighter near horizon
// stars
[[30,16],[70,28],[120,12],[200,22],[300,18],[160,34],[244,8]].forEach(([x,y])=>px(x,y,15));
// --- moon with soft glow (aligned to hotspot ~250,14) ---
for(let j=-2;j<24;j++) for(let i=-2;i<26;i++){
  const dx=i-11,dy=j-11,d=dx*dx+dy*dy;
  if(d<150) px(255+i,16+j, d<120?15:7);
}
rect(268,14,7,7,9); rect(263,28,5,5,9);  // craters / clouds

// --- shop facade: dithered brick (brown over dark) ---
rect(60,40,200,80,6);
dither(60,40,200,80, 6,8);
for(let y=40;y<118;y+=8) line(60,y,259,y,8);          // mortar rows
for(let x=60;x<260;x+=16) line(x,40,x,118,8);          // mortar cols
// gable roof
for(let i=0;i<40;i++){ line(160-i,40-i? (40-i):40, 160, 40, 0); }
for(let i=0;i<70;i++) px(90+i,40,0);

// --- sign board (hotspot 96,30,128,16) ---
rect(94,28,132,18,0); rect(96,30,128,14,8);
// crude lettering in yellow
const sign="YE OLDE ANTIQUES"; // baked decorative, real text drawn by engine over it if desired
for(let i=0;i<sign.length;i++){ if(sign[i]!==" ") rect(100+i*8,34,5,6,14); }

// --- window (left) with warm glow + cross frame ---
dither(76,64,48,36, 6,14);
rect(78,66,44,32,0);
dither(78,66,44,32, 14,6);
line(100,66,100,98,0); line(78,82,122,98? 82:82,0); line(78,82,122,82,0);
rect(104,70,14,10,12);     // a lurking shape

// --- door (hotspot 150,72,40,60) ---
rect(150,72,40,48,8);
rect(152,74,36,44,6);
dither(152,74,36,44, 6,8);
line(170,74,170,118,0);
rect(182,94,4,4,14);       // knob
rect(154,78,14,16,0); rect(172,78,14,16,0); // panels

// --- welcome mat (hotspot 148,120,44,16) ---
rect(150,124,40,8,4);
dither(150,124,40,8, 4,12);

// --- cobblestone ground: fog-lightened gradient + stones ---
rect(0,120,W,80,8);
dither(0,120,W,14, 8,7);   // fog band where ground meets wall
for(let y=124;y<H;y+=10) for(let x=(y%20);x<W;x+=20){ rect(x,y,9,3,7); px(x,y,15); }
dither(0,184,W,16, 8,0);   // darker foreground

// --- gas lamp (hotspot 18,58,24,64) ---
rect(28,70,4,52,0);
rect(20,64,20,10,14); rect(24,60,12,6,0);
for(let r=0;r<10;r++) for(let a=0;a<24;a++){ // glow halo
  const x=30+Math.cos(a/24*6.28)*r, y=69+Math.sin(a/24*6.28)*r;
  if(r>6 && ((x+y)&1)) px(x,y,14);
}

/* ---------------- encode PNG ---------------- */
function crc32(buf){
  let c=~0;
  for(let i=0;i<buf.length;i++){ c^=buf[i]; for(let k=0;k<8;k++) c=(c>>>1)^(0xEDB88320&-(c&1)); }
  return (~c)>>>0;
}
function chunk(type,data){
  const len=Buffer.alloc(4); len.writeUInt32BE(data.length,0);
  const t=Buffer.from(type,"ascii");
  const body=Buffer.concat([t,data]);
  const crc=Buffer.alloc(4); crc.writeUInt32BE(crc32(body),0);
  return Buffer.concat([len,body,crc]);
}
const sig=Buffer.from([137,80,78,71,13,10,26,10]);
const ihdr=Buffer.alloc(13);
ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4);
ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0; // 8-bit RGBA
// raw scanlines, filter 0 per row
const raw=Buffer.alloc(H*(1+W*4));
for(let y=0;y<H;y++){
  raw[y*(1+W*4)]=0;
  buf.subarray(y*W*4,(y+1)*W*4).forEach((v,i)=>{ raw[y*(1+W*4)+1+i]=v; });
}
const idat=zlib.deflateSync(raw,{level:9});
const png=Buffer.concat([sig,chunk("IHDR",ihdr),chunk("IDAT",idat),chunk("IEND",Buffer.alloc(0))]);
const outDir=path.join(__dirname,"..","art");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"street.png"),png);
console.log("Wrote art/street.png ("+png.length+" bytes)");
