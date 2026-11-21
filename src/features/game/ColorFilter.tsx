import './ColorFilter.css';

export const flagColorOptions=[{name:'Red',color:'#c8102e'},{name:'Orange',color:'#ee821b'},{name:'Yellow',color:'#f4cf30'},{name:'Green',color:'#16834c'},{name:'Blue',color:'#1557a0'},{name:'Purple',color:'#8752a3'},{name:'Black',color:'#202020'},{name:'White',color:'#ffffff'}] as const;
export type FlagColorName=typeof flagColorOptions[number]['name'];

export function colorFamily(hex:string):FlagColorName|null{
  const value=hex.replace('#','');
  if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value))return null;
  const full=value.length===3?[...value].map(c=>c+c).join(''):value;
  const [r,g,b]=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255);
  const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
  if(max<0.22)return 'Black';
  if(delta<0.13&&max>0.72)return 'White';
  if(delta<0.08)return null;
  let hue=max===r?(g-b)/delta+(g<b?6:0):max===g?(b-r)/delta+2:(r-g)/delta+4;
  hue*=60;
  if(hue<15||hue>=340)return 'Red';
  if(hue<42)return 'Orange';
  if(hue<72)return 'Yellow';
  if(hue<165)return 'Green';
  if(hue<260)return 'Blue';
  if(hue<340)return 'Purple';
  return null;
}

export function ColorFilter({selected,onChange}:{selected:FlagColorName[];onChange:(colors:FlagColorName[])=>void}){
  return <fieldset className="color-filter"><legend>Browse by color</legend><div className="color-filter-options">{flagColorOptions.map(option=><button key={option.name} type="button" aria-pressed={selected.includes(option.name)} onClick={()=>onChange(selected.includes(option.name)?selected.filter(name=>name!==option.name):[...selected,option.name])}><span className="color-filter-swatch" style={{backgroundColor:option.color}} aria-hidden="true"/>{option.name}</button>)}{selected.length>0&&<button type="button" className="color-filter-clear" onClick={()=>onChange([])}>Clear colors</button>}</div></fieldset>;
}
