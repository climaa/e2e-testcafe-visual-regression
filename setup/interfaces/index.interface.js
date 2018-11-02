/* eslint no-console: "off" */
const createTestCafe = require('testcafe');
const paths = require('./../paths');
const { cleanScreenshotFolder } = require('./../common-tests/');
const path = require('path');

let testcafe = null;

cleanScreenshotFolder();

module.exports = async function createInterface(options) {
    const pageUrl = options.page;
    const port1 = options.port1 || 1337;
    const port2 = options.port2 || 1338;
    const width = Number(options.viewport);

    return new Promise((resolve, reject) => {
        createTestCafe('localhost', port1, port2)
            .then(tc => {
                testcafe = tc;
                page = pageUrl;
                viewport = width;
                const runner = testcafe.createRunner();
                const example = path.resolve(`${paths.root}/${options.example}`);

                return runner
                    .src([example])
                    .screenshots(paths.screenshots)
                    .browsers(options.browser)
                    .run();
            })
            .then(failedCount => {
                console.log(`Test failed: ${failedCount}`);
                testcafe.close();
                resolve();
            })
            .catch(error => {
                testcafe.close();
                reject(error);
            });
    });
};