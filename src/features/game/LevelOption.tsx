import {useId} from 'react';
import flags from '../../data/flags.json';
import {PixelPreview,type PreviewLevel} from './PixelPreview';
import './LevelOption.css';

const example=flags.find(flag=>flag.name==='South Africa')??flags[0];
const previewLevels:PreviewLevel[]=['easy','medium','expert'];
type Props={level:number;label:string;selected:boolean;onClick:()=>void};

export function LevelOption({level,label,selected,onClick}:Props){
  const labelId=useId();
  return <div role="radio" aria-labelledby={labelId} aria-checked={selected} tabIndex={selected?0:-1} className={`setup-card level-option${selected?' is-selected':''}`} onClick={onClick} onKeyDown={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();onClick()}}}>
    <span className="level-preview"><PixelPreview url={example.imageUrl} level={previewLevels[level-1]} seed={example.name}/></span>
    <span id={labelId} className="level-label">{label}</span>
  </div>;
}
