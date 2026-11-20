import {Button} from '../../components/ui/Button';
import {CloseIcon} from '../../components/ui/CloseIcon';
import {Confetti} from './Confetti';
import {ResultRow,type ResultEntry} from './ResultRow';
import './Results.css';

type Props={score:number;total:number;history:ResultEntry[];onClose:()=>void;onPlayAgain:()=>void};

export function Results({score,total,history,onClose,onPlayAgain}:Props){
  const heading=score<=3?'Better luck next time':score<=5?'Not bad':score<=8?'Great job!':'Amazing';
  const review=[...history].sort((a,b)=>Number(b.correct)-Number(a.correct));
  return <div className="results final-results">
    {score>=6&&<Confetti/>}
    <div className="results-summary">
      <button className="results-close" type="button" onClick={onClose} aria-label="Back to home"><CloseIcon/></button>
      <h1 className="result-kicker">{heading}</h1>
      <div className="result-count">{score}/{total} correct</div>
    </div>
    <ul className="round-review" aria-label="Round by round review">
      {review.map(entry=><ResultRow key={entry.flag.name} entry={entry}/>)}
    </ul>
    <div className="results-actions"><Button onClick={onPlayAgain}>Play again</Button></div>
  </div>;
}
