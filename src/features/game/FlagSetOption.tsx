import {useId} from 'react';
import './FlagSetOption.css';
import {FlagImage} from './FlagImage';
type Props={label:string;count:number;selected:boolean;onChange:()=>void;previews?:string[]};

export function FlagSetOption({label,count,selected,onChange,previews=[]}:Props){
  const labelId=useId();
  return <label className={`setup-card flag-set-option${selected?' is-selected':''}`}>
    <input className="flag-set-check" type="checkbox" checked={selected} onChange={onChange} aria-labelledby={labelId}/>
    <span className="flag-set-previews" aria-hidden="true">{previews.map(url=><FlagImage key={url} url={url} alt=""/>)}</span>
    <span id={labelId} className="flag-pack-label">{label}</span>
    <span className="flag-pack-count">{count} flags</span>
  </label>;
}
