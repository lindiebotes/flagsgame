import {flushSync} from 'react-dom';

export function transitionScreen(updateState:()=>void,direction:'forward'|'back'){
  const update=()=>{flushSync(updateState);window.scrollTo(0,0)};
  if(!document.startViewTransition||window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.querySelector('.reduce-motion')){update();return}
  const root=document.documentElement;
  root.classList.remove('pack-transition-forward','pack-transition-back');
  const transitionClass=`pack-transition-${direction}`;
  root.classList.add(transitionClass);
  const transition=document.startViewTransition(update);
  void transition.finished.finally(()=>root.classList.remove(transitionClass));
}
