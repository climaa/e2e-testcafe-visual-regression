const { Selector } = require('testcafe');
const path = require('path');

function parsePage(page) {
    return path.basename(page,  path.extname(page));
}

function parseBrowserName(browserName) {
    return browserName
        .replace(/locally-installed/, '');
}

function parseBrowserMode(browserMode) {
    return browserMode
        .replace(/:device=iphone 6/, '')
        .replace(/;orientation=horizontal/, '_horizontal');
}

async function variables(t) {
    let { browserName:browserMode, providerName:browserName } = t.testRun.browserConnection.browserInfo;
    const host = parsePage(page);
    browserName = parseBrowserName(browserName);
    browserMode = parseBrowserMode(browserMode);
    
    t.ctx.host = host;
    t.ctx.browserName = (browserMode === '') ? `${browserName}` : `${browserName}_${browserMode}`;
    t.ctx.browserName = (browserName === '') ? `${browserMode}` : t.ctx.browserName;
    t.ctx.browserMode = browserMode.replace(/ /g, '_');
}

async function screenshot(t, name = '') {
    const prefix = `${t.ctx.browserName}-${t.ctx.host}`;
    t.ctx.i = t.ctx.i || 0;

    await t.takeScreenshot(`${prefix}.${++t.ctx.i}-${name}.png`);
}

async function elementScreenshot(t, element, name = '') {
    const prefix = `${t.ctx.browserName}-${t.ctx.host}`;
    t.ctx.i = t.ctx.i || 0;
    
    await t.takeElementScreenshot(Selector(element), `${prefix}.${++t.ctx.i}-${name}.png`);
}

module.exports = {
    parsePage,
    variables,
    screenshot,
    elementScreenshot
};