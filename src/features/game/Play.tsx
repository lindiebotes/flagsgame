import {useEffect,useState,type ReactNode} from 'react';
import {Button} from '../../components/ui/Button';
import './Play.css';

type Props={index:number;total:number;onQuit:()=>void;stage:ReactNode;feedback:ReactNode;answers:ReactNode;typed:boolean;action:ReactNode};

export function Play({index,total,onQuit,stage,feedback,answers,typed,action}:Props){
  const [confirming,setConfirming]=useState(false);
  useEffect(()=>{
    if(!confirming)return;
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setConfirming(false)};
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
  },[confirming]);
  return <div className="play">
    <div className="play-top">
      <div className="play-progress" role="img" aria-label={`Round ${index+1} of ${total}`}>
        <span className="play-count">{index+1}/{total}</span>
        <span className="play-segments">{Array.from({length:total},(_,i)=><i key={i} className={i<index?'is-done':i===index?'is-current':undefined}/>)}</span>
      </div>
      <button type="button" className="play-quit" aria-label="Quit game" onClick={()=>setConfirming(true)}><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></button>
    </div>
    <section className="play-card" aria-label="Flag challenge">
      <div className="play-stage">{stage}</div>
      <div className="play-feedback" aria-live="polite">{feedback}</div>
      <h2 className="play-question">Which flag is it?</h2>
      <div className={`play-answers${typed?' is-typed':''}`}>{answers}</div>
      <div className="play-bar"><div className="play-slot">{action}</div></div>
    </section>
    {confirming&&<div className="play-overlay"><div className="play-dialog" role="dialog" aria-modal="true" aria-labelledby="quit-title">
      <h2 id="quit-title">Quit this game?</h2>
      <div className="play-dialog-actions"><Button autoFocus onClick={()=>setConfirming(false)}>Keep playing</Button><Button variant="outline" onClick={onQuit}>Quit</Button></div>
    </div></div>}
  </div>;
}
