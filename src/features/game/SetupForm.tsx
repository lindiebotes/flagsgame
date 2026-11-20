import {useState} from 'react';
import {transitionScreen} from '../../lib/screenTransition';
import {Button} from '../../components/ui/Button';
import {RadioGroup} from '../../components/ui/RadioGroup';
import {AnswerFormatSelector,type AnswerFormat} from './AnswerFormatSelector';
import {FlagSetOption} from './FlagSetOption';
import {LevelOption} from './LevelOption';
import {FlagPackBrowser,type FlagPack} from './FlagPackBrowser';
import './Setup.css';

type Props={
  levels:string[];level:number;onLevel:(level:number)=>void;
  packs:FlagPack[];selected:string[];onTogglePack:(id:string)=>void;
  format:AnswerFormat;onFormat:(format:AnswerFormat)=>void;
  onStart:()=>void;
};

export function SetupForm({levels,level,onLevel,packs,selected,onTogglePack,format,onFormat,onStart}:Props){
  const [browsing,setBrowsing]=useState(false);
  const [featured]=useState(()=>{const ids=packs.map(pack=>pack.id);for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]]}return ids.slice(0,5)});
  const showBrowser=(open:boolean)=>transitionScreen(()=>setBrowsing(open),open?'forward':'back');
  const noPack=selected.length===0;
  const hiddenSelected=packs.filter(pack=>selected.includes(pack.id)&&!featured.includes(pack.id));
  if(browsing)return <div className="setup setup--browsing"><FlagPackBrowser packs={packs} selected={selected} onTogglePack={onTogglePack} onClose={()=>showBrowser(false)}/></div>;
  return <div className="setup">
    <section className="setup-section">
      <h2 className="setup-heading" id="setup-difficulty">Difficulty</h2>
      <RadioGroup labelledBy="setup-difficulty" className="setup-levels">
        {levels.map((label,index)=><LevelOption key={label} level={index+1} label={label} selected={level===index+1} onClick={()=>onLevel(index+1)}/>)}
      </RadioGroup>
    </section>
    <section className="setup-section">
      <div className="setup-packs-heading"><h2 className="setup-heading" id="setup-packs">Flag packs</h2><button type="button" className="setup-see-all" onClick={()=>showBrowser(true)}>See all</button></div>
      <div role="group" aria-labelledby="setup-packs" className="setup-packs">
        {featured.map(id=>packs.find(pack=>pack.id===id)).filter((pack):pack is FlagPack=>Boolean(pack)).map(pack=><FlagSetOption key={pack.id} label={pack.label} count={pack.count} previews={pack.previews} selected={selected.includes(pack.id)} onChange={()=>onTogglePack(pack.id)}/>)}
      </div>
      {hiddenSelected.length>0&&<p className="setup-hidden-selected">Also selected: {hiddenSelected.map(pack=>pack.label).join(', ')}</p>}
    </section>
    <section className="setup-section">
      <h2 className="setup-heading" id="setup-format">Answer format</h2>
      <AnswerFormatSelector value={format} onChange={onFormat} labelledBy="setup-format"/>
    </section>
    <div className="setup-bar">
      <Button onClick={onStart} disabled={noPack} aria-disabled={noPack}>{noPack?'Pick a flag pack':'Let’s play'}</Button>
    </div>
  </div>;
}
