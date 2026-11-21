import {useState} from 'react';
import {CloseIcon} from '../../components/ui/CloseIcon';
import {SearchField} from '../../components/ui/SearchField';
import {FlagSetOption} from './FlagSetOption';
import './FlagPackBrowser.css';

export type FlagPack={id:string;label:string;count:number;previews:string[];names:string[]};
type Props={packs:FlagPack[];selected:string[];onTogglePack:(id:string)=>void;onClose:()=>void};

const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

export function FlagPackBrowser({packs,selected,onTogglePack,onClose}:Props){
  const [search,setSearch]=useState('');
  const query=normalize(search);
  const filtered=[...packs].sort((a,b)=>a.label.localeCompare(b.label)).filter(pack=>[pack.label,...pack.names].some(name=>normalize(name).includes(query)));
  return <section className="pack-browser" aria-labelledby="pack-browser-title">
    <div className="pack-browser-header"><h2 id="pack-browser-title">All flag packs</h2><button className="pack-browser-close" type="button" onClick={onClose} aria-label="Close flag packs"><CloseIcon/></button></div>
    <SearchField label="Search flag packs or countries" placeholder="Search packs or countries" value={search} onChange={setSearch}/>
    <div className="pack-browser-list" role="group" aria-label="Flag packs">{filtered.map(pack=><FlagSetOption key={pack.id} label={pack.label} count={pack.count} previews={pack.previews} selected={selected.includes(pack.id)} onChange={()=>onTogglePack(pack.id)}/>)}</div>
    {filtered.length===0&&<p className="pack-browser-empty">No flag packs found. Try another search.</p>}
  </section>;
}
