import {RadioGroup} from '../../components/ui/RadioGroup';
import {type AnswerFormat} from '../../lib/setup';
import './AnswerFormatSelector.css';

export type {AnswerFormat};
const options=[{value:'multiple',label:'Multiple choice'},{value:'typed',label:'Type answer'}] as const;
type Props={value:AnswerFormat;onChange:(value:AnswerFormat)=>void;labelledBy:string};

export function AnswerFormatSelector({value,onChange,labelledBy}:Props){
  return <RadioGroup labelledBy={labelledBy} className="answer-format-options">
    {options.map(option=><div key={option.value} role="radio" aria-checked={value===option.value} tabIndex={value===option.value?0:-1} className={`setup-card answer-format-option${value===option.value?' is-selected':''}`} onClick={()=>onChange(option.value)} onKeyDown={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();onChange(option.value)}}}>{option.label}</div>)}
  </RadioGroup>;
}
