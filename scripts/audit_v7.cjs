/* BankVision v7: independent model, risk and UI integrity checks, all synthetic. */
const fs=require('fs'),path=require('path'),vm=require('vm'),A=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const read=(r,n)=>JSON.parse(fs.readFileSync(path.join(r,'data',n),'utf8'));
const rg=read(ROOT,'core-regions.json'),r0=read(ROOT,'core-regions-baseline-v6.json');
const office=read(ROOT,'offices-monthly.json'),at=read(ROOT,'office-attribution-v7.json'),st=read(ROOT,'risk-stages-v7.json'),tr=read(ROOT,'transfer-pricing-v7.json');
const meta=read(ROOT,'meta.json'),liq=read(ROOT,'liquidity.json');
const num=(rows,col)=>rows.reduce((t,r)=>t+r[col],0);
const approx=(a,b,tol,msg)=>A.ok(Math.abs(a-b)<=tol,`${msg}: ${a} vs ${b}`);
let checks=0;
const k=(r)=>r.slice(0,4).join(':'),map0=new Map(r0.map(r=>[k(r),r]));
for(const row of rg){const old=map0.get(k(row));A.ok(old);for(let i of [4,5,6,7,8,9,11,16,18,19,20,21,22,23,24]){approx(row[i],old[i],1e-7,`Original non-calibrated column ${i}`);checks++;}}
for(let m=1;m<=12;m++)for(let reg=1;reg<=5;reg++){
 const v=rg.filter(r=>r[0]===m&&r[1]===reg),o=r0.filter(r=>r[0]===m&&r[1]===reg);
 const fl=(rs)=>num(rs,16)-num(rs,17)+num(rs,18)-num(rs,19)+num(rs,20)-num(rs,21)-num(rs,22)-num(rs,23);
 approx(fl(v),fl(o),.004,`Regional original profit ${reg}/${m}`);checks++;
 approx(num(v,17),num(o,17),.004,`Regional funding conserved ${reg}/${m}`);checks++;
}
const eq=num(liq.filter(r=>r[0]===12),11),ct=num(liq.filter(r=>r[0]===12),7),rw=num(liq.filter(r=>r[0]===12),6);
const coreClose=rg.filter(r=>r[0]===12),totalCoreRwa=num(coreClose,11);
approx(rw,totalCoreRwa,.005,'Regulatory RWA reconciles with core RWA');
let segments=[];
for(let id=1;id<=5;id++){
 const full=rg.filter(r=>r[2]===id),closing=coreClose.filter(r=>r[2]===id);
 const profit=num(full,16)-num(full,17)+num(full,18)-num(full,19)+num(full,20)-num(full,21)-num(full,22)-num(full,23);
 const capital=eq*num(closing,11)/totalCoreRwa;
 const roe=profit/capital*100;
 A.ok(roe>4&&roe<20,`Segment ${id} ROE outside transparent portfolio range: ${roe}`);
 segments.push({id,roe,profit,capital});checks++;
}
approx(segments.reduce((t,r)=>t+r.profit,0),num(rg,16)-num(rg,17)+num(rg,18)-num(rg,19)+num(rg,20)-num(rg,21)-num(rg,22)-num(rg,23),.002,'P&L reconciles segment to bank');
approx(segments.reduce((t,r)=>t+r.capital,0),eq,.002,'Capital assigned to all segments');
A.ok(ct<eq&&ct>0,'CET1 and equity are distinct positive perimeters');
const riskMap=new Map(st.map(r=>[r.slice(0,4).join(':'),r]));
for(const row of rg){const rs=riskMap.get(k(row));A.ok(rs,`Missing risk key ${k(row)}`);approx(row[10],rs[7]+rs[8]+rs[9],.003,`Stage reserves ${k(row)}`);checks++;}
const ranges=[];
for(let reg=1;reg<=5;reg++){
 const rows=st.filter(r=>r[0]===12&&r[1]===reg);
 const stage3=num(rows,9)/num(rows,6)*100;
 A.ok(stage3>50&&stage3<95,`Region ${reg} stage3 coverage ${stage3}`);ranges.push(stage3);checks++;
}
A.ok(Math.max(...ranges)-Math.min(...ranges)>9,'Stage3 coverage diversity missing');
const att=new Map(at.map(r=>[`${r[0]}:${r[1]}`,r]));
A.equal(att.size,1872);
let byOffice=new Map();
for(const row of office){
 const entry=att.get(`${row[0]}:${row[1]}`);A.ok(entry,`Missing office attribution ${row[0]},${row[1]}`);
 A.ok(entry[2]>0&&entry[2]<row[8],`Office attributed income outside gross ${row[0]},${row[1]}`);
 A.ok(entry[3]>row[2],`FTE includes commercial managers ${row[0]},${row[1]}`);
 if(!byOffice.has(row[1]))byOffice.set(row[1],{income:0,managerMonths:0,assets:0,fte:0});
 const o=byOffice.get(row[1]);o.income+=entry[2];o.managerMonths+=row[2];if(row[0]===12){o.fte=entry[3];o.assets=row[7];}checks+=2;
}
A.equal(byOffice.size,156);
for(const [id,o] of byOffice){
 const attribAnnualPerManagerEUR=o.income/o.managerMonths*12*1e6;const assetPerFteEUR=o.assets/o.fte*1e6;
 A.ok(attribAnnualPerManagerEUR>150000&&attribAnnualPerManagerEUR<1600000,`Office ${id} annual income attributable / manager ${attribAnnualPerManagerEUR}`);
 A.ok(assetPerFteEUR>8e6&&assetPerFteEUR<25e6,`Office ${id} assets / allocated FTE ${assetPerFteEUR}`);checks+=2;
}
A.equal(tr.length,300);
const feeProd=new Map();for(const r of rg)feeProd.set(r[3],(feeProd.get(r[3])||0)+r[18]-r[19]);
A.equal(feeProd.size,14);approx([...feeProd.values()].reduce((a,b)=>a+b,0),num(rg,18)-num(rg,19),.01,'Fee by all 14 products');
const feesAll=[...feeProd.values()].reduce((a,b)=>a+b,0);const services=[12,13,14].reduce((a,k)=>a+(feeProd.get(k)||0),0);
A.ok(services<feesAll/3,'Services should not masquerade as all fees');
// Actual page functions with real v7 JSONs and real office attribution lookup.
const names={meta:'meta.json',schema:'schema.json',core:'core-regions.json',clients:'clients.json',leads:'leads.json',ratings:'ratings.json',offices:'offices-monthly.json',campaigns:'campaigns.json',liquidity:'liquidity.json',maturities:'maturities.json',buffer:'liquid-assets.json',stress:'stress.json',officeAttribution:'office-attribution-v7.json',riskStages:'risk-stages-v7.json',transferPricing:'transfer-pricing-v7.json'};
const data=Object.fromEntries(Object.entries(names).map(([key,file])=>[key,read(ROOT,file)]));
const js=fs.readFileSync(path.join(ROOT,'app.js'),'utf8').split("$('#app').addEventListener")[0];
const harness=String.raw`
 Object.entries(__DATA).forEach(([key,val])=>DATA[key]=val);
 ['regions','offices','segments','products','channels','ratings','sectors','campaigns','bufferTypes','maturityTypes','scenarios','severities'].forEach(d=>F[d]=new Map(DATA.meta[d].rows.map(r=>[r[0],r])));
 F.officeAttribution=new Map(DATA.officeAttribution.map(r=>[String(r[0])+'-'+String(r[1]),r]));
 const A=__A;
 for(const period of ['year','q1','8'])for(const region of ['all','1','2'])for(const segment of ['all','1','4']){
   state.period=period;state.region=region;state.segment=segment;
   const ctx=getCtx(),segs=segmentMetrics(ctx),summary=segs.reduce((a,b)=>a+b.equity,0);
   A.ok(Math.abs(summary-ctx.allocatedEquity)<.001,'ROE allocated equity failed');
   A.ok(Math.abs(ctx.stock.provisions-ctx.stage.p1-ctx.stage.p2-ctx.stage.p3)<.05,'Stage reserve reconciliation failed');
   A.ok(ctx.coverageStage3>40&&ctx.coverageStage3<95,'Stage 3 coverage failed');
 }
 state.period='year';state.region='all';state.segment='all';
 const ctx=getCtx();
 A.ok(ctx.marginInterest>0&&ctx.gross>ctx.marginInterest);
 A.ok(ctx.roe>10&&ctx.roe<12);
 A.ok(ctx.coverageStage3>60&&ctx.coverageStage3<80);
 const ex=execPage(ctx),risk=riskPage(ctx),profit=profitPage(ctx),offices=officesPage(ctx);
 A.match(ex,/scatter-key-above/);
 A.match(ex,/patrimonio contable asignado/i);
 A.match(ex,/capital CET1/i);
 A.match(ex,/comisiones netas de todos los productos/i);
 A.match(risk,/Cobertura Stage 3/);
 A.match(risk,/Provisiones por fase IFRS 9/);
 A.match(profit,/Comisiones netas por los 14 productos/);
 A.match(offices,/FTE asignados/);
 A.match(offices,/Ingresos atribuibles/);
 A.match(renderFilters(),/Trimestre 1/);
 A.match(__JS,/exportCsv/);
 console.log('Financial flows',ctx.profit.toFixed(3),'M EUR; Stage3',ctx.coverageStage3.toFixed(1),'%; ROE',ctx.roe.toFixed(2),'%; feeNet',ctx.feeNet.toFixed(1),'M EUR');
`;
const text=harness.replaceAll('\u0007','`').replace('A.match(fs__S,\'csv\');',"A.match(__JS,/exportCsv/);");
vm.runInNewContext(js+text,{__DATA:data,__A:A,__JS:js,console,Intl},{timeout:35000});
console.log(`OK v7: ${checks} granular financial/risk/employee controls + 27 UI filter-state validations; ${byOffice.size} offices, 14 products, ${ranges.map(x=>x.toFixed(1)).join('/')}% regional Stage 3 coverage`);
