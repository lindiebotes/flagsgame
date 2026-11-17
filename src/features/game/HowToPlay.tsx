import flags from '../../data/flags.json';
import {Button} from '../../components/ui/Button';
import {PixelPreview} from './PixelPreview';
import {HowToCard} from './HowToCard';
import {FlagImage} from './FlagImage';
import './HowToPlay.css';

const southAfrica=flags.find(flag=>flag.name==='South Africa')!;

export function HowToPlay({onBack,onStart}:{onBack:()=>void;onStart:()=>void}){
  return <div className="how-to-screen">
    <header className="how-to-header">
      <p>Guess the flag from its pixels. Each game is 10 flags.</p>
    </header>
    <section className="how-to-cards" aria-label="How to play">
      <HowToCard step={1} title="See it" description="Easy uses 14 columns; Medium uses 8 larger columns; Expert shuffles the flag’s colours.">
        <PixelPreview url={southAfrica.imageUrl} level="medium" seed="south-africa-sample"/>
      </HowToCard>
      <HowToCard step={2} title="Guess it" description="Choose or type your answer. Medium allows up to three tries when extra guesses are enabled. Correct answers count; first tries build your personal best.">
        <div className="how-to-guess-art">
          <PixelPreview url={southAfrica.imageUrl} level="medium" seed="south-africa-sample"/>
          <div className="how-to-mini-options" aria-hidden="true">
            <span>Kenya</span><span className="is-answer">South Africa</span><span>Ghana</span>
          </div>
        </div>
      </HowToCard>
      <HowToCard step={3} title="Reveal it" description="Hints can reveal the continent or colour share. Correct answers with a hint get a separate amber “With hint” result. Giving up or running out of tries is a miss.">
        <div className="how-to-reveal-art">
          <FlagImage url={southAfrica.imageUrl} alt="" loading="lazy"/>
          <div className="how-to-reveal-answer"><strong>South Africa</strong><span aria-label="Correct answer" role="img" className="how-to-check"/></div>
        </div>
      </HowToCard>
    </section>
    <footer className="how-to-actions"><Button onClick={onStart}>Let’s play</Button></footer>
  </div>;
}
