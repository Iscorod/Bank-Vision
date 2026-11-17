#!/usr/bin/env python3
"""Convert synthetic banking XLSX to compact static JSON for the portfolio web app.
Only reads XLSX XML with the standard zip container and lxml, no spreadsheets rewritten.
"""
from zipfile import ZipFile
from lxml import etree as E
from collections import defaultdict
from pathlib import Path
import json, math, time, sys, os

SRC = Path(sys.argv[1] if len(sys.argv)>1 else os.environ.get('BANKVISION_XLSX', '/mnt/data/modelo_bancario_300k_powerbi_2024.xlsx'))
OUT = Path(__file__).resolve().parents[1] / 'data'
OUT.mkdir(parents=True, exist_ok=True)
NS='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

def rows(z,idx):
    with z.open(f'xl/worksheets/sheet{idx}.xml') as f:
        for _,element in E.iterparse(f,events=('end',), tag=NS+'row'):
            vals=[]
            for c in element:
                if c.tag!=NS+'c': continue
                if c.attrib.get('t')=='inlineStr':
                    val=''.join(c.itertext())
                else:
                    val=c.findtext(NS+'v') or ''
                vals.append(val)
            yield vals
            element.clear()
            while element.getprevious() is not None:
                del element.getparent()[0]

def typed(vals):
    x=[]
    for v in vals:
        if v=='':x.append(None)
        else:
            try:
                f=float(v)
                x.append(int(f) if f.is_integer() else f)
            except (ValueError,OverflowError):x.append(v)
    return x

def save(filename, payload):
    p=OUT/filename
    with p.open('w',encoding='utf8') as f:json.dump(payload,f,ensure_ascii=False,separators=(',',':'))
    print(filename, f'{p.stat().st_size/1_000_000:.2f} MB')

def million(x):return round(float(x or 0)/1e6,5)

def whole(x):return int(float(x or 0))

start=time.time()
with ZipFile(SRC) as z:
    dims={}
    for name,idx in [('regions',13),('offices',14),('segments',15),('products',16),('channels',17),('ratings',18),('sectors',19),('campaigns',20),('bufferTypes',21),('maturityTypes',22),('scenarios',23),('severities',24)]:
        it=rows(z,idx)
        header=next(it)
        dims[name]={'columns':header,'rows':[typed(r) for r in it]}
    offices=dims['offices']['rows']; office_region={int(r[0]):int(r[4]) for r in offices}
    save('meta.json',dims)

    # C + PyG are physically aligned by the same month/office/segment/product grain.
    crows=rows(z,1); rrows=rows(z,2)
    next(crows);next(rrows)
    aggreg={}; chunks=defaultdict(list)
    n=0
    for c,r in zip(crows,rrows):
        c=[float(v) for v in c]
        r=[float(v) for v in r]
        m,office,seg,prod=map(int,c[:4]); rm,ro,rs,rp=map(int,r[:4])
        if (m,office,seg,prod)!=(rm,ro,rs,rp):raise ValueError(f'Unaligned fact rows at {n}')
        region=office_region[office]
        # [month, geographical key, segment, product,
        #  credit, deposit, investments, exposure, doubtful, stage2, provisions, rwa, contracts,
        #  credit_prior, deposit_prior, invest_prior,
        #  interest, funding, fee_income, fee_cost, other, opex, impairment, tax, profit_prior]
        values=[*(million(a) for a in c[4:12]),whole(c[12]),*(million(a) for a in c[13:16]),*(million(a) for a in r[4:13])]
        assert len(values)==21,len(values)
        one=[m%100,office,seg,prod,*values]
        chunks[region].append(one)
        key=(m%100,region,seg,prod)
        if key not in aggreg:
            aggreg[key]=[m%100,region,seg,prod,*([0]*21)]
        a=aggreg[key]
        for j,v in enumerate(values,4):a[j]+=v
        n+=1
    print('core input records:',n,'region groups:',len(aggreg))
    save('core-regions.json',[r[:4]+[round(v,5) if isinstance(v,float) else v for v in r[4:]] for r in sorted(aggreg.values())])
    for region,rows_ in sorted(chunks.items()):save(f'core-offices-r{region}.json',rows_)
    del chunks

    # Office/client/lead/risk facts are small enough to keep full drilldown.
    schemas={
      3:('clients.json', {7:'int'}),
      4:('leads.json',{}),
      5:('ratings.json',{}),
      6:('offices-monthly.json',{}),
      7:('campaigns.json',{}),
      8:('liquidity.json',{}),
      9:('maturities.json',{}),
      10:('liquid-assets.json',{}),
      11:('stress.json',{})
    }
    for idx,(filename,opts) in schemas.items():
        it=rows(z,idx);header=next(it)
        records=[]
        for raw in it:
            values=typed(raw)
            values[0]=int(values[0])%100
            if idx in (5,6,7,8,9,10,11):
                # Every monetary column given in EUR; convert to M€ (except office survey satisfaction count).
                ids={5:range(4,8),6:[5,7,8,9],7:[6],8:range(2,12),9:range(2,5),10:[2],11:[3,4]}[idx]
                for j in ids:values[j]=million(values[j])
            elif idx==4:
                values[8]=million(values[8]) # marketing spend
            records.append(values)
        save(filename, records)

    # metadata for generated model / data lineage
    model={'period':'2024-01 / 2024-12','synthetic':True,
       'coreColumns':['month','geography_id','segment_id','product_id','credit','deposits','investments','exposure','doubtful','stage2','provisions','rwa','contracts','credit_prior','deposit_prior','invest_prior','interest','funding_cost','fee_income','fee_cost','other_income','operating_expenses','impairment','tax','profit_prior'],
       'officeRegionIds':office_region,
       'amountUnit':'million_eur',
       'sourceFile':SRC.name,
       'sourceRecords':300053,
       'sourceFacts':299820,
       'notes':['Balance sheet indicators are closing stock for last month selected; P&L and lead flows are summed over selected months.','Office drill-down uses region chunk; liquidity is reportable by region, not by branch.','All data are synthetic and for portfolio demonstration only.']}
    save('schema.json',model)
print('Completed in',round(time.time()-start,1),'sec')
