import {useState,type ImgHTMLAttributes} from 'react';
import {getFlagSources} from '../../lib/flagImages';

type Props=Omit<ImgHTMLAttributes<HTMLImageElement>,'src'|'onError'>&{url:string};

export function FlagImage({url,...props}:Props){
  const sources=getFlagSources(url);
  const [index,setIndex]=useState(0);
  return <img {...props} src={sources[index]} crossOrigin={sources[index]?.startsWith('/flags/')?undefined:'anonymous'} onError={()=>setIndex(current=>Math.min(current+1,sources.length))}/>;
}
