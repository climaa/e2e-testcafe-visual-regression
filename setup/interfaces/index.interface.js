/* eslint no-console: "off" */
const createTestCafe = require('testcafe');
const paths = require('./../paths');

let testcafe = null;

module.exports = async function createInterface(options) {
    const pageUrl = options.page;
    const port1 = options.port1 || 1337;
    const port2 = options.port2 || 1338;

    return new Promise((resolve, reject) => {
        createTestCafe('localhost', port1, port2)
            .then(tc => {
                testcafe = tc;
                page = pageUrl;
                const runner = testcafe.createRunner();

                return runner
                    .src([paths.test])
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