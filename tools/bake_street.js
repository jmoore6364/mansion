/* Bakes art/street.png — a Hugo-style haunted antique shop street: bold flat
   EGA fills with clean BLACK OUTLINES. Two-storey clapboard facade with a
   scalloped red roof, brick chimney with smoke, a haunted dormer, teal-shuttered
   windows (one pair of glowing eyes), a marquee sign, a red panelled door with a
   jack-o'-lantern, a stone foundation, a gnarled speckle-canopy tree behind a
   picket fence, the moon + a bat, an ornate gas lamp, and cobblestones.
   Aligned to the street room's hotspots.  Run: node tools/bake_street.js      */
const fs = require("fs");
const path = require("path");
const { Frame, encodePNG } = require("./pnglib");
const W = 320, H = 200;
const f = Frame(W, H);
const R = (x,y,w,h,c)=>f.rect(x,y,w,h,c);
const L = (x0,y0,x1,y1,c)=>f.line(x0,y0,x1,y1,c);
const P = (x,y,c)=>f.px(x,y,c);
function box(x,y,w,h,fill,ln){ R(x,y,w,h,fill);
  R(x,y,w,1,ln); R(x,y+h-1,w,1,ln); R(x,y,1,h,ln); R(x+w-1,y,1,h,ln); }
// deterministic pseudo-random so the bake is reproducible
let seed=7; const rnd=()=>((seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff);

const GY = 152;                                   // ground line
R(0,0,W,GY,0);                                    // black night sky

/* ---------------- stars ---------------- */
const stars=[[60,26],[110,10],[150,16],[196,18],[226,8],[248,26],[40,46],[88,38],[135,40]];
for(const [sx,sy] of stars){ P(sx,sy,sy<20?15:7); if(sy<14){P(sx+1,sy,7);P(sx-1,sy,7);} }

/* ---------------- moon (top-left, clear of the tree) + bat ---------------- */
const mx=22,my=22,mr=12;
for(let j=-mr-2;j<=mr+2;j++)for(let i=-mr-2;i<=mr+2;i++){
  const d=i*i+j*j; if(d>mr*mr && d<=(mr+2)*(mr+2) && ((mx+i+my+j)&1)) P(mx+i,my+j,6); }
for(let j=-mr;j<=mr;j++)for(let i=-mr;i<=mr;i++){ if(i*i+j*j<=mr*mr) P(mx+i,my+j,14); }
R(mx-5,my-4,4,4,6); R(mx+3,my+2,4,4,6); R(mx-2,my+6,3,3,6);   // craters
const bx=mx+7,by=my-4; R(bx,by,3,2,0);                        // bat silhouette
L(bx,by,bx-5,by-3,0); L(bx-5,by-3,bx-8,by-1,0);
L(bx+3,by,bx+8,by-3,0); L(bx+8,by-3,bx+11,by-1,0);

/* ---------------- gnarled tree (right, behind the fence) ---------------- */
const tips=[];
function branch(x,y,ang,len,wdt){
  if(len<4){ tips.push([x,y]); return; }
  const nx=x+Math.cos(ang)*len, ny=y-Math.sin(ang)*len;
  const steps=Math.ceil(len*1.5);
  for(let s=0;s<=steps;s++){ const t=s/steps, px=x+(nx-x)*t, py=y+(ny-y)*t;
    for(let dw=0;dw<wdt;dw++) P((px+dw-wdt/2)|0, py|0, wdt>2?6:8); }
  const wob=(rnd()-0.5)*0.3;
  branch(nx,ny, ang+0.45+wob, len*0.68, Math.max(1,wdt-1));
  branch(nx,ny, ang-0.5+wob,  len*0.7,  Math.max(1,wdt-1));
  if(len>12) branch(nx,ny, ang+wob*0.5, len*0.55, Math.max(1,wdt-1));
}
// trunk: tapered, with bark shading and root flare
for(let y=GY; y>96; y--){
  const t=(GY-y)/(GY-96), wdt=Math.round(10-6*t), cx=282+Math.round(Math.sin(t*3)*2);
  for(let i=0;i<wdt;i++) P(cx-(wdt>>1)+i, y, i===0?0 : (i===wdt-1?0 : (i===1?8:6)));
}
for(let i=0;i<8;i++){ P(274+i,GY-1,6); P(284+i,GY-1,6); } // root flare
branch(282,98, 1.45, 20, 3);
branch(280,116, 2.5, 12, 2);                             // low left bough
branch(286,112, 0.6, 12, 2);                             // low right bough
// airy speckled canopy around the branch tips (Hugo-style dappled leaves)
for(const [tx,ty] of tips){
  const n=26+((rnd()*20)|0);
  for(let k=0;k<n;k++){
    const a=rnd()*6.283, r=rnd()*9;
    const lx=(tx+Math.cos(a)*r*1.4)|0, ly=(ty+Math.sin(a)*r)|0;
    if(ly>10 && ly<126 && lx>236) P(lx,ly, rnd()<0.3?10:2);
  }
}
// hanging willow strands off the canopy underside
for(let s=0;s<14;s++){
  const sx=246+((rnd()*66)|0), sy=64+((rnd()*26)|0), len=6+((rnd()*12)|0);
  for(let j=0;j<len;j++) if((j&1)===0) P(sx, sy+j, j<len-3?2:10);
}

/* ---------------- house facade ---------------- */
const BX=44, BW=176, WALLT=66;
box(BX,WALLT,BW,GY-WALLT,6,0);                    // clapboard wall
for(let y=WALLT+7;y<GY-6;y+=8) R(BX+1,y,BW-2,1,8);
R(BX+2,WALLT+1,2,GY-WALLT-2,8); R(BX+BW-4,WALLT+1,2,GY-WALLT-2,8); // corner trim
// stone foundation course
box(BX-2,GY-7,BW+4,7,8,0);
for(let x=BX+2;x<BX+BW-4;x+=14){ box(x,GY-6,12,5,8,0); P(x+2,GY-5,7); }

/* roof: scalloped red shingles with outline */
const apx=BX+BW/2, apy=28, eL=BX-8, eR=BX+BW+8, eY=WALLT;
for(let y=apy;y<=eY;y++){
  const t=(eY-y)/(eY-apy);
  const lx=Math.round(eL+(apx-eL)*t), rx=Math.round(eR+(apx-eR)*t);
  const course=((y-apy)%6);
  for(let x=lx;x<=rx;x++){
    let c=4;
    if(course===0) c=12;                                   // course highlight
    else if(course===5 && ((x+((y/6|0)&1)*4)%8<2)) c=8;    // scallop notch
    P(x,y,c);
  }
}
for(let y=apy;y<=eY;y++){ const t=(eY-y)/(eY-apy);
  P(Math.round(eL+(apx-eL)*t),y,0); P(Math.round(eR+(apx-eR)*t),y,0); }
R(eL,eY,eR-eL,2,0); R(eL,eY-1,eR-eL,1,12);
// brick chimney on the right slope, with drifting smoke
box(178,26,16,24,4,0);
for(let y=30;y<48;y+=4) R(179,y,14,1,8);
P(184,34,8); P(187,42,8);
box(176,22,20,5,8,0);                                     // cap
for(let s=0;s<3;s++){ const sx=184+s*3, sy=16-s*5;        // smoke curls
  P(sx,sy,8); P(sx+1,sy,7); P(sx+2,sy-1,8); P(sx-1,sy-1,8); }
// haunted dormer with scalloped mini-gable
box(apx-15,44,30,22,6,0);
for(let i=0;i<=16;i++){ const gy=44-Math.round(i*0.7);
  R(apx-16+i,gy,32-2*i,1, (gy%4===0)?12:4); }
L(apx-16,44,apx,32,0); L(apx+16,44,apx,32,0);
box(apx-9,50,18,14,0,0);
P(apx-4,55,12); P(apx-3,55,12); P(apx+3,55,12); P(apx+4,55,12); // glowing eyes
R(apx-3,59,6,1,4);

/* upper windows with teal shutters */
function shutters(x,y,w,h){
  box(x-7,y,7,h,3,0); box(x+w,y,7,h,3,0);
  for(let sy=y+3;sy<y+h-2;sy+=3){ R(x-5,sy,3,1,0); R(x+w+2,sy,3,1,0); }
}
function lit(x,y,w,h){ box(x,y,w,h,0,0); f.dither(x+2,y+2,w-4,h-4,14,6);
  L(x+(w>>1),y+1,x+(w>>1),y+h-2,0); L(x+1,y+(h>>1),x+w-2,y+(h>>1),0); R(x-1,y+h,w+2,2,8); }
function eyes(x,y,w,h){ box(x,y,w,h,0,0); R(x+2,y+2,w-4,h-4,8);
  R(x+4,y+5,4,4,12); R(x+w-8,y+5,4,4,12); R(x+5,y+h-5,w-10,1,4); R(x-1,y+h,w+2,2,8); }
shutters(58,72,34,24); eyes(58,72,34,24);
shutters(166,72,34,24); lit(166,72,34,24);

/* marquee shop sign (text drawn by over()) */
box(50,100,150,9,0,0); R(52,101,146,1,8);
R(56,109,4,3,8); R(192,109,4,3,8);

/* ground-floor display window */
box(54,124,62,26,0,0); f.dither(57,127,56,20,14,6);
L(85,125,85,149,0); L(56,137,114,137,0);
R(66,130,12,16,8); R(94,134,10,12,8);
P(70,132,12); P(98,136,11);
R(54,150,62,2,8);

/* red panelled door */
box(148,108,44,44,4,0);
box(152,112,16,16,4,0); box(172,112,16,16,4,0);
box(152,130,16,18,4,0); box(172,130,16,18,4,0);
R(150,110,2,40,12); R(188,110,2,40,0);
box(166,98,8,12,0,0); f.dither(167,99,6,10,14,6);
R(184,128,3,4,14); P(185,129,15);
R(146,150,48,4,7); R(146,154,48,2,8);
// jack-o'-lantern
box(126,138,14,12,6,0); R(131,135,3,4,2);
P(129,142,0); P(130,142,0); P(135,142,0); P(136,142,0);
R(129,146,8,1,0); P(130,145,0); P(135,145,0);

/* ---------------- gas lamp ---------------- */
box(28,74,6,76,8,0); R(29,75,1,74,7);
R(22,148,18,4,8); R(22,152,18,2,0);
for(let j=-12;j<=12;j++)for(let i=-12;i<=12;i++){ const d=i*i+j*j;
  if(d>40 && d<=140 && ((31+i+62+j)&1)) P(31+i,62+j,14); }
box(23,54,16,18,0,0); f.dither(25,56,12,14,14,15);
R(26,50,10,4,8); R(29,46,4,5,8);

/* ---------------- cobblestone street ---------------- */
R(0,GY,W,H-GY,8);
for(let k=0;k<3;k++) f.dither(0,GY+k,W,1,7,8);
for(let y=GY+6, rr=0; y<H; y+=10, rr++){
  const sw=11+rr*2, off=(rr&1)?(sw>>1):0;
  for(let x=-sw;x<W;x+=sw+3){ const cx=x+off;
    for(let j=0;j<8;j++)for(let i=0;i<sw;i++){
      const dx=i-sw/2, dy=j-4;
      if(dx*dx/((sw/2)*(sw/2))+dy*dy/16<=1) P(cx+i,y+j, j<2?7:(j>6?0:8));
    }
  }
}
R(0,H-4,W,4,0);
// pool of lamplight on the cobbles (after the ground so it survives)
for(let i=-12;i<=12;i++)for(let j=0;j<5;j++) if((i+j)&1 && Math.abs(i)<12-j*2) P(31+i,GY+j,14);

/* ---------------- picket fence (in front of the tree) ---------------- */
function fence(x0,x1){
  R(x0,132,x1-x0,3,6); R(x0,132,x1-x0,1,14); R(x0,134,x1-x0,1,0);   // upper rail
  R(x0,143,x1-x0,3,6); R(x0,143,x1-x0,1,14); R(x0,145,x1-x0,1,0);   // lower rail
  for(let x=x0;x<x1-4;x+=9){
    box(x,126,6,26,6,0); f.dither(x+1,128,4,23,6,4);
    P(x+1,126,0); P(x+4,126,0); P(x+2,125,0); P(x+3,125,0);          // picket point
    R(x+2,124,2,1,0);
  }
}
fence(232,320);

/* ---------------- write ---------------- */
const outDir=path.join(__dirname,"..","art");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"street.png"), encodePNG(f));
console.log("Wrote art/street.png ("+encodePNG(f).length+" bytes)");
