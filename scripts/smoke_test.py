import asyncio
from playwright.async_api import async_playwright

async def main():
  async with async_playwright() as p:
    browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--allow-file-access-from-files','--disable-web-security','--no-proxy-server'])
    page=await browser.new_page(viewport={'width':1672,'height':960},device_scale_factor=1)
    errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
    await page.goto('file:///mnt/data/banking-dashboard-vercel/index.html',wait_until='load')
    await page.wait_for_selector('.kpi-card',timeout=20000)
    print('App loaded',await page.title(),'kpis',await page.locator('.kpi-card').count(),'panels',await page.locator('.panel').count())
    print('Initial KPIs',await page.locator('.kpi-card .kpi-value').all_text_contents())
    await page.screenshot(path='/mnt/data/banking-dashboard-vercel/assets/preview-executive.png',full_page=True)
    for tab in ['profit','risk','liquidity','clients','offices']:
      await page.locator(f'[data-page="{tab}"]').click()
      await page.wait_for_timeout(180)
      print('tab',tab,'title',await page.title(),'panels',await page.locator('.panel').count(),'values', (await page.locator('.kpi-value').all_text_contents())[:3])
      await page.screenshot(path=f'/mnt/data/banking-dashboard-vercel/assets/preview-{tab}.png',full_page=True)
    await page.locator('[data-filter="region"]').select_option('2')
    print('region filter',await page.locator('[data-filter="region"]').input_value())
    await page.locator('[data-filter="office"]').select_option('51') if await page.locator('[data-filter="office"] option[value="51"]').count() else None
    await page.wait_for_timeout(500)
    print('office selection',await page.locator('[data-filter="office"]').input_value())
    await page.locator('[data-action="reset"]').click()
    print('reset',await page.locator('[data-filter="office"]').input_value())
    print('ERRORS',errors)
    await browser.close()

asyncio.run(main())
