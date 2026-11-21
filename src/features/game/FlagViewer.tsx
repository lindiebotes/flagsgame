import {useEffect,useRef} from 'react';
import {CloseIcon} from '../../components/ui/CloseIcon';
import {FlagImage} from './FlagImage';
import capitals from '../../data/flagCapitals.json';
import './FlagViewer.css';

type Props={flag:{name:string;imageUrl:string};index:number;total:number;onClose:()=>void;onPrevious:()=>void;onNext:()=>void};

export function FlagViewer({flag,index,total,onClose,onPrevious,onNext}:Props){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const element=dialog.current;if(!element)return;element.showModal();return()=>element.close()},[]);
  return <dialog ref={dialog} className="flag-viewer" aria-label="Flag viewer" onCancel={event=>{event.preventDefault();onClose()}} onClick={event=>{if(event.target===event.currentTarget)onClose()}} onKeyDown={event=>{if(event.key==='ArrowLeft'&&index>0){event.preventDefault();onPrevious()}if(event.key==='ArrowRight'&&index<total-1){event.preventDefault();onNext()}}}>
    <button className="flag-viewer-close" type="button" onClick={onClose} aria-label="Close flag viewer"><CloseIcon/></button>
    <div className="flag-viewer-content">
      <button className="flag-viewer-arrow" type="button" onClick={onPrevious} disabled={index===0} aria-label="Previous flag">&#8592;</button>
      <figure><FlagImage key={flag.imageUrl} url={flag.imageUrl} alt={`Flag of ${flag.name}`}/><figcaption>{flag.name}{(capitals as Record<string,string>)[flag.name]&&<span className="flag-viewer-capital">{(capitals as Record<string,string>)[flag.name]}</span>}</figcaption></figure>
      <button className="flag-viewer-arrow" type="button" onClick={onNext} disabled={index===total-1} aria-label="Next flag">&#8594;</button>
    </div>
  </dialog>;
}
