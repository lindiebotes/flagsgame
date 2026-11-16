import {ALL_CONTINENTS} from '../../lib/settings';
import './ContinentFilter.css';

type Props={selected:string[];onChange:(continents:string[])=>void};

export function ContinentFilter({selected,onChange}:Props){
  const toggle=(continent:string)=>{
    const next=selected.includes(continent)?selected.filter(c=>c!==continent):[...selected,continent];
    onChange(next.length?next:ALL_CONTINENTS);
  };
  return <div className="continent-filter">
    <div className="setting-copy"><span className="setting-name">Continents shown</span><span className="setting-desc">Pick which continents to draw flags from.</span></div>
    <div className="continent-grid">
      {ALL_CONTINENTS.map(continent=><label key={continent} className="continent-option"><input type="checkbox" checked={selected.includes(continent)} onChange={()=>toggle(continent)}/>{continent}</label>)}
    </div>
  </div>;
}
