const path = require('path');

let paths = {};
paths.root = path.resolve(`${__dirname}/../`);
paths.screenshots = path.join(paths.root, 'screenshots');
paths.regressions = path.join(paths.root, 'regressions');
paths.setup = path.join(paths.root, 'setup');
paths.reports = path.join(paths.setup, 'reports');

module.exports = paths; 