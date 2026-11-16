export type FlagColor={color:string;percent:number};

type Bucket={r:number;g:number;b:number;weight:number};
type Cluster={r:number;g:number;b:number;weight:number};

// Group near-identical raster colors so antialiased edges don't become separate colors.
// Transparent pixels are weighted by opacity and don't count as flag background.
export function measureFlagColors(pixels:Uint8ClampedArray):FlagColor[]{
  const buckets=new Map<number,Bucket>();
  let total=0;
  for(let i=0;i<pixels.length;i+=4){
    const weight=pixels[i+3]/255;
    if(!weight)continue;
    const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
    const key=((r>>3)<<10)|((g>>3)<<5)|(b>>3);
    const bucket=buckets.get(key)??{r:0,g:0,b:0,weight:0};
    bucket.r+=r*weight;bucket.g+=g*weight;bucket.b+=b*weight;bucket.weight+=weight;
    buckets.set(key,bucket);total+=weight;
  }
  if(!total)return [];
  const samples=[...buckets.values()].map(bucket=>({r:bucket.r/bucket.weight,g:bucket.g/bucket.weight,b:bucket.b/bucket.weight,weight:bucket.weight})).sort((a,b)=>b.weight-a.weight);
  const distance=(a:Cluster,b:Cluster)=>(a.r-b.r)**2+(a.g-b.g)**2+(a.b-b.b)**2;
  const centers:Cluster[]=[];
  for(const sample of samples){
    if(sample.weight/total<0.001||centers.length>=24)break;
    const isEdgeBlend=sample.weight/total<0.005&&centers.some((a,i)=>centers.slice(i+1).some(b=>{
      const dr=b.r-a.r,dg=b.g-a.g,db=b.b-a.b,length=dr*dr+dg*dg+db*db;
      if(!length)return false;
      const t=Math.max(0,Math.min(1,((sample.r-a.r)*dr+(sample.g-a.g)*dg+(sample.b-a.b)*db)/length));
      return distance(sample,{r:a.r+t*dr,g:a.g+t*dg,b:a.b+t*db,weight:0})<26**2;
    }));
    if(!isEdgeBlend&&centers.every(center=>distance(center,sample)>36**2))centers.push({...sample});
  }
  if(!centers.length)centers.push({...samples[0]});
  const totals=centers.map(()=>({r:0,g:0,b:0,weight:0}));
  for(const sample of samples){
    let best=0;
    for(let i=1;i<centers.length;i++)if(distance(centers[i],sample)<distance(centers[best],sample))best=i;
    const group=totals[best];
    group.r+=sample.r*sample.weight;group.g+=sample.g*sample.weight;group.b+=sample.b*sample.weight;group.weight+=sample.weight;
  }
  const groups=totals.filter(group=>group.weight/total>=0.001).sort((a,b)=>b.weight-a.weight);
  const included=groups.reduce((sum,group)=>sum+group.weight,0);
  const rounded=groups.map(group=>Math.floor(group.weight/included*1000));
  let remaining=1000-rounded.reduce((sum,value)=>sum+value,0);
  const order=groups.map((group,i)=>({i,remainder:group.weight/included*1000-rounded[i]})).sort((a,b)=>b.remainder-a.remainder);
  for(let i=0;i<remaining;i++)rounded[order[i].i]++;
  return groups.map((group,i)=>({color:'#'+[group.r,group.g,group.b].map(value=>Math.round(value/group.weight).toString(16).padStart(2,'0')).join(''),percent:rounded[i]/10}));
}
