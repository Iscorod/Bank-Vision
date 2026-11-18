const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const load=f=>JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8'));
const data={meta:load('meta.json'),schema:load('schema.json'),core:load('core-regions.json'),clients:load('clients.json'),leads:load('leads.json'),ratings:load('ratings.json'),offices:load('offices-monthly.json'),campaigns:load('campaigns.json'),liquidity:load('liquidity.json'),maturities:load('maturities.json'),buffer:load('liquid-assets.json'),stress:load('stress.json')};
let js=fs.readFileSync(path.join(root,'app.js'),'utf8').split("$('#app').addEventListener")[0];
const harness=String.raw`
Object.entries(__D).forEach(([k,v])=>DATA[k]=v);
['regions','offices','segments','products','channels','ratings','sectors','campaigns','bufferTypes','maturityTypes','scenarios','severities'].forEach(k=>F[k]=new Map(DATA.meta[k].rows.map(r=>[r[0],r])));
const assert=__assert;
let ctx=getCtx();assert.equal(ctx.months.length,12);
const segments=segmentMetrics(ctx);
const rawRwa=segments.reduce((s,a)=>s+(a.credit?0:0),0);
const frac=segments.reduce((s,a)=>s+a.profit,0);
assert.ok(Math.abs(frac-ctx.profit)<.0005);
assert.equal(segments.length,5);
for(const id of Object.keys(PAGE_RENDERERS)){
 const html=PAGE_RENDERERS[id](ctx);
 assert.match(html,/class="kpi-grid"/);
 assert.match(html,/class="dash-grid"/);
 if(id==='executive'){
  assert.match(html,/Servicios: comisiones netas/);
  assert.match(html,/Escala común de saldos/);
  assert.match(html,/Leyenda de segmentos/);
  assert.match(html,/vs. Dic 2023/);
  assert.equal((html.match(/class="scatter-key-item"/g)||[]).length,5);
 }
 if(id==='offices'){
   assert.match(html,/Gestores \(cierre\)/);
   assert.match(html,/Prod. por gestor-mes/);
 }
 console.log('OK render',id,html.length);
}
state.region='1';ctx=getCtx();
assert.ok(Math.abs(ctx.profit-179.22287)<0.001);
state.region='all';state.period='q2';ctx=getCtx();assert.equal(ctx.months.length,3);
state.period='year';state.region='1';state.office='18';state.officeChunks[1]=__R1;ctx=getCtx();
assert.equal(ctx.months.length,12);assert.ok(ctx.fin.interest>0);
assert.match(PAGE_RENDERERS.offices(ctx),/gestor-mes/);
console.log('OK filters + branch + quarter and reconciled 2024 North');
`;
const c={__D:data,__R1:load('core-offices-r1.json'),__assert:assert,console,Intl};
vm.runInNewContext(js+harness,c,{timeout:10000});
