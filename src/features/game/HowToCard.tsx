import type {ReactNode} from 'react';
import './HowToCard.css';

type Props={step:number;title:string;description:string;children:ReactNode};

export function HowToCard({step,title,description,children}:Props){
  return <article className="how-to-card">
    <h2 className="how-to-card-title"><span>{step}</span>{title}</h2>
    <div className="how-to-illustration">{children}</div>
    <p>{description}</p>
  </article>;
}
