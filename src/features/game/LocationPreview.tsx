import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './LocationPreview.css';

type Props={name:string;parent?:string;coordinates?:number[];compact?:boolean};

export function LocationPreview({name,parent,coordinates,compact=false}:Props){
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  const [failed,setFailed]=useState(false);
  const [mapTop,setMapTop]=useState(0);
  const pinRef=useRef<HTMLButtonElement>(null);
  const mapId=useId();
  const [lat,lon]=coordinates??[0,0];
  const delta=2.5;
  const bbox=[lon-delta,lat-delta,lon+delta,lat+delta].join(',');
  const url=`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`;

  useEffect(()=>{
    if(!open)return;
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);setLoading(false)}};
    const reposition=()=>setMapTop((pinRef.current?.getBoundingClientRect().bottom??0)+8);
    reposition();
    window.addEventListener('keydown',onKey);
    window.addEventListener('resize',reposition);
    window.addEventListener('scroll',reposition,true);
    return()=>{window.removeEventListener('keydown',onKey);window.removeEventListener('resize',reposition);window.removeEventListener('scroll',reposition,true)};
  },[open]);

  const toggleMap=()=>{
    if(open){setOpen(false);setLoading(false);return}
    setFailed(false);
    setLoading(true);
    setMapTop((pinRef.current?.getBoundingClientRect().bottom??0)+8);
    setOpen(true);
  };

  return <div className={`location-result${compact?' is-compact':''}`}>
    {open&&createPortal(<div className="map-scrim" aria-hidden="true" onClick={()=>{setOpen(false);setLoading(false)}}/>,document.body)}
    {!compact&&<div className="location-name"><strong>{name}</strong>{parent&&<span>{parent}</span>}</div>}
    {coordinates&&<div className="location-map">
      <button ref={pinRef} className="location-pin" type="button" aria-label={open?`Hide map for ${name}`:`Show ${name} on a map`} aria-expanded={open} aria-controls={mapId} onClick={toggleMap}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" fill="currentColor"/><circle cx="12" cy="9" r="2.3" fill="var(--color-surface)"/></svg>
      </button>
      {open&&createPortal(<div className="map-popover" id={mapId} role="region" aria-label={`Map for ${name}`} style={{top:mapTop,maxHeight:`calc(100dvh - ${mapTop}px - 12px)`}}>
        <div className="map-popover-header"><span>{name}</span><button type="button" className="map-close" onClick={()=>{setOpen(false);setLoading(false)}} aria-label="Close map">×</button></div>
        <div className="map-frame">
          {loading&&!failed&&<div className="map-loading" role="status">Loading map…</div>}
          {failed?<div className="map-loading" role="status">Map unavailable.</div>:<iframe title={`Map showing ${name}`} src={url} loading="eager" referrerPolicy="no-referrer" onLoad={()=>setLoading(false)} onError={()=>{setLoading(false);setFailed(true)}}/>}
        </div>
        <a className="map-attribution" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=8/${lat}/${lon}`} target="_blank" rel="noreferrer">© OpenStreetMap</a>
      </div>,document.body)}
    </div>}
  </div>;
}
