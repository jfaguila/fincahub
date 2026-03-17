const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'estrategia.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Wait for fonts to load
  await page.waitForTimeout(2000);

  await page.pdf({
    path: path.resolve(__dirname, 'FincaHub-Estrategia-Marketing.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('PDF generado: FincaHub-Estrategia-Marketing.pdf');
})();
