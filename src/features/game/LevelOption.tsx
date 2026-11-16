import {useState} from 'react';
import './LevelOption.css';
type Props={level:number;label:string;points:number;pointsText?:string;selected:boolean;onClick:()=>void};
export function LevelOption({level,label,points,pointsText,selected,onClick}:Props){
  const [tipOpen,setTipOpen]=useState(false);
  return <div className={`level-option ${selected?'is-selected':''}`} role="button" tabIndex={0} aria-pressed={selected} onClick={onClick} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onClick()}}}>
    <button type="button" className="level-info" aria-label={`${label}: ${points} points per correct answer`} onClick={event=>{event.stopPropagation();setTipOpen(v=>!v)}} onMouseEnter={()=>setTipOpen(true)} onMouseLeave={()=>setTipOpen(false)} onFocus={()=>setTipOpen(true)} onBlur={()=>setTipOpen(false)} onKeyDown={event=>{event.stopPropagation();if(event.key==='Escape'){setTipOpen(false);event.currentTarget.blur()}}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1.1" fill="currentColor"/></svg>
      {tipOpen&&<span className="level-tooltip" role="tooltip">You earn {points} points for each correct answer at this level.</span>}
    </button>
    <span className="level-number">0{level}</span>
    <span className="level-label">{label}</span>
    <span className="level-points">{pointsText ?? `${points} pts/correct answer`}</span>
    <span className="level-dots" aria-hidden="true">{[1,2,3].map(n=><i key={n} className={n<=level?'filled':''}/>)}</span>
  </div>;
}
