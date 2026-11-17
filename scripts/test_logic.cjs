const fs=require('fs');const vm=require('vm');const path=require('path');
const dir=path.resolve(__dirname,'..');let app={html:'',addEventListener(){},set innerHTML(x){this.html=x},get innerHTML(){return this.html}};
const context={console,Intl,URL,Number,Math,Array,Map,Set,Object,String,Date,Promise,setTimeout,
 document:{querySelector:(s)=>s==='#app'?app:null,title:''},window:{scrollTo(){}},
 fetch:async (u)=>{try{return {ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(dir,u),'utf8'))}}catch(e){return {ok:false,status:404}}},
};
vm.createContext(context);
const src=fs.readFileSync(path.join(dir,'app.js'),'utf8');
try{vm.runInContext(src+'\nglobalThis.test={state,render,getCtx,DATA};',context,{filename:'app.js'})}catch(e){console.log('VM parse/runtime error',e);process.exit(1)}
setTimeout(()=>{
 let t=context.test;console.log('loaded',t.state.ready,'html length',app.html.length);
 if(!t.state.ready){console.log(app.html.slice(0,1000));process.exit(1)}
 for(const id of ['executive','profit','risk','liquidity','clients','offices']){
  t.state.page=id;
  try{t.render();let kpis=(app.html.match(/class="kpi-card"/g)||[]).length,panels=(app.html.match(/class="panel /g)||[]).length;console.log(id,kpis,'KPIs',panels,'panels', 'html',app.html.length);if(kpis!==8||panels<6)process.exitCode=1;}
  catch(e){console.log('ERR',id,e.stack);process.exitCode=1}
 }
 t.state.period='q4';t.state.region='2';t.state.segment='1';t.state.product='1';
 try{t.render();console.log('filtered', t.getCtx().stock.credits.toFixed(2),'credits M');}
 catch(e){console.log('FILTER ERR',e.stack);process.exitCode=1}
},2000)
