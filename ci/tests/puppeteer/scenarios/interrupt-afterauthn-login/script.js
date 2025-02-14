const puppeteer = require('puppeteer');
const assert = require('assert');
const cas = require('../../cas.js');

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await cas.newPage(browser);
    await page.goto("https://localhost:8443/cas/login");
    await cas.loginWith(page, "casuser", "Mellon");
    await cas.loginDuoSecurityBypassCode(page, 'universal-prompt');

    console.log(`Duo Security authentication should now be complete`);
    console.log("Checking for page URL...")
    console.log(await page.url())
    await cas.screenshot(page);
    await cas.assertTextContent(page, "#content h1", "Authentication Interrupt")
    await cas.assertTextContentStartsWith(page, "#content p", "The authentication flow has been interrupted");
    await cas.assertNoTicketGrantingCookie(page);
    await cas.assertTextContent(page, "#interruptMessage", "We interrupted your login");
    await cas.assertVisibility(page, '#interruptLinks')
    await cas.assertVisibility(page, '#attributesTable')
    await cas.assertVisibility(page, '#field1')
    await cas.assertVisibility(page, '#field1-value')
    await cas.assertVisibility(page, '#field2')
    await cas.assertVisibility(page, '#field2-value')

    let cancel = await page.$('#cancel');
    assert(cancel == null);
    await cas.submitForm(page, "#fm1");
    await cas.assertTicketGrantingCookie(page);
    await page.waitForTimeout(1000)
    await browser.close();
})();
