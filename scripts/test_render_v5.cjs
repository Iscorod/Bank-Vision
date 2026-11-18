const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const load=f=>JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8'));
const names={meta:'meta.json',schema:'schema.json',core:'core-regions.json',clients:'clients.json',leads:'leads.json',ratings:'ratings.json',offices:'offices-monthly.json',campaigns:'campaigns.json',liquidity:'liquidity.json',maturities:'maturities.json',buffer:'liquid-assets.json',stress:'stress.json'};
const data=Object.fromEntries(Object.entries(names).map(([k,v])=>[k,load(v)]));
const js=fs.readFileSync(path.join(root,'app.js'),'utf8').split("$('#app').addEventListener")[0];
const harness=String.raw`
 Object.entries(__D).forEach(([k,v])=>DATA[k]=v);
 ['regions','offices','segments','products','channels','ratings','sectors','campaigns','bufferTypes','maturityTypes','scenarios','severities'].forEach(k=>F[k]=new Map(DATA.meta[k].rows.map(r=>[r[0],r])));
 const A=__assert;
 let ctx=getCtx();
 A.equal(ctx.months.length,12);
 for(const id of Object.keys(PAGE_RENDERERS)){
  const html=PAGE_RENDERERS[id](ctx);
  A.match(html,/class="kpi-grid"/);
  A.match(html,/class="dash-grid"/);
  if(id==='executive'){
   A.match(html,/data-local-filter="productGroup"/);
   A.match(html,/data-local-filter="productCardItem"/);
   A.match(html,/data-local-filter="officeSort"/);
   A.match(html,/data-local-filter="officeLimit"/);
   A.match(html,/class="funnel-layout funnel-expanded"/);
   A.equal((html.match(/class="executive-funnel-panel"/g)||[]).length,0); // classes are combined with panel
   A.match(html,/panel executive-funnel-panel/);
   A.match(html,/panel executive-office-panel/);
   A.equal((html.match(/class="product-section"/g)||[]).length,1);
   A.equal((html.match(/data-office="\d+"/g)||[]).length,10);
   A.match(html,/Cartera de créditos/);
   A.match(html,/Escala común de saldos/);
   A.match(html,/Leyenda de segmentos/);
  }
  console.log('OK render',id,html.length);
 }
 for(const [group,title,count] of [['deposits','Depósitos de clientes',1],['investments','Inversiones administradas',1],['services','Servicios: comisiones netas',1],['all','Cartera de créditos',4]]){
  state.productGroup=group;
  const html=productBreakdown(ctx);
  A.match(html,new RegExp(title));
  A.equal((html.match(/class="product-section"/g)||[]).length,count);
  console.log('OK category',group);
 }
 state.productGroup='credits';state.productCardItem='1';
 let html=productBreakdown(ctx);
 A.equal((html.match(/class="bar-item"/g)||[]).length,1);
 A.match(html,/Producto seleccionado/);
 A.doesNotMatch(html,/Σ productos:.*conciliado/);
 state.productCardItem='all';
 for(const limit of ['5','10','all']){
  state.officeLimit=limit;
  const str=renderExecutiveOfficeTable(ctx);
  const n=(str.match(/data-office="\d+"/g)||[]).length;
  A.equal(n,limit==='all'?156:Number(limit));
  console.log('OK office top',limit,n);
 }
 state.officeSort='rating'; A.match(renderExecutiveOfficeTable(ctx),/option value="rating" selected/);
 state.region='1';ctx=getCtx(); A.ok(Math.abs(ctx.profit-179.22287)<0.001);
 state.region='all';state.period='q2';ctx=getCtx();A.equal(ctx.months.length,3);
 console.log('OK v5 interactive controls and underlying financial filters');
`;
vm.runInNewContext(js+harness,{__D:data,__assert:assert,console,Intl},{timeout:20000});
