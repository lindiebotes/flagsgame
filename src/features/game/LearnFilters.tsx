import {useEffect,useRef,type SyntheticEvent} from 'react';
import {ColorFilter,type FlagColorName} from './ColorFilter';
import './LearnFilters.css';

type Props={packs:string[];pack:string;onPack:(pack:string)=>void;colors:FlagColorName[];onColors:(colors:FlagColorName[])=>void;packLabel:(pack:string)=>string};

export function LearnFilters({packs,pack,onPack,colors,onColors,packLabel}:Props){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const closeOutside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))root.current?.querySelectorAll('details[open]').forEach(item=>item.removeAttribute('open'))};
    document.addEventListener('pointerdown',closeOutside);
    return()=>document.removeEventListener('pointerdown',closeOutside);
  },[]);
  const closeOthers=(event:SyntheticEvent<HTMLDetailsElement>)=>{const current=event.currentTarget;if(current.open)root.current?.querySelectorAll('details[open]').forEach(item=>{if(item!==current)item.removeAttribute('open')})};
  const active=Number(pack!=='All flags')+colors.length;
  return <>
    <div className="learn-filter-controls" ref={root}>
      <details className="learn-filter-dropdown" onToggle={closeOthers}>
        <summary><span>Flag pack <strong>{packLabel(pack)}</strong></span></summary>
        <div className="learn-filter-popover pack-options" role="group" aria-label="Flag pack">
          {['All flags',...packs].map(item=><button type="button" key={item} aria-pressed={pack===item} onClick={event=>{onPack(item);event.currentTarget.closest('details')?.removeAttribute('open')}}>{packLabel(item)}</button>)}
        </div>
      </details>
      <details className="learn-filter-dropdown" onToggle={closeOthers}>
        <summary><span>Browse by color <strong>{colors.length?colors.join(', '):'Any color'}</strong></span></summary>
        <div className="learn-filter-popover"><ColorFilter selected={colors} onChange={onColors}/></div>
      </details>
    </div>
    {active>0&&<button type="button" className="learn-filter-clear learn-filter-clear-top" onClick={()=>{onPack('All flags');onColors([])}}>Clear filters</button>}
  </>;
}
