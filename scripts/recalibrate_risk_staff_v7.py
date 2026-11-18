#!/usr/bin/env python3
"""BankVision v7 - deterministic transparent synthetic risk, segment pricing and workforce overlay.

Run once on UNMODIFIED v6 JSON data (prefer a clean copy of bankvision-v6).
All monetary quantities are millions of EUR unless labeled otherwise.
"""
import json, csv, math, collections
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data'
def load(s): return json.loads((D/s).read_text('utf8'))
def save(s,v): (D/s).write_text(json.dumps(v,ensure_ascii=False,separators=(',',':')),'utf8')
def rnd(v):return round(v,5)
regions=load('core-regions.json'); offices={r:load(f'core-offices-r{r}.json') for r in range(1,6)}
liquid=load('liquidity.json'); monthly=load('offices-monthly.json'); ratings=load('ratings.json'); meta=load('meta.json');schema=load('schema.json')
office_region={a[0]:a[4] for a in meta['offices']['rows']}
liquid_equity={(r[0],r[1]):r[11] for r in liquid}
if schema.get('simulationVersion')=='portfolio-calibration-v7':
    raise SystemExit('ERROR: v7 already applied. Restore the full unmodified v6 JSON bundle before rerunning calibration.')
original_reg={tuple(r[:4]):r[:] for r in regions}
orig_fund={tuple(r[:4]):r[17] for r in regions}
reg_keys=collections.defaultdict(list)
for row in regions:reg_keys[(row[0],row[1])].append(row)

# 1. Internal transfer pricing: reallocate EXISTING funding costs between segments, not create new profit.
# Banca Privada / Institucional had economically implausible negative NII from a uniform funding rule.
# Use transparent illustrative ROE targets by segment; allocate offset to retail, SME and corporates.
transfers=[]
for (month,region),group in sorted(reg_keys.items()):
    sgroups=collections.defaultdict(list)
    for row in group:sgroups[row[2]].append(row)
    rwa_total=sum(r[11] for r in group)
    seg_equity={s:liquid_equity[(month,region)]*sum(r[11] for r in rows)/rwa_total for s,rows in sgroups.items()}
    changes={s:0. for s in sgroups}
    for seg,benchmark in [(4,.077),(5,.068)]:
        rows=sgroups[seg]
        current=sum(r[16]-r[17]+r[18]-r[19]+r[20]-r[21]-r[22]-r[23] for r in rows)
        target=seg_equity[seg]*benchmark/12 * (1+.06*math.sin(month*.7+region*.9+seg))
        changes[seg]=target-current
    balancing=changes[4]+changes[5]
    donor_weights={1:.62,2:.22,3:.16}
    for s,w in donor_weights.items():changes[s]=-balancing*w
    assert abs(sum(changes.values()))<1e-8
    for seg,delta_profit in changes.items():
        rows=sgroups[seg]
        baseline=sum(row[17] for row in rows)
        assert baseline>0
        for row in rows:
            # Decrease funding cost to increase profits; increase donor cost to compensate.
            row[17]=rnd(row[17]-delta_profit*row[17]/baseline)
        residual=baseline-delta_profit-sum(row[17] for row in rows)
        max(rows,key=lambda row: row[17])[17] = rnd(max(rows,key=lambda row: row[17])[17]+residual)
        assert min(row[17] for row in rows)>=-0.00001,(month,region,seg)
        transfers.append([month,region,seg,rnd(baseline),rnd(sum(r[17] for r in rows)),rnd(delta_profit),rnd(seg_equity[seg])])
    assert abs(sum(r[17] for r in group)-sum(orig_fund[tuple(r[:4])] for r in group))<.001
# Distribute regional changes to offices at same month/region/segment/product grain.
reg_by_key={tuple(r[:4]):r for r in regions}
for reg,chunk in offices.items():
    g=collections.defaultdict(list)
    for row in chunk:g[(row[0],reg,row[2],row[3])].append(row)
    for key,ls in g.items():
        target=reg_by_key[key][17]
        base=sum(row[17] for row in ls)
        if base>0:
            for row in ls:row[17]=rnd(row[17]*target/base)
            ls[-1][17]=rnd(ls[-1][17]+target-sum(row[17] for row in ls))
        else:assert abs(target)<.00001

# 2. Stage-specific ECL stock: Stage 1, Stage 2 and Stage 3 allowances per credit portfolio.
# Stage 1/2/3 *exposures are exclusive* for this synthetic illustration.
# Stage 3 coverage is specific allowance / Stage 3 exposure. Total provision/NPL is NOT coverage.
base1={1:.0019,2:.0045,3:.0033,4:.0034,5:.0068,6:.0036}
base2={1:.029,2:.075,3:.064,4:.058,5:.096,6:.060}
base3={1:.57,2:.79,3:.72,4:.67,5:.86,6:.70}
reg_mult={1:.94,2:1.03,3:1.10,4:.98,5:1.055}
seg_mult={1:.96,2:1.06,3:1.015,4:1.09,5:1.045}
def ecl(r,region):
    mon,_,seg,prod=r[:4]
    exposure=max(0,r[7]);doubt=max(0,min(r[8],exposure));s2=max(0,min(r[9],exposure-doubt));s1=max(0,exposure-s2-doubt)
    if prod not in base1:return (0.,0.,0.,0.,0.,0.)
    mult=reg_mult[region]*seg_mult[seg]*(1+.021*math.sin(.65*mon+.75*region+1.1*seg))
    p1=rnd(s1*base1[prod]*mult)
    p2=rnd(s2*base2[prod]*mult)
    p3=rnd(doubt*min(.94,base3[prod]*mult))
    return (rnd(s1),rnd(s2),rnd(doubt),p1,p2,p3)
# The region facts remain the authoritative regional aggregates; to guarantee < 0.02 M€ reconciliation,
# compute office ECL then sum it for each regional key and stage.
risk_detail=[]
for region,chunk in offices.items():
    for r in chunk:
        e=ecl(r,region)
        r[10]=rnd(sum(e[3:]))
for key,row in reg_by_key.items():row[10]=0.
risk_reg=collections.defaultdict(lambda:[0.]*6)
for region,chunk in offices.items():
    for row in chunk:
        key=(row[0],region,row[2],row[3])
        a=risk_reg[key]
        for j,v in enumerate(ecl(row,region)):a[j]+=v
for key,a in sorted(risk_reg.items()):
    r=reg_by_key[key]; r[10]=rnd(sum(a[3:]));risk_detail.append([*key,*[rnd(v) for v in a]])
    # The credited provision reserve must also sum from office core exactly.
    assert abs(r[10]-sum(rr[10] for rr in offices[key[1]] if rr[0]==key[0] and rr[2]==key[2] and rr[3]==key[3]))<.012,key
# Independent rating-sector sample, because its classified exposure is NOT the whole credit portfolio.
for r in ratings:
    month,off,grade,sector,expo,doubt=r[:6];region=office_region[off]
    # Sampled classified risk reserve proxy has different risk-profile factors.
    mult=reg_mult[region]*(1+.015*math.sin(month*.6+sector))
    stage3_rate=min(.97,[.56,.60,.67,.72,.78,.81][grade-1]*mult)
    stage12_proxy=[.0015,.0027,.0045,.008,.014,.018][grade-1]
    r[6]=rnd(doubt*stage3_rate + max(0,expo-doubt)*stage12_proxy*mult)

# 3. Workforce: preserve number of commercial managers; allocate commercial-attributable revenue,
# and simulate FTE incl. allocated support. Whole bank gross revenue is NOT per-manager sales.
attr=[]
for r in monthly:
    month,office=r[:2]
    region=office_region[office]
    factor=max(.105,min(.225,.157+.035*math.sin(office*1.43+region*.32)+.013*math.cos(month*.52+office)))
    attrib=rnd(r[8]*factor)
    asset_per_fte=14.5+3.2*math.sin(office*.61+region*.4)+.6*math.cos(month*.4+office*.7)
    fte=max(int(r[2])+8,int(round(r[7]/asset_per_fte)))
    attr.append([month,office,attrib,fte,rnd(factor)])

for reg,chunk in offices.items():save(f'core-offices-r{reg}.json',chunk)
save('core-regions.json',regions);save('ratings.json',ratings)
save('risk-stages-v7.json',risk_detail);save('office-attribution-v7.json',attr)
save('transfer-pricing-v7.json',transfers)
schema['simulationVersion']='portfolio-calibration-v7'
schema['dataLineage']='Original 300053-row workbook + office calibration v4 + v7 risk ECL, segment transfer pricing and commercial staff attribution overlays; web JSON are authoritative for v7.'
schema['v7']={'creditECL':'risk-stages-v7.json: stage1_exposure,stage2_exposure,stage3_exposure,allowance_stage1,allowance_stage2,allowance_stage3','transferPricing':'transfer-pricing-v7.json: funding cost reallocated monthly across segments, regional total and bank profit unchanged','workforce':'office-attribution-v7.json: attributed_commercial_income MEUR and allocated FTE; commercial managers unchanged','ratings':'Ratings table ECL is sampled and independent of core credit book','reconstruction':'Run recalibrate_risk_staff_v7.py on v6 JSON only; do not re-run on already recalibrated data.'}
save('schema.json',schema)

def csvfile(name,headers,records):
    with (D/name).open('w',newline='',encoding='utf8') as out:
        w=csv.writer(out,delimiter=';');w.writerow(headers);w.writerows(records)
csvfile('risk-stages-v7.csv',['Mes','Region_ID','Segmento_ID','Producto_ID','Exposicion_Stage1_MEUR','Exposicion_Stage2_MEUR','Exposicion_Stage3_MEUR','Provision_Stage1_MEUR','Provision_Stage2_MEUR','Provision_Stage3_MEUR'],risk_detail)
csvfile('office-attribution-v7.csv',['Mes','Oficina_ID','Ingresos_Comerciales_Atribuidos_MEUR','Plantilla_FTE','Fraccion_Ingresos_Atribuidos'],attr)
csvfile('transfer-pricing-v7.csv',['Mes','Region_ID','Segmento_ID','Coste_Financiacion_v6_MEUR','Coste_Financiacion_v7_MEUR','Ajuste_Beneficio_MEUR','Patrimonio_Asignado_MEUR'],transfers)

# Derived source overlay for exact monthly regional product-grain finance/risk values after changes.
csvfile('core-adjustments-v7.csv',['Mes','Region_ID','Segmento_ID','Producto_ID','Coste_Financiacion_v7_MEUR','Provision_Total_v7_MEUR'],[[*r[:4],r[17],r[10]] for r in regions])

# v7 direct integrity tests
for region in range(1,6):
 for mon in range(1,13):
  rr=[r for r in regions if r[0]==mon and r[1]==region]
  oo=[r for r in offices[region] if r[0]==mon]
  assert abs(sum(r[17] for r in rr)-sum(orig_fund[tuple(r[:4])] for r in rr))<.002
  assert abs(sum(r[17] for r in rr)-sum(r[17] for r in oo))<.03
  assert abs(sum(r[10] for r in rr)-sum(r[10] for r in oo))<.03
by_reg=collections.defaultdict(lambda:[0.,0.,0.])
for row in risk_detail:
 m,reg=row[:2]
 if m==12:
  by_reg[reg][0]+=row[6] # s3 exposure
  by_reg[reg][1]+=row[9] # allowance s3
  by_reg[reg][2]+=row[7]+row[8]+row[9]
print('V7 December regional coverage Stage3 and total/doubtful:')
for k,v in sorted(by_reg.items()): print(k,round(v[1]/v[0]*100,1),round(v[2]/v[0]*100,1))
print('v7 generated:',len(risk_detail),'risk keys;',len(attr),'office months;',len(transfers),'transfer pricing groups')
