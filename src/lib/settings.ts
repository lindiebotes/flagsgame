const KEY='pixel-challenge-settings';

export const ALL_CONTINENTS=['Africa','Asia','Europe','North America','South America','Oceania','Caribbean'];

export type Settings={extraGuesses:boolean;clearerHint:boolean;continents:string[];reduceMotion:boolean|null;keyboardShortcuts:boolean};

const defaults:Settings={extraGuesses:true,clearerHint:true,continents:[...ALL_CONTINENTS],reduceMotion:null,keyboardShortcuts:true};

export function prefersReducedMotion(settings:Settings=loadSettings()):boolean{
  return settings.reduceMotion??(typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

export function loadSettings():Settings{
  try{
    const raw=window.localStorage.getItem(KEY);
    if(!raw)return defaults;
    const parsed=JSON.parse(raw) as Partial<Settings>;
    return{
      extraGuesses:typeof parsed.extraGuesses==='boolean'?parsed.extraGuesses:defaults.extraGuesses,
      clearerHint:typeof parsed.clearerHint==='boolean'?parsed.clearerHint:defaults.clearerHint,
      reduceMotion:typeof parsed.reduceMotion==='boolean'?parsed.reduceMotion:null,
      keyboardShortcuts:typeof parsed.keyboardShortcuts==='boolean'?parsed.keyboardShortcuts:true,
      continents:Array.isArray(parsed.continents)&&parsed.continents.every(c=>typeof c==='string')?parsed.continents:defaults.continents,
    };
  }catch{return defaults}
}

export function saveSettings(settings:Settings){
  try{window.localStorage.setItem(KEY,JSON.stringify(settings))}catch{}
  window.dispatchEvent(new Event('pixel-flags-settings-change'));
}
