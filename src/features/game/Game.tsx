import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {playOpening} from '../../lib/openingAnimation';
import {SiteFooter} from '../../components/SiteFooter';
import flags from '../../data/flags.json';
import japanesePrefectureNames from '../../data/japanesePrefectureNames.json';
import {Button} from '../../components/ui/Button';
import {CloseIcon} from '../../components/ui/CloseIcon';
import {transitionScreen} from '../../lib/screenTransition';
import {FlagCanvas} from './FlagCanvas';
import {AnswerOption} from './AnswerOption';
import {TypedAnswer} from './TypedAnswer';
import type {AnswerFormat} from './AnswerFormatSelector';
import {SetupForm} from './SetupForm';
import {ModeTabs,type GameMode} from './ModeTabs';
import {LearnState} from './LearnState';
import {HowToPlay} from './HowToPlay';
import {LocationPreview} from './LocationPreview';
import {ColorGrid} from './ColorGrid';
import {ColorSharePie} from './ColorSharePie';
import {Play} from './Play';
import './Game.css';
import {Results} from './Results';
import {loadSettings,prefersReducedMotion} from '../../lib/settings';
import {loadSetup,saveSetup} from '../../lib/setup';
import type {FlagColor} from '../../lib/flagColors';
type Flag=typeof flags[number];
type Round={flag:Flag;options:Flag[]};
type Outcome='first'|'later'|'with-hint'|'missed';
type Entry={flag:Flag;answer:string;correct:boolean;firstTry:boolean;attempts:number;outcome:Outcome;hintUsed:boolean;note?:'revealed'|'hint'};
const flagSets=[{label:'Common flags'},{label:'Rare flags'},{label:'US state flags'},{label:'Japanese prefectures'},{label:'Animal flags'}];
const levels=[{label:'Easy',columns:14,guesses:1},{label:'Medium',columns:8,guesses:3},{label:'Expert',columns:0,guesses:1,colorsOnly:true}];
const missReactions=['Not quite.','Oh no!','Dang it!','Blistering barnacles!','Oof!','Yikes!','Well, drat!'];
const successReactions=['Great!','Fantastic!','Incredible!','Impressive!','Noice!','Good stuff!','Sweet!','Heck yeah!'];
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
const editDistance=(a:string,b:string)=>{const previous=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let diagonal=previous[0];previous[0]=i;for(let j=1;j<=b.length;j++){const above=previous[j];previous[j]=Math.min(previous[j]+1,previous[j-1]+1,diagonal+(a[i-1]===b[j-1]?0:1));diagonal=above}}return previous[b.length]};
const matches=(answer:string,name:string)=>{const a=normalize(answer),b=normalize(name);const japanese=(japanesePrefectureNames as Record<string,string>)[name];return a===b||(japanese&&(a===normalize(japanese)||(name!=='Hokkaido'&&a===normalize(japanese.slice(0,-1)))))||(b==='turkiye'&&a==='turkey')||(b==='aland islands'&&a==='aland')||(Math.min(a.length,b.length)>=5&&editDistance(a,b)<=(Math.min(a.length,b.length)>=8?2:1))};
const shuffle=<T,>(array:T[])=>[...array].sort(()=>Math.random()-.5);
const displaySetName=(set:string)=>set==='US state flags'?'US states':set==='Japanese regional'?'Japanese prefectures':set;
const articleFlagNames=new Set(['Faroe Islands','Maldives','Cook Islands','Isle of Man','Åland Islands','Comoros']);
const pluralFlagNames=new Set(['Faroe Islands','Maldives','Cook Islands','Åland Islands','Comoros']);
const displayFlagName=(name:string)=>articleFlagNames.has(name)?`the ${name}`:name;
const flagIdentitySentence=(name:string)=>`${pluralFlagNames.has(name)?'These are':'This is'} ${displayFlagName(name)}.`;
const poolFor=(sets:string[])=>Array.from(new Map(flags.filter(f=>sets.includes(f.set)).map(f=>[f.name,f])).values());
const isSimpleStriped=(flag:Flag)=>Boolean((flag as {stripes?:boolean}).stripes)&&new Set(flag.palette.map(color=>color.color.toLowerCase())).size<=3;
const expertPoolFor=(pool:Flag[])=>pool.filter(flag=>new Set(flag.palette.map(color=>color.color.toLowerCase())).size>2);
function makeRounds(targets:Flag[],pool:Flag[]):Round[]{return shuffle(targets).slice(0,10).map(flag=>{const colors=new Set(flag.palette.map(item=>item.color.toLowerCase()));const candidates=shuffle(pool.filter(item=>item.name!==flag.name));candidates.sort((a,b)=>Number(b.region===flag.region)-Number(a.region===flag.region)||Number(b.palette.some(item=>colors.has(item.color.toLowerCase())))-Number(a.palette.some(item=>colors.has(item.color.toLowerCase()))));return{flag,options:shuffle([flag,...candidates.slice(0,3)])}})}
const BEST_KEY='pixel-flags-first-try-bests';
const bestContext=(level:number,sets:string[])=>JSON.stringify([level,[...sets].sort()]);
function readBest(context:string){try{const scores=JSON.parse(window.localStorage.getItem(BEST_KEY)||'{}') as Record<string,number>;return Number.isFinite(scores[context])?scores[context]:0}catch{return 0}}
function writeBest(context:string,score:number){try{const scores=JSON.parse(window.localStorage.getItem(BEST_KEY)||'{}') as Record<string,number>;scores[context]=score;window.localStorage.setItem(BEST_KEY,JSON.stringify(scores))}catch{}}
export function Game(){const [mode,setMode]=useState<GameMode>('play');const resultTimer=useRef<number|undefined>(undefined);useEffect(()=>()=>window.clearTimeout(resultTimer.current),[]);const [initial]=useState(()=>loadSetup(flagSets.map(set=>set.label)));const [level,setLevel]=useState(initial.level);const [answerFormat,setAnswerFormat]=useState<AnswerFormat>(initial.format);const changeAnswerFormat=(format:AnswerFormat)=>setAnswerFormat(format);const [selectedSets,setSelectedSets]=useState<string[]>(initial.sets);const [howTo,setHowTo]=useState(false);useEffect(()=>{saveSetup({level,sets:selectedSets,format:answerFormat})},[level,selectedSets,answerFormat]);const [rounds,setRounds]=useState<Round[]>([]);const [index,setIndex]=useState(0);const [correct,setCorrect]=useState(0);const [history,setHistory]=useState<Entry[]>([]);const [choice,setChoice]=useState<string|null>(null);const [keyChoice,setKeyChoice]=useState<string|null>(null);const [showResult,setShowResult]=useState(false);const [revealed,setRevealed]=useState(false);const [skipped,setSkipped]=useState(false);const [wrongPicks,setWrongPicks]=useState<string[]>([]);const [extraGuesses]=useState(()=>loadSettings().extraGuesses);const [keyboardShortcuts]=useState(()=>loadSettings().keyboardShortcuts);const [reduceMotion]=useState(()=>prefersReducedMotion());const [clearerHint]=useState(()=>loadSettings().clearerHint);const [continentHint,setContinentHint]=useState(false);const [shareHint,setShareHint]=useState(false);const [measuredColors,setMeasuredColors]=useState<{url:string;colors:FlagColor[]}|null>(null);const [finished,setFinished]=useState(false);const [ready,setReady]=useState(false);const [typedAnswerReady,setTypedAnswerReady]=useState(false);const playing=rounds.length>0&&!finished;const locked=Boolean(choice)||skipped;const maxGuesses=extraGuesses?levels[level-1].guesses:1;const clearer=clearerHint&&level===2&&wrongPicks.length>=2;const attemptsLeft=maxGuesses-wrongPicks.length;const isExpert=Boolean(levels[level-1].colorsOnly);const round=rounds[index];const expertColors=round&&measuredColors?.url===round.flag.imageUrl?measuredColors.colors:[];const total=rounds.length;const [bestScore,setBestScore]=useState<number|null>(null);const [newBest,setNewBest]=useState(false);const beginGame=(newRounds:Round[])=>{window.clearTimeout(resultTimer.current);setRounds(newRounds);setIndex(0);setCorrect(0);setHistory([]);setChoice(null);setKeyChoice(null);setShowResult(false);setRevealed(false);setSkipped(false);setWrongPicks([]);setContinentHint(false);setShareHint(false);setFinished(false);setReady(false);setTypedAnswerReady(false);setBestScore(readBest(bestContext(level,selectedSets)));setNewBest(false)};const start=()=>{const pool=poolFor(selectedSets);const playablePool=isExpert?expertPoolFor(pool):pool;const targetPool=isExpert?playablePool:(()=>{const simple=playablePool.filter(flag=>!isSimpleStriped(flag));return simple.length>=4?simple:playablePool})();beginGame(makeRounds(targetPool,playablePool))};const startWithOpening=()=>playOpening(()=>flushSync(start));const finish=()=>{setFinished(true);const score=history.filter(entry=>entry.outcome==='first').length;const context=bestContext(level,selectedSets);const previous=readBest(context);const nextBest=Math.max(previous,score);setBestScore(nextBest);setNewBest(score>previous);if(score>previous)writeBest(context,score)};const answer=(name:string)=>{if(locked||!ready||wrongPicks.some(guess=>normalize(guess)===normalize(name)))return;const isCorrect=matches(name,round.flag.name);if(!revealed&&!isCorrect&&wrongPicks.length+1<maxGuesses){setWrongPicks(w=>[...w,name]);return}const attempts=wrongPicks.length+1;const usedHint=continentHint||shareHint;const counted=isCorrect&&!usedHint;const firstTry=counted&&attempts===1;const outcome:Outcome=counted?(attempts===1?'first':'later'):isCorrect?'with-hint':'missed';setChoice(name);setKeyChoice(null);resultTimer.current=window.setTimeout(()=>{if(counted)setCorrect(c=>c+1);setHistory(h=>[...h,{flag:round.flag,answer:name,correct:counted,firstTry,attempts,outcome,hintUsed:usedHint,note:usedHint?'hint':undefined}]);setShowResult(true)},reduceMotion?0:400)};const reveal=()=>{if(locked||!ready)return;setTypedAnswerReady(false);setRevealed(true);setSkipped(true);resultTimer.current=window.setTimeout(()=>{setHistory(h=>[...h,{flag:round.flag,answer:wrongPicks[wrongPicks.length-1]||'',correct:false,firstTry:false,attempts:wrongPicks.length,outcome:'missed',hintUsed:continentHint||shareHint,note:'revealed'}]);setShowResult(true)},reduceMotion?0:400)};const next=()=>{if(index===total-1){finish();return}setIndex(i=>i+1);setChoice(null);setKeyChoice(null);setShowResult(false);setRevealed(false);setSkipped(false);setWrongPicks([]);setContinentHint(false);setShareHint(false);setReady(false);setTypedAnswerReady(false)};const reset=()=>{window.clearTimeout(resultTimer.current);setRounds([]);setHistory([]);setFinished(false);setChoice(null);setKeyChoice(null);setShowResult(false);setRevealed(false);setSkipped(false);setWrongPicks([]);setContinentHint(false);setShareHint(false);setTypedAnswerReady(false);};useLayoutEffect(()=>{if(playing||finished)window.scrollTo({top:0,behavior:'instant'})},[playing,index,finished]);
useLayoutEffect(()=>{const resetScroll=()=>{window.scrollTo(0,0);document.querySelector('.game-page')?.scrollTo(0,0)};resetScroll();const frame=requestAnimationFrame(resetScroll);return()=>cancelAnimationFrame(frame)},[mode]);
useEffect(()=>{if(!playing||answerFormat==='typed'||locked||!ready||!keyboardShortcuts)return;const onKey=(event:KeyboardEvent)=>{const target=event.target as HTMLElement|null;if(event.altKey||event.ctrlKey||event.metaKey||target?.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target?.tagName||''))return;if(document.querySelector('[role="dialog"]'))return;const key=event.key.toLowerCase();const optionIndex=['a','b','c','d'].indexOf(key);if(optionIndex>=0&&!event.repeat){const option=round.options[optionIndex];if(wrongPicks.includes(option.name))return;event.preventDefault();setKeyChoice(option.name);answer(option.name)}else if(event.key==='Enter'&&keyChoice){event.preventDefault();answer(keyChoice)}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[playing,answerFormat,locked,ready,keyChoice,round,wrongPicks,keyboardShortcuts]);
const details=`${levels[level-1].label} · ${selectedSets.map(displaySetName).join(', ')} · ${answerFormat==='typed'?'Typed answer':'Multiple choice'}`;
const renderPlay=()=>{
  const flag=round.flag;
  const done=showResult;
  const isRight=Boolean(choice)&&matches(choice as string,flag.name);
  const gaveUp=skipped||revealed;
  const japaneseName=flag.set==='Japanese prefectures'?(japanesePrefectureNames as Record<string,string>)[flag.name]:undefined;
  const hasContinent=flag.set!=='US state flags'&&flag.set!=='Japanese prefectures';
  const usedHint=continentHint||shareHint;
  const feedback=done
    ?(gaveUp?flagIdentitySentence(flag.name):isRight&&usedHint?`${successReactions[index%successReactions.length]} Correct with a hint.`:isRight?successReactions[index%successReactions.length]:`${missReactions[index%missReactions.length]} ${flagIdentitySentence(flag.name)}`)
    :(isExpert||japaneseName)&&(continentHint||shareHint)
      ?<>{continentHint&&(japaneseName?<strong lang="ja">{japaneseName}</strong>:<span>Continent: <strong>{flag.region}</strong></span>)}{shareHint&&<ColorSharePie palette={expertColors}/>}</>
      :wrongPicks.length>0?`${attemptsLeft} ${attemptsLeft===1?'guess':'guesses'} left`:null;
  const stage=<>
    <FlagCanvas key={flag.imageUrl} url={flag.imageUrl} columns={clearer?12:levels[level-1].columns} revealed={locked||revealed} onReady={setReady} onColors={isExpert?colors=>setMeasuredColors({url:flag.imageUrl,colors}):undefined}/>
    {isExpert&&expertColors.length>0&&<div className={`color-grid-overlay${locked||revealed?' is-hidden':''}`}><ColorGrid palette={expertColors} seed={flag.name}/></div>}
  </>;
  const answers=answerFormat==='typed'
     ?<TypedAnswer key={`${index}-${wrongPicks.length}`} previousGuesses={wrongPicks} disabled={locked||!ready} onSubmit={answer} onValueChange={setTypedAnswerReady} showSubmit={false} placeholder={flag.set==='Japanese prefectures'?'Type in English or Japanese.':undefined}/>
    :round.options.map((option,i)=>{
      const status=done&&gaveUp&&option.name===flag.name?'answer':done&&option.name===flag.name?'correct':(wrongPicks.includes(option.name)||(done&&option.name===choice))?'wrong':undefined;
      return <AnswerOption key={option.name} name={option.name} index={i} selected={!done&&option.name===(choice??keyChoice)} dimmed={done&&!status} disabled={locked||!ready||wrongPicks.includes(option.name)} status={status} onClick={()=>answer(option.name)}/>;
    });
  const showNameOrContinent=Boolean(japaneseName||(isExpert&&hasContinent));
  const showColorShare=isExpert&&expertColors.length>0;
  const hints=!locked&&!done&&(showNameOrContinent||showColorShare)?<div className="play-hints"><h3 className="play-hints-title">{showNameOrContinent&&showColorShare?'Hints':'Hint'}</h3><div className="play-hint-buttons">{showNameOrContinent&&<Button variant="outline" className="play-hint" onClick={()=>setContinentHint(true)} disabled={!ready||continentHint}>{japaneseName?'Japanese name':'Show continent'}</Button>}{showColorShare&&<Button variant="outline" className="play-hint play-hint--share" onClick={()=>setShareHint(true)} disabled={!ready||shareHint}>Show color share</Button>}</div></div>:null;
  const action=locked||done
    ?<Button onClick={next} disabled={!done}>{index===total-1?'See results':'Next flag'}</Button>
    :<>
      <Button variant="secondary" className="play-give-up" onClick={reveal} disabled={!ready}>Give up</Button>
      {answerFormat==='typed'&&<Button type="submit" form="typed-answer-form" className="play-check" disabled={!ready||!typedAnswerReady}>Check</Button>}
    </>;
  return <Play question={flag.set==='Japanese prefectures'?"Which prefecture's flag is this?":undefined} index={index} total={total} completed={history.map(entry=>entry.outcome)} onQuit={reset} stage={stage} feedback={<><span className={`play-feedback-text${done&&!gaveUp&&isRight?(usedHint?' is-later':' is-correct'):done&&!gaveUp?' is-incorrect':''}`}>{feedback}</span>{done&&<LocationPreview key={flag.name} compact name={flag.name} parent={'parentCountry' in flag?flag.parentCountry:undefined} coordinates={flag.coordinates}/>}</>} answers={answers} typed={answerFormat==='typed'} hints={hints} action={action}/>;
};
useEffect(()=>{if(!showResult)return;const onKey=(event:KeyboardEvent)=>{const t=event.target as HTMLElement|null;if(event.key!=='Enter'||event.repeat||['BUTTON','A','INPUT','TEXTAREA'].includes(t?.tagName||'')||document.querySelector('[role="dialog"]'))return;event.preventDefault();next()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)});
 const setupForm=<SetupForm levels={['n00b','Mid','Boss mode']} level={level} onLevel={setLevel} packs={flagSets.map(set=>({id:set.label,label:displaySetName(set.label),count:new Set(flags.filter(flag=>flag.set===set.label).map(flag=>flag.name)).size,previews:flags.filter(flag=>flag.set===set.label).slice(0,3).map(flag=>flag.imageUrl),names:flags.filter(flag=>flag.set===set.label).flatMap(flag=>[flag.name,...('parentCountry' in flag&&flag.parentCountry?[flag.parentCountry]:[])])}))} selected={selectedSets} onTogglePack={id=>setSelectedSets(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])} format={answerFormat} onFormat={changeAnswerFormat} onStart={startWithOpening}/>;
 return <main className={`game-page${playing?' game-page--playing':''}`}>{!playing&&!finished&&<section className="intro"><div className="intro-title"><h1>{howTo?'How it works':'Pixel Flags!'}</h1>{howTo&&<div className="header-actions"><button type="button" className="header-button" aria-label="Back to setup" onClick={()=>transitionScreen(()=>setHowTo(false),'back')}><CloseIcon/></button></div>}{!howTo&&<div className="header-actions"><button type="button" className="header-button how-to-button" aria-label="How it works" onClick={()=>transitionScreen(()=>setHowTo(true),'forward')}>?</button><a href="#/settings" className="settings-link header-button" aria-label="Settings"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zm-.22 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/><circle cx="12" cy="12" r="2.6" fill="var(--color-background)"/></svg></a></div>}</div></section>}
{!playing&&!finished&&!howTo&&<ModeTabs mode={mode} onMode={setMode}/>}
{playing&&round?renderPlay():<section className="game-card" aria-label="Flag challenge">
  {finished?<Results score={correct} total={total} history={history} onClose={reset} onPlayAgain={start}/>:<>
 <div className="card-bottom">{howTo?<HowToPlay onBack={()=>setHowTo(false)} onStart={startWithOpening}/>:<><div className="mode-panel" hidden={mode!=='play'}>{setupForm}</div><div className="mode-panel" hidden={mode!=='learn'}><LearnState/></div></>}</div></>}
</section>}{!playing&&!finished&&<SiteFooter/>}</main>}
