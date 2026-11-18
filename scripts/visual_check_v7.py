import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
root=Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=await browser.new_page(viewport={'width':1480,'height':980},device_scale_factor=1)
  errs=[]
  page.on('pageerror',lambda e: errs.append(str(e)))
  await page.goto('http://127.0.0.1:8766/',wait_until='networkidle',timeout=40000)
  await page.locator('.kpi-card').first.wait_for(timeout=30000)
  for name,tab in [('executive','Visión ejecutiva'),('profit','Rentabilidad y márgenes'),('risk','Riesgo y morosidad'),('offices','Red de oficinas')]:
   await page.locator(f'[data-page="{name}"]').last.click()
   await page.wait_for_timeout(350)
   screenshot=root/f'preview-v7-{name}.png'
   await page.screenshot(path=str(screenshot),full_page=True)
   print(name,'screenshot',screenshot,screenshot.stat().st_size,'panels',await page.locator('.panel').count())
   if name=='risk':
    print('risk card',await page.locator('.kpi-card').nth(2).inner_text())
   if name=='offices':
    print('staff label',await page.get_by_text('FTE asignados').count())
  await page.locator('[data-page="executive"]').last.click()
  legend=page.locator('.scatter-key-above');print('legend count',await legend.count(),'visible',await legend.first.is_visible())
  for t in ['year','q1','8']:
   await page.select_option('#f-period',t)
   print('period',t,'KPI',await page.locator('.kpi-card').count())
  print('JS ERRORS',errs[:8])
  await browser.close()
asyncio.run(main())
