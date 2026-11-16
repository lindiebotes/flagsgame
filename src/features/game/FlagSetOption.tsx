import './FlagSetOption.css';
type Props={label:string;bonus:string;selected:boolean;onChange:()=>void};
export function FlagSetOption({label,bonus,selected,onChange}:Props){return <label className={`flag-set-option ${selected?'is-selected':''}`}><input type="checkbox" checked={selected} onChange={onChange}/><span className="flag-set-name">{label}</span><span className="flag-set-bonus">{bonus}</span></label>}
