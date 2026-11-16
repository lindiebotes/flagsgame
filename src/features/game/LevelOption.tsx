import './LevelOption.css';
type Props={level:number;label:string;selected:boolean;onClick:()=>void};
export function LevelOption({level,label,selected,onClick}:Props){return <button className={`level-option ${selected?'is-selected':''}`} onClick={onClick} aria-pressed={selected}><span className="level-number">0{level}</span><span className="level-label">{label}</span><span className="level-dots" aria-hidden="true">{[1,2,3,4,5].map(n=><i key={n} className={n<=level?'filled':''}/>)}</span></button>}
