import {useState} from 'react';
import {loadSettings,saveSettings} from '../../lib/settings';
import {Button} from '../../components/ui/Button';
import {SettingToggle} from './SettingToggle';
import {ContinentFilter} from './ContinentFilter';
import './SettingsPage.css';

export function SettingsPage(){
  const [settings,setSettings]=useState(loadSettings);
  const update=(patch:Partial<ReturnType<typeof loadSettings>>)=>{
    const next={...settings,...patch};
    setSettings(next);
    saveSettings(next);
  };
  return <main className="settings-page">
    <section className="settings-intro"><h1>Settings</h1><p>Gameplay options. Changes save straight away.</p></section>
    <section className="settings-card" aria-label="Gameplay settings">
      <div className="settings-heading"><h2>Gameplay</h2></div>
      <SettingToggle name="Extra guesses" description="Medium gets 3 tries per flag. Off means one guess only." checked={settings.extraGuesses} onChange={extraGuesses=>update({extraGuesses})}/>
      <SettingToggle name="Clearer flag hint" description="On Medium, see a sharper flag after two wrong guesses." checked={settings.clearerHint} onChange={clearerHint=>update({clearerHint})}/>
      <ContinentFilter selected={settings.continents} onChange={continents=>update({continents})}/>
      <div className="settings-actions"><Button variant="text" onClick={()=>{window.location.hash=''}}>← Back to the game</Button></div>
    </section>
  </main>;
}
