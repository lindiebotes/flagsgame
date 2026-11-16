import {useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {Game} from './features/game/Game';
import {SettingsPage} from './features/settings/SettingsPage';
import {prefersReducedMotion} from './lib/settings';
import './App.css';

const readRoute=()=>window.location.hash==='#/settings'?'settings':'game';

function App(){
  const [route,setRoute]=useState<'game'|'settings'>(readRoute);
  const [transitioning,setTransitioning]=useState(false);
  const [reduceMotion,setReduceMotion]=useState(()=>prefersReducedMotion());
  const animationTimer=useRef<number|undefined>(undefined);
  useEffect(()=>{
    const onHash=()=>{
      const update=()=>{flushSync(()=>{setTransitioning(true);setRoute(readRoute())});window.scrollTo(0,0);window.clearTimeout(animationTimer.current);animationTimer.current=window.setTimeout(()=>setTransitioning(false),700)};
      if(document.startViewTransition&&!prefersReducedMotion()){document.startViewTransition(update)}else{update()}
    };
    window.addEventListener('hashchange',onHash);
    return()=>{window.removeEventListener('hashchange',onHash);window.clearTimeout(animationTimer.current)};
  },[]);
  useEffect(()=>{const update=()=>setReduceMotion(prefersReducedMotion());const media=window.matchMedia('(prefers-reduced-motion: reduce)');window.addEventListener('pixel-flags-settings-change',update);media.addEventListener('change',update);return()=>{window.removeEventListener('pixel-flags-settings-change',update);media.removeEventListener('change',update)}},[]);
  return <div className={`app-shell${transitioning?' is-route-transitioning':''}${reduceMotion?' reduce-motion':''}`}>{route==='settings'?<SettingsPage/>:<Game/>}</div>;
}
export default App;
