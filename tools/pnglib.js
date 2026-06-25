/* Tiny EGA framebuffer + PNG encoder shared by the bake scripts.
   No dependencies beyond Node's zlib. RGBA, transparent by default.        */
const zlib = require("zlib");

const EGA = [
  [0,0,0],[0,0,170],[0,170,0],[0,170,170],
  [170,0,0],[170,0,170],[170,85,0],[170,170,170],
  [85,85,85],[85,85,255],[85,255,85],[85,255,255],
  [255,85,85],[255,85,255],[255,255,85],[255,255,255]
];

function Frame(W, H){
  const buf = new Uint8Array(W*H*4);
  const fr = {
    W, H, buf,
    px(x,y,c){ x|=0; y|=0; if(x<0||y<0||x>=W||y>=H) return;
      const i=(y*W+x)*4, e=EGA[c]; buf[i]=e[0]; buf[i+1]=e[1]; buf[i+2]=e[2]; buf[i+3]=255; },
    rect(x,y,w,h,c){ for(let j=0;j<h;j++) for(let i=0;i<w;i++) fr.px(x+i,y+j,c); },
    dither(x,y,w,h,c1,c2){ for(let j=0;j<h;j++) for(let i=0;i<w;i++) fr.px(x+i,y+j, ((i+j)&1)?c1:c2); },
    line(x0,y0,x1,y1,c){ x0|=0;y0|=0;x1|=0;y1|=0;
      let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;
      for(;;){ fr.px(x0,y0,c); if(x0===x1&&y0===y1)break; const e2=2*e; if(e2>=dy){e+=dy;x0+=sx;} if(e2<=dx){e+=dx;y0+=sy;} } },
    // soft radial glow halo (dithered) around a point
    glow(cx,cy,r,c){ for(let j=-r;j<=r;j++) for(let i=-r;i<=r;i++){
      const d=i*i+j*j; if(d<=r*r && d>(r*0.45)*(r*0.45) && ((cx+i+cy+j)&1)) fr.px(cx+i,cy+j,c); } }
  };
  return fr;
}

function crc32(buf){ let c=~0; for(let i=0;i<buf.length;i++){ c^=buf[i];
  for(let k=0;k<8;k++) c=(c>>>1)^(0xEDB88320&-(c&1)); } return (~c)>>>0; }
function chunk(type,data){
  const len=Buffer.alloc(4); len.writeUInt32BE(data.length,0);
  const body=Buffer.concat([Buffer.from(type,"ascii"),data]);
  const crc=Buffer.alloc(4); crc.writeUInt32BE(crc32(body),0);
  return Buffer.concat([len,body,crc]);
}
function encodePNG(fr){
  const {W,H,buf}=fr;
  const sig=Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4);
  ihdr[8]=8; ihdr[9]=6; // 8-bit RGBA
  const stride=1+W*4, raw=Buffer.alloc(H*stride);
  for(let y=0;y<H;y++){ raw[y*stride]=0;
    for(let i=0;i<W*4;i++) raw[y*stride+1+i]=buf[y*W*4+i]; }
  const idat=zlib.deflateSync(raw,{level:9});
  return Buffer.concat([sig,chunk("IHDR",ihdr),chunk("IDAT",idat),chunk("IEND",Buffer.alloc(0))]);
}

module.exports = { EGA, Frame, encodePNG };
