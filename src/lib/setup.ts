const KEY='pixel-flags-setup';
export type AnswerFormat='multiple'|'typed';
export type SetupPrefs={level:number;sets:string[];format:AnswerFormat};
export const defaultSetup:SetupPrefs={level:1,sets:['World flags'],format:'multiple'};

export function loadSetup(validSets:string[]):SetupPrefs{
  try{
    const raw=window.localStorage.getItem(KEY);
    if(!raw)return defaultSetup;
    const parsed=JSON.parse(raw) as Partial<SetupPrefs>;
    const sets=Array.isArray(parsed.sets)?parsed.sets.filter(set=>validSets.includes(set)):[];
    return{
      level:parsed.level===2||parsed.level===3?parsed.level:1,
      sets:sets.length?sets:defaultSetup.sets,
      format:parsed.format==='typed'?'typed':'multiple',
    };
  }catch{return defaultSetup}
}

export function saveSetup(prefs:SetupPrefs){
  try{window.localStorage.setItem(KEY,JSON.stringify(prefs))}catch{}
}
