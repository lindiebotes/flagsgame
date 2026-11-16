import {useEffect,useState} from 'react';
import {Game} from './features/game/Game';
import {SettingsPage} from './features/settings/SettingsPage';
import './App.css';

const readRoute=()=>window.location.hash==='#/settings'?'settings':'game';

function App(){
  const [route,setRoute]=useState<'game'|'settings'>(readRoute);
  useEffect(()=>{
    const onHash=()=>{setRoute(readRoute());window.scrollTo(0,0)};
    window.addEventListener('hashchange',onHash);
    return()=>window.removeEventListener('hashchange',onHash);
  },[]);
  return <div className="app-shell">{route==='settings'?<SettingsPage/>:<Game/>}</div>;
}
export default App;
