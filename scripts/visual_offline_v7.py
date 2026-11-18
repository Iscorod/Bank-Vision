import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for width in [1440,390]:
   for name in ['executive','risk','offices']:
    page=await browser.new_page(viewport={'width':width,'height':950},device_scale_factor=1)
    html=(ROOT/f'_offline_{name}.html').read_text()
    html=html.replace("@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');",'')
    await page.set_content(html,wait_until='domcontentloaded',timeout=12000)
    # no remote fonts requested in offline preview
    file=ROOT/f'preview-v7-{name}-{width}.png'
    await page.screenshot(path=str(file),full_page=True)
    result=await page.evaluate('''() => { const panels=[...document.querySelectorAll('.panel')],legend=document.querySelector('.scatter-key-above');return {height:document.body.scrollHeight,panels:panels.length,legend:!!legend?{h:legend.getBoundingClientRect().height,top:legend.getBoundingClientRect().top}:null,overflow:panels.filter(p=>p.scrollWidth>p.clientWidth+3).map(p=>p.getAttribute('aria-label')).slice(0,8)} }''')
    print(width,name,result,'bytes',file.stat().st_size)
    await page.close()
  await browser.close()
asyncio.run(main())
