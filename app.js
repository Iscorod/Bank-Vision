/* BankVision — Banking performance dashboard. All figures synthetic. No external JS dependencies. */
const COLORS=['#075bd0','#09b5cf','#29cdd1','#43c977','#7aaef5','#8ce1d5','#8aa0c8'];
const MONTHS=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const PAGES=[
 {id:'executive',label:'Visión ejecutiva',short:'Visión ejecutiva',icon:'home'},
 {id:'profit',label:'Rentabilidad y márgenes',short:'Rentabilidad y márgenes',icon:'chart'},
 {id:'risk',label:'Riesgo y morosidad',short:'Riesgo y morosidad',icon:'shield'},
 {id:'liquidity',label:'Liquidez y solvencia',short:'Liquidez y solvencia',icon:'droplet'},
 {id:'clients',label:'Clientes y productos',short:'Clientes y productos',icon:'users'},
 {id:'offices',label:'Red de oficinas',short:'Red de oficinas y regiones',icon:'building'}
];
const PATHS={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 16v-5m5 5V6m5 10V9"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
 droplet:'<path d="M12 22a8 8 0 0 0 8-8C20 10 12 2 12 2S4 10 4 14a8 8 0 0 0 8 8z"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 building:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-4h4v4"/>',
 filter:'<path d="M4 4h16l-6.5 8v7l-3 2v-9z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
 wallet:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 9V5a2 2 0 0 1 2-2h13m-1 12h4M15 15h1"/>',
 coins:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v5c0 2 16 2 16 0V5M4 10v5c0 2 16 2 16 0v-5M4 15v5c0 2 16 2 16 0v-5"/>',
 activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
 trending:'<path d="m3 17 6-6 4 4 8-9M14 6h7v7"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 percentage:'<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m4 20 16-16"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 refresh:'<path d="M20 7v-4l-3 3a8 8 0 1 0 3 8M20 3l1 4h-4"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v5M12 7h.01"/>',
 check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
 close:'<path d="M18 6 6 18M6 6l12 12"/>',
 alert:'<path d="m12 3 10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
 scatter:'<circle cx="5" cy="17" r="2"/><circle cx="11" cy="9" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="19" cy="17" r="2"/>',
 table:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
 pie:'<path d="M12 2v10h10A10 10 0 1 1 12 2zM16 2a9 9 0 0 1 6 6h-6z"/>',
 map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 link:'<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',
 credit:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20m-16 5h4"/>',
 briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 13h18"/>',
 spark:'<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c-5 5-5 15 0 20M12 2c5 5 5 15 0 20"/>'
};
function icon(name='chart',cls='icon'){return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]||PATHS.chart}</svg>`}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const nf=new Intl.NumberFormat('es-ES',{maximumFractionDigits:0});
const nf1=new Intl.NumberFormat('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1});
const nf2=new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtInt=v=>Number.isFinite(v)?nf.format(Math.round(v)):'—';
const fmt1=v=>Number.isFinite(v)?nf1.format(v):'—';
const fmtPct=(v,d=1)=>Number.isFinite(v)?`${d===2?nf2.format(v):nf1.format(v)} %`:'—';
const fmtM=(v,d=0)=>Number.isFinite(v)?`${d?nf1.format(v):nf.format(Math.round(v))} M€`:'—';
const fmtK=v=>Number.isFinite(v)?`${nf1.format(v)} k€`:'—';
const shortM=v=>Number.isFinite(v)?Math.abs(v)>=1000?`${nf1.format(v/1000)} mil M€`:`${nf.format(Math.round(v))} M€`:'—';
const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sum=(rs,k)=>rs.reduce((a,r)=>a+Number(r[k]||0),0);
const total=(rs,fn)=>rs.reduce((a,r)=>a+fn(r),0);
const ratio=(a,b,mult=100)=>b? a/b*mult:NaN;
const pctDelta=(curr,prev)=>prev?(curr/prev-1)*100:NaN;
const normalized=(t)=>String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const state={page:'executive',period:'year',region:'all',office:'all',segment:'all',product:'all',channel:'all',ready:false,officeChunks:{}};
const DATA={};const F={};let lastContext=null;
async function json(path){const res=await fetch(`data/${path}`);if(!res.ok)throw new Error(`No se pudo cargar ${path} (${res.status})`);return res.json()}
async function init(){
 try{
  const names={meta:'meta.json',schema:'schema.json',core:'core-regions.json',clients:'clients.json',leads:'leads.json',ratings:'ratings.json',offices:'offices-monthly.json',campaigns:'campaigns.json',liquidity:'liquidity.json',maturities:'maturities.json',buffer:'liquid-assets.json',stress:'stress.json'};
  const keys=Object.keys(names);const arr=await Promise.all(keys.map(k=>json(names[k])));
  keys.forEach((k,i)=>DATA[k]=arr[i]);
  ['regions','offices','segments','products','channels','ratings','sectors','campaigns','bufferTypes','maturityTypes','scenarios','severities'].forEach(d=>F[d]=new Map(DATA.meta[d].rows.map(r=>[r[0],r])));
  state.ready=true;render();
 }catch(e){console.error(e);$('#app').innerHTML=`<div class="boot"><div class="boot-logo">!</div><h2>No hemos podido cargar los datos</h2><p>${safe(e.message)}</p><p>Abre el proyecto desde un servidor HTTP local o desde Vercel, no como archivo file://.</p></div>`}
}
function selectedMonths(){if(state.period==='year')return Array.from({length:12},(_,i)=>i+1);if(state.period.startsWith('q')){const q=+state.period.slice(1);return [q*3-2,q*3-1,q*3]}return [+state.period]}
function officeBelongs(office,region){return region==='all'||String(F.offices.get(office)?.[4])===String(region)}
function geographyOffice(oid){return state.office==='all'||Number(state.office)===oid}
function regionAllowed(oid){return state.region==='all'||officeBelongs(oid,state.region)}
function officeFiltered(arr,officeIndex=1){return arr.filter(r=>geographyOffice(r[officeIndex])&&regionAllowed(r[officeIndex]))}
function coreFiltered(geoOnly=false){const core=state.office==='all'?DATA.core:(state.officeChunks[F.offices.get(Number(state.office))?.[4]]||[]);return core.filter(r=>{
  if(state.office!=='all'&&r[1]!==Number(state.office))return false;
  if(state.office==='all'&&state.region!=='all'&&r[1]!==Number(state.region))return false;
  if(!geoOnly){if(state.segment!=='all'&&r[2]!==Number(state.segment))return false;if(state.product!=='all'&&r[3]!==Number(state.product))return false;}
  return true
})}
async function selectOffice(id){
 state.office=id;
 if(id!=='all'){
  const region=F.offices.get(Number(id))?.[4];state.region=String(region);
  if(!state.officeChunks[region]){
   showToast('Cargando detalle de oficina…');
   state.officeChunks[region]=await json(`core-offices-r${region}.json`);
  }
 }
 render()
}
function getCtx(){
 const months=selectedMonths(),last=months.at(-1),includes=m=>months.includes(m);
 const core=coreFiltered(), allGeoCore=coreFiltered(true),
  closing=core.filter(r=>r[0]===last),flows=core.filter(r=>includes(r[0])),
  geoClosing=allGeoCore.filter(r=>r[0]===last);
 const officeRows=officeFiltered(DATA.offices),officeClosing=officeRows.filter(r=>r[0]===last),officeFlows=officeRows.filter(r=>includes(r[0]));
 const clientsRows=officeFiltered(DATA.clients).filter(r=>state.segment==='all'||r[2]===Number(state.segment));
 const clientsClosing=clientsRows.filter(r=>r[0]===last),clientsFlows=clientsRows.filter(r=>includes(r[0]));
 const leadRows=officeFiltered(DATA.leads).filter(r=>state.channel==='all'||r[2]===Number(state.channel));
 const leadsFlows=leadRows.filter(r=>includes(r[0]));
 const ratingRows=officeFiltered(DATA.ratings),ratingClosing=ratingRows.filter(r=>r[0]===last);
 const regionIds=state.region==='all'?[1,2,3,4,5]:[Number(state.region)];
 const liqRows=DATA.liquidity.filter(r=>regionIds.includes(r[1])),liqClosing=liqRows.filter(r=>r[0]===last);
 const liqFlows=liqRows.filter(r=>includes(r[0]));
 const flowsMeasures={}, stockMeasures={};
 for(const [name,i] of Object.entries({interest:16,funding:17,fees:18,feeCost:19,other:20,opex:21,impairment:22,tax:23,profitPrior:24})){flowsMeasures[name]=sum(flows,i)}
 for(const [name,i] of Object.entries({credits:4,deposits:5,investments:6,exposure:7,doubtful:8,stage2:9,provisions:10,rwa:11,contracts:12,creditsPrior:13,depositsPrior:14,investmentsPrior:15})){stockMeasures[name]=sum(closing,i)}
 const f=flowsMeasures,s=stockMeasures;
 const marginInterest=f.interest-f.funding;
 const feeNet=f.fees-f.feeCost;
 const gross=marginInterest+feeNet+f.other;
 const marginNet=gross-f.opex;
 const profit=marginNet-f.impairment-f.tax;
 const costIncome=ratio(f.opex,gross);
 const annualFactor=12/months.length;
 // Allocate denominator capital (by RWA) and assets (by business stock) when filters restrict segments/products/offices.
 const selectedRegionCore=DATA.core.filter(r=>r[0]===last&&regionIds.includes(r[1]));
 const fullRegionRwa=sum(selectedRegionCore,11), fullRegionBusiness=total(selectedRegionCore,r=>r[4]+r[5]+r[6]);
 const allocatedEquity=sum(liqClosing,11)*ratio(s.rwa,fullRegionRwa,1);
 const assetsGeo=sum(officeClosing,7);
 const allocAssets=assetsGeo*ratio(total(closing,r=>r[4]+r[5]+r[6]),total(geoClosing,r=>r[4]+r[5]+r[6]),1);
 // Regional assets from offices can be filtered to branch; ratio within current geography.
 const roe=ratio(profit*annualFactor,allocatedEquity),roa=ratio(profit*annualFactor,allocAssets);
 const clients={active:sum(clientsClosing,3),new:sum(clientsFlows,4),lost:sum(clientsFlows,5),digital:sum(clientsClosing,6),linked:sum(clientsClosing,7),products:sum(clientsClosing,8),prior:sum(clientsClosing,9)};
 const leads={leads:sum(leadsFlows,3),contacted:sum(leadsFlows,4),qualified:sum(leadsFlows,5),captured:sum(leadsFlows,6),linked:sum(leadsFlows,7),marketing:sum(leadsFlows,8),prior:sum(leadsFlows,9)};
 const lq={hqla:sum(liqClosing,2),outflow:sum(liqClosing,3),stableAvail:sum(liqClosing,4),stableReq:sum(liqClosing,5),rwa:sum(liqClosing,6),cet1:sum(liqClosing,7),tier1:sum(liqClosing,8),capital:sum(liqClosing,9),gap:sum(liqClosing,10),equity:sum(liqClosing,11)};
 const q={month:last,months,includes,flows,closing,core,geoClosing,officeRows,officeClosing,officeFlows,clientsRows,clientsClosing,clientsFlows,leadRows,leadsFlows,ratingRows,ratingClosing,liqRows,liqClosing,liqFlows,stock:s,fin:f,marginInterest,feeNet,gross,marginNet,profit,profitPrior:f.profitPrior,costIncome,roe,roa,clients,leads,liquidity:lq,annualFactor,
  npl:ratio(s.doubtful,s.credits),stage2:ratio(s.stage2,s.exposure),coverage:ratio(s.provisions,s.doubtful),costRisk:ratio(f.impairment*annualFactor,s.credits),lcr:ratio(lq.hqla,lq.outflow),nsfr:ratio(lq.stableAvail,lq.stableReq),cet1ratio:ratio(lq.cet1,lq.rwa),tier1ratio:ratio(lq.tier1,lq.rwa)};
 return q;
}
/* Accessible, dependency-free SVG chart components. */
function panel(title,subtitle,body,opts={}){return `<section class="panel ${opts.class||''}" aria-label="${safe(title)}"><div class="panel-head"><span class="panel-icon">${icon(opts.icon||'chart')}</span><div><h2 class="panel-title">${safe(title)}</h2><p class="panel-sub">${safe(subtitle)}</p></div></div><div class="panel-body">${body}</div>${opts.foot?`<div class="panel-foot">${safe(opts.foot)}</div>`:''}</section>`}
function kpi(label,value,ico,opts={}){
 const trend=opts.trend, positive=Number.isFinite(trend)&&(opts.inverse?-trend:trend)>=0;
 const badge=opts.badge||(!Number.isFinite(trend)?'Indicador':positive?'Mejora':'Revisar');
 const quality=opts.badge?opts.badgeQuality||'neutral':!Number.isFinite(trend)?'neutral':positive?'good':'warn';
 const variation=Number.isFinite(trend)?`${trend>=0?'+':''}${fmt1(trend)}${opts.unit||' %'}`:(opts.detail||'Dato del periodo');
 return `<div class="kpi-card" title="${safe(label)} · ${safe(opts.description||'Datos sintéticos de 2024')}" aria-label="${safe(label)}: ${safe(value)}"><div class="kpi-top"><div class="kpi-label-wrap"><span class="kpi-icon">${icon(ico)}</span><span class="kpi-label">${safe(label)}</span></div><span class="kpi-badge ${quality}">${safe(badge)}</span></div><div class="kpi-value">${safe(value)}</div><div class="kpi-bottom"><span>${opts.trendLabel||'Variación anual'}</span><strong style="${(!Number.isFinite(trend)||!positive)?'color:#8394a9':''}">${safe(variation)}</strong></div></div>`
}
function svgLine(labels,series,options={}){
 const W=650,H=222,L=48,R=22,T=20,B=33,iw=W-L-R,ih=H-T-B;
 const all=series.flatMap(s=>s.values.filter(Number.isFinite));
 if(!all.length)return '<div class="empty">No hay datos para este filtro</div>';
 let ymin=options.yMin??Math.min(0,...all),ymax=options.yMax??Math.max(...all)*1.16;
 if(ymax<=ymin)ymax=ymin+1;
 const py=v=>T+ih-(v-ymin)/(ymax-ymin)*ih;
 const px=i=>L+(labels.length===1?iw/2:i/(labels.length-1)*iw);
 let out=`<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${safe(options.aria||'Gráfico de líneas')}">`;
 for(let i=0;i<=4;i++){let v=ymin+(ymax-ymin)*i/4,y=py(v);out+=`<path class="chart-grid" d="M${L} ${y.toFixed(1)}H${W-R}"/><text class="chart-ticks" x="${L-8}" y="${y+3}" text-anchor="end">${safe(options.tickFmt?options.tickFmt(v):fmtInt(v))}</text>`}
 out+=`<path class="chart-axis" d="M${L} ${H-B}H${W-R}"/>`;
 labels.forEach((lab,i)=>{if(labels.length>7&&i%2===1&&i!==labels.length-1)return;out+=`<text class="chart-ticks" x="${px(i)}" y="${H-12}" text-anchor="middle">${safe(lab)}</text>`});
 series.forEach((s,j)=>{
  const pts=s.values.map((v,i)=>({x:px(i),y:py(v),v})).filter(p=>Number.isFinite(p.v));
  if(!pts.length)return;
  out+=`<polyline class="chart-line" stroke="${s.color||COLORS[j]}" points="${pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}"/>`;
  for(const p of pts)out+=`<circle class="chart-node" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.3" fill="${s.color||COLORS[j]}"><title>${safe(s.name)}: ${safe(options.valueFmt?options.valueFmt(p.v):fmt1(p.v))}</title></circle>`;
  if(options.lastLabels!==false){let p=pts.at(-1);out+=`<rect x="${Math.min(p.x-2,W-83)}" y="${clamp(p.y-21,T-5,H-B-23)}" width="72" height="19" rx="5" fill="${s.color||COLORS[j]}"/><text x="${Math.min(p.x+34,W-47)}" y="${clamp(p.y-8,T+8,H-B-10)}" text-anchor="middle" fill="white" font-size="10" font-weight="800">${safe(options.valueFmt?options.valueFmt(p.v):fmt1(p.v))}</text>`}
 });
 out+='</svg></div>';
 out+=`<div class="legend">${series.map((s,j)=>`<span><i style="background:${s.color||COLORS[j]}"></i>${safe(s.name)}</span>`).join('')}</div>`;
 return out;
}
function horizontalBars(items,opts={}){
 if(!items.length)return '<div class="empty">No hay datos para mostrar</div>';
 const max=Math.max(...items.map(x=>Math.max(0,x.value)),1);
 return `<div class="bar-list">${items.map((a,i)=>{const col=a.color||COLORS[Math.min(i,COLORS.length-1)];const attr=a.product!=null?`data-product="${a.product}"`:a.region!=null?`data-region="${a.region}"`:'';
 return `<div class="bar-item"><span class="bar-item-label" title="${safe(a.label)}">${safe(a.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(1,100*a.value/max)}%;background:${col}" ${attr} title="${safe(a.label)} · ${safe(opts.format?opts.format(a.value):fmtInt(a.value))}"></div></div><span class="bar-value">${safe(opts.format?opts.format(a.value):fmtInt(a.value))}</span></div>`}).join('')}</div>`
}
function donut(items,opts={}){
 const arr=items.filter(i=>i.value>0),totalVal=arr.reduce((s,a)=>s+a.value,0);
 if(!totalVal)return '<div class="empty">Sin registros para este filtro</div>';
 let start=0;const stops=arr.map((it,i)=>{const end=start+it.value/totalVal*100,stop=`${it.color||COLORS[i]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;start=end;return stop});
 return `<div class="donut-layout"><div class="donut" style="background:conic-gradient(${stops.join(',')})" title="Distribución por categoría"><div class="donut-hole"><b>${safe(opts.center||'100 %')}</b><span>${safe(opts.subtitle||'Distribución')}</span></div></div><div class="donut-legend">${arr.map((a,i)=>`<div class="donut-legend-item ${a.channel!=null?'clickable':''}" ${a.channel!=null?`data-channel="${a.channel}"`:''}><i style="background:${a.color||COLORS[i]}"></i><span title="${safe(a.label)}">${safe(a.label)}</span><b>${fmtPct(a.value/totalVal*100,1)}</b></div>`).join('')}</div></div>`
}
function simpleTable(columns,rows,opts={}){
 let html=`<div class="tbl-wrap"><table class="data-table"><thead><tr>${columns.map(c=>`<th>${safe(c)}</th>`).join('')}</tr></thead><tbody>`;
 for(const r of rows){const cells=Array.isArray(r)?r:r.cells,attr=r?.office?` data-office="${r.office}"`:r?.region?` data-region="${r.region}"`:'',cls=`${r?.total?'total-row ':''}${attr?'click-row':''}`;
 html+=`<tr class="${cls}"${attr}>${cells.map(cell=>`<td>${safe(cell)}</td>`).join('')}</tr>`}
 html+='</tbody></table></div>';return html
}
function heatmap(rowNames,colNames,values,opts={}){
 const all=values.flat().filter(Number.isFinite),min=Math.min(...all,0),max=Math.max(...all,1),span=max-min||1;
 let html=`<table class="heat-table"><thead><tr><th>${safe(opts.rowTitle||'Región')}</th>${colNames.map(x=>`<th>${safe(x)}</th>`).join('')}</tr></thead><tbody>`;
 rowNames.forEach((name,i)=>{html+=`<tr><td>${safe(name.label||name)}</td>`;colNames.forEach((c,j)=>{
  const v=values[i]?.[j];const t=Number.isFinite(v)?clamp((v-min)/span,0,1):0;
  const bg=Number.isFinite(v)?`rgba(${Math.round(211-173*t)},${Math.round(247-112*t)},${Math.round(238-42*t)},${(0.58+0.4*t).toFixed(2)})`:'#f4f6fa';
  const attr=name.region!=null?`data-region="${name.region}"`:'';
  html+=`<td ${attr} style="background:${bg};color:${t>.75?'white':'#274563'}" title="${safe(name.label||name)} · ${safe(c)}: ${fmtPct(v,2)}">${Number.isFinite(v)?fmtPct(v,1):'—'}</td>`
 });html+='</tr>'});
 return html+'</tbody></table><div class="heat-legend"><span>Menor</span><span class="heat-gradient"></span><span>Mayor</span></div>'
}
function barChart(labels,series,opts={}){
 if(!series.length)return '<div class="empty">Sin datos</div>';
 const W=640,H=226,L=48,R=14,T=18,B=44,iw=W-L-R,ih=H-T-B;
 const vals=series.flatMap(s=>s.values||[]).filter(Number.isFinite),max=opts.max??Math.max(1,...vals)*1.17;
 const scale=v=>ih*(Math.max(0,v)/max),groupW=iw/labels.length,bw=Math.min(38,(groupW-14)/Math.max(1,series.length));
 let out=`<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${safe(opts.aria||'Gráfico de barras')}">`;
 for(let i=0;i<=4;i++){const y=T+ih-i*ih/4;out+=`<path d="M${L} ${y}H${W-R}" class="chart-grid"/><text x="${L-7}" y="${y+4}" text-anchor="end" class="chart-ticks">${safe(opts.tickFmt?opts.tickFmt(max*i/4):fmtInt(max*i/4))}</text>`}
 labels.forEach((lab,i)=>{out+=`<text class="chart-ticks" x="${L+groupW*(i+.5)}" y="${H-20}" text-anchor="middle">${safe(lab)}</text>`});
 series.forEach((s,j)=>{for(let i=0;i<labels.length;i++){
  const v=s.values[i]||0,h=scale(v),x=L+groupW*(i+.5)-(series.length*bw+Math.max(0,series.length-1)*3)/2+j*(bw+3),y=T+ih-h;
  out+=`<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="2" fill="${s.color||COLORS[j]}"><title>${safe(s.name)} · ${safe(labAt(labels,i))}: ${safe(opts.valueFmt?opts.valueFmt(v):fmtInt(v))}</title></rect>`;
 }});
 out+='</svg></div>';
 if(opts.legend!==false)out+=`<div class="legend">${series.map((s,j)=>`<span><i style="background:${s.color||COLORS[j]}"></i>${safe(s.name)}</span>`).join('')}</div>`;
 return out
}
function labAt(labels,i){return labels[i]||''}
function scatter(points,opts={}){
 const nums=points.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(!nums.length)return '<div class="empty">Sin datos</div>';
 const W=640,H=250,L=65,R=22,T=22,B=45,iw=W-L-R,ih=H-T-B;
 const xs=nums.map(p=>p.x),ys=nums.map(p=>p.y),xFmt=opts.xFmt||fmtPct,yFmt=opts.yFmt||fmtPct;
 // Zoom around the observed data range, rather than anchoring both axes at zero.
 // This preserves the original values but makes close offices visibly distinguishable.
 const domain=values=>{
  const low=Math.min(...values),high=Math.max(...values),span=Math.max(high-low,Math.abs(high)*.006,0.0001);
  return [Math.max(0,low-span*.28),high+span*.28];
 };
 const [ax0,ax1]=domain(xs),[ay0,ay1]=domain(ys);
 const x0=opts.xMin??ax0,x1=opts.xMax??ax1,y0=opts.yMin??ay0,y1=opts.yMax??ay1;
 const xx=x=>L+(x-x0)/Math.max(1e-8,x1-x0)*iw,yy=y=>T+ih-(y-y0)/Math.max(1e-8,y1-y0)*ih;
 let out=`<div class="chart-wrap scatter-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${safe(opts.aria||'Gráfico de dispersión. Acerca el puntero o usa Tab sobre un punto para ver sus datos.')}">`;
 for(let i=0;i<=4;i++){
  const x=L+i*iw/4,y=T+i*ih/4;
  out+=`<path class="chart-grid" d="M${x} ${T}V${T+ih}M${L} ${y}H${L+iw}"/><text class="chart-ticks" text-anchor="middle" x="${x}" y="${H-24}">${safe(xFmt(x0+(x1-x0)*i/4))}</text><text class="chart-ticks" text-anchor="end" x="${L-9}" y="${y+4}">${safe(yFmt(y1-(y1-y0)*i/4))}</text>`;
 }
 // Draw unlabeled dots. The readable detail card only appears on hover or keyboard focus.
 for(let i=0;i<nums.length;i++){
  const p=nums[i],x=xx(p.x),y=yy(p.y),col=p.color||COLORS[i%COLORS.length];
  const tooltipW=167,tooltipH=43;
  const bx=clamp(x+16,L+3,W-R-tooltipW-2),by=clamp(y-tooltipH-13,T+3,T+ih-tooltipH-2);
  const detail=`${xFmt(p.x)}  ·  ${yFmt(p.y)}`;
  out+=`<g class="scatter-dot" tabindex="0" role="img" aria-label="${safe(p.label)}: ${safe(detail)}" ${p.segment?`data-segment="${safe(p.segment)}"`:''}>
     <circle cx="${x}" cy="${y}" r="7" fill="${col}" stroke="#fff" stroke-width="2.4"/>
     <g class="scatter-detail"><rect x="${bx}" y="${by}" width="${tooltipW}" height="${tooltipH}" rx="9" fill="#122e56"/><text class="scatter-detail-title" x="${bx+11}" y="${by+17}">${safe(p.label)}</text><text class="scatter-detail-value" x="${bx+11}" y="${by+32}">${safe(detail)}</text></g>
    </g>`;
 }
 out+=`<text x="${W/2}" y="${H-4}" text-anchor="middle" class="chart-ticks">${safe(opts.xLabel||'Eje X (%)')}</text><text x="15" y="${T+ih/2}" text-anchor="middle" class="chart-ticks" transform="rotate(-90 15 ${T+ih/2})">${safe(opts.yLabel||'Eje Y (%)')}</text></svg></div>`;
 return out
}
function waterfall(start,parts,opts={}){
 const W=640,H=226,L=18,R=16,T=21,B=46,iw=W-L-R,ih=H-T-B;
 let curr=start;const steps=[{name:opts.startLabel||'Inicial',start:0,end:start,value:start,total:true}];
 for(const p of parts){steps.push({name:p.name,start:curr,end:curr+p.value,value:p.value,total:false});curr+=p.value}
 steps.push({name:opts.endLabel||'Final',start:0,end:curr,value:curr,total:true});
 const max=Math.max(...steps.map(s=>s.start),...steps.map(s=>s.end),0)*1.09;
 const min=Math.min(0,...steps.map(s=>s.start),...steps.map(s=>s.end));
 const range=max-min||1,py=v=>T+ih-(v-min)/range*ih;
 const gw=iw/steps.length,bw=Math.min(56,gw*.65);
 let out=`<div class="waterfall"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Puente de margen financiero">`;
 out+=`<line x1="${L}" y1="${py(0)}" x2="${W-R}" y2="${py(0)}" stroke="#e3ebf5"/>`;
 steps.forEach((s,i)=>{
  const x=L+gw*i+(gw-bw)/2,y1=py(s.start),y2=py(s.end),y=Math.min(y1,y2),h=Math.max(2,Math.abs(y1-y2));
  let color=s.total?'#075bd0':s.value>=0?'#38c5ad':'#ec8d94';
  out+=`<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="2" fill="${color}"><title>${safe(s.name)}: ${fmtM(s.value)}</title></rect>`;
  out+=`<text class="water-value" text-anchor="middle" x="${x+bw/2}" y="${Math.max(12,y-6)}">${s.total?fmtInt(s.value):`${s.value>=0?'+':''}${fmtInt(s.value)}`}</text>`;
  const w=s.name.split(' ');const half=Math.ceil(w.length/2);out+=`<text class="water-label" text-anchor="middle" x="${x+bw/2}" y="${H-25}"><tspan x="${x+bw/2}">${safe(w.slice(0,half).join(' '))}</tspan><tspan x="${x+bw/2}" dy="11">${safe(w.slice(half).join(' '))}</tspan></text>`;
  if(!s.total&&i<steps.length-2){const yn=py(s.end);out+=`<path d="M${x+bw} ${yn}H${x+gw}" stroke="#b7c7d6" stroke-dasharray="3 3"/>`}
 });
 return out+'</svg></div>'
}
function funnel(values){
 const names=['Leads generados','Contactados','Cualificados','Captados'],cols=['#0860d0','#13a9da','#26c9c8','#51cd78'];
 return `<div class="funnel-body"><div class="funnel-shapes">${values.map((v,i)=>`<div class="funnel-stage" style="background:${cols[i]}">${fmtInt(v)}</div>`).join('')}</div><div class="funnel-steps">${names.map((name,i)=>`<div class="funnel-step"><i style="background:${cols[i]}"></i><span class="funnel-name">${name}</span><b>${fmtInt(values[i])}</b>${i?`<small>${fmtPct(ratio(values[i],values[i-1]))} conversión</small>`:''}</div>`).join('')}</div></div>`
}
/* Reusable financial aggregations, all derived from the source Excel. */
function group(rows, keyFn, valueFn){const g=new Map();for(const r of rows){const k=keyFn(r);g.set(k,(g.get(k)||0)+valueFn(r))}return g}
function byMonth(rows,valueFn){return selectedMonths().map(m=>total(rows.filter(r=>r[0]===m),valueFn))}
function getRevenue(r){return r[16]-r[17]+r[18]-r[19]+r[20]}
function getNetMargin(r){return getRevenue(r)-r[21]}
function getProfit(r){return getNetMargin(r)-r[22]-r[23]}
function getRegion(r){return state.office==='all'?r[1]:F.offices.get(r[1])?.[4]}
function aggRegion(ctx,metric){const g=new Map();for(const r of ctx.closing){const region=getRegion(r);g.set(region,(g.get(region)||0)+(metric(r)||0))}return g}
function monthResults(ctx){const monthly=ctx.months.map(m=>ctx.flows.filter(r=>r[0]===m));return {labels:ctx.months.map(m=>MONTHS[m-1]),interest:monthly.map(r=>total(r,x=>x[16]-x[17])),gross:monthly.map(r=>total(r,getRevenue)),margin:monthly.map(r=>total(r,getNetMargin)),profit:monthly.map(r=>total(r,getProfit)),costs:monthly.map(r=>total(r,x=>x[17]+x[19]+x[21]+x[22]+x[23])),fees:monthly.map(r=>total(r,x=>x[18]-x[19]))}}
function productStats(ctx,measure='business'){
 const g=new Map();const isFlow=['margin','profit','fee','income'].includes(measure),source=isFlow?ctx.flows:ctx.closing;
 for(const r of source){const k=r[3],a=measure==='business'?r[4]+r[5]+r[6]:measure==='credits'?r[4]:measure==='deposits'?r[5]:measure==='contracts'?r[12]:measure==='margin'?getNetMargin(r):measure==='profit'?getProfit(r):measure==='fee'?r[18]-r[19]:getRevenue(r);g.set(k,(g.get(k)||0)+a)}
 return [...g].map(([id,value])=>({id,label:F.products.get(id)?.[1]||`Producto ${id}`,value})).sort((a,b)=>b.value-a.value)
}
function channelStats(ctx,field=6){const g=group(ctx.leadsFlows,r=>r[2],r=>r[field]);return [...g].map(([id,value])=>({id,label:F.channels.get(id)?.[1]||'Canal',value,channel:id})).sort((a,b)=>b.value-a.value)}
function segmentMetrics(ctx){
 const closing=new Map(),flow=new Map();
 for(const r of ctx.closing){let a=closing.get(r[2]);if(!a){a={credit:0,doubt:0,rwa:0,volume:0};closing.set(r[2],a)}a.credit+=r[4];a.doubt+=r[8];a.rwa+=r[11];a.volume+=r[4]+r[5]+r[6]}
 for(const r of ctx.flows){let a=flow.get(r[2]);if(!a){a={profit:0,opex:0,gross:0};flow.set(r[2],a)}a.profit+=getProfit(r);a.opex+=r[21];a.gross+=getRevenue(r)}
 const out=[];const totalRwa=[...closing.values()].reduce((s,a)=>s+a.rwa,0);
 for(const [id,s] of closing){const f=flow.get(id)||{profit:0,opex:0,gross:0};const allocEquity=ctx.liquidity.equity*ratio(s.rwa,totalRwa,1);
  out.push({id,label:F.segments.get(id)?.[1]||'Segmento',risk:ratio(s.doubt,s.credit),roe:ratio(f.profit*ctx.annualFactor,allocEquity),eff:ratio(f.opex,f.gross),profit:f.profit,credit:s.credit,volume:s.volume})}
 return out
}
function regionRiskHeat(ctx){
 const reg=state.region==='all'?[1,2,3,4,5]:[Number(state.region)];
 const products=state.product==='all'?[1,2,3,4,5,6]:[Number(state.product)];
 const prod=products.filter(p=>F.products.get(p)?.[3]==='Credito');
 const names=reg.map(id=>({label:F.regions.get(id)?.[1]||`R${id}`,region:id}));
 const col=prod.map(id=>F.products.get(id)?.[1]||`P${id}`);
 const values=reg.map(id=>prod.map(pid=>{
  const rs=ctx.closing.filter(r=>getRegion(r)===id&&r[3]===pid);
  return ratio(sum(rs,8),sum(rs,4))
 }));
 return heatmap(names,col,values,{rowTitle:'Región'})
}
function officeScores(ctx){
 const byOffice=new Map();
 for(const r of ctx.officeFlows){let o=byOffice.get(r[1]);if(!o){o={id:r[1],income:0,cost:0,claims:0,managerMonths:0,assets:0,satisfaction:0,surveys:0,months:0};byOffice.set(r[1],o)}
  o.income+=r[8];o.cost+=r[5];o.claims+=r[6];o.managerMonths+=r[2];o.months++;
  o.satisfaction+=r[4]*r[3];o.surveys+=r[3]
 }
 for(const r of ctx.officeClosing){const o=byOffice.get(r[1]);if(o){o.assets=r[7];o.managers=r[2]}}
 return [...byOffice.values()].map(o=>({...o,name:F.offices.get(o.id)?.[2]||`Oficina ${o.id}`,city:F.offices.get(o.id)?.[3]||'',region:F.offices.get(o.id)?.[4]||0,productivity:o.managerMonths?o.income*1000/o.managerMonths:0,efficiency:ratio(o.cost,o.income),rating:o.surveys?o.satisfaction/o.surveys:NaN})).sort((a,b)=>b.income-a.income)
}
function renderOfficeTable(ctx,limit=6){
 const rank=officeScores(ctx).slice(0,limit),byOffice=group(ctx.officeClosing,r=>r[1],r=>r[7]);
 const rows=rank.map(o=>({office:o.id,cells:[o.name,fmtM(o.assets),fmtM(o.income,1),fmtK(o.productivity),fmtPct(o.efficiency),`${fmt1(o.rating)} / 10`]}));
 return simpleTable(['Oficina','Activos','Ingresos','Prod. gestor','Eficiencia*','Satisfacción'],rows)
}
function firstKpi(ctx){const assets=sum(ctx.officeClosing,7),s=ctx.stock;
 return [
  kpi('Activos totales',fmtM(assets),'coins',{detail:'Saldo de cierre'}),
  kpi('Créditos concedidos',fmtM(s.credits),'credit',{trend:pctDelta(s.credits,s.creditsPrior)}),
  kpi('Depósitos captados',fmtM(s.deposits),'wallet',{trend:pctDelta(s.deposits,s.depositsPrior)}),
  kpi('Margen neto',fmtM(ctx.marginNet),'chart',{detail:'Acumulado del periodo'}),
  kpi('ROA',fmtPct(ctx.roa,2),'target',{detail:'Anualizado estimado'}),
  kpi('ROE',fmtPct(ctx.roe),'trending',{detail:'Capital asignado'}),
  kpi('CET1',fmtPct(ctx.cet1ratio),'shield',{detail:'Nivel regional / banco'}),
  kpi('Ratio de eficiencia',fmtPct(ctx.costIncome),'percentage',{detail:'Gastos / ingresos'})
 ].join('')
}
function execPage(ctx){
 const m=monthResults(ctx),products=productStats(ctx).slice(0,6),channels=channelStats(ctx),segs=segmentMetrics(ctx),l=ctx.leads;
 const notices=[`Beneficio ${fmtM(ctx.profit)} en el periodo seleccionado, con un margen financiero de ${fmtM(ctx.marginInterest)}.`,
  `Créditos ${fmtM(ctx.stock.credits)} y depósitos ${fmtM(ctx.stock.deposits)} al cierre de ${MONTHS[ctx.month-1]}.`,
  `La morosidad se sitúa en ${fmtPct(ctx.npl)} y la cobertura crediticia en ${fmtPct(ctx.coverage)}.`,
  `Se han generado ${fmtInt(l.leads)} leads y captado ${fmtInt(l.captured)} clientes por canales comerciales.`,
  `Liquidez LCR ${fmtPct(ctx.lcr)} y solvencia CET1 ${fmtPct(ctx.cet1ratio)} para el ámbito territorial seleccionado.`];
 const volume=products.map((p,i)=>({...p,color:COLORS[Math.min(i,COLORS.length-1)],product:p.id}));
 return `<div class="kpi-grid">${firstKpi(ctx)}</div><div class="dash-grid">
 ${panel('Evolución de ingresos, costes y beneficio','Importes mensuales acumulados por mes (M€)',svgLine(m.labels,[{name:'Ingresos operativos',values:m.gross,color:'#075bd0'},{name:'Costes totales',values:m.costs,color:'#0cb7c6'},{name:'Beneficio neto',values:m.profit,color:'#43c977'}],{valueFmt:v=>fmtInt(v),lastLabels:false}),{icon:'chart'})}
 ${panel('Volumen de negocio por producto','Créditos, depósitos e inversiones a cierre (M€)',horizontalBars(volume,{format:v=>fmtM(v)}),{icon:'layers'})}
 ${panel('Mix de captación por canal','Distribución de clientes captados durante el periodo',donut(channels,{center:fmtInt(ctx.leads.captured),subtitle:'Captaciones'}),{icon:'pie'})}
 ${panel('Rentabilidad vs. riesgo por segmento','ROE anualizado frente a ratio de mora',scatter(segs.map((s,i)=>({x:s.risk,y:s.roe,label:s.label,segment:s.id,color:COLORS[i]})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),{xLabel:'Ratio de mora (%)',yLabel:'ROE (%)'}),{icon:'scatter'})}
 ${panel('Embudo comercial','De leads a captaciones: volumen y conversión',funnel([l.leads,l.contacted,l.qualified,l.captured]),{icon:'filter'})}
 ${panel('Desempeño de oficinas','Principales oficinas según ingresos comerciales',renderOfficeTable(ctx),{icon:'building',foot:'* Eficiencia local = gastos locales / ingresos comerciales.'})}
 ${panel('Claves del periodo','Lectura ejecutiva de los principales indicadores',`<div class="insights">${notices.map(x=>`<div class="insight-item">${icon('check','icon icon-sm')}<span>${safe(x)}</span></div>`).join('')}</div>`,{class:'full story-card',icon:'spark'})}
 </div>`
}
function profitPage(ctx){
 const m=monthResults(ctx),segs=segmentMetrics(ctx),rank=productStats(ctx,'margin').filter(x=>x.value>0).slice(0,7);
 const marginFinancial=ctx.marginInterest,flow=ctx.fin;
 const data=[
  kpi('Margen financiero',fmtM(marginFinancial),'coins',{detail:'Intereses netos'}),
  kpi('Margen bruto',fmtM(ctx.gross),'chart',{detail:'Antes de explotación'}),
  kpi('Margen neto',fmtM(ctx.marginNet),'trending',{detail:'Antes de provisiones'}),
  kpi('Beneficio neto',fmtM(ctx.profit),'target',{trend:pctDelta(ctx.profit,ctx.profitPrior)}),
  kpi('ROE',fmtPct(ctx.roe),'percentage',{detail:'Anualizado'}),
  kpi('ROA',fmtPct(ctx.roa,2),'activity',{detail:'Anualizado'}),
  kpi('Comisiones netas',fmtM(ctx.feeNet),'wallet',{detail:'Ingresos - costes'}),
  kpi('Coste / ingresos',fmtPct(ctx.costIncome),'layers',{detail:'Eficiencia operativa'})].join('');
 const groupedByQuarter=[1,2,3,4].map(q=>ctx.flows.filter(r=>Math.ceil(r[0]/3)===q));
 const incomeMix=barChart(['T1','T2','T3','T4'],[
 {name:'Intereses netos',values:groupedByQuarter.map(rs=>total(rs,r=>r[16]-r[17])),color:'#0b5dca'},
 {name:'Comisiones netas',values:groupedByQuarter.map(rs=>total(rs,r=>r[18]-r[19])),color:'#17b6ca'},
 {name:'Otros ingresos',values:groupedByQuarter.map(rs=>sum(rs,20)),color:'#70d5bd'}],{tickFmt:v=>fmtInt(v)});
 return `<div class="kpi-grid">${data}</div><div class="dash-grid">
 ${panel('Evolución de márgenes y resultado','Detalle mensual, millones de euros',svgLine(m.labels,[{name:'Margen financiero',values:m.interest,color:'#075bd0'},{name:'Margen neto',values:m.margin,color:'#09b5cf'},{name:'Beneficio neto',values:m.profit,color:'#40bc79'}],{valueFmt:v=>fmtInt(v),lastLabels:false}),{icon:'chart'})}
 ${panel('Puente de margen bruto a beneficio','Desglose económico del periodo (M€)',waterfall(ctx.gross,[{name:'Gastos explotación',value:-flow.opex},{name:'Deterioros riesgo',value:-flow.impairment},{name:'Impuestos',value:-flow.tax}],{startLabel:'Margen bruto',endLabel:'Beneficio neto'}),{icon:'layers'})}
 ${panel('Ranking de margen por producto','Margen después de gastos operativos (M€)',horizontalBars(rank.map(x=>({...x,product:x.id})),{format:fmtM}),{icon:'trending'})}
 ${panel('Mix de ingresos','Intereses, comisiones y otros por trimestre',incomeMix,{icon:'coins'})}
 ${panel('ROE vs. eficiencia por segmento','Mayor ROE y menor coste / ingresos es preferible',scatter(segs.map((s,i)=>({x:s.eff,y:s.roe,label:s.label,segment:s.id,color:COLORS[i]})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),{xLabel:'Coste / ingresos (%)',yLabel:'ROE (%)'}),{icon:'scatter'})}
 ${panel('Resultado comercial por oficina','Ingresos y gastos operativos locales',renderOfficeTable(ctx,8),{icon:'building',foot:'La rentabilidad de oficina se basa en ingresos y gastos locales, distinta de la PyG por producto.'})}
 </div>`
}
function riskPage(ctx){
 const r=ctx.stock,s=ctx.fin,seriesSeg=[1,2,3,4,5].filter(id=>state.segment==='all'||id===Number(state.segment));
 const riskSeries=seriesSeg.map((id,i)=>({name:F.segments.get(id)?.[1]||'Segmento',color:COLORS[i],values:ctx.months.map(m=>{
 const rs=ctx.core.filter(row=>row[0]===m&&row[2]===id);return ratio(sum(rs,8),sum(rs,4));})}));
 const grades=group(ctx.ratingClosing,r=>r[2],r=>r[4]);
 const gradeVals=[...grades].map(([id,value])=>({label:F.ratings.get(id)?.[1]||'Rating',value})).sort((a,b)=>b.value-a.value);
 const provisions=ctx.months.map(m=>sum(ctx.core.filter(r=>r[0]===m),10));
 const doubtful=ctx.months.map(m=>sum(ctx.core.filter(r=>r[0]===m),8));
 const sectors=new Map();for(const row of ctx.ratingClosing){const sid=row[3];let v=sectors.get(sid);if(!v){v={id:sid,expo:0,doubt:0,prov:0};sectors.set(sid,v)}v.expo+=row[4];v.doubt+=row[5];v.prov+=row[6]}
 const watch=[...sectors.values()].sort((a,b)=>ratio(b.doubt,b.expo)-ratio(a.doubt,a.expo)).slice(0,7);
 const watchRows=watch.map(a=>[F.sectors.get(a.id)?.[1]||'Sector',fmtM(a.expo),fmtPct(ratio(a.doubt,a.expo),2),fmtPct(ratio(a.prov,a.doubt)),ratio(a.doubt,a.expo)>5?'Alto':ratio(a.doubt,a.expo)>3?'Medio':'Bajo']);
 const segs=segmentMetrics(ctx);
 const kpis=[
  kpi('Morosidad (NPL)',fmtPct(ctx.npl,2),'alert',{detail:'Saldo dudoso / créditos'}),
  kpi('Coste del riesgo',fmtPct(ctx.costRisk,2),'coins',{detail:'Deterioros anualizados'}),
  kpi('Cobertura',fmtPct(ctx.coverage),'shield',{detail:'Provisión / dudoso'}),
  kpi('Stage 2',fmtPct(ctx.stage2,2),'layers',{detail:'Sobre exposición'}),
  kpi('Stage 3',fmtPct(ratio(r.doubtful,r.exposure),2),'alert',{detail:'Dudosos / exposición'}),
  kpi('Provisiones',fmtM(r.provisions),'wallet',{detail:'Saldo de cierre'}),
  kpi('Exposición crediticia',fmtM(r.exposure),'credit',{detail:'Cartera a cierre'}),
  kpi('Deterioros del periodo',fmtM(s.impairment),'activity',{detail:'Gasto por deterioro'})].join('');
 return `<div class="kpi-grid">${kpis}</div><div class="dash-grid">
 ${panel('Evolución de la morosidad','Ratio NPL de cierre por segmento (%)',svgLine(ctx.months.map(m=>MONTHS[m-1]),riskSeries,{valueFmt:v=>fmtPct(v),tickFmt:v=>fmtPct(v),lastLabels:false}),{icon:'chart'})}
 ${panel('Mora por región y producto','Mapa de calor de ratios NPL (%)',regionRiskHeat(ctx),{icon:'table',foot:'Los tonos más intensos corresponden a mayor mora.'})}
 ${panel('Exposición por rating crediticio','Distribución del riesgo clasificado (M€)',horizontalBars(gradeVals,{format:fmtM}),{icon:'chart',foot:'Muestra de exposición clasificada de la tabla de rating.'})}
 ${panel('Dudosos y provisiones','Saldos de cierre por mes (M€)',svgLine(ctx.months.map(m=>MONTHS[m-1]),[{name:'Saldo dudoso',values:doubtful,color:'#0e62cc'},{name:'Provisiones',values:provisions,color:'#36c5a0'}],{valueFmt:v=>fmtInt(v),lastLabels:false}),{icon:'activity'})}
 ${panel('Rentabilidad frente a riesgo','Comparación de segmentos: NPL vs. ROE',scatter(segs.map((p,i)=>({x:p.risk,y:p.roe,label:p.label,segment:p.id,color:COLORS[i]})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),{xLabel:'Ratio NPL (%)',yLabel:'ROE (%)'}),{icon:'scatter'})}
 ${panel('Sectores bajo vigilancia','Exposición crediticia por riesgo estimado',simpleTable(['Sector','Exposición','NPL','Cobertura','Nivel'],watchRows),{icon:'alert',foot:'Clasificación orientativa con datos sintéticos; no representa alertas reales.'})}
 </div>`
}
function liquidityPage(ctx){
 const l=ctx.liquidity,last=ctx.month;
 const values=ctx.months.map(m=>ctx.liqRows.filter(r=>r[0]===m));
 const lc=values.map(r=>ratio(sum(r,2),sum(r,3))),ns=values.map(r=>ratio(sum(r,4),sum(r,5)));
 const maturities=DATA.maturities.filter(r=>r[0]===last).sort((a,b)=>a[1]-b[1]);
 const matChart=barChart(maturities.map(r=>F.maturityTypes.get(r[1])?.[1]?.replace(' meses','m')||''),[
  {name:'Activos',values:maturities.map(r=>r[2]),color:'#0b5dce'},
  {name:'Pasivos',values:maturities.map(r=>r[3]),color:'#27c0d2'}],{tickFmt:v=>fmtInt(v)});
 const buf=DATA.buffer.filter(r=>r[0]===last).map(r=>({label:F.bufferTypes.get(r[1])?.[1]||'Activo',value:r[2]})).sort((a,b)=>b.value-a.value);
 const stressRows=DATA.stress.filter(r=>r[0]===last),scenarioIDs=[...new Set(stressRows.map(r=>r[1]))].sort();
 const stressSeries=[1,2,3].map((id,i)=>({name:F.severities.get(id)?.[1]||`Nivel ${id}`,color:COLORS[[0,1,3][i]],values:scenarioIDs.map(sid=>{const row=stressRows.find(r=>r[1]===sid&&r[2]===id);return row?ratio(row[3],row[4]):NaN})}));
 const regionRows=ctx.liqClosing.map(r=>({region:r[1],cells:[F.regions.get(r[1])?.[1]||'Región',fmtPct(ratio(r[2],r[3])),fmtPct(ratio(r[4],r[5])),fmtPct(ratio(r[7],r[6])),fmtM(r[10]),fmtM(r[2])]}));
 const kpis=[
  kpi('LCR',fmtPct(ctx.lcr),'droplet',{detail:'HQLA / salidas 30d'}),
  kpi('NSFR',fmtPct(ctx.nsfr),'layers',{detail:'Financiación estable'}),
  kpi('CET1',fmtPct(ctx.cet1ratio),'shield',{detail:'Capital / RWA'}),
  kpi('Tier 1',fmtPct(ctx.tier1ratio),'target',{detail:'Capital Tier 1 / RWA'}),
  kpi('Loan to deposit',fmtPct(ratio(ctx.stock.credits,ctx.stock.deposits)),'arrow',{detail:'Créditos / depósitos'}),
  kpi('Gap de liquidez 30d',fmtM(l.gap),'calendar',{detail:'Flujo contractual neto'}),
  kpi('Activos líquidos HQLA',fmtM(l.hqla),'coins',{detail:'Saldo de cierre'}),
  kpi('RWA',fmtM(l.rwa),'layers',{detail:'Activos ponderados'})].join('');
 const capitalSplit=[{label:'CET1',value:Math.max(l.cet1,0)},{label:'AT1',value:Math.max(l.tier1-l.cet1,0)},{label:'Tier 2',value:Math.max(l.capital-l.tier1,0)}];
 const stressPanel=barChart(scenarioIDs.map(id=>F.scenarios.get(id)?.[1]||`Escenario ${id}`),stressSeries,{tickFmt:v=>`${fmtInt(v)} %`,valueFmt:v=>fmtPct(v)});
 const notes='Los datos regulatorios están disponibles por región. Los escenarios, vencimientos y buffers representan el conjunto del banco.';
 return `<div class="kpi-grid">${kpis}</div><div class="data-scope-warning">${icon('info','icon icon-sm')} ${safe(notes)}</div><div class="dash-grid">
 ${panel('Evolución de LCR y NSFR','Ratios regulatorios de liquidez (%)',svgLine(ctx.months.map(m=>MONTHS[m-1]),[{name:'LCR',values:lc,color:'#075bd0'},{name:'NSFR',values:ns,color:'#12b8cc'}],{valueFmt:v=>fmtPct(v),tickFmt:v=>fmtPct(v),lastLabels:false}),{icon:'chart'})}
 ${panel('Escalera de vencimientos','Activos y pasivos por tramo de vencimiento (M€)',matChart,{icon:'chart'})}
 ${panel('Capital regulatorio','Distribución del capital total a cierre',donut(capitalSplit,{center:fmtM(l.capital),subtitle:'Capital regulatorio'}),{icon:'pie'})}
 ${panel('Buffer de liquidez por activo','Composición de activos de alta liquidez HQLA (M€)',horizontalBars(buf,{format:fmtM}),{icon:'layers'})}
 ${panel('Escenarios de estrés','LCR bajo estrés base, moderado y severo',stressPanel,{icon:'bolt'})}
 ${panel('Solvencia por región','Indicadores regulatorios del periodo',simpleTable(['Región','LCR','NSFR','CET1','Gap 30d','HQLA'],regionRows),{icon:'building'})}
 </div>`
}
function clientsPage(ctx){
 const c=ctx.clients,l=ctx.leads;
 const monthClients=ctx.months.map(m=>ctx.clientsRows.filter(r=>r[0]===m)),monthLeads=ctx.months.map(m=>ctx.leadRows.filter(r=>r[0]===m));
 const mix=productStats(ctx,'contracts').slice(0,7).map(p=>({label:p.label,value:p.value}));
 const prodRanking=productStats(ctx).slice(0,7).map(p=>({...p,product:p.id}));
 const channels=channelStats(ctx);
 const segSummaries=new Map();for(const r of ctx.clientsClosing){let v=segSummaries.get(r[2]);if(!v){v={id:r[2],clients:0,linked:0,digital:0,products:0};segSummaries.set(r[2],v)}v.clients+=r[3];v.linked+=r[7];v.digital+=r[6];v.products+=r[8]}
 const segRows=[...segSummaries.values()].sort((a,b)=>b.clients-a.clients).map(v=>({cells:[F.segments.get(v.id)?.[1]||'',fmtInt(v.clients),fmtPct(ratio(v.linked,v.clients)),fmtPct(ratio(v.digital,v.clients)),fmt1(ratio(v.products,v.clients,1)),fmtInt(v.products)]}));
 const kpis=[
  kpi('Clientes activos',fmtInt(c.active),'users',{trend:pctDelta(c.active,c.prior)}),
  kpi('Altas del periodo',fmtInt(c.new),'trending',{detail:'Suma de altas mensuales'}),
  kpi('Clientes vinculados',fmtInt(c.linked),'link',{detail:'Saldo de cierre'}),
  kpi('Productos / cliente',fmt1(ratio(c.products,c.active,1)),'layers',{detail:'Promedio de cartera'}),
  kpi('Depósitos de clientes',fmtM(ctx.stock.deposits),'wallet',{trend:pctDelta(ctx.stock.deposits,ctx.stock.depositsPrior)}),
  kpi('Créditos a clientes',fmtM(ctx.stock.credits),'credit',{trend:pctDelta(ctx.stock.credits,ctx.stock.creditsPrior)}),
  kpi('Adopción digital',fmtPct(ratio(c.digital,c.active)),'globe',{detail:'Clientes digitales / activos'}),
  kpi('Leads comerciales',fmtInt(l.leads),'target',{trend:pctDelta(l.leads,l.prior)})].join('');
 return `<div class="kpi-grid">${kpis}</div><div class="dash-grid">
 ${panel('Embudo de captación comercial','Leads, contactos, cualificados y captados',funnel([l.leads,l.contacted,l.qualified,l.captured]),{icon:'filter'})}
 ${panel('Mix de productos contratados','Peso de contratos activos por producto',donut(mix,{center:fmtInt(mix.reduce((a,b)=>a+b.value,0)),subtitle:'Contratos activos'}),{icon:'pie'})}
 ${panel('Ranking por volumen de negocio','Créditos, ahorro e inversión (M€)',horizontalBars(prodRanking,{format:fmtM}),{icon:'chart'})}
 ${panel('Altas y bajas de clientes','Movimiento mensual de clientes',barChart(ctx.months.map(m=>MONTHS[m-1]),[{name:'Altas',values:monthClients.map(rs=>sum(rs,4)),color:'#0863d4'},{name:'Bajas',values:monthClients.map(rs=>sum(rs,5)),color:'#15c1cc'}],{tickFmt:v=>fmtInt(v)}),{icon:'activity'})}
 ${panel('Canales de captación','Captados por canal comercial',donut(channels,{center:fmtInt(l.captured),subtitle:'Clientes captados'}),{icon:'pie'})}
 ${panel('Detalle por segmento','Vinculación y actividad por tipología de cliente',simpleTable(['Segmento','Clientes','Vinculados','Digitales','Prod./cli.','Contratos'],segRows),{icon:'users'})}
 </div>`
}
function officesPage(ctx){
 const scores=officeScores(ctx),activeOffices=ctx.officeClosing.length,managers=sum(ctx.officeClosing,2),assets=sum(ctx.officeClosing,7);
 const lending=ctx.stock.credits,deposits=ctx.stock.deposits,localIncome=sum(ctx.officeFlows,8),localCosts=sum(ctx.officeFlows,5),satisfaction=ratio(total(ctx.officeClosing,r=>r[3]*r[4]),sum(ctx.officeClosing,3),1),
   productivity=ratio(localIncome*1000,sum(ctx.officeFlows,2),1);
 const kpis=[
  kpi('Oficinas activas',fmtInt(activeOffices),'building',{detail:'Red al cierre'}),
  kpi('Gestores comerciales',fmtInt(managers),'users',{detail:'Plantilla al cierre'}),
  kpi('Activos por oficina',fmtM(assets/Math.max(1,activeOffices),1),'coins',{detail:'Media de cierre'}),
  kpi('Depósitos por oficina',fmtM(deposits/Math.max(1,activeOffices),1),'wallet',{detail:'Media de cierre'}),
  kpi('Créditos por oficina',fmtM(lending/Math.max(1,activeOffices),1),'credit',{detail:'Media de cierre'}),
  kpi('Productividad gestor',fmtK(productivity),'target',{detail:'Ingresos / gestor-mes'}),
  kpi('Gasto local',fmtM(localCosts),'layers',{detail:'Total del periodo'}),
  kpi('Satisfacción',`${fmt2or1(satisfaction)} / 10`,'check',{detail:'Media ponderada'})].join('');
 const top=scores.slice(0,8),ranking=top.map(s=>({label:s.name,value:s.income}));
 const regions=[1,2,3,4,5].filter(id=>state.region==='all'||id===Number(state.region));
 const regionList=regions.map(id=>({id,name:F.regions.get(id)?.[1]||'',count:DATA.meta.offices.rows.filter(o=>o[4]===id).length}));
 const regionCredit=regions.map(id=>total(ctx.closing.filter(r=>getRegion(r)===id),r=>r[4]));
 const regionDeposit=regions.map(id=>total(ctx.closing.filter(r=>getRegion(r)===id),r=>r[5]));
 const regionTiles=`<div class="region-tiles">${regionList.map((r,i)=>`<div class="region-tile" data-region="${r.id}"><div class="stripe" style="background:${COLORS[i]}"></div><strong>${safe(r.name)}</strong><div class="num">${fmtInt(r.count)}</div><span>oficinas · ${fmtPct(ratio(r.count,156))} de la red</span></div>`).join('')}</div>`;
 const heatRows=top.slice(0,6),quarters=[1,2,3,4],heatValues=heatRows.map(o=>quarters.map(q=>{
  const subset=ctx.officeRows.filter(r=>r[1]===o.id&&Math.ceil(r[0]/3)===q&&ctx.includes(r[0]));
  return ratio(sum(subset,8)*1000,sum(subset,2),1)
 }));
 // This heatmap displays productivity in k€ per gestor, not percentages.
 const heatMin=Math.min(...heatValues.flat().filter(Number.isFinite),0),heatMax=Math.max(...heatValues.flat().filter(Number.isFinite),1);
 const customHeat=`<table class="heat-table"><thead><tr><th>Oficina</th>${quarters.map(q=>`<th>T${q}</th>`).join('')}</tr></thead><tbody>${heatRows.map((o,i)=>`<tr><td>${safe(o.name)}</td>${heatValues[i].map(v=>{const t=clamp((v-heatMin)/Math.max(1,heatMax-heatMin),0,1),bg=`rgba(${Math.round(214-164*t)},${Math.round(248-100*t)},${Math.round(226-25*t)},.86)`;return `<td style="background:${bg};color:${t>.7?'white':'#244e67'}">${fmt1(v)}</td>`}).join('')}</tr>`).join('')}</tbody></table><div class="heat-legend"><span>Menor productividad</span><span class="heat-gradient"></span><span>Mayor productividad</span></div>`;
 const scatterPoints=scores.slice(0,12).filter(o=>Number.isFinite(o.efficiency)&&Number.isFinite(o.productivity)).map((o,i)=>({x:o.efficiency,y:o.productivity,label:o.name.replace(' Comercial','').replace(' Centro',''),color:COLORS[i%COLORS.length]}));
 return `<div class="kpi-grid">${kpis}</div><div class="dash-grid">
 ${panel('Ranking de oficinas','Ingresos comerciales acumulados (M€)',horizontalBars(ranking,{format:v=>fmtM(v,1)}),{icon:'chart'})}
 ${panel('Distribución territorial de la red','Número de oficinas por región',regionTiles,{icon:'map',foot:'Selecciona una región para filtrar el cuadro de mando.'})}
 ${panel('Créditos y depósitos por región','Saldos bancarios al cierre (M€)',barChart(regions.map(id=>F.regions.get(id)?.[1]||''),[{name:'Créditos',values:regionCredit,color:'#0b64d2'},{name:'Depósitos',values:regionDeposit,color:'#15b9d0'}],{tickFmt:fmtInt}),{icon:'coins'})}
 ${panel('Productividad por oficina y trimestre','Ingresos comerciales por gestor (k€)',customHeat,{icon:'table'})}
 ${panel('Productividad vs. eficiencia','Ingreso por gestor (k€) y gastos / ingresos (%)',scatter(scatterPoints,{xLabel:'Coste / ingresos (%)',yLabel:'Productividad (k€)',yFmt:v=>fmt1(v)+' k€'}),{icon:'scatter',foot:'Vista ampliada para distinguir oficinas próximas. Pasa el cursor por un punto o usa Tab para ver su nombre y sus cifras.'})}
 ${panel('Detalle de las principales oficinas','Indicadores de gestión y satisfacción',renderOfficeTable(ctx,10),{icon:'building',foot:'Clic sobre una oficina para filtrar todas las vistas compatibles.'})}
 </div>`
}
function fmt2or1(v){return Number.isFinite(v)?nf2.format(v):'—'}
const PAGE_RENDERERS={executive:execPage,profit:profitPage,risk:riskPage,liquidity:liquidityPage,clients:clientsPage,offices:officesPage};
function option(value,label,active){return `<option value="${safe(value)}" ${String(value)===String(active)?'selected':''}>${safe(label)}</option>`}
function filter(name,id,opts){return `<div class="filter-item"><label for="f-${id}">${safe(name)}</label><select class="filter-select" id="f-${id}" data-filter="${id}" aria-label="${safe(name)}">${opts}</select></div>`}
function renderFilters(){
 const regionOptions=option('all','Todas',state.region)+DATA.meta.regions.rows.map(r=>option(r[0],r[1],state.region)).join('');
 const segments=option('all','Todos',state.segment)+DATA.meta.segments.rows.map(r=>option(r[0],r[1],state.segment)).join('');
 const products=option('all','Todos',state.product)+DATA.meta.products.rows.map(r=>option(r[0],r[1],state.product)).join('');
 const channels=option('all','Todos',state.channel)+DATA.meta.channels.rows.map(r=>option(r[0],r[1],state.channel)).join('');
 const offices=option('all','Todas',state.office)+DATA.meta.offices.rows.filter(o=>state.region==='all'||o[4]===Number(state.region)).map(r=>option(r[0],r[2],state.office)).join('');
 const periods=option('year','Año completo · 2024',state.period)+[1,2,3,4].map(q=>option(`q${q}`,`Trimestre ${q}`,state.period)).join('')+Array.from({length:12},(_,i)=>option(i+1,`${MONTHS[i]} 2024`,state.period)).join('');
 return `<div class="filter-panel"><div class="filter-title">${icon('filter')} <span>Filtros</span></div>${filter('Periodo','period',periods)}${filter('Región','region',regionOptions)}${filter('Oficina','office',offices)}${filter('Segmento','segment',segments)}${filter('Producto','product',products)}${filter('Canal','channel',channels)}</div>`
}
function breadcrumb(){const p=PAGES.find(x=>x.id===state.page);return p?.short||'Visión ejecutiva'}
function filterScope(){const parts=[];
 if(state.product!=='all')parts.push('Producto: cartera y cuenta de resultados');
 if(state.segment!=='all')parts.push('Segmento: cartera, resultados y clientes');
 if(state.channel!=='all')parts.push('Canal: captación comercial');
 if(state.office!=='all')parts.push('Oficina: ratios regulatorios referidos a su región');
 if(!parts.length)parts.push('Cada visual utiliza la granularidad disponible en el Excel original');
 return `<div class="data-scope"><span class="scope-info">${icon('info')} ${safe(parts[0])}</span>${parts.slice(1).map(s=>`<span class="scope-divider"></span><span>${safe(s)}</span>`).join('')}</div>`
}
function renderPageTabs(){return `<nav class="page-tabs" aria-label="Pestañas del informe">${PAGES.map(p=>`<button type="button" class="page-tab ${state.page===p.id?'active':''}" data-page="${p.id}">${icon(p.icon)} ${safe(p.label)}</button>`).join('')}</nav>`}
function render(){
 if(!state.ready)return;
 const ctx=getCtx();lastContext=ctx;
 const menu=PAGES.map(p=>`<button type="button" class="side-item ${state.page===p.id?'active':''}" data-page="${p.id}" title="${safe(p.label)}" aria-label="${safe(p.label)}" ${state.page===p.id?'aria-current="page"':''}>${icon(p.icon)}</button>`).join('');
 $('#app').innerHTML=`<div class="app-shell"><aside class="sidebar" aria-label="Navegación principal"><button class="side-brand" type="button" data-page="executive" title="BankVision · Ir al inicio" aria-label="BankVision · Ir al inicio"><img src="assets/bankvision-mark.png" alt="" width="42" height="42" /></button><nav class="side-nav">${menu}</nav><div class="sidebar-bottom"><div class="side-mini">BANKVISION</div></div></aside><main class="main">
 <header class="header"><div class="heading"><span class="heading-mark">${icon('chart','icon-lg')}</span><div><h1>Panel de Control Financiero Bancario</h1><p>${safe(breadcrumb())} <span class="muted">· Ejercicio 2024</span></p></div></div><div class="top-right"><span class="simulation-pill"><span class="sim-dot"></span> Datos 100 % simulados</span><span class="update-pill">${icon('calendar','icon-sm')} Corte: ${safe(MONTHS[ctx.month-1])} 2024</span><button class="icon-btn" type="button" data-action="reset" title="Restablecer filtros">${icon('refresh','icon-sm')} Restablecer</button><button class="icon-btn" type="button" data-action="csv" title="Exportar datos filtrados">${icon('download','icon-sm')} CSV</button></div></header>
 ${renderPageTabs()}${renderFilters()}${filterScope()}<div class="section-eyebrow">VISIÓN ANALÍTICA <span></span> ${safe(breadcrumb().toUpperCase())}</div>
 ${PAGE_RENDERERS[state.page](ctx)}
 <footer class="footer"><span><strong>BankVision / Banking Analytics</strong> · Proyecto demostrativo con 300.053 registros originales · Importes en millones de euros salvo indicación</span><span>Datos sintéticos · 2024 · Diseñado para portfolio profesional</span></footer>
 </main></div>`;
 document.title=`BankVision · ${breadcrumb()}`;
}
function showToast(message){const prev=$('.toast');if(prev)prev.remove();const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),2500)}
function exportCsv(){
 const ctx=lastContext,head=['Mes','Region','Segmento','Producto','Creditos_MEUR','Depositos_MEUR','Inversiones_MEUR','Dudosos_MEUR','Provisiones_MEUR','IngresosIntereses_MEUR','CosteFinanciacion_MEUR','ComisionesNetas_MEUR','Gastos_MEUR','Deterioros_MEUR','Beneficio_MEUR'];
 const rows=ctx.core.filter(r=>ctx.includes(r[0])).map(r=>[`${r[0]}/2024`,F.regions.get(getRegion(r))?.[1]||'',F.segments.get(r[2])?.[1]||'',F.products.get(r[3])?.[1]||'',r[4],r[5],r[6],r[8],r[10],r[16],r[17],r[18]-r[19],r[21],r[22],getProfit(r)]);
 const txt='\uFEFF'+[head,...rows].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([txt],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download=`bankvision_${state.page}_2024.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);showToast(`Exportadas ${fmtInt(rows.length)} filas a CSV`)
}
function reset(){state.period='year';state.region='all';state.office='all';state.segment='all';state.product='all';state.channel='all';render();showToast('Filtros restablecidos')}
$('#app').addEventListener('click',async e=>{
 const nav=e.target.closest('[data-page]');if(nav){state.page=nav.dataset.page;render();window.scrollTo({top:0,behavior:'smooth'});return}
 const action=e.target.closest('[data-action]');if(action){if(action.dataset.action==='reset')reset();else if(action.dataset.action==='csv')exportCsv();return}
 const product=e.target.closest('[data-product]');if(product){state.product=String(product.dataset.product);render();showToast('Producto filtrado');return}
 const channel=e.target.closest('[data-channel]');if(channel){state.channel=String(channel.dataset.channel);render();showToast('Canal filtrado');return}
 const segment=e.target.closest('[data-segment]');if(segment){state.segment=String(segment.dataset.segment);render();showToast('Segmento filtrado');return}
 const region=e.target.closest('[data-region]');if(region){state.region=String(region.dataset.region);state.office='all';render();showToast('Región filtrada');return}
 const office=e.target.closest('[data-office]');if(office){await selectOffice(String(office.dataset.office));showToast('Oficina filtrada');return}
});
$('#app').addEventListener('change',async e=>{
 const filter=e.target.closest('[data-filter]');if(!filter)return;
 const field=filter.dataset.filter,value=filter.value;
 if(field==='office'){await selectOffice(value);return}
 state[field]=value;if(field==='region')state.office='all';render();
});
init();
