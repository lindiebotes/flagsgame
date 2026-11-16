import './AnswerFormatSelector.css';

export type AnswerFormat='multiple'|'typed';
type Props={value:AnswerFormat;onChange:(value:AnswerFormat)=>void;legend?:string};

export function AnswerFormatSelector({value,onChange,legend='Choose your answer format'}:Props){
  return <fieldset className="answer-format">
    <legend>{legend}</legend>
    <div className="answer-format-options">
      {([{value:'multiple',label:'Multiple choice'},{value:'typed',label:'Type the answer'}] as const).map(option=>
        <label key={option.value} className={`answer-format-option${value===option.value?' is-selected':''}`}>
          <input type="radio" name="answer-format" value={option.value} checked={value===option.value} onChange={()=>onChange(option.value)}/>
          <span>{option.label}</span>
        </label>
      )}
    </div>
  </fieldset>;
}
