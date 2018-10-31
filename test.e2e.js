const { variables, screenshot, elementScreenshot } = require('./setup/common-tests/');

fixture `Demo visual regression`
    .page(page)
    .beforeEach(async t => await variables(t));

test('Enter and take screenshot', async t => {
    await screenshot(t, 'screenshotOne');
    await elementScreenshot(t, 'h1', 'screenshotTitle');
});