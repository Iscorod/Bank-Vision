/* Independent consistency tests for the synthetic BankVision datasets. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const BASE=path.resolve(__dirname,'../data');
const load=n=>JSON.parse(fs.readFileSync(path.join(BASE,n),'utf8'));
const core=load('core-regions.json'),office=load('offices-monthly.json'),meta=load('meta.json');
const sum=(arr,k)=>arr.reduce((t,r)=>t+Number(r[k]||0),0);
const approx=(a,b,msg)=>assert.ok(Math.abs(a-b)<.06,`${msg}: ${a} vs ${b}`);
let checks=0;
for(let region=1;region<=5;region++)for(let month=1;month<=12;month++){
 const a=core.filter(r=>r[0]===month&&r[1]===region),b=office.filter(r=>r[0]===month&&meta.offices.rows.find(o=>o[0]===r[1])?.[4]===region);
 const gross=sum(a,16)+sum(a,18)+sum(a,20);
 const cost=sum(a,17)+sum(a,19)+sum(a,21)+sum(a,22)+sum(a,23);
 const profit=sum(a,16)-sum(a,17)+sum(a,18)-sum(a,19)+sum(a,20)-sum(a,21)-sum(a,22)-sum(a,23);
 approx(gross-cost,profit,`PyG ${region}/${month}`);
 approx(sum(b,8),gross,`Red office gross revenue ${region}/${month}`);
 for (const metric of [4,5,6]) {
  const byProduct=new Map();for(const r of a)byProduct.set(r[3],(byProduct.get(r[3])||0)+r[metric]);
  approx([...byProduct.values()].reduce((x,y)=>x+y,0),sum(a,metric),`Product split ${metric} ${region}/${month}`);
 }
 checks+=5;
}
const north=core.filter(r=>r[1]===1);
const fullProfit=sum(north,16)-sum(north,17)+sum(north,18)-sum(north,19)+sum(north,20)-sum(north,21)-sum(north,22)-sum(north,23);
approx(fullProfit,179.22287,'North 2024 profit');
console.log(`OK: ${checks} tests of income–cost–profit, office reconciliation, products by region/month + 2024 North profit`);
