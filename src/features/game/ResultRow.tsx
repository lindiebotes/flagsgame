import capitals from '../../data/flagCapitals.json';
import {FlagImage} from './FlagImage';
import './Results.css';

export type ResultEntry={flag:{name:string;imageUrl:string};answer:string;correct:boolean;outcome:'first'|'later'|'with-hint'|'missed';note?:'revealed'|'hint'};

export function ResultRow({entry}:{entry:ResultEntry}){
  const withHint=entry.outcome==='with-hint';
  const capital=(capitals as Record<string,string>)[entry.flag.name];
  return <li>
    <FlagImage url={entry.flag.imageUrl} className="review-flag" alt=""/>
    <span className="review-mark-column"><span className={`review-mark ${entry.correct?'is-correct':withHint?'is-later':'is-incorrect'}`} aria-label={entry.correct?'Correct':withHint?'Correct with hint':'Incorrect'}>{entry.correct||withHint?'✓':'✕'}</span></span>
    <span className="review-main"><span className="review-name">{entry.flag.name}</span>{entry.outcome==='missed'&&<span className="review-guess">{entry.answer?`You guessed: ${entry.answer}`:'Skipped'}</span>}{withHint&&<span className="review-guess review-hint">With hint</span>}</span>
    {capital&&<span className="review-capital">{capital}</span>}
  </li>;
}
