import {useState} from 'react';
import {Button} from '../../components/ui/Button';
import './TypedAnswer.css';

type Props={disabled:boolean;onSubmit:(answer:string)=>void;suggestions?:string[]};
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');

export function TypedAnswer({disabled,onSubmit,suggestions=[]}:Props){
  const [value,setValue]=useState('');
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);
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
  const pick=(name:string)=>{setValue(name);setOpen(false);setActive(0)};
  return <form className="typed-answer" onSubmit={event=>{event.preventDefault();if(show&&matches[active]){pick(matches[active]);return}if(query&&!disabled)onSubmit(query)}}>
    <label className="typed-answer-label" htmlFor="flag-answer">Your answer</label>
    <div className="typed-answer-row">
      <div className="typed-answer-field">
        <input id="flag-answer" value={value} disabled={disabled} placeholder="Type a country or territory" autoComplete="off" role="combobox" aria-expanded={show} aria-controls="flag-suggestions" aria-autocomplete="list" aria-activedescendant={show?`flag-suggestion-${active}`:undefined}
          onChange={event=>{setValue(event.target.value);setOpen(true);setActive(0)}}
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
      <Button type="submit" disabled={disabled||!query}>Submit</Button>
    </div>
  </form>;
}
