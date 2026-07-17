/* Bakes Hugo-style painted backgrounds for the interior rooms into
   art/<room>.png. Bold flat EGA fills with clean BLACK OUTLINES and real
   object detail, matching the street's look. Object positions match the
   room's over() in index.html so the animated/flag-dependent bits (flames,
   coil, Hammerstein, the coin, the open clock/gate, the lantern, the glass
   case) still land correctly on top. Only static layers are baked here.
   Run: node tools/bake_rooms.js                                              */
const fs = require("fs");
const path = require("path");
const { Frame, encodePNG } = require("./pnglib");
const W = 320, H = 200;
const outDir = path.join(__dirname, "..", "art");
fs.mkdirSync(outDir, { recursive: true });

// ---- shared helpers ----
function H_(f){
  const o = {
    R:(x,y,w,h,c)=>f.rect(x,y,w,h,c),
    P:(x,y,c)=>f.px(x,y,c),
    L:(x0,y0,x1,y1,c)=>f.line(x0,y0,x1,y1,c),
    D:(x,y,w,h,a,b)=>f.dither(x,y,w,h,a,b),
    box(x,y,w,h,fill,ln){ f.rect(x,y,w,h,fill);
      f.rect(x,y,w,1,ln); f.rect(x,y+h-1,w,1,ln); f.rect(x,y,1,h,ln); f.rect(x+w-1,y,1,h,ln); },
    // offset stone blocks with mortar outlines + per-block shading
    stone(x,y,w,h,base,light,mortar){
      o.R(x,y,w,h,base);
      for(let yy=y,row=0; yy<y+h; yy+=12,row++){
        const off=(row&1)?-13:0;
        for(let xx=x+off; xx<x+w; xx+=26){
          o.box(Math.max(x,xx),yy,Math.min(26,x+w-xx),Math.min(12,y+h-yy),
                ((xx*5+row*7)%9<2)?light:base, mortar);
        }
      }
      o.R(x,y,w,1,mortar); o.R(x,y,1,h,mortar);
    },
    // wooden steps (dir +1 = up to the right edge, -1 = down)
    stepsUp(x,y,w,n,c,ln){ for(let i=0;i<n;i++){ const sy=y+i*((/*span*/0)); } },
    glassPanes(x,y,w,h,glow){ o.box(x,y,w,h,0,0); o.D(x+2,y+2,w-4,h-4,glow[0],glow[1]);
      for(let gx=x+ (w>>2); gx<x+w-2; gx+=(w>>2)) o.L(gx,y+1,gx,y+h-2,0);
      for(let gy=y+(h>>1); gy<y+h-2; gy+=(h>>1)) o.L(x+1,gy,x+w-2,gy,0); }
  };
  return o;
}
function save(name, f){ fs.writeFileSync(path.join(outDir, name+".png"), encodePNG(f)); console.log("art/"+name+".png"); }

/* ===================== SHOP ===================== */
(() => {
  const f = Frame(W,H), h = H_(f);
  h.R(0,0,W,160,6); h.D(0,0,W,160,6,8);                 // warm wood wall
  h.R(0,128,W,32,8); h.R(0,128,W,2,0);                  // wainscot band
  for(let x=0;x<W;x+=24) h.L(x,128,x,158,0);            // wainscot panels
  h.R(0,10,W,2,8);                                      // picture rail
  // floorboards with grain
  h.R(0,160,W,40,6); h.R(0,160,W,2,0);
  for(let x=0;x<W;x+=22) h.L(x,160,x,200,8);
  h.D(0,160,W,4,8,6);
  // EXIT doorway (left)
  h.box(8,96,40,64,0,8); h.box(12,100,32,56,1,0); h.D(12,100,32,56,1,9);
  h.R(6,94,44,3,6);                                     // lintel
  // staircase UP (right) with railing
  h.box(286,40,34,120,0,8);
  for(let i=0;i<7;i++){ h.R(288,150-i*16,30,8,6); h.R(288,150-i*16,30,2,14); h.R(288,158-i*16,30,2,0); }
  h.L(286,150,286,44,8); h.L(300,140,300,52,7);         // banister
  // wall pictures
  h.box(70,24,30,24,14,0); h.box(73,27,24,18,1,0); h.R(78,32,6,6,12);
  h.box(120,22,26,22,6,0); h.box(123,25,20,16,8,0);
  // shelf with clutter (music box spot 238,52 left clear for over())
  h.box(206,66,80,8,6,0); h.R(206,74,80,2,0);           // shelf board + shadow
  h.box(210,46,12,20,2,0); h.R(212,44,8,4,10);          // a green vase
  h.box(264,48,16,18,4,0); h.R(266,46,12,4,12);         // a red urn
  // grandfather clock (closed) — centerpiece
  h.box(150,40,44,118,6,0);
  h.R(150,40,44,6,8); h.R(148,38,48,4,6);               // crown molding
  h.P(170,34,6); h.P(172,32,14);                        // finial
  h.box(156,48,32,30,1,0);                              // face housing
  h.box(160,50,24,24,15,0);                             // clock face
  h.L(172,62,172,53,0); h.L(172,62,180,62,0);           // hands
  for(let a=0;a<12;a++){ const ang=a/12*6.283; h.P(172+Math.cos(ang)*10|0,62+Math.sin(ang)*10|0,0); }
  h.box(158,84,28,68,1,0); h.D(158,84,28,68,1,9);       // pendulum case (glass)
  h.R(170,88,4,48,8); h.box(166,134,12,10,14,0);        // brass pendulum
  // crate
  h.box(60,128,40,32,6,0); h.R(60,128,40,3,14);
  h.L(60,128,100,160,8); h.L(100,128,60,160,8);
  for(let yy=132;yy<158;yy+=8) h.L(62,yy,98,yy,8);      // slats
  // hanging oil lamp on a chain
  for(let y=0;y<16;y+=2) h.P(112,y,7);
  h.box(105,16,15,11,6,0); h.D(107,18,11,7,14,6); h.R(109,27,7,2,0);
  // small book stack on the shelf
  h.box(226,58,10,3,4,0); h.box(227,55,9,3,1,0); h.box(228,52,8,3,2,0);
  // cobwebs
  h.L(0,0,30,30,7); h.L(30,0,0,30,7); h.L(W,0,W-30,30,7);
  for(let i=1;i<6;i++) h.L(i*5,0,0,i*5,8);
  save("shop", f);
})();

/* ===================== UPSTAIRS PARLOR ===================== */
(() => {
  const f = Frame(W,H), h = H_(f);
  h.R(0,0,W,160,5); h.D(0,0,W,160,5,1);                 // damask wall
  for(let y=8;y<128;y+=18) for(let x=8;x<W;x+=22){ h.P(x,y,13); h.P(x+1,y,13); h.P(x,y+1,13); } // motif dots
  h.R(0,120,W,3,6); h.R(0,123,W,1,0);                   // chair rail
  h.R(0,6,W,3,6);                                       // crown molding
  // floor + rug
  h.R(0,160,W,40,6); h.R(0,160,W,2,0);
  for(let x=0;x<W;x+=22) h.L(x,160,x,200,8);
  h.box(96,168,128,28,4,0); h.box(104,172,112,20,12,0); h.D(104,172,112,20,12,4);
  // stairs DOWN (right) + railing
  h.box(286,40,34,120,0,8);
  for(let i=0;i<7;i++){ h.R(288,52+i*16,30,8,6); h.R(288,52+i*16,30,2,14); h.R(288,60+i*16,30,2,0); }
  h.L(300,60,300,150,7);
  // tall arched window with moonlight + drapes
  h.box(40,28,52,76,0,8);
  for(let i=0;i<26;i++){ const yy=28-Math.round(Math.sqrt(26*26-(i-26)*(i-26))*0.0); } // (flat top kept)
  h.box(43,31,46,68,1,0); h.D(45,33,42,52,1,9);         // night sky panes
  for(let gx=43+11;gx<89;gx+=11) h.L(gx,31,gx,99,0);
  for(let gy=31+17;gy<99;gy+=17) h.L(43,gy,89,gy,0);
  h.R(56,40,8,8,15);                                    // a glimpse of moon
  h.box(34,26,8,80,4,0); h.box(90,26,8,80,4,0);         // red drapes
  h.D(34,26,8,80,4,12); h.D(90,26,8,80,4,12);
  // creepy gilt portrait
  h.box(148,32,44,52,14,0); h.box(152,36,36,44,8,0);    // gilt frame
  h.P(150,34,15); h.P(190,34,15); h.P(150,82,15); h.P(190,82,15); // corner glints
  h.box(158,40,24,30,7,0);                              // painted figure (coat)
  h.R(162,42,16,12,12); h.P(166,46,0); h.P(174,46,0); h.R(165,51,10,2,4); // stern face
  // ornate side table (lantern spot 230,96 left clear)
  h.box(210,118,56,10,6,0); h.R(214,114,48,4,14);       // table top + doily
  h.L(218,128,216,158,6); h.L(258,128,260,158,6);       // cabriole legs
  h.L(216,158,224,158,6); h.L(254,158,262,158,6);
  // stone fireplace between the window and the portrait
  h.box(102,102,44,58,8,0);                             // stone surround
  for(let y=106;y<156;y+=10) for(let x=105;x<143;x+=12) h.box(x,y,10,8,8,0);
  h.box(98,98,52,7,6,0); h.R(100,99,48,2,14);           // mantel
  h.box(110,116,28,40,0,0);                             // firebox
  h.D(112,146,24,8,4,12); h.D(116,142,16,4,12,14);      // glowing embers
  h.R(114,152,8,3,6); h.R(126,150,9,3,6);               // charred logs
  h.box(104,90,6,9,14,0); h.box(138,90,6,9,14,0);       // brass candlesticks
  h.P(106,88,12); h.P(140,88,12);                       // little flames
  // attic hatch + dangling pull-cord (leads up to the attic)
  h.box(250,2,30,8,6,0); h.R(252,4,26,2,8);             // hatch outline in the ceiling
  for(let y=10;y<40;y+=2) h.P(264,y,7);                 // cord
  h.box(262,40,5,6,14,0);                               // wooden pull-ring
  // spider dangling from the ceiling
  for(let y=6;y<30;y+=2) h.P(300,y,7);
  h.R(298,30,5,4,0); h.P(297,31,0); h.P(303,31,0);
  h.L(295,34,297,32,0); h.L(305,34,303,32,0); h.L(295,29,297,31,0); h.L(305,29,303,31,0);
  // cobwebs
  h.L(0,0,28,28,7); h.L(28,0,0,28,7); h.L(W,0,W-28,28,7);
  save("upstairs", f);
})();

/* ===================== CATACOMBS (lit) ===================== */
(() => {
  const f = Frame(W,H), h = H_(f);
  h.stone(0,0,W,160,8,7,0);                             // stone-block wall
  h.R(0,160,W,40,8); h.R(0,160,W,2,0);                  // stone floor
  for(let x=0;x<W;x+=40) h.L(x,160,x,200,0);
  h.D(0,160,W,4,0,8);
  // niche skulls in the wall
  for(const nx of [30,300]){ h.box(nx-9,40,18,20,0,8); h.R(nx-5,46,10,8,7); h.P(nx-3,49,0); h.P(nx+2,49,0); }
  // stair UP (left) — lit archway
  h.box(6,90,36,70,0,8);
  for(let i=0;i<6;i++){ h.R(10,150-i*9,28,5,8); h.R(10,150-i*9,28,1,7); }
  h.D(10,92,28,12,14,6);                                // warm light from above
  // torch brackets (flames are dynamic)
  h.box(94,58,8,6,0,0); h.R(96,60,4,18,8);
  h.box(214,58,8,6,0,0); h.R(216,60,4,18,8);
  // stone gargoyle (eyes dynamic at 58,102 / 70,102)
  h.box(50,94,32,26,8,0); h.D(50,94,32,26,8,7);         // head block
  h.L(50,94,44,84,8); h.L(82,94,88,84,8);               // horns
  h.box(46,86,8,9,8,0); h.box(78,86,8,9,8,0);           // ears
  h.R(56,114,20,2,0); h.P(60,116,0); h.P(72,116,0);     // fanged mouth
  h.R(62,108,8,3,0);                                    // brow shadow over eye sockets
  // sarcophagus with carved effigy (coin dynamic at 176,116)
  h.box(118,116,74,44,8,0); h.D(118,116,74,44,8,7);
  h.box(122,120,66,8,7,0);                              // lid rim
  h.box(134,126,30,20,7,0); h.R(140,130,4,5,0); h.R(154,130,4,5,0); h.R(146,138,6,4,0); // skull effigy
  for(let cx=126;cx<186;cx+=2) h.P(cx,158,0);           // base crack
  // barred gate archway (bars/open dynamic)
  h.box(262,76,52,84,0,8);
  for(let i=0;i<14;i++){ h.P(288-i,76-Math.round(Math.sqrt(196-(i*i))*0.0),8); }
  h.box(266,82,44,76,0,0); h.D(266,82,44,76,0,8);       // dark opening
  // rusty chains hanging from the ceiling
  for(const cx of [148,240]){
    for(let y=0;y<34;y+=4){ h.box(cx-1,y,3,3,7,0); h.P(cx,y+3,8); }
    h.L(cx-3,36,cx+3,36,7); h.P(cx,38,7);               // hook
  }
  // scattered bone pile (right of the sarcophagus)
  h.D(206,152,34,8,7,8);
  h.R(208,150,12,2,15); h.R(224,153,10,2,15); h.R(214,156,14,2,7);
  h.P(207,149,15); h.P(220,149,15); h.P(223,152,15); h.P(234,152,15);
  h.box(238,146,10,9,7,0); h.P(240,149,0); h.P(244,149,0);   // stray skull
  // cracks in the floor
  h.L(30,168,44,176,0); h.L(44,176,40,186,0);
  h.L(250,170,262,180,0); h.L(262,180,258,190,0);
  // corner spider web
  for(let i=1;i<6;i++) h.L(W-i*7,0,W,i*7,7);
  h.L(W-30,0,W,30,8);
  save("catacombs", f);
})();

/* ===================== CRYPT ===================== */
(() => {
  const f = Frame(W,H), h = H_(f);
  h.stone(0,0,W,160,1,8,0);                             // cold blue stone
  h.R(0,160,W,40,8); h.R(0,160,W,2,0);
  for(let x=0;x<W;x+=40) h.L(x,160,x,200,0);
  // wall niches with skulls + columns
  for(const nx of [40,280]){ h.box(nx-10,44,20,28,0,8); h.R(nx-6,50,12,10,7); h.P(nx-3,54,0); h.P(nx+3,54,0); h.R(nx-3,64,6,2,0); }
  h.box(96,20,12,140,8,0); h.box(212,20,12,140,8,0);    // columns
  h.D(96,20,12,140,8,1); h.D(212,20,12,140,8,1);
  // west gate (arched)
  h.box(8,92,30,68,0,8); h.D(10,94,26,64,0,8);
  // altar with carvings
  h.box(116,118,88,42,8,0); h.D(116,118,88,42,8,1);
  h.box(120,118,80,5,7,0);                              // altar top
  for(let cx=126;cx<196;cx+=12){ h.box(cx,134,8,18,0,8); }   // carved arches
  // candlestick bases (flames dynamic at 69,112 / 249,112)
  h.box(66,116,12,6,14,0); h.R(70,120,4,30,7); h.R(70,118,4,2,8);
  h.box(246,116,12,6,14,0); h.R(250,120,4,30,7); h.R(250,118,4,2,8);
  // rose window above the altar, leaking moonlight
  for(let j=-16;j<=16;j++)for(let i=-16;i<=16;i++){
    const d=i*i+j*j;
    if(d<=16*16){ h.P(160+i,36+j, d>14*14?0 : (((i+j)&1)?9:1)); }
  }
  for(let a=0;a<8;a++){ const ang=a*Math.PI/4;
    h.L(160,36, 160+Math.cos(ang)*14|0, 36+Math.sin(ang)*14|0, 0); }
  h.R(158,34,5,5,14); h.P(160,36,15);                   // glowing heart
  for(let j=0;j<14;j++){ if(j&1){ h.P(150-j,52+j,9); h.P(170+j,52+j,9); } } // faint beams
  // heraldic banners on the columns
  for(const bx of [96,212]){
    h.box(bx+1,24,10,26,4,0);
    h.P(bx+3,50,4); h.P(bx+5,52,4); h.P(bx+7,50,4);     // swallowtail
    h.R(bx+4,32,4,4,14); h.P(bx+5,38,14);               // gold emblem
  }
  // ornate glass case frame on the altar (inner dynamic)
  h.box(130,68,60,56,14,0); h.box(132,70,56,52,11,0);   // gilt + glass frame
  h.P(130,68,15); h.P(190,68,15); h.P(130,124,15); h.P(190,124,15);
  save("crypt", f);
})();

/* ===================== LAB ===================== */
(() => {
  const f = Frame(W,H), h = H_(f);
  h.R(0,0,W,160,8); h.D(0,0,W,160,8,0);                 // dark metal wall
  for(let y=14;y<150;y+=22) for(let x=10;x<W;x+=22){ h.P(x,y,7); h.P(x+1,y,0); } // rivets
  h.R(0,160,W,40,8); h.R(0,160,W,2,0);                  // metal floor
  for(let x=0;x<W;x+=20) h.L(x,160,x,200,0);
  // pipes along the top
  h.R(0,12,W,5,7); h.R(0,17,W,1,0); for(let x=20;x<W;x+=60){ h.box(x,8,8,14,8,0); }
  // barred window with stormy sky (left of machine)
  h.box(214,28,40,34,0,8); h.box(217,31,34,28,1,0); h.D(217,31,34,28,1,9);
  for(let bx=224;bx<251;bx+=8) h.L(bx,31,bx,58,0);
  h.L(218,30,238,46,11); h.L(238,46,232,52,11);         // a lightning bolt
  // WEST door
  h.box(6,96,30,64,0,8); h.D(8,98,26,60,0,8);
  // workbench (gloves dynamic at 54/64,120)
  h.box(38,126,50,32,6,0); h.R(38,126,50,3,14); h.D(38,129,50,29,6,8);
  h.box(70,112,6,14,10,0); h.box(44,116,8,10,11,0);     // a beaker + flask on the bench
  h.L(40,158,40,196,0); h.L(86,158,86,196,0);           // bench legs
  // the great machine (coil/dials/lever dynamic)
  h.box(116,38,78,84,8,0); h.D(116,38,78,84,8,7);
  h.box(120,44,70,40,1,0); h.D(122,46,66,36,1,9);       // viewing panel
  h.R(124,50,30,6,11); h.R(160,50,24,6,10);             // readout lights
  h.box(120,90,70,28,0,8);                              // control band (dials sit here)
  h.R(132,30,46,8,7);                                   // coil mount plate
  // gauges flanking
  for(const gx of [102,196]){ h.box(gx-1,60,16,16,7,0); h.R(gx+5,62,2,7,4); }
  // operating slab (right, near Hammerstein)
  h.box(244,120,72,12,7,0); h.L(248,132,248,158,8); h.L(310,132,310,158,8);
  h.D(244,120,72,4,7,8);
  // specimen shelf above the workbench
  h.box(36,84,54,6,7,0); h.R(36,90,54,2,0);
  for(let i=0;i<3;i++){ const jx=40+i*17;
    h.box(jx,66,13,18,2,0); h.D(jx+1,67,11,16,2,10);    // glowing green jars
    h.R(jx+1,64,11,3,7); h.R(jx+2,63,9,1,0);            // lids
  }
  h.P(45,74,15); h.P(46,74,0);                          // ...an eye, watching
  h.P(62,76,15); h.P(63,76,0);
  h.R(74,72,3,8,5);                                     // something coiled
  // thick cable from the machine to the slab
  h.L(194,110,214,126,0); h.L(214,126,244,124,0);
  h.L(194,111,214,127,8); h.L(214,127,244,125,8);
  h.L(194,112,214,128,0); h.L(214,128,244,126,0);
  // hazard stripes on the machine base
  for(let x=118;x<192;x+=8){ for(let j=0;j<5;j++) for(let i=0;i<4;i++) h.P(x+i+j,117+j,14); }
  h.R(116,116,78,1,0); h.R(116,122,78,1,0);
  save("lab", f);
})();

/* ===================== THE ATTIC ===================== */
(() => {
  const f = Frame(W,H), h = H_(f);
  let s=21; const rnd=()=>((s=(s*1103515245+12345)&0x7fffffff)/0x7fffffff);
  h.R(0,0,W,160,0);
  // sloped roof planes of rough planks
  for(let y=0;y<126;y++){
    const half=Math.min(150, 20+y*1.9);                 // widening from the ridge
    const lx=Math.max(0,160-half), rx=Math.min(W-1,160+half);
    for(let x=lx;x<=rx;x++) h.P(x,y, ((x+y*3)%14<1)?8:6);
  }
  for(let i=0;i<7;i++){                                 // rafter beams
    const y0=6+i*18;
    h.L(Math.max(0,160-(20+y0*1.9)),y0, 160,Math.max(0,y0-((160-(160-(20+y0*1.9)))/1.9)|0), 8);
  }
  // plank courses following the slopes
  for(let y=8;y<126;y+=12){
    const half=Math.min(150, 20+y*1.9);
    h.R(Math.max(0,160-half),y, Math.min(W,half*2),1, 8);
  }
  h.L(0,126,W,126,0);                                   // wall/kneewall line
  h.R(0,127,W,9,8); h.D(0,127,W,9,8,6);                 // knee wall
  // plank floor (visible band above the HUD)
  h.R(0,136,W,24,6); h.R(0,136,W,2,0);
  for(let x=0;x<W;x+=26) h.L(x,138,x,160,8);
  h.D(0,156,W,4,8,6);
  h.R(0,160,W,40,8);
  // open hatch with ladder (left)
  h.box(16,120,44,40,0,8);
  for(let i=0;i<4;i++) h.R(22,152-i*8,32,3,6);
  h.D(20,122,36,10,14,6);                               // lamplight from below
  // round porthole window (center-top), moonlight
  for(let j=-18;j<=18;j++)for(let i=-18;i<=18;i++){
    const d=i*i+j*j;
    if(d<=18*18) h.P(160+i,48+j, d>16*16?0 : (((i+j)&1)?9:1));
  }
  h.L(160,32,160,64,0); h.L(144,48,176,48,0);
  h.R(150,38,8,8,15);                                   // the moon, glaring in
  for(let j=0;j<20;j++) if(j&1){ h.P(148-j,66+j,9); h.P(172+j,66+j,9); } // moonbeams
  // banded chest under the eaves (lid + lock drawn by over())
  h.box(170,120,48,36,6,0); h.D(171,121,46,34,6,4);
  h.R(178,120,5,36,8); h.R(205,120,5,36,8);             // iron bands
  // raven's perch: a jutting rafter stub
  h.box(256,66,40,5,6,0); h.R(258,71,36,2,8);
  // dressmaker's dummy in the corner (it moved. it definitely moved.)
  h.box(74,88,20,8,7,0);                                // shoulders
  h.R(80,80,8,8,7); h.R(82,82,4,4,8);                   // head knob
  for(let j=0;j<44;j++){ const w=20+((j/6)|0)*2;        // shawled body flaring down
    h.R(84-(w>>1), 96+j, w, 1, (j%9<1)?8:7); }
  h.box(78,140,12,4,6,0); h.R(82,144,4,12,6);           // stand
  // stenciled crates (right of the chest)
  h.box(228,128,30,28,6,0); h.L(228,128,258,156,8); h.L(258,128,228,156,8);
  h.box(236,112,22,16,6,0); h.R(238,116,18,2,8);
  // cobwebs draped everywhere
  for(let i=1;i<7;i++){ h.L(i*6,0,0,i*6,7); h.L(W-i*6,0,W,i*6,7); }
  for(let k=0;k<5;k++){ const wx=60+k*46;               // sagging web strands
    for(let x=0;x<26;x++) h.P(wx+x, 4+((x*x)/26|0)+k*2, (x&1)?7:8);
  }
  // drifting dust motes
  for(let n=0;n<26;n++) h.P((rnd()*W)|0, (rnd()*120)|0, 7);
  save("attic", f);
})();

console.log("done.");
