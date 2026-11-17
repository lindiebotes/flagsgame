import type {KeyboardEvent,ReactNode} from 'react';

type Props={labelledBy:string;className?:string;children:ReactNode};

// Radio group where the arrow keys move focus and selection between role="radio" children.
export function RadioGroup({labelledBy,className,children}:Props){
  const onKeyDown=(event:KeyboardEvent<HTMLDivElement>)=>{
    const forward=event.key==='ArrowRight'||event.key==='ArrowDown';
    const backward=event.key==='ArrowLeft'||event.key==='ArrowUp';
    if(!forward&&!backward)return;
    const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]'));
    const current=items.indexOf(document.activeElement as HTMLElement);
    if(current<0)return;
    event.preventDefault();
    const next=items[(current+(forward?1:-1)+items.length)%items.length];
    next.focus();
    next.click();
  };
  return <div role="radiogroup" aria-labelledby={labelledBy} className={className} onKeyDown={onKeyDown}>{children}</div>;
}
