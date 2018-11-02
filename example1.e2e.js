const { variables, screenshot, elementScreenshot } = require('./setup/common-tests');

fixture `Demo visual regression`
    .page(page)
    .beforeEach(async t => await variables(t));

test('Enter and take screenshot', async t => {
    await t.resizeWindow(viewport, 700);
    await screenshot(t, 'example1');
    await elementScreenshot(t, 'h1', 'example1Title');
});