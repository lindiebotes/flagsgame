import './ModeTabs.css';

export type GameMode='play'|'learn';

export function ModeTabs({mode,onMode}:{mode:GameMode;onMode:(mode:GameMode)=>void}){
  return <nav className="mode-tabs" aria-label="Game mode">
    {(['play','learn'] as const).map(item=><button key={item} type="button" aria-pressed={mode===item} onClick={()=>onMode(item)}>{item==='play'?'Play':'Learn'}</button>)}
  </nav>;
}
