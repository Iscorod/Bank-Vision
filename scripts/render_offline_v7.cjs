const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const load=n=>JSON.parse(fs.readFileSync(path.join(ROOT,'data',n),'utf8'));
const data={};
for(const [k,v] of Object.entries({meta:'meta.json',schema:'schema.json',core:'core-regions.json',clients:'clients.json',leads:'leads.json',ratings:'ratings.json',offices:'offices-monthly.json',campaigns:'campaigns.json',liquidity:'liquidity.json',maturities:'maturities.json',buffer:'liquid-assets.json',stress:'stress.json',officeAttribution:'office-attribution-v7.json',riskStages:'risk-stages-v7.json',transferPricing:'transfer-pricing-v7.json'})) data[k]=load(v);
const js=fs.readFileSync(path.join(ROOT,'app.js'),'utf8').split("$('#app').addEventListener")[0];
const app={innerHTML:''},doc={title:'',querySelector:()=>app};
const ctx=vm.createContext({console,Intl,document:doc,__DATA:data});
vm.runInContext(js+`
 Object.entries(__DATA).forEach(([k,v])=>DATA[k]=v);
 ['regions','offices','segments','products','channels','ratings','sectors','campaigns','bufferTypes','maturityTypes','scenarios','severities'].forEach(d=>F[d]=new Map(DATA.meta[d].rows.map(r=>[r[0],r])));
 F.officeAttribution=new Map(DATA.officeAttribution.map(r=>[String(r[0])+'-'+String(r[1]),r]));
 state.ready=true;
 globalThis.setPage=(p)=>{state.page=p;render()};
`,ctx,{timeout:35000});
let css=fs.readFileSync(path.join(ROOT,'styles.css'),'utf8');
const png='data:image/png;base64,'+fs.readFileSync(path.join(ROOT,'assets','bankvision-mark.png')).toString('base64');
for(const id of ['executive','profit','risk','liquidity','clients','offices']){
 ctx.setPage(id);const html=app.innerHTML.replaceAll('src="assets/bankvision-mark.png"',`src="${png}"`);
 const doc=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><div id="app">${html}</div></body></html>`;
 fs.writeFileSync(path.join(ROOT,`_offline_${id}.html`),doc);console.log(id,doc.length);
}
