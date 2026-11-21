import {useEffect,useRef,useState} from 'react';
import {ColorFilter,type FlagColorName} from './ColorFilter';
import './LearnFilters.css';

type Props={packs:string[];pack:string;onPack:(pack:string)=>void;colors:FlagColorName[];onColors:(colors:FlagColorName[])=>void;packLabel:(pack:string)=>string};
type Menu='pack'|'color';

export function LearnFilters({packs,pack,onPack,colors,onColors,packLabel}:Props){
  const root=useRef<HTMLDivElement>(null);
  const [open,setOpen]=useState<Menu|null>(null);
  useEffect(()=>{
    const closeOutside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(null)};
    const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(null)};
    document.addEventListener('pointerdown',closeOutside);
    document.addEventListener('keydown',closeOnEscape);
    return()=>{document.removeEventListener('pointerdown',closeOutside);document.removeEventListener('keydown',closeOnEscape)};
  },[]);
  const toggle=(menu:Menu)=>setOpen(current=>current===menu?null:menu);
  const active=Number(pack!=='All flags')+colors.length;
  return <>
    <div className="learn-filter-controls" ref={root}>
      <div className={`learn-filter-dropdown${open==='pack'?' is-open':''}`}>
        <button type="button" className="learn-filter-trigger" aria-expanded={open==='pack'} aria-controls="learn-filter-pack" onClick={()=>toggle('pack')}><span>Flag pack <strong>{packLabel(pack)}</strong></span></button>
        <div id="learn-filter-pack" className="learn-filter-popover pack-options" role="group" aria-label="Flag pack" aria-hidden={open!=='pack'} inert={open!=='pack'}>
          {['All flags',...packs].map(item=><button type="button" key={item} aria-pressed={pack===item} onClick={()=>{onPack(item);setOpen(null)}}>{packLabel(item)}</button>)}
        </div>
      </div>
      <div className={`learn-filter-dropdown${open==='color'?' is-open':''}`}>
        <button type="button" className="learn-filter-trigger" aria-expanded={open==='color'} aria-controls="learn-filter-color" onClick={()=>toggle('color')}><span>Browse by color <strong>{colors.length?colors.join(', '):'Any color'}</strong></span></button>
        <div id="learn-filter-color" className="learn-filter-popover" aria-hidden={open!=='color'} inert={open!=='color'}><ColorFilter selected={colors} onChange={onColors}/></div>
      </div>
    </div>
    {active>0&&<button type="button" className="learn-filter-clear learn-filter-clear-top" onClick={()=>{onPack('All flags');onColors([])}}>Clear filters</button>}
  </>;
}
