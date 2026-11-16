import {useMemo} from 'react';
import './ColorGrid.css';
type Palette={color:string;percent:number}[];
type Props={palette:Palette;seed:number};
const CELLS=24;
function buildBlocks(palette:Palette,seed:number):string[]{
  const colors=palette.map(p=>p.color);
  const base=Math.floor(CELLS/colors.length);
  const extra=CELLS-base*colors.length;
  const blocks:string[]=[];
  colors.forEach((color,i)=>{for(let n=0;n<base;n++)blocks.push(color)});
  for(let i=0;i<extra;i++)blocks.push(colors[Math.floor(Math.random()*colors.length)]);
  let random=seed||1;
  const rand=()=>{random=(random*1103515245+12345)%2147483648;return random/2147483648};
  return [...blocks].sort(()=>rand()-.5);
}
export function ColorGrid({palette,seed}:Props){
  const blocks=useMemo(()=>buildBlocks(palette,seed),[palette,seed]);
  return <div className="color-grid" role="img" aria-label="Pixelated flag shown as equal blocks of its colours">
    {blocks.map((color,i)=><span key={i} className="color-grid-cell" style={{background:color}}/>)}
  </div>;
}
