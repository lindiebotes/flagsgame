import './FlagSetOption.css';
type Props={label:string;bonus:string;selected:boolean;onChange:()=>void;previews?:string[]};
export function FlagSetOption({label,bonus,selected,onChange,previews=[]}:Props){return <label className={`flag-set-option ${selected?'is-selected':''}`}><input type="checkbox" checked={selected} onChange={onChange}/><span className="flag-set-previews" aria-hidden="true">{previews.map(url=><img key={url} src={url} alt=""/>)}</span><span className="flag-set-name">{label}</span><span className="flag-set-bonus">{bonus}</span></label>}
