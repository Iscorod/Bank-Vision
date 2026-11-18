#!/usr/bin/env python3
"""Create companion XLSX overlays for BankVision v7 using artifact_tool, no original workbook rewrite."""
import csv,json, pathlib
from artifact_tool import Workbook, SpreadsheetFile
D=pathlib.Path(__file__).resolve().parents[1]/'data'
OUT=pathlib.Path(__file__).resolve().parents[2]/'BankVision_v7_Adenda_Financiera.xlsx'
wb=Workbook.create()
def rd(name):
 with (D/name).open(encoding='utf8',newline='') as f:
  return [[int(x) if i<len(row) and i in (0,1,2,3) and x and x.lstrip('-').isdigit() else float(x) if x else None for i,x in enumerate(row)] for row in list(csv.reader(f,delimiter=';'))[1:]]
def sheet(name,headers,rows,width=17,table=True):
 sh=wb.worksheets.add(name)
 n=len(headers)
 sh.get_range_by_indexes(0,0,len(rows)+1,n).values=[headers]+rows
 sh.get_range_by_indexes(0,0,1,n).format={"fill":"#123A68","font":{"bold":True,"color":"#FFFFFF"},"row_height":30,"vertical_alignment":"center","wrap_text":True}
 sh.get_range_by_indexes(0,0,len(rows)+1,n).format.column_width=width
 sh.freeze_panes.freeze_rows(1)
 if table and len(rows)>0:
  try:sh.tables.add(f'A1:{chr(64+n)}{len(rows)+1}',True,'BV'+name.replace('_','')[:25])
  except Exception as e:print('Table not added',name,str(e)[:140])
 return sh
info=[
 ['Versión','BankVision v7 · 18/11/2026'],
 ['Fuente','Excel original 300.053 registros + adenda de oficinas v4'],
 ['Actualización','Reservas ECL simuladas por fases; transfer pricing interno; ingresos comerciales atribuibles y FTE'],
 ['Alcance','Se conservan beneficios consolidados, créditos, depósitos, inversiones, morosidad y RWA'],
 ['Importes','M€ salvo indicación; productividad k€/gestor-mes; FTE = equivalente de plantilla de apoyo'],
 ['ECL Stage 3','Provisión específica Stage3 / exposición dudosa Stage3'],
 ['ECL total','Stage1 + Stage2 + Stage3; NO es una cobertura regulatoria Stage 3'],
 ['ROE','Beneficio anual / patrimonio contable asignado proporcional al RWA'],
 ['Capital CET1','Distinto del patrimonio contable: no se conocen ajustes prudenciales detallados'],
 ['Transfer Pricing','Redistribución SINTÉTICA de coste de financiación, suma neta por región-mes = 0'],
 ['Ingresos atribuidos','Porcentaje simulado de ingresos brutos atribuible al equipo comercial de cada oficina'],
 ['FTE','Incluye personal y soporte asignado, distinto de gestores comerciales al cierre'],
 ['Región/mes/segmento/producto','Claves para unir Ajustes_Core y Provisiones_Fases con origen de cartera y PyG'],
 ['Mes/oficina','Claves para unir Personal_Oficinas con red de oficinas'],
 ['Reconstrucción','JSON de bankvision-v7/data/ es la fuente autoritativa de la web publicada'],
 ['Advertencia','Todos los datos, tasas y metodologías son simulados: no representan una entidad real']]
sheet('LEEME',['Concepto','Descripción'],info,45,False)
rs=rd('risk-stages-v7.csv')
rsrows=[r+[None,None] for r in rs]
sh=sheet('Provisiones_Fases',['Mes','Region_ID','Segmento_ID','Producto_ID','Expo Stage1 M€','Expo Stage2 M€','Expo Stage3 M€','Prov Stage1 M€','Prov Stage2 M€','Prov Stage3 M€','Prov total M€','Cobertura Stage3'],rsrows,18,False)
# Ranges bulk formula, fill_down uses relative refs
sh.get_range('K2').formulas=[['=SUM(H2:J2)']]
sh.get_range(f'K2:K{len(rsrows)+1}').fill_down()
sh.get_range('L2').formulas=[['=IF(G2=0,0,J2/G2)']]
sh.get_range(f'L2:L{len(rsrows)+1}').fill_down()
sh.get_range(f'L2:L{len(rsrows)+1}').set_number_format('0.0%')
new_core=rd('core-adjustments-v7.csv')
old=json.loads((D/'core-regions.json').read_text('utf8'))
# original source v6 loaded strictly for comparison
orig=json.loads((D.parent.parent/'bankvision-v6'/'data'/'core-regions.json').read_text('utf8'))
idx={(r[0],r[1],r[2],r[3]):r for r in orig}
corerows=[[int(r[0]),int(r[1]),int(r[2]),int(r[3]),idx[tuple(map(int,r[:4]))][17],r[4],idx[tuple(map(int,r[:4]))][10],r[5]] for r in new_core]
sh=sheet('Ajustes_Core',['Mes','Region_ID','Segmento_ID','Producto_ID','Financiación v6 M€','Financiación v7 M€','Provisión v6 M€','Provisión v7 M€'],corerows,19)
att=rd('office-attribution-v7.csv');month=json.loads((D/'offices-monthly.json').read_text('utf8'));idx={(r[0],r[1]):r for r in month}
workrows=[]
for m,id,attr,fte,fraction in att:
 raw=idx[(m,id)]
 workrows.append([m,id,raw[8],attr,raw[2],fte,raw[7],fraction,None,None])
sh=sheet('Personal_Oficinas',['Mes','Oficina_ID','Ingresos brutos M€','Ingresos atribuidos M€','Gestores','FTE asignados','Activos M€','Factor atribución','k€ / gestor-mes','Activos M€ / FTE'],workrows,20,False)
sh.get_range('I2').formulas=[['=IF(E2=0,0,D2/E2*1000)']]
sh.get_range(f'I2:I{len(workrows)+1}').fill_down()
sh.get_range('J2').formulas=[['=IF(F2=0,0,G2/F2)']]
sh.get_range(f'J2:J{len(workrows)+1}').fill_down()
sh.get_range(f'H2:H{len(workrows)+1}').set_number_format('0.0%')
tf=rd('transfer-pricing-v7.csv');trrows=[list(r)+[None] for r in tf]
sh=sheet('Transfer_Pricing',['Mes','Region_ID','Segmento_ID','Financiación v6 M€','Financiación v7 M€','Δ Beneficio M€','Patrimonio M€','Check Δ'],trrows,19,False)
sh.get_range('H2').formulas=[['=D2-E2-F2']]
sh.get_range(f'H2:H{len(trrows)+1}').fill_down()
liq=json.loads((D/'liquidity.json').read_text('utf8'))
cap=[]
for r in liq:
 if r[0]!=12:continue
 cap.append([r[1],r[11],r[7],r[6],r[8],r[9],None,None])
sh=sheet('Capital_2024',['Región_ID','Patrimonio asignado M€','CET1 M€','RWA M€','Tier1 M€','Capital Total M€','CET1 / RWA','Diferencia patrimonio-CET1'],cap,24,False)
sh.get_range('G2').formulas=[['=IF(D2=0,0,C2/D2)']]
sh.get_range('G2:G6').fill_down()
sh.get_range('H2').formulas=[['=B2-C2']]
sh.get_range('H2:H6').fill_down()
sh.get_range('G2:G6').set_number_format('0.00%')
# Dedicated summary note: bridges are perimeter differences, not a derived reconciliation of adjustments.
sheet('CONTROLES',['Control','Resultado'],[
 ['Beneficio nacional 2024','1.046,39 M€ (se conserva)'],
 ['Conciliación por producto/región','90.132 pruebas existentes'],
 ['Provisiones Stage3 regionales','65,3% · 71,4% · 76,5% · 68,8% · 74,5% (diciembre)'],
 ['ROE segmental 2024','11,34% · 11,74% · 11,18% · 7,38% · 6,50%'],
 ['Capital','RWA contable coincide con RWA prudencial del escenario'],
 ['Límite','No se aportan ajustes prudenciales CET1 vs patrimonio: diferencia, no puente regulatorio'],
 ['Archivos auditables','scripts/recalibrate_risk_staff_v7.py y scripts/audit_v7.cjs']
],50,False)
SpreadsheetFile.export_xlsx(wb).save(str(OUT))
print('SAVED',OUT,OUT.stat().st_size)
try:
 print(wb.inspect({'kind':'table','range':'Capital_2024!A1:H6','include':'values,formulas','table_max_rows':6,'table_max_cols':8}).ndjson[:900])
except Exception as e:print('Inspect warning',repr(e)[:180])
