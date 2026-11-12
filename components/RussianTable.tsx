import {asset,brandLogo,monogram,vehicles} from "@/lib/data";
export function RussianTable(){
  const byMake:Record<string,string[]>={};vehicles.filter(c=>c.service==="russian").forEach(c=>(byMake[c.make]||=[]).push(c.name));
  const rows=Object.entries(byMake).sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0],"ru"));
  const items=rows.slice(0,9).map(([make,models])=>{const text=models.join(" · ");return {make,text:text.length>150?text.slice(0,150).replace(/[ ·]+$/,"")+"…":text};});
  if(rows.length>9)items.push({make:"Ещё",text:`${rows.slice(9).map(([make])=>make).join(", ")} — всего ${rows.length} марок.`});
  return <div className="russian-table" id="russian-table">{items.map(({make,text})=>{const logo=brandLogo(make);return <div key={make} className="rt-row"><span className="rt-make">{make!=="Ещё"&&<span className="rt-logo" aria-hidden="true">{logo?<img src={asset(logo)} alt="" loading="lazy"/>:monogram(make)}</span>}{make}</span><span className="rt-models">{text}</span></div>;})}</div>;
}
