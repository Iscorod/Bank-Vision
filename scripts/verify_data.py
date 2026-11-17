import json
from pathlib import Path
P=Path(__file__).resolve().parents[1]/'data'
def read(f):return json.load(open(P/f,encoding='utf8'))
meta=read('meta.json');schema=read('schema.json')
regions=read('core-regions.json')
chunks=[read(f'core-offices-r{i}.json') for i in range(1,6)]
clients=read('clients.json');leads=read('leads.json');liq=read('liquidity.json')
assert len(regions)==4200
assert sum(map(len,chunks))==131040
assert len(clients)==9360 and len(leads)==11232
assert len(meta['products']['rows'])==14
assert len(meta['offices']['rows'])==156
assert schema['sourceRecords']==300053
assert sum(r[3] for r in clients if r[0]==12)==3283149
assert sum(r[3] for r in leads)==2031027
assert sum(r[6] for r in leads)==477937
# Validate region chunks aggregate to region fact for selected accounting columns.
for ix in [4,5,8,10,11,16,17,18,19,20,21,22,23]:
 expected=sum(r[ix] for r in regions)
 actual=sum(r[ix] for grp in chunks for r in grp)
 assert abs(expected-actual)<1e-4,(ix,expected,actual)
print('OK — 300,053 source records; 131,040 banking fact rows; 14 products; 156 offices; accounting chunks reconciled')
print('Total LCR: %.2f%%' % (100*sum(r[2] for r in liq if r[0]==12)/sum(r[3] for r in liq if r[0]==12)))
