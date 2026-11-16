import {useMemo} from 'react';
import './ColorGrid.css';
type Palette={color:string;percent:number}[];
type Props={palette:Palette;seed:string};
const CELLS=24;
function buildBlocks(palette:Palette,seed:string):string[]{
  const colors=palette.map(p=>p.color);
  const base=Math.floor(CELLS/colors.length);
  const extra=CELLS-base*colors.length;
  const blocks:string[]=[];
  colors.forEach((color,i)=>{for(let n=0;n<base;n++)blocks.push(color)});
  let random=Array.from(seed).reduce((hash,char)=>(Math.imul(hash,31)+char.charCodeAt(0))>>>0,1);
  const rand=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random/4294967296};
  for(let i=0;i<extra;i++)blocks.push(colors[Math.floor(rand()*colors.length)]);
  for(let i=blocks.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[blocks[i],blocks[j]]=[blocks[j],blocks[i]]}
  return blocks;
}
export function ColorGrid({palette,seed}:Props){
  const blocks=useMemo(()=>buildBlocks(palette,seed),[palette,seed]);
  return <div className="color-grid" role="img" aria-label="Pixelated flag shown as equal blocks of its colours">
    {blocks.map((color,i)=><span key={i} className="color-grid-cell" style={{background:color}}/>)}
  </div>;
}
