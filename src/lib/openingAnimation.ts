import flags from '../data/flags.json';

// "Pixel loader": a loading card with a row of flag-colored blocks, covered and uncovered by pixel blocks.
const DURATION=1500/0.8;
const SWAP=0.72;
const CELL=40;
const PAGE_BG='#fcf9f4';
const INK='#202020';
const SOFT='#dedcda';

const clamp=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,v));
const seg=(p:number,start:number,dur:number)=>clamp((p-start)/dur);
const easeIn=(t:number)=>t*t*t;
const easeInOut=(t:number)=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

function rng(seed:number){
  let s=seed>>>0;
  return()=>{s=(s+0x6d2b79f5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
}

type Swatch={color:string;percent:number};
const palettes=(flags as {palette:Swatch[]}[]).map(flag=>flag.palette).filter(palette=>palette.length>=3);

let running=false;
export const openingRunning=()=>running;

export function playOpening(onSwap:()=>void){
  if(running)return;
  running=true;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.querySelector('.app-shell.reduce-motion')!==null;
  const dpr=Math.min(2,window.devicePixelRatio||1);
  const W=window.innerWidth,H=window.innerHeight;
  const canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  canvas.width=W*dpr;canvas.height=H*dpr;
  Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',zIndex:'1000',pointerEvents:'auto'});
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d')!;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.imageSmoothingEnabled=false;
  const pal=palettes[Math.floor(Math.random()*palettes.length)].map(swatch=>swatch.color);
  const duration=reduced?600:DURATION;
  const swapAt=reduced?0.5:SWAP;

  const N=14;
  const cw=Math.min(W-40,460),ch=176;
  const cx=(W-cw)/2,cy=(H-ch)/2;
  const cols=Math.ceil(W/CELL),rows=Math.ceil(H/CELL);
  const r=rng(31);
  const gone:number[]=[],entry:number[]=[];
  for(let i=0;i<cols*rows;i++){gone.push(0.74+r()*0.22);entry.push(r()*0.1)}
  const pad=24,gap=4;
  const bw=(cw-pad*2-gap*(N-1))/N;
  const barY=cy+ch-pad-26;

  const drawFade=(p:number)=>{
    ctx.clearRect(0,0,W,H);
    ctx.globalAlpha=p<0.5?easeInOut(p/0.5):1-easeInOut((p-0.5)/0.5);
    ctx.fillStyle=PAGE_BG;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
  };
  const drawLoader=(p:number)=>{
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=PAGE_BG;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const i=y*cols+x;
      if(p<0.74?p<entry[i]:p>gone[i])continue;
      ctx.fillRect(x*CELL,y*CELL,CELL+1,CELL+1);
    }
    const show=p<0.8?1-easeIn(seg(p,0.72,0.08)):0;
    if(show<=0)return;
    ctx.save();
    ctx.globalAlpha=show*clamp((p-0.04)/0.08);
    ctx.fillStyle=SOFT;ctx.fillRect(cx+6,cy+6,cw,ch);
    ctx.fillStyle='#fff';ctx.fillRect(cx,cy,cw,ch);
    ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(cx+1,cy+1,cw-2,ch-2);
    ctx.fillStyle=INK;
    ctx.font='400 24px "Geist Pixel", monospace';
    ctx.textBaseline='top';
    ctx.fillText('Loading flags'+'.'.repeat(1+(Math.floor(p*18)%3)),cx+pad,cy+pad);
    const filled=easeInOut(seg(p,0.1,0.6))*N;
    for(let i=0;i<N;i++){
      const x=cx+pad+i*(bw+gap);
      const on=i+1<=filled+0.001;
      ctx.fillStyle=on?pal[i%pal.length]:'#fff';
      ctx.fillRect(x,barY,bw,26);
      ctx.strokeStyle=on?INK:SOFT;ctx.lineWidth=2;ctx.strokeRect(x+1,barY+1,bw-2,24);
    }
    const lead=clamp(filled,0.5,N-0.5);
    const fx=cx+pad+lead*(bw+gap)-gap/2-bw/2;
    const fy=barY-40-Math.abs(Math.sin(p*Math.PI*7))*16;
    ctx.fillStyle=INK;ctx.fillRect(Math.round(fx-8),Math.round(fy),3,38);
    const wave=Math.round(Math.sin(p*Math.PI*14));
    for(let ry=0;ry<3;ry++)for(let rx=0;rx<5;rx++){
      ctx.fillStyle=pal[ry%pal.length];
      ctx.fillRect(Math.round(fx-5+rx*6),Math.round(fy+ry*6+(rx%2?wave*2:0)),6,6);
    }
    ctx.restore();
  };
  const frame=reduced?drawFade:drawLoader;

  if(document.fonts)void document.fonts.load('24px "Geist Pixel"');
  let swapped=false;
  const t0=performance.now();
  const tick=(now:number)=>{
    const p=clamp((now-t0)/duration);
    if(!swapped&&p>=swapAt){swapped=true;onSwap()}
    frame(p);
    if(p<1)requestAnimationFrame(tick);
    else{canvas.remove();running=false}
  };
  frame(0);
  requestAnimationFrame(tick);
}
