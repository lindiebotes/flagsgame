import {FlagImage} from './FlagImage';
import './LearnFlagRow.css';

export function LearnFlagRow({flag,capital,onOpen}:{flag:{name:string;imageUrl:string};capital?:string;onOpen:()=>void}){
  return <li className="learn-row"><button type="button" className="learn-row-flag" onClick={onOpen} aria-label={`View ${flag.name} flag`}><FlagImage url={flag.imageUrl} alt="" loading="lazy"/><span>{flag.name}</span></button><span className="learn-row-capital">{capital}</span></li>;
}
