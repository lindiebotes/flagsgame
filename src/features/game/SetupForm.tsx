import {Button} from '../../components/ui/Button';
import {RadioGroup} from '../../components/ui/RadioGroup';
import {AnswerFormatSelector,type AnswerFormat} from './AnswerFormatSelector';
import {FlagSetOption} from './FlagSetOption';
import {LevelOption} from './LevelOption';
import './Setup.css';

type Pack={id:string;label:string;count:number;previews:string[]};
type Props={
  levels:string[];level:number;onLevel:(level:number)=>void;
  packs:Pack[];selected:string[];onTogglePack:(id:string)=>void;
  format:AnswerFormat;onFormat:(format:AnswerFormat)=>void;
  onStart:()=>void;
};

export function SetupForm({levels,level,onLevel,packs,selected,onTogglePack,format,onFormat,onStart}:Props){
  const noPack=selected.length===0;
  return <div className="setup">
    <section className="setup-section">
      <h2 className="setup-heading" id="setup-difficulty">Choose difficulty</h2>
      <RadioGroup labelledBy="setup-difficulty" className="setup-levels">
        {levels.map((label,index)=><LevelOption key={label} level={index+1} label={label} selected={level===index+1} onClick={()=>onLevel(index+1)}/>)}
      </RadioGroup>
    </section>
    <section className="setup-section">
      <h2 className="setup-heading" id="setup-packs">Choose one or more flag packs</h2>
      <div role="group" aria-labelledby="setup-packs" className="setup-packs">
        {packs.map(pack=><FlagSetOption key={pack.id} label={pack.label} count={pack.count} previews={pack.previews} selected={selected.includes(pack.id)} onChange={()=>onTogglePack(pack.id)}/>)}
      </div>
    </section>
    <section className="setup-section">
      <h2 className="setup-heading" id="setup-format">Choose answer format</h2>
      <AnswerFormatSelector value={format} onChange={onFormat} labelledBy="setup-format"/>
    </section>
    <div className="setup-bar">
      <Button onClick={onStart} disabled={noPack} aria-disabled={noPack}>{noPack?'Pick a flag pack':'Let’s play'}</Button>
    </div>
  </div>;
}
