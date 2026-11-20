import {useEffect,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {CloseIcon} from '../../components/ui/CloseIcon';
import './Play.css';

type Props={index:number;total:number;completed:('first'|'later'|'with-hint'|'missed')[];onQuit:()=>void;stage:ReactNode;feedback:ReactNode;answers:ReactNode;typed:boolean;hints?:ReactNode;action:ReactNode;question?:string};

export function Play({index,total,completed,onQuit,stage,feedback,answers,typed,hints,action,question='Which flag is it?'}:Props){
  const root=useRef<HTMLDivElement>(null);
  const [keyboard,setKeyboard]=useState({open:false,inset:0});
  useEffect(()=>{
    const viewport=window.visualViewport;
    if(!viewport)return;
    let focused=false,initialHeight=viewport.height;
    const update=()=>{
      const open=focused&&initialHeight-viewport.height>120;
      const inset=open?Math.max(0,window.innerHeight-viewport.height-viewport.offsetTop):0;
      setKeyboard({open,inset});
    };
    const focusIn=(event:FocusEvent)=>{if(root.current?.contains(event.target as Node)&&event.target instanceof HTMLInputElement){focused=true;initialHeight=viewport.height;update()}};
    const focusOut=(event:FocusEvent)=>{if(event.target instanceof HTMLInputElement&&root.current?.contains(event.target)){focused=false;update()}};
    document.addEventListener('focusin',focusIn);
    document.addEventListener('focusout',focusOut);
    viewport.addEventListener('resize',update);
    viewport.addEventListener('scroll',update);
    return()=>{document.removeEventListener('focusin',focusIn);document.removeEventListener('focusout',focusOut);viewport.removeEventListener('resize',update);viewport.removeEventListener('scroll',update)};
  },[]);
  return <div ref={root} className={`play${keyboard.open?' play--keyboard-open':''}`} style={{'--keyboard-inset':`${keyboard.inset}px`} as CSSProperties}>
    <div className="play-top">
      <div className="play-progress" role="img" aria-label={`Round ${index+1} of ${total}`}>
        <span className="play-count">{index+1}/{total}</span>
         <span className="play-segments">{Array.from({length:total},(_,i)=><i key={i} className={completed[i]?`is-${completed[i]}`:i===index?'is-current':undefined}/>)}</span>
      </div>
      <button type="button" className="play-quit" aria-label="Quit game" onClick={onQuit}><CloseIcon/></button>
    </div>
    <section className="play-card" aria-label="Flag challenge">
      <div className="play-stage">{stage}</div>
      <div className="play-feedback" aria-live="polite">{feedback}</div>
      <h2 className="play-question">{question}</h2>
      <div className={`play-answers${typed?' is-typed':''}`}>{answers}</div>
      {hints}
      <div className="play-bar"><div className="play-slot">{action}</div></div>
    </section>
  </div>;
}
