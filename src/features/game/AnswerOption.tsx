import './AnswerOption.css';
type Props={name:string;index:number;status?:'correct'|'wrong';disabled:boolean;onClick:()=>void};
export function AnswerOption({name,index,status,disabled,onClick}:Props){return <button className={`answer-option ${status||''}`} disabled={disabled} onClick={onClick}><span className="answer-key">{String.fromCharCode(65+index)}</span><span>{name}</span><span className="answer-indicator">{status==='correct'?'✓':status==='wrong'?'×':'↗'}</span></button>}
