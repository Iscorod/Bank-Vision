import asyncio,sys,os
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in [(1440,900),(390,844)]:
   page=await browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
   logs=[]
   page.on('pageerror',lambda e:logs.append(str(e)))
   await page.goto('http://127.0.0.1:8766/',wait_until='domcontentloaded',timeout=15000)
   await page.wait_for_selector('.executive-funnel-panel .funnel-stage',timeout=20000)
   await page.wait_for_timeout(600)
   prefix=f'/mnt/data/bankvision-v6/{w}'
   await page.screenshot(path=prefix+'-page.png',full_page=True)
   await page.locator('.executive-funnel-panel').screenshot(path=prefix+'-funnel.png')
   funnel=await page.evaluate('''() => {const p=document.querySelector('.executive-funnel-panel'),b=p.querySelector('.panel-body'),lay=p.querySelector('.funnel-expanded'),f=lay.querySelector('.funnel-body'),s=lay.querySelector('.funnel-shapes'),step=lay.querySelector('.funnel-steps'); const r=x=>{const z=x.getBoundingClientRect();return {top:z.top,bottom:z.bottom,height:z.height,width:z.width}};return {card:r(p),body:r(b),layout:r(lay),funnel:r(f),shapes:r(s),steps:r(step),overflow:p.scrollHeight-p.clientHeight,stage:[...p.querySelectorAll('.funnel-stage')].map(r),stepRows:[...p.querySelectorAll('.funnel-step')].map(r)};}''')
   print(w,'errors',logs,'funnel',funnel)
   await page.close()
  await browser.close()

if __name__=='__main__':asyncio.run(main())
