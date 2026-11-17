import {useEffect,useRef} from 'react';
import {prefersReducedMotion} from '../../lib/settings';
import './Confetti.css';

const COLORS=['#e6fb45','#35221d','#cfd3f4','#3a7d4e','#a45a50','#ffffff'];
const COUNT=140,DURATION=4500;

// A short burst of falling confetti drawn on a canvas that never blocks clicks.
export function Confetti(){
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const target=canvas.current;
    if(!target||prefersReducedMotion())return;
    const context=target.getContext('2d');
    if(!context)return;
    const ratio=window.devicePixelRatio||1;
    const width=window.innerWidth,height=window.innerHeight;
    target.width=width*ratio;target.height=height*ratio;
    context.scale(ratio,ratio);
    const pieces=Array.from({length:COUNT},()=>({
      x:Math.random()*width,y:-20-Math.random()*height*.6,
      w:6+Math.random()*6,h:8+Math.random()*8,
      vx:(Math.random()-.5)*3,vy:2+Math.random()*3.5,
      angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.3,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
    }));
    const start=performance.now();
    let frame=0;
    const draw=(now:number)=>{
      const elapsed=now-start;
      context.clearRect(0,0,width,height);
      const fade=Math.max(0,Math.min(1,(DURATION-elapsed)/800));
      context.globalAlpha=fade;
      for(const p of pieces){
        p.x+=p.vx;p.y+=p.vy;p.angle+=p.spin;
        context.save();
        context.translate(p.x,p.y);context.rotate(p.angle);
        context.fillStyle=p.color;
        context.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        context.restore();
      }
      if(elapsed<DURATION)frame=requestAnimationFrame(draw);
      else context.clearRect(0,0,width,height);
    };
    frame=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(frame);
  },[]);
  return <canvas ref={canvas} className="confetti" aria-hidden="true"/>;
}
