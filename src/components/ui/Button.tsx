import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;variant?:'primary'|'text'};
export function Button({children,variant='primary',className='',...props}:Props){return <button className={`button button--${variant} ${className}`} {...props}>{children}</button>}
