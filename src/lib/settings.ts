const KEY='pixel-challenge-settings';

export const ALL_CONTINENTS=['Africa','Asia','Europe','North America','South America','Oceania','Caribbean'];

export type Settings={extraGuesses:boolean;clearerHint:boolean;continents:string[]};

const defaults:Settings={extraGuesses:true,clearerHint:true,continents:[...ALL_CONTINENTS]};

export function loadSettings():Settings{
  try{
    const raw=window.localStorage.getItem(KEY);
    if(!raw)return defaults;
    const parsed=JSON.parse(raw) as Partial<Settings>;
    return{
      extraGuesses:typeof parsed.extraGuesses==='boolean'?parsed.extraGuesses:defaults.extraGuesses,
      clearerHint:typeof parsed.clearerHint==='boolean'?parsed.clearerHint:defaults.clearerHint,
      continents:Array.isArray(parsed.continents)&&parsed.continents.every(c=>typeof c==='string')?parsed.continents:defaults.continents,
    };
  }catch{return defaults}
}

export function saveSettings(settings:Settings){
  try{window.localStorage.setItem(KEY,JSON.stringify(settings))}catch{}
}
