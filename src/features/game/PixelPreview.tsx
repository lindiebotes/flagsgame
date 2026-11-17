import {useEffect,useRef} from 'react';
import {measureFlagColors} from '../../lib/flagColors';
import {buildBlocks} from './ColorGrid';
import {rasterUrl} from './FlagCanvas';
import {getFlagSources} from '../../lib/flagImages';
import './PixelPreview.css';

export type PreviewLevel='easy'|'medium'|'expert';
type Props={url:string;level:PreviewLevel;seed:string;columns?:number};
const SETTINGS={easy:{columns:14,cell:6},medium:{columns:8,cell:9},expert:{columns:8,cell:9}};
const SAMPLE_WIDTH=288;

// Decorative preview drawn as whole-pixel blocks on a canvas, so cells never have gaps or lines.
export function PixelPreview({url,level,seed,columns:columnOverride}:Props){
  const canvas=useRef<HTMLCanvasElement>(null);
  const {columns:levelColumns,cell:levelCell}=SETTINGS[level];
  const columns=columnOverride??levelColumns;
  const cell=columnOverride?Math.max(2,Math.round(levelColumns*levelCell/columnOverride)):levelCell;
  useEffect(()=>{
    let active=true;
    const sources=getFlagSources(url);
    let sourceIndex=0;
    const image=new Image();
    image.crossOrigin='anonymous';
    image.onload=()=>{
      const target=canvas.current;
      if(!active||!target)return;
      const height=Math.round(SAMPLE_WIDTH*image.naturalHeight/image.naturalWidth);
      const source=document.createElement('canvas');
      source.width=SAMPLE_WIDTH;source.height=height;
      const sourceContext=source.getContext('2d',{willReadFrequently:true});
      const context=target.getContext('2d');
      if(!sourceContext||!context)return;
      sourceContext.drawImage(image,0,0,SAMPLE_WIDTH,height);
      const pixels=sourceContext.getImageData(0,0,SAMPLE_WIDTH,height).data;
      const rows=Math.max(1,Math.round(columns*height/SAMPLE_WIDTH));
      target.width=columns*cell;target.height=rows*cell;
      context.imageSmoothingEnabled=false;
      if(level==='expert'){
        buildBlocks(measureFlagColors(pixels),seed,columns*rows).forEach((color,index)=>{
          context.fillStyle=color;
          context.fillRect((index%columns)*cell,Math.floor(index/columns)*cell,cell,cell);
        });
      }else{
        for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
          const x0=Math.floor(column*SAMPLE_WIDTH/columns),x1=Math.floor((column+1)*SAMPLE_WIDTH/columns);
          const y0=Math.floor(row*height/rows),y1=Math.floor((row+1)*height/rows);
          let r=0,g=0,b=0,a=0;
          for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
            const i=(y*SAMPLE_WIDTH+x)*4,alpha=pixels[i+3]/255;
            r+=pixels[i]*alpha;g+=pixels[i+1]*alpha;b+=pixels[i+2]*alpha;a+=alpha;
          }
          if(!a)continue;
          context.fillStyle=`rgb(${Math.round(r/a)},${Math.round(g/a)},${Math.round(b/a)})`;
          context.fillRect(column*cell,row*cell,cell,cell);
        }
      }
      target.dataset.ready='true';
    };
    image.onerror=()=>{sourceIndex++;const next=sources[sourceIndex];if(next){image.crossOrigin=next.startsWith('/flags/')?'':'anonymous';image.src=next}};
    image.src=rasterUrl(url);
    return()=>{active=false};
  },[url,level,seed,columns,cell]);
  return <canvas ref={canvas} className="pixel-preview" width={columns*cell} height={48} aria-hidden="true"/>;
}
