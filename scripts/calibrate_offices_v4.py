#!/usr/bin/env python3
"""Deterministically diversify synthetic branch economics while reconciling each
month × region × segment × product exactly with the published regional dataset.

Generated website JSON is a *scenario version*, not identical to the original XLSX;
`data/office-overrides-v4.csv` makes the revised branch observations reproducible.
No external banking records are involved.
"""
from __future__ import annotations
from collections import defaultdict
from pathlib import Path
from hashlib import blake2b
import csv, json, math, statistics

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT/'data'

def load(name):
    return json.loads((DATA/name).read_text(encoding='utf-8'))

def save(name, value):
    (DATA/name).write_text(json.dumps(value, ensure_ascii=False, separators=(',',':')), encoding='utf-8')

def u01(k):
    return int.from_bytes(blake2b(str(k).encode(), digest_size=8).digest(),'big') / (2**64-1)

def unit(k):
    return (u01(k)*2-1)

def bound(v, lo, hi):
    return max(lo,min(hi,v))

meta=load('meta.json'); regions=load('core-regions.json')
if load('schema.json').get('simulationVersion')=='office-calibration-v4':
    raise SystemExit('Esta calibración ya está aplicada. Regenera antes los JSON originales desde el XLSX y ejecuta el script una sola vez.')
rows_by_region={rid:load(f'core-offices-r{rid}.json') for rid in range(1,6)}
office_rows=load('offices-monthly.json')
office_to_region={int(r[0]):int(r[4]) for r in meta['offices']['rows']}

profiles={}
for o in meta['offices']['rows']:
    oid=int(o[0]);name=o[2]
    # Stable, intercorrelated office-specific synthetic drivers.
    facility=bound(1+.32*unit(f'{oid}|asset')+.09*unit(f'{oid}|capacity'),.69,1.36)
    yield_ix=bound(1+.32*unit(f'{oid}|yield')-.05*unit(f'{oid}|expense'),.67,1.36)
    local_cost_ix=bound(1+.47*unit(f'{oid}|localcost'),.58,1.48)
    staffing_ix=bound(1+.22*unit(f'{oid}|staffing'),.78,1.22)
    satisfaction=bound(8.57+.69*unit(f'{oid}|sat')+.13*unit(f'{oid}|care'),7.7,9.35)
    risk_ix=bound(1+.19*unit(f'{oid}|risk'),.78,1.22)
    profiles[oid]={
        'facility':facility,'yield':yield_ix,'cost':local_cost_ix,
        'staff':staffing_ix,'satisfaction':satisfaction,'risk':risk_ix,
        'name':name,'region':office_to_region[oid]
    }

# Sanity: columns 0: m, 1: office, 2: segment, 3: product, 4..24: facts.
# Keep all *region × month × segment × product* fact totals constant.
# Different columns may use different economic drivers but remain additive.
expected={(r[0],r[1],r[2],r[3]):r for r in regions}
change_stock={4,5,6,7,8,9,10,11,13,14,15}
change_income={16,18,20,24}
change_cost={17,19,21,22,23}
all_change=sorted(change_stock|change_income|change_cost)
for rid,rows in rows_by_region.items():
    grouped=defaultdict(list)
    for rr in rows:
        grouped[(rr[0],rid,rr[2],rr[3])].append(rr)
    for key,grp in grouped.items():
        target=expected[key]
        weights={}
        for rr in grp:
            oid=rr[1];p=profiles[oid];month=rr[0]
            seasonal=1+.025*math.sin(month*math.pi/6+oid*.8)
            weights[oid]={
              'stock':p['facility']*(1+.012*math.sin(month*.4+oid)),
              'income':p['facility']*p['yield']*seasonal,
              'expense':p['facility']*(.85+.15*p['cost']),
              'creditRisk':p['facility']*p['risk'],
            }
        for j in all_change:
            if j in (8,9,10,22):field='creditRisk'
            elif j in change_stock:field='stock'
            elif j in change_income:field='income'
            else:field='expense'
            vals=[float(rr[j])*weights[rr[1]][field] for rr in grp]
            subtotal=sum(vals)
            t=float(target[j])
            if abs(subtotal)<1e-14:
                # Native zeros; no spurious synthetic flow on non-applicable products.
                for rr in grp:rr[j]=0
                continue
            scaled=[round(v*t/subtotal,5) for v in vals]
            # Put rounding remainder on the most representative nonzero observation.
            ix=max(range(len(grp)),key=lambda i:abs(scaled[i]))
            scaled[ix]=round(scaled[ix]+(t-sum(scaled)),5)
            for rr,val in zip(grp,scaled):rr[j]=val
    save(f'core-offices-r{rid}.json',rows)

# Derived branch revenue is now exactly the sum of reweighted gross revenue
# from detailed facts, not an additional independent random observation.
rev=defaultdict(float)
for rid,rows in rows_by_region.items():
    for rr in rows:
        rev[(rr[0],rr[1])]+=rr[16]+rr[18]+rr[20]

region_month=defaultdict(list)
for r in office_rows:
    region_month[(r[0],office_to_region[r[1]])].append(r)
for (month,region),rs in region_month.items():
    prev_asset=sum(r[7] for r in rs)
    prev_cost=sum(r[5] for r in rs)
    prev_prior=sum(r[9] for r in rs)
    for r in rs:
        o=profiles[r[1]]
        r[7]=r[7]*o['facility']*(1+.015*math.sin(month/3+r[1]*.53))
        r[9]=r[9]*o['facility']
        r[2]=max(3,round(r[2]*o['staff']*(1+.02*math.sin(month/3+r[1]))))
        r[4]=round(bound(o['satisfaction']+.055*math.sin(month/2.6+r[1]*.25),7.5,9.5),2)
        r[8]=round(rev[(month,r[1])],5)
        r[5]=r[8]*o['cost']*(1+.035*math.cos(month/3+r[1]))
    # Normalize to preserve regional sums of assets, prior assets, and costs.
    for col,original in [(7,prev_asset),(9,prev_prior),(5,prev_cost)]:
        new_sum=sum(r[col] for r in rs)
        for r in rs:r[col]=round(r[col]*original/new_sum,5) if new_sum else 0
        lead=max(rs,key=lambda r:abs(r[col]));lead[col]=round(lead[col]+(original-sum(r[col] for r in rs)),5)

# Ensure regional branch-office revenues agree with regional core source.
assert len(office_rows)==1872
for (month,region),rs in region_month.items():
    desired=sum(r[16]+r[18]+r[20] for r in regions if r[0]==month and r[1]==region)
    actual=sum(r[8] for r in rs)
    if abs(desired-actual)>0.005:
        raise AssertionError(f'Revenue reconciliation {month}/{region}: {actual} vs {desired}')

save('offices-monthly.json',office_rows)
meta_notes=load('schema.json')
meta_notes['simulationVersion']='office-calibration-v4'
meta_notes['sourceRecords']=300053
meta_notes['dataLineage']='Original Excel bank synthetic model; revised office synthetic scenario overrides per original monthly regional/segment/product totals.'
meta_notes['calibration']={
  'scope':'Office-level synthetic facts (data/core-offices-r*.json and data/offices-monthly.json)',
  'method':'Stable deterministic office factors, ratio diversity, reweighting of branch financial facts preserving 2024 region/month/segment/product totals',
  'preservedTotals':'Region-month-segment-product core, monthly region assets, previous assets, local operating costs',
  'note':'The original 300,053-row XLSX is the V3 baseline, not an updated source for V4 branch figures. Use office-overrides-v4.csv and core-offices-r*.json as authoritative V4 branch overlay.'
}
save('schema.json',meta_notes)

# Companion addendum: audited branch observations and factors (not a rewrite of V3 XLSX).
with (DATA/'office-overrides-v4.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f,delimiter=';')
    w.writerow(['Mes','Oficina_ID','Region_ID','Oficina','Gestores_plantilla','Encuestas','Satisfaccion_10','Gasto_comercial_local_MEUR','Activos_a_cierre_MEUR','Ingresos_brutos_MEUR','Activos_previos_MEUR','Gasto_local_sobre_ingresos_pct','Productividad_kEUR_gestor_mes'])
    for r in office_rows:
        p=profiles[r[1]]
        w.writerow([r[0],r[1],p['region'],p['name'],r[2],r[3],r[4],r[5],r[7],r[8],r[9],round(100*r[5]/r[8],4) if r[8] else '',round(1000*r[8]/r[2],4) if r[2] else ''])

with (DATA/'office-profiles-v4.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f,delimiter=';')
    w.writerow(['Oficina_ID','Oficina','Region_ID','Factor_activos','Factor_rendimiento','Factor_gasto_local','Factor_plantilla','Perfil_satisfaccion_10','Factor_riesgo'])
    for oid,p in sorted(profiles.items()):w.writerow([oid,p['name'],p['region'],*[round(p[k],4) for k in ('facility','yield','cost','staff','satisfaction','risk')]])

# Useful annual distribution summary for audit report.
by_branch=defaultdict(lambda:{'income':0,'cost':0,'staff_months':0,'assets':0,'rating':0,'surveys':0})
for r in office_rows:
    d=by_branch[r[1]];d['income']+=r[8];d['cost']+=r[5];d['staff_months']+=r[2]
    d['rating']+=r[4]*r[3];d['surveys']+=r[3]
    if r[0]==12:d['assets']=r[7]
metrics={
 'incomeToAssetsPct':[100*v['income']/v['assets'] for v in by_branch.values()],
 'localEfficiencyPct':[100*v['cost']/v['income'] for v in by_branch.values()],
 'satisfaction':[v['rating']/v['surveys'] for v in by_branch.values()],
 'productivityKperStaffMonth':[1000*v['income']/v['staff_months'] for v in by_branch.values()],
}
summary={k:{'min':round(min(v),2),'max':round(max(v),2),'stdev':round(statistics.stdev(v),2),'median':round(statistics.median(v),2)} for k,v in metrics.items()}
(DATA/'audit-offices-v4.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False),encoding='utf8')
for k,v in summary.items():print(k, v)
print('OK: office source calibration complete; regional financial aggregates unchanged.')
