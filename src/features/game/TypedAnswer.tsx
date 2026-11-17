import {useState} from 'react';
import {Button} from '../../components/ui/Button';
import './TypedAnswer.css';

type Props={disabled:boolean;onSubmit:(answer:string)=>void;onValueChange?:(hasAnswer:boolean)=>void;previousGuesses?:string[];showSubmit?:boolean};
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');

export function TypedAnswer({disabled,onSubmit,onValueChange,previousGuesses=[],showSubmit=true}:Props){
  const [value,setValue]=useState('');
  const [error,setError]=useState('');
  const query=value.trim();
  return <form id="typed-answer-form" className="typed-answer" onSubmit={event=>{event.preventDefault();if(!query||disabled)return;if(previousGuesses.some(guess=>normalize(guess)===normalize(query))){setError('Already guessed');return}onSubmit(query)}}>
    <div className="typed-answer-row">
      <div className="typed-answer-field">
        <input id="flag-answer" aria-label="Type your answer" aria-invalid={Boolean(error)} aria-describedby={error?'flag-answer-error':undefined} value={value} disabled={disabled} placeholder="Type your answer" autoComplete="off"
          onChange={event=>{setValue(event.target.value);onValueChange?.(Boolean(event.target.value.trim()));setError('')}}/>
      </div>
      {showSubmit&&<Button type="submit" disabled={disabled||!query}>Submit</Button>}
    </div>
    {error&&<p className="typed-answer-error" id="flag-answer-error" role="alert">{error}</p>}
  </form>;
}
