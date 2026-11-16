import {useEffect,useRef,useState} from 'react';
import './FlagCanvas.css';

type Props={url:string;columns:number;revealed?:boolean;onReady?:(ready:boolean)=>void};
const rasterUrl=(url:string)=>url.replace(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f]\/[0-9a-f]{2}\/)([^/]+\.svg)$/i,(_,base,path,name)=>base+'thumb/'+path+name+'/960px-'+name+'.png');

export function FlagCanvas({url,columns,revealed=false,onReady}:Props){
  const canvas=useRef<HTMLCanvasElement>(null);
  const [error,setError]=useState(false);
  const [retry,setRetry]=useState(0);

  useEffect(()=>{
    let active=true;
    setError(false);
    onReady?.(false);
    const image=new Image();
    image.crossOrigin='anonymous';
    image.onload=async()=>{
      try{
        if(image.decode)await image.decode();
        if(!active||!canvas.current)return;
        const width=image.naturalWidth,height=image.naturalHeight;
        if(!width||!height)throw new Error('Empty flag image');
        const source=document.createElement('canvas');
        source.width=width;source.height=height;
        const sourceContext=source.getContext('2d',{willReadFrequently:true});
        if(!sourceContext)throw new Error('Canvas unavailable');
        sourceContext.drawImage(image,0,0,width,height);
        const pixels=sourceContext.getImageData(0,0,width,height).data;
        const visible=canvas.current;
        visible.width=width;visible.height=height;
        visible.parentElement?.style.setProperty('--flag-ratio',String(width/height));
        const context=visible.getContext('2d');
        if(!context)throw new Error('Canvas unavailable');
        const rows=Math.max(1,Math.round(columns*height/width));
        for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
          const x0=Math.floor(x*width/columns),x1=Math.floor((x+1)*width/columns);
          const y0=Math.floor(y*height/rows),y1=Math.floor((y+1)*height/rows);
          let r=0,g=0,b=0,a=0,count=0;
          for(let py=y0;py<y1;py++)for(let px=x0;px<x1;px++){
            const i=(py*width+px)*4,alpha=pixels[i+3]/255;
            r+=pixels[i]*alpha;g+=pixels[i+1]*alpha;b+=pixels[i+2]*alpha;a+=alpha;count++;
          }
          if(count&&a/count>=.5&&a){
            context.fillStyle=`rgb(${Math.round(r/a)},${Math.round(g/a)},${Math.round(b/a)})`;
            context.fillRect(x0,y0,x1-x0,y1-y0);
          }
        }
        onReady?.(true);
      }catch{if(active)setError(true)}
    };
    image.onerror=()=>{if(active)setError(true)};
    image.src=rasterUrl(url);
    return()=>{active=false};
  },[url,columns,retry]);

  return <div className="flag-frame">{error
    ?<div className="flag-error">This flag couldn’t load.<br/>Please check your connection.<br/><button onClick={()=>{setError(false);setRetry(n=>n+1)}}>Try again</button></div>
    :<div className={`flag-art${revealed?' is-revealed':''}`}><canvas ref={canvas} aria-label={revealed?'The revealed flag':'A pixelated mystery flag'}/><img src={rasterUrl(url)} crossOrigin="anonymous" alt="" className={revealed?'flag-original revealed':'flag-original'}/></div>}
  </div>;
}
