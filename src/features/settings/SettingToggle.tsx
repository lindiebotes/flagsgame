import './SettingToggle.css';

type Props={name:string;description:string;checked:boolean;onChange:(checked:boolean)=>void};

export function SettingToggle({name,description,checked,onChange}:Props){
  return <label className="setting-toggle">
    <span className="setting-copy">
      <span className="setting-name">{name}</span>
      <span className="setting-desc">{description}</span>
    </span>
    <input className="setting-switch" type="checkbox" checked={checked} onChange={event=>onChange(event.target.checked)} aria-label={name}/>
  </label>;
}
