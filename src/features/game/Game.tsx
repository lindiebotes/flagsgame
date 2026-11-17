import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import flags from '../../data/flags.json';
import {Button} from '../../components/ui/Button';
import {FlagCanvas} from './FlagCanvas';
import {FlagImage} from './FlagImage';
import {AnswerOption} from './AnswerOption';
import {TypedAnswer} from './TypedAnswer';
import type {AnswerFormat} from './AnswerFormatSelector';
import {SetupForm} from './SetupForm';
import {HowToPlay} from './HowToPlay';
import {LocationPreview} from './LocationPreview';
import {ColorGrid} from './ColorGrid';
import {Play} from './Play';
import {Confetti} from './Confetti';
import {loadSettings,prefersReducedMotion} from '../../lib/settings';
import {loadSetup,saveSetup} from '../../lib/setup';
import type {FlagColor} from '../../lib/flagColors';
import './Game.css';
type Flag=typeof flags[number];
type Round={flag:Flag;options:Flag[]};
type Entry={flag:Flag;answer:string;correct:boolean;note?:"revealed"|"hint"};
const flagSets=[{label:'World flags'},{label:'Rare countries'},{label:'Territories and islands'},{label:'US state flags'}];
const levels=[{label:'Easy',columns:24,guesses:1},{label:'Medium',columns:8,guesses:3},{label:'Expert',columns:0,guesses:1,colorsOnly:true}];
const successReactions=['Great!','Fantastic!','Incredible!','Impressive!','Noice!','Good stuff!','Sweet!','Heck yeah!'];
const missReactions=['Not quite.','Oh no!','Dang it!','Blistering barnacles!','Oof!','Yikes!','Well, drat!'];
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
const matches=(answer:string,name:string)=>normalize(answer)===normalize(name)||(normalize(name)==='turkiye'&&normalize(answer)==='turkey')||(normalize(name)==='aland islands'&&normalize(answer)==='aland');
const shuffle=<T,>(array:T[])=>[...array].sort(()=>Math.random()-.5);
const displaySetName=(set:string)=>set==='World flags'?'Common flags':set==='Rare countries'?'Rare flags':set==='Territories and islands'?'Territories & islands':set;
const poolFor=(sets:string[])=>Array.from(new Map(flags.filter(f=>sets.includes(f.set)).map(f=>[f.name,f])).values());
function makeRounds(targets:Flag[],pool:Flag[]):Round[]{return shuffle(targets).slice(0,10).map(flag=>({flag,options:shuffle([flag,...shuffle(pool.filter(f=>f.name!==flag.name)).slice(0,3)])}))}
export function Game(){const resultTimer=useRef<number|undefined>(undefined);useEffect(()=>()=>window.clearTimeout(resultTimer.current),[]);const [initial]=useState(()=>loadSetup(flagSets.map(set=>set.label)));const [level,setLevel]=useState(initial.level);const [answerFormat,setAnswerFormat]=useState<AnswerFormat>(initial.format);const changeAnswerFormat=(format:AnswerFormat)=>setAnswerFormat(format);const [selectedSets,setSelectedSets]=useState<string[]>(initial.sets);const [howTo,setHowTo]=useState(false);useEffect(()=>{saveSetup({level,sets:selectedSets,format:answerFormat})},[level,selectedSets,answerFormat]);const [rounds,setRounds]=useState<Round[]>([]);const [index,setIndex]=useState(0);const [correct,setCorrect]=useState(0);const [history,setHistory]=useState<Entry[]>([]);const [choice,setChoice]=useState<string|null>(null);const [keyChoice,setKeyChoice]=useState<string|null>(null);const [showResult,setShowResult]=useState(false);const [revealed,setRevealed]=useState(false);const [skipped,setSkipped]=useState(false);const [wrongPicks,setWrongPicks]=useState<string[]>([]);const [extraGuesses]=useState(()=>loadSettings().extraGuesses);const [keyboardShortcuts]=useState(()=>loadSettings().keyboardShortcuts);const [reduceMotion]=useState(()=>prefersReducedMotion());const [clearerHint]=useState(()=>loadSettings().clearerHint);const [continentHint,setContinentHint]=useState(false);const [shareHint,setShareHint]=useState(false);const [measuredColors,setMeasuredColors]=useState<{url:string;colors:FlagColor[]}|null>(null);const [finished,setFinished]=useState(false);const [ready,setReady]=useState(false);const [typedAnswerReady,setTypedAnswerReady]=useState(false);const playing=rounds.length>0&&!finished;const locked=Boolean(choice)||skipped;const maxGuesses=extraGuesses?levels[level-1].guesses:1;const clearer=clearerHint&&level===2&&wrongPicks.length>=2;const attemptsLeft=maxGuesses-wrongPicks.length;const isExpert=Boolean(levels[level-1].colorsOnly);const round=rounds[index];const expertColors=round&&measuredColors?.url===round.flag.imageUrl?measuredColors.colors:[];const total=rounds.length;const beginGame=(newRounds:Round[])=>{window.clearTimeout(resultTimer.current);setRounds(newRounds);setIndex(0);setCorrect(0);setHistory([]);setChoice(null);setKeyChoice(null);setShowResult(false);setRevealed(false);setSkipped(false);setWrongPicks([]);setContinentHint(false);setShareHint(false);setFinished(false);setReady(false)};const start=()=>{const pool=poolFor(selectedSets);beginGame(makeRounds(pool,pool))};const finish=()=>{setFinished(true)};const answer=(name:string)=>{if(locked||!ready||wrongPicks.some(guess=>normalize(guess)===normalize(name)))return;const isCorrect=matches(name,round.flag.name);if(!revealed&&!isCorrect&&wrongPicks.length+1<maxGuesses){setWrongPicks(w=>[...w,name]);setKeyChoice(null);return}setChoice(name);setKeyChoice(null);resultTimer.current=window.setTimeout(()=>{const counted=isCorrect&&!revealed&&!continentHint&&!shareHint;if(counted)setCorrect(c=>c+1);setHistory(h=>[...h,{flag:round.flag,answer:name,correct:counted,note:revealed?'revealed':(isCorrect&&(continentHint||shareHint))?'hint':undefined}]);setShowResult(true)},reduceMotion?0:400)};const reveal=()=>{if(locked||!ready)return;setTypedAnswerReady(false);setRevealed(true);setSkipped(true);resultTimer.current=window.setTimeout(()=>{setHistory(h=>[...h,{flag:round.flag,answer:'Revealed',correct:false,note:'revealed'}]);setShowResult(true)},reduceMotion?0:400)};const next=()=>{if(index===total-1){finish();return}setIndex(i=>i+1);setChoice(null);setKeyChoice(null);setShowResult(false);setRevealed(false);setSkipped(false);setWrongPicks([]);setContinentHint(false);setShareHint(false);setReady(false);setTypedAnswerReady(false)};const reset=()=>{window.clearTimeout(resultTimer.current);setRounds([]);setHistory([]);setFinished(false);setChoice(null);setKeyChoice(null);setShowResult(false);setRevealed(false);setSkipped(false);setWrongPicks([]);setContinentHint(false);setShareHint(false);setTypedAnswerReady(false)};
useLayoutEffect(()=>{if(playing)window.scrollTo({top:0,behavior:'instant'})},[playing]);
useEffect(()=>{if(!playing||answerFormat==='typed'||locked||!ready||!keyboardShortcuts)return;const onKey=(event:KeyboardEvent)=>{const target=event.target as HTMLElement|null;if(event.altKey||event.ctrlKey||event.metaKey||target?.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target?.tagName||''))return;if(document.querySelector('[role="dialog"]'))return;const key=event.key.toLowerCase();const optionIndex=['a','b','c','d'].indexOf(key);if(optionIndex>=0&&!event.repeat){const option=round.options[optionIndex];if(wrongPicks.includes(option.name))return;event.preventDefault();setKeyChoice(option.name)}else if(event.key==='Enter'&&keyChoice){event.preventDefault();answer(keyChoice)}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[playing,answerFormat,locked,ready,keyChoice,round,wrongPicks,keyboardShortcuts]);
const details=`${levels[level-1].label} · ${selectedSets.map(displaySetName).join(', ')} · ${answerFormat==='typed'?'Typed answer':'Multiple choice'}`;
 const resultHeading=correct<=3?'Better luck next time':correct<=5?'Not bad':correct<=8?'Great job!':'Amazing';
const review=[...history].sort((a,b)=>Number(a.correct)-Number(b.correct));
const renderPlay=()=>{
  const flag=round.flag;
  const done=showResult;
  const isRight=Boolean(choice)&&matches(choice as string,flag.name);
  const gaveUp=skipped||revealed;
  const hasContinent=flag.set!=='US state flags';
  const hintAvailable=ready&&((!continentHint&&hasContinent)||(!shareHint&&expertColors.length>0));
  const useHint=()=>{if(!continentHint&&hasContinent)setContinentHint(true);else if(!shareHint)setShareHint(true)};
  const feedback=done
    ?(gaveUp?<>That was <strong>{flag.name}</strong>.</>:isRight?<>{successReactions[index%successReactions.length]} This is <strong>{flag.name}</strong>.</>:<>{missReactions[index%missReactions.length]} This is <strong>{flag.name}</strong>.</>)
    :isExpert&&(continentHint||shareHint)
      ?<>{continentHint&&<span>Continent: <strong>{flag.region}</strong></span>}{shareHint&&<span className="play-share">{expertColors.slice(0,4).map(c=><span key={c.color} className="play-share-item"><i style={{background:c.color}}/>{Math.round(c.percent)}%</span>)}</span>}</>
      :wrongPicks.length>0?`${attemptsLeft} ${attemptsLeft===1?'guess':'guesses'} left`:null;
  const stage=<>
    <FlagCanvas key={flag.imageUrl} url={flag.imageUrl} columns={clearer?12:levels[level-1].columns} revealed={locked||revealed} onReady={setReady} onColors={isExpert?colors=>setMeasuredColors({url:flag.imageUrl,colors}):undefined}/>
    {isExpert&&expertColors.length>0&&<div className={`color-grid-overlay${locked||revealed?' is-hidden':''}`}><ColorGrid palette={expertColors} seed={flag.name}/></div>}
  </>;
  const answers=answerFormat==='typed'
    ?<TypedAnswer key={`${index}-${wrongPicks.length}`} previousGuesses={wrongPicks} disabled={locked||!ready} onSubmit={answer} onValueChange={setTypedAnswerReady} showSubmit={false} suggestions={poolFor(selectedSets).map(f=>f.name)}/>
    :round.options.map((option,i)=>{
      const status=done&&option.name===flag.name?'correct':(wrongPicks.includes(option.name)||(done&&option.name===choice))?'wrong':undefined;
      return <AnswerOption key={option.name} name={option.name} index={i} selected={!done&&option.name===(choice??keyChoice)} dimmed={done&&!status} disabled={locked||!ready||wrongPicks.includes(option.name)} status={status} onClick={()=>answer(option.name)}/>;
    });
  const action=locked||done
    ?<Button onClick={next} disabled={!done}>{index===total-1?'See results':'Next flag'}</Button>
    :<>
      {isExpert&&<Button variant="outline" className="play-hint" onClick={useHint} disabled={!hintAvailable}>Show hint</Button>}
      <Button variant="secondary" className="play-give-up" onClick={reveal} disabled={!ready}>Give up</Button>
      {answerFormat==='typed'&&<Button type="submit" form="typed-answer-form" className="play-check" disabled={!ready||!typedAnswerReady}>Check</Button>}
    </>;
  return <Play index={index} total={total} onQuit={reset} stage={stage} feedback={<><span className={`play-feedback-text${done&&!gaveUp?(isRight?' is-correct':' is-incorrect'):''}`}>{feedback}</span>{done&&<LocationPreview compact name={flag.name} parent={'parentCountry' in flag?flag.parentCountry:undefined} coordinates={flag.coordinates}/>}</>} answers={answers} typed={answerFormat==='typed'} action={action}/>;
};
useEffect(()=>{if(!showResult)return;const onKey=(event:KeyboardEvent)=>{const t=event.target as HTMLElement|null;if(event.key!=='Enter'||event.repeat||['BUTTON','A','INPUT','TEXTAREA'].includes(t?.tagName||'')||document.querySelector('[role="dialog"]'))return;event.preventDefault();next()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)});
 return <main className={`game-page${playing?' game-page--playing':''}`}>{!playing&&!finished&&<section className="intro"><div className="intro-title"><h1>{howTo?'How it works':'Pixel Flags!'}</h1>{howTo&&<div className="header-actions"><button type="button" className="header-button" aria-label="Back to setup" onClick={()=>setHowTo(false)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button></div>}{!howTo&&<div className="header-actions"><button type="button" className="header-button how-to-button" aria-label="How to play" onClick={()=>setHowTo(true)}>?</button><a href="#/settings" className="settings-link header-button" aria-label="Settings"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zm-.22 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/><circle cx="12" cy="12" r="2.6" fill="var(--color-background)"/></svg></a></div>}</div></section>}
{playing&&round?renderPlay():<section className="game-card" aria-label="Flag challenge">
  {finished?<div className="results">{correct>=6&&<Confetti/>}<div className="results-summary"><button type="button" className="results-close" aria-label="Back to setup" onClick={reset}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="result-kicker">{resultHeading}</div><div className="result-count">{correct}/{total} correct</div></div><ul className="round-review" aria-label="Round by round review">{review.map(e=><li key={e.flag.name} className={e.correct?undefined:'is-missed'}><FlagImage url={e.flag.imageUrl} className="review-flag" alt=""/><span className="review-main"><span className="review-name"><span className={`review-mark${e.correct?' is-correct':' is-incorrect'}`} aria-label={e.correct?'Correct':'Incorrect'}>{e.correct?'✓':'✕'}</span>{e.flag.name}</span></span><span className="review-answer">{e.note==='revealed'?'Not guessed (revealed)':e.note==='hint'?'Hint used':`Your answer: ${e.answer}`}</span></li>)}</ul><div className="results-actions"><Button onClick={start}>Play again</Button></div></div>:<>
 <div className="card-bottom">{howTo?<HowToPlay onBack={()=>setHowTo(false)} onStart={start}/>:<SetupForm levels={levels.map(item=>item.label)} level={level} onLevel={setLevel} packs={flagSets.map(set=>({id:set.label,label:displaySetName(set.label),count:new Set(flags.filter(flag=>flag.set===set.label).map(flag=>flag.name)).size,previews:flags.filter(flag=>flag.set===set.label).slice(0,3).map(flag=>flag.imageUrl)}))} selected={selectedSets} onTogglePack={id=>setSelectedSets(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])} format={answerFormat} onFormat={changeAnswerFormat} onStart={start}/>}</div></>}
</section>}</main>}
