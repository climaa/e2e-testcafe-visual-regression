const { variables, screenshot } = require('./setup/common-tests');
const { Selector }  = require('testcafe');

fixture `Demo visual regression`
    .page(page)
    .beforeEach(async t => await variables(t));

test('Enter and take screenshot', async t => {
    const clickFirstReadMore = Selector('#myBtn').nth(0);
    await t.resizeWindow(viewport, 600);
    await t
        .hover(clickFirstReadMore)
        .click(clickFirstReadMore);
    await t.wait(800);
    await screenshot(t, 'modal');
});