import {useState} from 'react';
import {Button} from '../../components/ui/Button';
import './TypedAnswer.css';

type Props={disabled:boolean;onSubmit:(answer:string)=>void;onValueChange?:(hasAnswer:boolean)=>void;suggestions?:string[];previousGuesses?:string[];showSubmit?:boolean};
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');

export function TypedAnswer({disabled,onSubmit,onValueChange,suggestions=[],previousGuesses=[],showSubmit=true}:Props){
  const [value,setValue]=useState('');
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);
  const [error,setError]=useState('');
  const query=value.trim();
  const matches=(()=>{
    if(!query)return [];
    const q=normalize(query);
    return suggestions
      .map(name=>({name,n:normalize(name)}))
      .filter(({name,n})=>n!==q&&(n.startsWith(q)||n.includes(q)))
      .sort((a,b)=>Number(b.n.startsWith(q))-Number(a.n.startsWith(q)))
      .slice(0,7)
      .map(({name})=>name);
  })();
  const show=open&&!disabled&&query.length>0&&matches.length>0;
  const pick=(name:string)=>{setValue(name);onValueChange?.(Boolean(name.trim()));setOpen(false);setActive(0);setError('')};
  return <form id="typed-answer-form" className="typed-answer" onSubmit={event=>{event.preventDefault();if(!query||disabled)return;if(previousGuesses.some(guess=>normalize(guess)===normalize(query))){setOpen(false);setError('Already guessed');return}if(show&&matches[active]){pick(matches[active]);return}onSubmit(query)}}>
    <div className="typed-answer-row">
      <div className="typed-answer-field">
        <input id="flag-answer" aria-label="Type your answer" aria-invalid={Boolean(error)} aria-describedby={error?'flag-answer-error':undefined} value={value} disabled={disabled} placeholder="Type your answer" autoComplete="off" role="combobox" aria-expanded={show} aria-controls="flag-suggestions" aria-autocomplete="list" aria-activedescendant={show?`flag-suggestion-${active}`:undefined}
          onChange={event=>{setValue(event.target.value);onValueChange?.(Boolean(event.target.value.trim()));setOpen(true);setActive(0);setError('')}}
          onFocus={()=>{if(query)setOpen(true)}}
          onBlur={()=>{window.setTimeout(()=>setOpen(false),100)}}
          onKeyDown={event=>{
            if(!show)return;
            if(event.key==='ArrowDown'){event.preventDefault();setActive(i=>(i+1)%matches.length)}
            else if(event.key==='ArrowUp'){event.preventDefault();setActive(i=>(i-1+matches.length)%matches.length)}
            else if(event.key==='Escape'){setOpen(false)}
          }}/>
        {show&&<ul className="suggestion-list" id="flag-suggestions" role="listbox" aria-label="Country name suggestions">{matches.map((name,i)=><li key={name} id={`flag-suggestion-${i}`} role="option" aria-selected={i===active} className={i===active?'is-active':''} onMouseDown={event=>event.preventDefault()} onClick={()=>pick(name)}>{name}</li>)}</ul>}
      </div>
      {showSubmit&&<Button type="submit" disabled={disabled||!query}>Submit</Button>}
    </div>
    {error&&<p className="typed-answer-error" id="flag-answer-error" role="alert">{error}</p>}
  </form>;
}
