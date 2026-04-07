const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/courses');
  await page.waitForTimeout(2000); // Wait for load

  console.log("Setting filter to all...");
  await page.select('select', 'all'); // The status filter is the second select? Let's use selectors carefully.
  
  // Wait, let's just click the first course edit button
  // And take a screenshot
  await page.screenshot({ path: '/tmp/courses-all.png' });
  console.log("Saved dashboard screenshot.");

  await browser.close();
})();
