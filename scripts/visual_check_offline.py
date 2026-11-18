import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
CSS=(ROOT/'styles.css').read_text()
HTML='''<div class="dash-grid" style="grid-template-columns:1fr;max-width:500px;margin:20px auto"><section class="panel executive-funnel-panel" style="min-height:460px"><div class="panel-head"><span class="panel-icon"></span><div><h2 class="panel-title">Embudo comercial</h2><p class="panel-sub">De leads a captaciones: volumen y conversión</p></div></div><div class="panel-body"><div class="funnel-layout funnel-expanded"><div class="funnel-body"><div class="funnel-shapes"><div class="funnel-stage" style="background:#0860d0">2.031.027</div><div class="funnel-stage" style="background:#13a9da">1.766.739</div><div class="funnel-stage" style="background:#26c9c8">1.271.653</div><div class="funnel-stage" style="background:#51cd78">477.937</div></div><div class="funnel-steps"><div class="funnel-step"><i style="background:#0860d0"></i><span class="funnel-name">Leads generados</span><b>2.031.027</b><small>Inicio del embudo</small></div><div class="funnel-step"><i style="background:#13a9da"></i><span class="funnel-name">Contactados</span><b>1.766.739</b><small>87,0 % conversión</small></div><div class="funnel-step"><i style="background:#26c9c8"></i><span class="funnel-name">Cualificados</span><b>1.271.653</b><small>72,0 % conversión</small></div><div class="funnel-step"><i style="background:#51cd78"></i><span class="funnel-name">Captados</span><b>477.937</b><small>37,6 % conversión</small></div></div></div><div class="funnel-conversion-total"><span>Conversión total · leads a clientes</span><strong>23,5 %</strong></div></div></div></section></div>'''
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for width in (1440,390):
   page=await browser.new_page(viewport={'width':width,'height':840})
   await page.set_content('<!doctype html><html><head><meta charset="UTF-8"><style>'+CSS+'</style></head><body>'+HTML+'</body></html>')
   layout=await page.evaluate('''() => {const p=document.querySelector('.executive-funnel-panel'),q=p.querySelector('.funnel-layout'),s=[...p.querySelectorAll('.funnel-stage')],t=[...p.querySelectorAll('.funnel-step')],rect=e=>{const r=e.getBoundingClientRect();return [r.top,r.bottom,r.height,r.width]};return {card:rect(p),funnel:rect(q),stages:s.map(rect),steps:t.map(rect),gapTop:rect(q)[0]-rect(p)[0],gapBottom:rect(p)[1]-rect(q)[1]}}''')
   print(width,layout)
   await page.locator('.executive-funnel-panel').screenshot(path=str(ROOT/f'funnel-offline-{width}.png'))
   await page.close()
  await browser.close()
asyncio.run(main())
