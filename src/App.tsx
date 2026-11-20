import {useEffect,useRef,useState} from 'react';
import {Game} from './features/game/Game';
import {SettingsPage} from './features/settings/SettingsPage';
import {prefersReducedMotion} from './lib/settings';
import {transitionScreen} from './lib/screenTransition';
import './App.css';

const readRoute=()=>window.location.hash==='#/settings'?'settings':'game';

function App(){
  const [route,setRoute]=useState<'game'|'settings'>(readRoute);
  const [transitioning,setTransitioning]=useState(false);
  const [reduceMotion,setReduceMotion]=useState(()=>prefersReducedMotion());
  const animationTimer=useRef<number|undefined>(undefined);
  useEffect(()=>{
    const onHash=()=>{
      const next=readRoute();
      transitionScreen(()=>{setTransitioning(true);setRoute(next);window.clearTimeout(animationTimer.current);animationTimer.current=window.setTimeout(()=>setTransitioning(false),700)},next==='settings'?'forward':'back');
    };
    window.addEventListener('hashchange',onHash);
    return()=>{window.removeEventListener('hashchange',onHash);window.clearTimeout(animationTimer.current)};
  },[]);
  useEffect(()=>{const update=()=>setReduceMotion(prefersReducedMotion());const media=window.matchMedia('(prefers-reduced-motion: reduce)');window.addEventListener('pixel-flags-settings-change',update);media.addEventListener('change',update);return()=>{window.removeEventListener('pixel-flags-settings-change',update);media.removeEventListener('change',update)}},[]);
  return <div className={`app-shell${transitioning?' is-route-transitioning':''}${reduceMotion?' reduce-motion':''}`}>{route==='settings'?<SettingsPage/>:<Game/>}</div>;
}
export default App;
