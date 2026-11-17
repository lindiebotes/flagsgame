import './AnswerOption.css';
type Props={name:string;index:number;status?:'correct'|'wrong';disabled:boolean;selected?:boolean;dimmed?:boolean;onClick:()=>void};

export function AnswerOption({name,index,status,disabled,selected=false,dimmed=false,onClick}:Props){
  return <button type="button" className={`answer-option${status?` ${status}`:''}${selected?' is-selected':''}${dimmed?' is-dimmed':''}`} disabled={disabled} onClick={onClick}>
    <span className="answer-key" aria-hidden="true">{String.fromCharCode(65+index)}</span>
    <span className="answer-name">{name}</span>
    {status==='correct'&&<span className="answer-check" role="img" aria-label="Correct answer"/>}
    {status==='wrong'&&<svg className="answer-cross" role="img" aria-label="Incorrect answer" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>}
  </button>;
}
