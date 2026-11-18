const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const load=f=>JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8'));
const names={meta:'meta.json',schema:'schema.json',core:'core-regions.json',clients:'clients.json',leads:'leads.json',ratings:'ratings.json',offices:'offices-monthly.json',campaigns:'campaigns.json',liquidity:'liquidity.json',maturities:'maturities.json',buffer:'liquid-assets.json',stress:'stress.json'};
const data=Object.fromEntries(Object.entries(names).map(([k,v])=>[k,load(v)]));
const js=fs.readFileSync(path.join(root,'app.js'),'utf8').split("$('#app').addEventListener")[0];
const test=String.raw`
 Object.entries(__D).forEach(([k,v])=>DATA[k]=v);
 ['regions','offices','segments','products','channels','ratings','sectors','campaigns','bufferTypes','maturityTypes','scenarios','severities'].forEach(k=>F[k]=new Map(DATA.meta[k].rows.map(r=>[r[0],r])));
 const A=__assert;
 for(const period of ['year','q2','7'])for(const region of ['all','1'])for(const seg of ['all','1','4']){
  state.period=period;state.region=region;state.segment=seg;
  const ctx=getCtx(),segs=segmentMetrics(ctx),equity=segs.reduce((s,a)=>s+a.equity,0),profits=segs.reduce((s,a)=>s+a.profit,0);
  A.ok(Math.abs(equity-ctx.allocatedEquity)<1e-5,'equity mismatch '+period+'/'+region+'/'+seg);
  A.ok(Math.abs(profits-ctx.profit)<1e-5,'profit mismatch '+period+'/'+region+'/'+seg);
  A.ok(Math.abs(ratio(profits*ctx.annualFactor,equity)-ctx.roe)<1e-6,'ROE mismatch '+period+'/'+region+'/'+seg);
  const html=execPage(ctx);
  A.match(html,/class="finance-breakdown"/);
  A.match(html,/class="funnel-layout funnel-expanded"/);
  A.match(html,/Ver causas de pérdidas/);
  A.match(html,/Capital/);
 }
 state.period='year';state.region='all';state.segment='all';
 const ctx=getCtx(),segs=segmentMetrics(ctx);
 A.ok(segs.find(s=>s.label==='Banca Privada').roe>0);
 A.ok(Math.abs(ctx.feeNet-838.99993)<.1);
 A.equal(selectedMonths().length,12);
 console.log('OK v6: 18 segment equity/ROE reconciliations, fee statement, funnel markup');
`;
vm.runInNewContext(js+test,{__D:data,__assert:assert,console,Intl},{timeout:30000});
