from pathlib import Path
p=Path(__file__).resolve().parents[1]
js=p/'app.js';s=js.read_text()
def rep(old,new):
 global s
 assert old in s, f'NOT FOUND {old[:100]}'
 s=s.replace(old,new)
# data initialization
rep("buffer:'liquid-assets.json',stress:'stress.json'", "buffer:'liquid-assets.json',stress:'stress.json',officeAttribution:'office-attribution-v7.json',riskStages:'risk-stages-v7.json',transferPricing:'transfer-pricing-v7.json'")
rep("keys.forEach((k,i)=>DATA[k]=arr[i]);", "keys.forEach((k,i)=>DATA[k]=arr[i]);\n  F.officeAttribution=new Map(DATA.officeAttribution.map(r=>[`${r[0]}-${r[1]}`,r]));")
# stage3 model equivalent
anchor="function getCtx(){"
code='''// Stage-specific allowances: v7 ECL scenario. Monetary amounts in M€.
const STAGE3_RATE={1:.57,2:.79,3:.72,4:.67,5:.86,6:.70};
const STAGE2_RATE={1:.029,2:.075,3:.064,4:.058,5:.096,6:.060};
const STAGE1_RATE={1:.0019,2:.0045,3:.0033,4:.0034,5:.0068,6:.0036};
const REGION_RISK={1:.94,2:1.03,3:1.10,4:.98,5:1.055};
const SEGMENT_RISK={1:.96,2:1.06,3:1.015,4:1.09,5:1.045};
function stageEcl(row){
 const m=row[0],region=state.office==='all'?row[1]:F.offices.get(row[1])?.[4],seg=row[2],prod=row[3];
 if(!STAGE3_RATE[prod]||!region)return {s1:0,s2:0,s3:0,p1:0,p2:0,p3:0};
 const exposure=Math.max(0,row[7]),s3=Math.min(exposure,Math.max(0,row[8])),s2=Math.max(0,Math.min(row[9],exposure-s3)),s1=Math.max(0,exposure-s3-s2);
 const mult=REGION_RISK[region]*SEGMENT_RISK[seg]*(1+.021*Math.sin(.65*m+.75*region+1.1*seg));
 return {s1,s2,s3,p1:s1*STAGE1_RATE[prod]*mult,p2:s2*STAGE2_RATE[prod]*mult,p3:s3*Math.min(.94,STAGE3_RATE[prod]*mult)};
}
function riskStages(rows){const res={s1:0,s2:0,s3:0,p1:0,p2:0,p3:0};for(const row of rows){const e=stageEcl(row);for(const k of Object.keys(res))res[k]+=e[k]}return res;}
'''
rep(anchor,code+anchor)
rep("const annualFactor=12/months.length;","const annualFactor=12/months.length;\n const stage=riskStages(closing);")
rep("fin:f,marginInterest,feeNet,gross,marginNet,profit", "fin:f,marginInterest,feeNet,gross,marginNet,profit,stage")
rep("coverage:ratio(s.provisions,s.doubtful),costRisk", "coverage:ratio(s.provisions,s.doubtful),coverageStage3:ratio(stage.p3,stage.s3),costRisk")
# scatter: legend first and explicit exact positions, no clipping
rep('''let out=`<div class="chart-wrap scatter-wrap"><svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${safe(opts.aria||'Gráfico de dispersión. Cada segmento se identifica en la leyenda.')} ">`;''', '''let out=`<div class="chart-wrap scatter-wrap"><svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${safe(opts.aria||'Gráfico de dispersión. Cada segmento se identifica en la leyenda.')} ">`;''')
old=''' if(showLegend){
   out+=`<div class="scatter-key" aria-label="Leyenda de segmentos">${nums.map((p,i)=>`<div class="scatter-key-item" ${p.segment?`data-segment="${safe(p.segment)}"`:''}><b class="scatter-key-marker" style="background:${p.y<0?'#d45d70':(p.color||COLORS[i%COLORS.length])}">${i+1}</b><span>${safe(p.label)}</span><small>Mora ${safe(xFmt(p.x))} · ROE ${safe(yFmt(p.y))}</small>${Number.isFinite(p.capital)?`<em>Capital ${fmtM(p.capital,1)} · ${fmtPct(ratio(p.capital,nums.reduce((a,q)=>a+(q.capital||0),0)))}</em>`:''}</div>`).join('')}</div>`;
 }
 return out;'''
new=''' if(showLegend){
   const legend=`<div class="scatter-key ${opts.legendTop?'scatter-key-above':''}" aria-label="Leyenda de segmentos">${nums.map((p,i)=>`<div class="scatter-key-item" ${p.segment?`data-segment="${safe(p.segment)}"`:''}><b class="scatter-key-marker" style="background:${p.y<0?'#d45d70':(p.color||COLORS[i%COLORS.length])}">${i+1}</b><span>${safe(p.label)}</span><small>${safe(xFmt(p.x))} mora · ${safe(yFmt(p.y))} ROE</small>${Number.isFinite(p.capital)?`<em>Capital ${fmtM(p.capital,1)} · ${fmtPct(ratio(p.capital,nums.reduce((a,q)=>a+(q.capital||0),0)))}</em>`:''}</div>`).join('')}</div>`;
   out=opts.legendTop?legend+out:out+legend;
 }
 return out;'''
rep(old,new)
# Segment P&L includes negative NII analysis and share within capital in table
rep("<td>${fmtM(s.equity,1)}</td><td>${fmtPct(s.roe)}</td>","<td>${fmtM(s.equity,1)} (${fmtPct(ratio(s.equity,totalEquity))})</td><td>${fmtM(s.rwa,1)}</td><td>${fmtPct(s.roe)}</td>")
rep("<th>Patrimonio</th><th>ROE</th>","<th>Patrimonio y peso</th><th>RWA</th><th>ROE</th>")
rep("Patrimonio distribuido según RWA. El ROE negativo puede deberse a financiación, gastos de explotación y deterioros, aunque la morosidad sea baja.","Patrimonio distribuido según RWA. La v7 aplica una asignación revisada de costes de financiación (transfer pricing interno) a Banca Privada e Institucional, compensada en los demás segmentos; el beneficio bancario total no cambia.")
# add more explicit capital bridge and fee mix
rep('''<div><span>CET1 / RWA · capital regulatorio</span><strong>${fmtM(ctx.liquidity.cet1)} / ${fmtM(ctx.liquidity.rwa)}</strong></div>
 </div>`;''','''<div><span>CET1 / RWA · capital regulatorio</span><strong>${fmtM(ctx.liquidity.cet1)} / ${fmtM(ctx.liquidity.rwa)}</strong></div>
 <div><span>Comisiones netas · 14 productos</span><strong>${fmtM(ctx.feeNet)}</strong></div>
 <div><span>Capital contable vs. CET1</span><strong>${fmtM(ctx.allocatedEquity)} / ${fmtM(ctx.liquidity.cet1)}</strong><small>No son magnitudes equivalentes</small></div>
 </div>`;''')
rep("`Mora ${fmtPct(ctx.npl)}; provisiones totales ${fmtM(ctx.stock.provisions)}. Su relación con dudosos (${fmtPct(ctx.coverage)}) es un proxy, no una cobertura Stage 3 regulatoria.`", "`Mora ${fmtPct(ctx.npl)}. Provisiones Stage 3 ${fmtM(ctx.stage.p3)} / dudosos ${fmtM(ctx.stage.s3)} = cobertura específica simulada ${fmtPct(ctx.coverageStage3)}. Reservas totales ${fmtM(ctx.stock.provisions)}.`")
rep("`ROE consolidado ${fmtPct(ctx.roe)}: beneficio total / patrimonio asignado total. No se obtiene promediando el ROE de los segmentos.`", "`ROE consolidado ${fmtPct(ctx.roe)}: beneficio total / patrimonio asignado total. El patrimonio es contable y asignado según RWA; no equivale al CET1 regulatorio.`")
rep("{xLabel:'Ratio de mora (%)',yLabel:'ROE (%)',bubbleSize:true}","{xLabel:'Ratio de mora (%)',yLabel:'ROE (%)',bubbleSize:true,legendTop:true}")
# insert fee breakdown on profit page separate from mix
rep("const marginFinancial=ctx.marginInterest,flow=ctx.fin;", "const marginFinancial=ctx.marginInterest,flow=ctx.fin;\n const feesByProduct=productStats(ctx,'fee').filter(p=>p.value>0).map(p=>({...p,product:p.id}));")
rep(''' ${panel('Resultado comercial por oficina','Ingresos y gastos operativos locales',renderOfficeTable(ctx,8),{icon:'building',foot:'La rentabilidad de oficina se basa en ingresos y gastos locales, distinta de la PyG por producto.'})}
 </div>`''',''' ${panel('Resultado comercial por oficina','Ingresos bancarios y gasto local',renderOfficeTable(ctx,8),{icon:'building',foot:'Ingresos bancarios brutos ≠ ventas atribuibles a los gestores. La plantilla FTE incluye soporte asignado.'})}
 ${panel('Comisiones netas por los 14 productos','Incluye cuentas, tarjetas, fondos, seguros y servicios. Suma = comisiones netas del periodo.',horizontalBars(feesByProduct,{format:v=>fmtM(v,1)}),{icon:'wallet',class:'full',foot:`Σ comisiones netas: ${fmtM(feesByProduct.reduce((a,p)=>a+p.value,0),1)} · mismo importe que KPI de comisiones netas.`})}
 </div>`''')
# risk KPI / panel replace
rep("kpi('Provisiones / dudosos*',fmtPct(ctx.coverage),'shield',{detail:'Proxy, no cobertura Stage 3'})", "kpi('Cobertura Stage 3',fmtPct(ctx.coverageStage3),'shield',{detail:'Provisión específica / dudosos'})")
rep("kpi('Provisiones',fmtM(r.provisions),'wallet',{detail:'Saldo de cierre'})", "kpi('Provisiones S1+S2+S3',fmtM(r.provisions),'wallet',{detail:'Reservas contables simuladas'})")
rep("'Provisiones/dudosos*'", "'Reservas/dudosos*'")
rep("'* Provisiones totales / dudosos es una aproximación; falta provisión específica Stage 3 para estimar cobertura regulatoria.'", "'* En la muestra independiente de rating, reservas totales / dudosos NO es cobertura Stage 3 de la cartera. La cobertura específica del banco figura en el KPI.'")
rep(" ${panel('Dudosos y provisiones','Saldos de cierre por mes (M€)'", " ${panel('Dudosos y provisiones','Dudosos y reservas contables Stage 1+2+3 (M€)'")
rep(''' ${panel('Sectores bajo vigilancia','Exposición crediticia por riesgo estimado',simpleTable(['Sector','Exposición','NPL','Reservas/dudosos*','Nivel'],watchRows),{icon:'alert',foot:'* En la muestra independiente de rating, reservas totales / dudosos NO es cobertura Stage 3 de la cartera. La cobertura específica del banco figura en el KPI.'})}
 </div>`''',''' ${panel('Sectores bajo vigilancia','Exposición crediticia por riesgo estimado',simpleTable(['Sector','Exposición','NPL','Reservas/dudosos*','Nivel'],watchRows),{icon:'alert',foot:'* La muestra independiente de rating no reconcilia con toda la cartera: reservas / dudosos es solo una proxy en esa muestra.'})}
 ${panel('Provisiones por fase IFRS 9 · simulación','Reservas y exposiciones por Stage (M€)',`<div class="risk-stage-cards">${[['Stage 1',ctx.stage.s1,ctx.stage.p1],['Stage 2',ctx.stage.s2,ctx.stage.p2],['Stage 3',ctx.stage.s3,ctx.stage.p3]].map(([n,exp,prov])=>`<div><strong>${n}</strong><span>Exposición ${fmtM(exp,1)}</span><span>Provisión ${fmtM(prov,1)}</span><b>Tasa ${fmtPct(ratio(prov,exp),2)}</b></div>`).join('')}</div><div class="stage-recon">Σ reservas por fase ${fmtM(ctx.stage.p1+ctx.stage.p2+ctx.stage.p3,1)} · saldo de provisiones ${fmtM(ctx.stock.provisions,1)} · diferencia ${fmtM(ctx.stock.provisions-ctx.stage.p1-ctx.stage.p2-ctx.stage.p3,2)}</div>`,{icon:'shield',class:'full',foot:'Stage 1+2+3 exclusivos. Las tasas y reservas corresponden a escenarios ECL sintéticos, no a estados regulatorios reales.'})}
 </div>`''')
# workforce revise
rep("o.income+=r[8];o.cost+=r[5];o.claims+=r[6];o.managerMonths+=r[2];o.months++;", "const at=F.officeAttribution?.get(`${r[0]}-${r[1]}`);o.income+=r[8];o.commercialIncome=(o.commercialIncome||0)+(at?at[2]:r[8]*.157);o.cost+=r[5];o.claims+=r[6];o.managerMonths+=r[2];o.months++;o.fteMonths=(o.fteMonths||0)+(at?at[3]:Math.round(r[7]/14.5));")
rep("o.assets=r[7];o.managers=r[2]", "o.assets=r[7];o.managers=r[2];o.fte=F.officeAttribution?.get(`${r[0]}-${r[1]}`)?.[3]||Math.round(r[7]/14.5)")
rep("productivity:o.managerMonths?o.income*1000/o.managerMonths:0", "productivity:o.managerMonths?o.commercialIncome*1000/o.managerMonths:0,assetsPerFte:o.fte?o.assets/o.fte:NaN")
rep("fmtInt(o.managers),fmtK(o.productivity)","fmtInt(o.managers),fmtInt(o.fte),fmtK(o.productivity)")
rep("['Oficina','Activos','Ingresos brutos','Gestores (cierre)','Prod. por gestor-mes','Gasto local / ingresos','Satisfacción']", "['Oficina','Activos','Ingresos brutos','Gestores','FTE asignados','Prod. atribuida / gestor-mes','Gasto local / brutos','Satisfacción']")
rep("['Oficina','Activos','Ingresos brutos','Gestores (cierre)','Prod. / gestor-mes','Gasto local / ingresos','Satisfacción']", "['Oficina','Activos','Ingresos brutos','Gestores','FTE asignados','Prod. atribuida / gestor-mes','Gasto local / brutos','Satisfacción']")
rep("'Productividad':", "'Productividad':") if "'Productividad':" in s else None
rep("Productividad = ingresos brutos / gestores-mes acumulados (k€ por gestor-mes). El gasto local no es la eficiencia bancaria de la PyG. Los ratios por empleado son sintéticos y no constituyen referencias del sector.","Productividad = ingresos comerciales atribuibles / gestores-mes (k€). Ingresos brutos abarcan toda la actividad bancaria, no se imputan íntegramente a cada gestor. FTE incluye funciones de soporte asignadas. Gasto local distinto de eficiencia bancaria.")
rep("const kpis=[\n  kpi('Oficinas activas'", "const attributed=sum(ctx.officeFlows.map(r=>[r[0],r[1],F.officeAttribution?.get(`${r[0]}-${r[1]}`)?.[2]??r[8]*.157]),2);\n const fte=sum(ctx.officeClosing.map(r=>[r[0],r[1],F.officeAttribution?.get(`${r[0]}-${r[1]}`)?.[3]??Math.round(r[7]/14.5)]),2);\n const kpis=[\n  kpi('Oficinas activas'")
rep("productivity=ratio(localIncome*1000,sum(ctx.officeFlows,2),1);", "productivity=ratio(attributed*1000,sum(ctx.officeFlows,2),1);")
# const attributed declared after previous const productivity: let -> lexical use only after declarations at evaluation time? fix below
rep("kpi('Activos por oficina',fmtM(assets/Math.max(1,activeOffices),1),'coins',{detail:'Media de cierre'})", "kpi('FTE asignados',fmtInt(fte),'users',{detail:'Incluye soporte operativo'})")
rep("kpi('Productividad gestor-mes',fmtK(productivity),'target',{detail:'Ingresos / suma gestores-mes'})", "kpi('Productividad atribuida',fmtK(productivity),'target',{detail:'Ingresos atribuibles / gestores-mes'})")
rep("return ratio(sum(subset,8)*1000,sum(subset,2),1)", "return ratio(subset.reduce((t,r)=>t+(F.officeAttribution?.get(`${r[0]}-${r[1]}`)?.[2]??r[8]*.157),0)*1000,sum(subset,2),1)")
rep("'Ingresos brutos por gestor-mes (k€)'", "'Ingresos comerciales atribuibles / gestor-mes (k€)'")
rep("'Ingresos brutos por gestor-mes (k€) y gasto comercial / ingresos brutos (%)'", "'Ingresos atribuibles / gestor-mes (k€) vs. gasto local / ingresos brutos (%)'")
rep("'Ranking de oficinas','Ingresos comerciales acumulados (M€)'", "'Ranking de oficinas','Ingresos bancarios brutos acumulados (M€)'")
# already replaced in profit panel
rep("BankVision v6 / Banking Analytics", "BankVision v7 / Banking Analytics")
rep("300.053 registros originales + calibración de oficinas v4", "300.053 registros originales + recalibraciones v4 y v7")
rep("Reutilizable: todo se deriva del Excel original.", "Reutilizable: datos originales + escenarios sintéticos v4/v7.") if "Reutilizable: todo se deriva del Excel original." in s else None
# export distinguish reserves and attributed monthly staff? CSV origin column provisions already changes, add metadata CSV header and office staffing if relevant
js.write_text(s)
print('Patched JS bytes',len(s))
