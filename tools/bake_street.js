/* Bakes art/street.png — a Hugo-style haunted antique shop: bold flat EGA fills
   with clean BLACK OUTLINES (the Hugo hallmark), a tall two-storey facade with a
   red shingled roof + dormer, upper windows (one with glowing eyes), a glowing
   storefront, a red panelled door with a jack-o'-lantern, a gnarled tree, the
   moon + a bat, an ornate gas lamp, and cobblestones. Aligned to the street
   room's hotspots.  Run: node tools/bake_street.js                            */
const fs = require("fs");
const path = require("path");
const { Frame, encodePNG } = require("./pnglib");
const W = 320, H = 200;
const f = Frame(W, H);
const R = (x,y,w,h,c)=>f.rect(x,y,w,h,c);
const L = (x0,y0,x1,y1,c)=>f.line(x0,y0,x1,y1,c);
const P = (x,y,c)=>f.px(x,y,c);
// filled rect with a 1px outline
function box(x,y,w,h,fill,ln){ R(x,y,w,h,fill);
  R(x,y,w,1,ln); R(x,y+h-1,w,1,ln); R(x,y,1,h,ln); R(x+w-1,y,1,h,ln); }

const GY = 152;                                   // ground line
R(0,0,W,GY,0);                                    // pure black night sky

/* ---------------- moon + bat ---------------- */
const mx=262,my=24,mr=13;
for(let j=-mr-2;j<=mr+2;j++)for(let i=-mr-2;i<=mr+2;i++){      // faint halo
  const d=i*i+j*j; if(d>mr*mr && d<=(mr+2)*(mr+2) && ((mx+i+my+j)&1)) P(mx+i,my+j,6); }
for(let j=-mr;j<=mr;j++)for(let i=-mr;i<=mr;i++){ if(i*i+j*j<=mr*mr) P(mx+i,my+j,14); }
R(mx-6,my-4,4,4,6); R(mx+3,my+2,5,5,6); R(mx-2,my+6,3,3,6);    // craters
// bat crossing the moon (black on yellow = readable)
const bx=mx-3,by=my-2; R(bx,by,3,2,0);
L(bx,by,bx-5,by-3,0); L(bx-5,by-3,bx-8,by-1,0);
L(bx+3,by,bx+8,by-3,0); L(bx+8,by-3,bx+11,by-1,0);

/* ---------------- gnarled tree (right) ---------------- */
(()=>{
  const tx=288;
  box(tx-4,86,10,66,6,0);                         // trunk
  R(tx-2,88,2,62,8);                              // trunk shading
  L(tx-4,110,tx-16,96,6); L(tx-16,96,tx-22,86,6); // low branch
  L(tx+6,104,tx+18,92,6);
  // canopy: outlined green mass with light-green dapples
  for(let j=0;j<54;j++)for(let i=0;i<92;i++){
    const x=tx-44+i, y=18+j, dx=(i-46)/46, dy=(j-27)/27;
    if(dx*dx+dy*dy<=1){ P(x,y, ((x*3+y*5)%9<2)?10:2); }
  }
  // outline the canopy edge
  for(let a=0;a<360;a+=4){ const x=tx+2+Math.cos(a*Math.PI/180)*46, y=45+Math.sin(a*Math.PI/180)*27; P(x|0,y|0,0); }
})();

/* ---------------- house facade ---------------- */
const BX=44, BW=176, WALLT=66;                    // wall box top
box(BX,WALLT,BW,GY-WALLT,6,0);                    // two-storey wall
for(let y=WALLT+7;y<GY;y+=8) R(BX+1,y,BW-2,1,8);  // clapboard courses
R(BX+1,WALLT+1,2,GY-WALLT-2,8); R(BX+BW-3,WALLT+1,2,GY-WALLT-2,8); // corner boards

/* roof: red triangle with shingle courses + outline */
const apx=BX+BW/2, apy=28, eL=BX-8, eR=BX+BW+8, eY=WALLT;
for(let y=apy;y<=eY;y++){
  const t=(eY-y)/(eY-apy);
  const lx=Math.round(eL+(apx-eL)*t), rx=Math.round(eR+(apx-eR)*t);
  for(let x=lx;x<=rx;x++) P(x,y, ((y-apy)%8<4)?4:12);   // shingle courses
}
for(let y=apy;y<=eY;y++){                           // slope outlines
  const t=(eY-y)/(eY-apy);
  P(Math.round(eL+(apx-eL)*t),y,0); P(Math.round(eR+(apx-eR)*t),y,0);
}
R(eL,eY,eR-eL,2,0); R(eL,eY-1,eR-eL,1,12);          // eave + highlight
// dormer (haunted attic) centered in the roof
box(apx-15,42,30,24,6,0);
for(let i=0;i<=15;i++){ P(apx-15+i,42-Math.round(i*0.8),0); P(apx+15-i,42-Math.round(i*0.8),0); R(apx-15+i,42-Math.round(i*0.8),30-2*i,1,4); } // little red gable
box(apx-9,50,18,14,0,0);                            // dark attic window
P(apx-4,55,12); P(apx-3,55,12); P(apx+3,55,12); P(apx+4,55,12); // glowing eyes
R(apx-3,59,6,1,4);                                  // sinister mouth

/* upper-storey windows */
function lit(x,y,w,h){ box(x,y,w,h,0,0); f.dither(x+2,y+2,w-4,h-4,14,6);
  L(x+w/2,y+1,x+w/2,y+h-2,0); L(x+1,y+h/2,x+w-2,y+h/2,0); R(x-1,y+h,w+2,2,8); }
function eyes(x,y,w,h){ box(x,y,w,h,0,0); R(x+2,y+2,w-4,h-4,8);
  R(x+4,y+5,4,4,12); R(x+w-8,y+5,4,4,12); R(x+5,y+h-5,w-10,1,4); R(x-1,y+h,w+2,2,8); }
eyes(58,72,34,24);                                  // left window: glowing eyes
lit(166,72,34,24);                                  // right window: warm glow

/* marquee shop sign over the storefront (text drawn by over()) */
box(50,100,150,9,0,0); R(52,101,146,1,8);
R(56,109,4,3,8); R(192,109,4,3,8);                  // mounting brackets

/* ground-floor display window (left) */
box(54,124,62,26,0,0); f.dither(57,127,56,20,14,6);
L(85,125,85,149,0); L(56,137,114,137,0);            // panes
R(66,130,12,16,8); R(94,134,10,12,8);               // antique silhouettes
P(70,132,12); P(98,136,11);                         // glints
R(54,150,62,2,8);                                   // sill

/* red panelled door (hotspot 150,110,40,42) */
box(148,108,44,44,4,0);
box(152,112,16,16,4,0); box(172,112,16,16,4,0);     // upper panels
box(152,130,16,18,4,0); box(172,130,16,18,4,0);     // lower panels
R(150,110,2,40,12); R(188,110,2,40,0);              // bevels
box(166,98,8,12,0,0); f.dither(167,99,6,10,14,6);   // transom window
R(184,128,3,4,14);                                  // brass knob
R(146,150,48,4,7); R(146,154,48,2,8);               // stone step
// jack-o'-lantern by the door (a Hugo nod)
box(126,138,14,12,6,0); R(131,135,3,4,2);           // pumpkin + stem
P(129,142,0); P(130,142,0); P(135,142,0); P(136,142,0); // eyes
R(129,146,8,1,0); P(130,145,0); P(135,145,0);       // grin
for(let i=-9;i<=9;i++)for(let j=0;j<4;j++) if((i+j)&1 && Math.abs(i)<9-j) P(133+i,150+j,14); // glow on ground

/* ---------------- gas lamp (left, hotspot 18..42) ---------------- */
box(28,74,6,76,8,0); R(29,75,1,74,7);               // post
R(22,148,18,4,8); R(22,152,18,2,0);                 // base
for(let j=-12;j<=12;j++)for(let i=-12;i<=12;i++){ const d=i*i+j*j;
  if(d>40 && d<=140 && ((31+i+62+j)&1)) P(31+i,62+j,14); } // halo
box(23,54,16,18,0,0); f.dither(25,56,12,14,14,15);  // lantern + flame
R(26,50,10,4,8); R(29,46,4,5,8);                    // cap + finial
for(let i=-12;i<=12;i++)for(let j=0;j<5;j++) if((i+j)&1 && Math.abs(i)<12-j*2) P(31+i,150+j,14);

/* ---------------- cobblestone street ---------------- */
R(0,GY,W,H-GY,8);
for(let k=0;k<3;k++) f.dither(0,GY+k,W,1,7,8);      // fog at the base
for(let y=GY+6, rr=0; y<H; y+=10, rr++){
  const sw=11+rr*2, off=(rr&1)?(sw>>1):0;
  for(let x=-sw;x<W;x+=sw+3){ const cx=x+off;
    for(let j=0;j<8;j++)for(let i=0;i<sw;i++){
      const dx=i-sw/2, dy=j-4;
      if(dx*dx/((sw/2)*(sw/2))+dy*dy/16<=1){
        P(cx+i,y+j, j<2?7 : (j>6?0:8)); }
    }
  }
}
R(0,H-4,W,4,0);

const outDir=path.join(__dirname,"..","art");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"street.png"), encodePNG(f));
console.log("Wrote art/street.png ("+encodePNG(f).length+" bytes)");
