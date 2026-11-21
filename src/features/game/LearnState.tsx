import {useMemo,useState} from 'react';
import flags from '../../data/flags.json';
import capitals from '../../data/flagCapitals.json';
import {SearchField} from '../../components/ui/SearchField';
import {LearnFlagRow} from './LearnFlagRow';
import {FlagViewer} from './FlagViewer';
import {colorFamily,type FlagColorName} from './ColorFilter';
import {LearnFilters} from './LearnFilters';
import './LearnState.css';

const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const packName=(name:string)=>name==='US state flags'?'US states':name;
const packs=[...new Set(flags.map(flag=>flag.set))].sort((a,b)=>packName(a).localeCompare(packName(b)));

export function LearnState(){
  const [search,setSearch]=useState('');
  const [pack,setPack]=useState('All flags');
  const [colors,setColors]=useState<FlagColorName[]>([]);
  const [viewing,setViewing]=useState<string|null>(null);
  const filtered=useMemo(()=>{
    const matching=flags.filter(flag=>(pack==='All flags'||flag.set===pack)&&normalize(`${flag.name} ${(capitals as Record<string,string>)[flag.name]||''}`).includes(normalize(search))&&colors.every(color=>flag.palette.some(item=>colorFamily(item.color)===color)));
    return [...new Map(matching.map(flag=>[flag.name,flag])).values()].sort((a,b)=>a.name.localeCompare(b.name));
  },[pack,search,colors]);
  const index=filtered.findIndex(flag=>flag.name===viewing);
  return <section className="learn-state" aria-label="Learn about flags">
    <SearchField label="Search flags or capitals" placeholder="Search flags or capitals" value={search} onChange={setSearch}/>
    <LearnFilters packs={packs} pack={pack} onPack={setPack} colors={colors} onColors={setColors} packLabel={packName}/>
    {filtered.length?<ul className="learn-list">{filtered.map(flag=><LearnFlagRow key={flag.name} flag={flag} capital={(capitals as Record<string,string>)[flag.name]} onOpen={()=>setViewing(flag.name)}/>)}</ul>:<p className="learn-empty">No flags found. Try another search, flag pack or color.</p>}
    {index>=0&&<FlagViewer flag={filtered[index]} index={index} total={filtered.length} onClose={()=>setViewing(null)} onPrevious={()=>setViewing(filtered[index-1].name)} onNext={()=>setViewing(filtered[index+1].name)}/>}
  </section>;
}
