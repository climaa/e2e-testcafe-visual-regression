/* eslint no-console: "off" */
const paths = require('./../paths');
const { parsePage } = require('./../common-tests/');
const glob = require('glob');
const fs = require('fs-extra');
const BlinkDiff =  require('blink-diff');
const path = require('path');
var jimp = require('jimp');

/**
 * @constructor visualRegression
 * @param {String} browser Name called by Testcafe.
 * @param {String} host Complete file name.
 * @param {String} baseline Complete file name.
 */
function visualRegression(browser, host, baseline) {
    this.host = parsePage(host);
    this.baseline = parsePage(baseline);
    this.browser = browser;
    this.screenshots = paths.screenshots;
    this.outputFolder = `${paths.regressions}/${this.host}_vs_${this.baseline}`;
    this.pathsImgs = [];
    this.outputLogs = [];
    this.thumbnailPercentage = 0.025;
}

visualRegression.prototype.init = async function init() {
    return new Promise((resolve, reject) => {
        // Detect if using headless mode.
        this.isHeadless();
        // Obtains this.pathsImgs.
        this.obtainComparativeObj();
        // Create folder output.
        this.createOutputFolder();
        // Remove files inside output folder.
        this.removeFilesOutputFolder();
        // Iterate all images and retrieve data.
        const promises = this.pathsImgs.map(obj => {
            return this.getDifferencesImages(obj);
        });
        // Run all images promises.
        Promise.all(promises)
            .then((results) => {
                results.filename = `${this.host}_${this.baseline}`;
                results.outputFolder = this.outputFolder;
                this.createThumbnails().then(() => resolve(results));
                resolve(results);
            })
            .catch(err => reject(err));
    });
};

visualRegression.prototype.isHeadless = function isHeadless() {
    if (this.browser.indexOf('headless') > -1) {
        this.browser = this.browser[0].replace(':','_');
    }
};

visualRegression.prototype.obtainComparativeObj = function obtainComparativeObj() {
    const matches = `+(${this.browser}-${this.host}|${this.browser}-${this.baseline})`;
    const dirPattern = `${this.screenshots}/*${matches}.*.png`;
    const pathsImages = glob.sync(dirPattern);
    const pathsImgs = [];
    // Brake program is doesn't match images.
    if (pathsImages.length === 0) {
        throw 'Not found on path images, please review your command line sentence.';
    }
    // Add into array the name and host image path.
    pathsImages.forEach(element => {
        const filename =  path.basename(element);
        const name = filename.split('.')[1];
        const browserName = filename.split('-')[0];
        let host = undefined;
        for (let i in pathsImages) {
            if (pathsImages[i].indexOf(name) > -1) {
                if (pathsImages[i].indexOf(this.host) > -1) {
                    host = pathsImages[i];
                    pathsImgs.push({name, browserName, host});
                    delete pathsImages[i];
                }
            }
        }
    });
    // Add into array the baseline image path.
    pathsImgs.forEach(element => {
        const name = element.name;
        const host = element.host;
        const browserName = element.browserName;

        if (element.host === undefined) {
            throw `Doesn't exist the file having name "${name}" finding by host: "${this.host}".`;
        }

        for (let i in pathsImages) {
            if (pathsImages[i].indexOf(name) > -1 && pathsImages[i].indexOf(browserName) > -1) {
                this.pathsImgs.push({name, browserName, host, baseline: pathsImages[i]});
            }
        }
    });
};

visualRegression.prototype.createOutputFolder = function createOutputFolder() {
    if (!fs.existsSync(this.outputFolder)){
        fs.mkdirSync(this.outputFolder);
    }
};

visualRegression.prototype.removeFilesOutputFolder = function removeFilesOutputFolder() {
    const dirPattern = glob.sync(`${this.outputFolder}/**`);
    dirPattern.shift();
    dirPattern.forEach(element => fs.unlinkSync(element));
};

/**
 * @param {object} obj ex: {host, baseline, name, browserName}
 */
visualRegression.prototype.getDifferencesImages = async function getDifferencesImages(obj) {
    const filename = `${obj.browserName}_${obj.name}`;
    const diff = new BlinkDiff({
        threshold: 0.01, // 1% threshold
        imageAPath: obj.host,
        imageBPath: obj.baseline,
        thresholdType: BlinkDiff.THRESHOLD_PERCENT,
        imageOutputPath: `${this.outputFolder}/${filename}.png`
    });
    return new Promise(resolve => {
        let result = diff.runSync();
        console.log(`    ▫ The image ${filename} has been processed.`);
        result.filename = filename;
        result.hasPassed = diff.hasPassed(result.code) ? 'Passed' : 'Failed';
        resolve(result);
    });
};

visualRegression.prototype.createThumbnails = function createThumbnails() {
    const pathsImages = glob.sync(`${this.outputFolder}/*.png`);
    const promises = pathsImages.map(element => {
        const filename = path.basename(element, path.extname(element));
        return new Promise(resolve => {
            jimp.read(element)
                .then(image => {
                    image
                        .scale(this.thumbnailPercentage)
                        .write(`${this.outputFolder}/${filename}_thumbnail.png`, () => resolve());
                })
                .catch(err => console.error(err));
        });
    });
    return new Promise(resolve => {
        Promise.all(promises).then(() => resolve());
    });
};

module.exports = visualRegression;
