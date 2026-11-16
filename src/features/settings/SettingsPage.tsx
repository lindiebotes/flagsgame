import {useState} from 'react';
import {loadSettings,prefersReducedMotion,saveSettings} from '../../lib/settings';
import {SettingToggle} from './SettingToggle';
import './SettingsPage.css';

export function SettingsPage(){
  const [settings,setSettings]=useState(loadSettings);
  const update=(patch:Partial<ReturnType<typeof loadSettings>>)=>{
    const next={...settings,...patch};
    setSettings(next);
    saveSettings(next);
  };
  return <main className="settings-page">
    <section className="settings-intro"><div className="settings-title"><h1>Settings</h1><a className="settings-close" href="#/" aria-label="Close settings"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></a></div><p>Gameplay options. Changes save straight away.</p></section>
    <section className="settings-card" aria-label="Gameplay settings">
      <div className="settings-heading"><h2>Gameplay</h2></div>
      <SettingToggle name="Extra guesses" description="Medium gets 3 tries per flag. Off means one guess only." checked={settings.extraGuesses} onChange={extraGuesses=>update({extraGuesses})}/>
      <SettingToggle name="Clearer flag hint" description="On Medium, see a sharper flag after two wrong guesses." checked={settings.clearerHint} onChange={clearerHint=>update({clearerHint})}/>
      <div className="settings-heading settings-preferences"><h2>Preferences</h2></div>
      <SettingToggle name="Reduce motion" description="Make page transitions and flag reveals immediate. Initially follows your device settings." checked={prefersReducedMotion(settings)} onChange={reduceMotion=>update({reduceMotion})}/>
      <SettingToggle name="Keyboard shortcuts" description="In multiple choice, use A–D to select an answer and Enter to submit." checked={settings.keyboardShortcuts} onChange={keyboardShortcuts=>update({keyboardShortcuts})}/>
    </section>
  </main>;
}
