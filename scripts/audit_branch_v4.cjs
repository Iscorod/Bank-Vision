const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const DATA=path.resolve(__dirname,'../data');
const load=f=>JSON.parse(fs.readFileSync(path.join(DATA,f),'utf8'));
const meta=load('meta.json'),rg=load('core-regions.json'),office=load('offices-monthly.json');
const region=new Map(meta.offices.rows.map(o=>[o[0],o[4]]));
const byKey=new Map(rg.map(r=>[[r[0],r[1],r[2],r[3]].join('-'),r]));
const byOffice=new Map();let checks=0,records=0;
for(let r=1;r<=5;r++){
 const core=load(`core-offices-r${r}.json`),agg=new Map();
 for(const row of core){records++;const key=[row[0],r,row[2],row[3]].join('-');let a=agg.get(key);if(!a){a=Array(25).fill(0);agg.set(key,a)}for(let c=4;c<25;c++)a[c]+=row[c];
  const ok=`${row[0]}-${row[1]}`;byOffice.set(ok,(byOffice.get(ok)||0)+row[16]+row[18]+row[20]);
 }
 for(const [k,nums] of agg){const orig=byKey.get(k);assert(orig,`Region key missing ${k}`);for(let c=4;c<25;c++){assert(Math.abs(nums[c]-orig[c])<.012,`${k} col${c} ${nums[c]} vs ${orig[c]}`);checks++}}
}
const regionOffice=new Map(),summary=new Map();
for(const row of office){
 const key=`${row[0]}-${row[1]}`,rid=region.get(row[1]);
 assert(Math.abs(byOffice.get(key)-row[8])<.003,`Office revenue ${key}`);checks++;
 const mk=`${row[0]}-${rid}`,a=regionOffice.get(mk)||{income:0,assets:0,localCosts:0};
 a.income+=row[8];a.assets+=row[7];a.localCosts+=row[5];regionOffice.set(mk,a);
 let b=summary.get(row[1]);if(!b){b={income:0,cost:0,managers:0,assets:0,score:0,weighted:0};summary.set(row[1],b)}
 b.income+=row[8];b.cost+=row[5];b.managers+=row[2];b.score+=row[4]*row[3];b.weighted+=row[3];if(row[0]===12)b.assets=row[7];
}
for(const [mk,a] of regionOffice){const [month,rid]=mk.split('-').map(Number),rows=rg.filter(x=>x[0]===month&&x[1]===rid);
 const target=rows.reduce((t,x)=>t+x[16]+x[18]+x[20],0);assert(Math.abs(target-a.income)<.006,`${mk} region sum`);checks++;
}
function stdev(v){const avg=v.reduce((t,n)=>t+n,0)/v.length;return Math.sqrt(v.reduce((t,n)=>t+(n-avg)**2,0)/(v.length-1))}
const ratios=[...summary.values()].map(x=>({yield:x.income/x.assets*100,eff:x.cost/x.income*100,prod:x.income/x.managers*1000,sat:x.score/x.weighted}));
assert(stdev(ratios.map(x=>x.yield))>.5,'Insufficient office income/assets heterogeneity');
assert(stdev(ratios.map(x=>x.eff))>2,'Insufficient local cost ratio heterogeneity');
assert(stdev(ratios.map(x=>x.sat))>.3,'Insufficient satisfaction heterogeneity');
assert(stdev(ratios.map(x=>x.prod))>65,'Insufficient productivity heterogeneity');
console.log(`OK: ${checks} reconciliation checks; ${records} office-level core rows; ${summary.size} offices; 12 monthly periods.`);
console.log('Dispersion SD',Object.fromEntries(Object.keys(ratios[0]).map(k=>[k,+stdev(ratios.map(x=>x[k])).toFixed(2)])));
