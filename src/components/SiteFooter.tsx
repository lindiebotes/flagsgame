import './SiteFooter.css';

export function SiteFooter(){
  return <div className="site-footer" role="contentinfo">
    <div className="site-footer-inner">
      <span>© {new Date().getFullYear()} Pixel Flags!</span>
      <span>Made by Lindie Botes (<a href="https://lindie.design/flags" target="_blank" rel="noopener noreferrer">see my favorite flags</a>)</span>
    </div>
  </div>;
}
