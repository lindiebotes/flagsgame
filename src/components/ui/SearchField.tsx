import './SearchField.css';
import {CloseIcon} from './CloseIcon';

type Props={label:string;placeholder:string;value:string;onChange:(value:string)=>void};

export function SearchField({label,placeholder,value,onChange}:Props){
  return <div className="search-field"><svg className="search-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2"/><path d="m15.5 15.5 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><input type="search" aria-label={label} placeholder={placeholder} value={value} onChange={event=>onChange(event.target.value)}/>{value&&<button type="button" className="search-field-clear" aria-label="Clear search" onClick={()=>onChange('')}><CloseIcon/></button>}</div>;
}
