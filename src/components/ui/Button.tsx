import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;variant?:'primary'|'text'|'outline'|'secondary'};
export function Button({children,variant='primary',className='',...props}:Props){return <button className={`button button--${variant} ${className}`} {...props}>{children}{(variant==='primary'||variant==='secondary')&&<svg className="button-arrow" aria-hidden="true" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M1 8h16M11 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}</button>}
