import './ColorSharePie.css';
type Palette={color:string;percent:number}[];
type Props={palette:Palette};
export function ColorSharePie({palette}:Props){
  const sorted=[...palette].sort((a,b)=>b.percent-a.percent);
  let angle=0;
  const stops=sorted.map(slice=>{
    const start=angle;
    angle+=slice.percent/100*360;
    return `${slice.color} ${start}deg ${angle}deg`;
  }).join(',');
  return <div className="color-share">
    <div className="color-share-pie" style={{background:`conic-gradient(${stops})`}} role="img" aria-label="Approximate colour shares measured from the flag image, largest first"/>
    <ul className="color-share-legend">
      {sorted.map(slice=><li key={slice.color}><span className="color-share-swatch" style={{background:slice.color}}/>≈{slice.percent}%</li>)}
    </ul>
  </div>;
}
