/* eslint no-console: "off" */
const createInterface = require('./setup/interfaces/index.interface');
const visualRegression = require('./setup/regression/regression.prototype');
const reports = require('./setup/reports/reports.prototype');
const [ ,, browser, page, baseline, example, viewport ] = process.argv;
let options = {browser, page, baseline, example, viewport};

const regression = new visualRegression(browser, page, baseline);

createInterface(options)
    .then(() => {
        options.page = baseline;
        options.port1 = 1339;
        options.port2 = 1340;
        createInterface(options)
            .then(() => {
                console.log('All interfaces are finished!');
                regression.init()
                    .then((result) => {
                        const report = new reports(result, 'HTML');
                        report.saveFile();
                        report.open();
                    })
                    .catch(err => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    })
    .catch((err) => {
        console.error(err);
    });