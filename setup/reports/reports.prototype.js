const paths = require('./../paths');
const { markdown } = require( 'markdown' );
const opn = require('opn');
const fs = require('fs');

/**
 * @constructor Create reports.
 * @param {array} data
 * @param {string} fileType example: markdown or HTML.
 * @param {string} type example: regression
 */
function reports(data, fileType, type) {
    const { filename , outputFolder } = data;
    delete data.filename;
    delete data.outputFolder;

    this.data = data;
    this.savePath = `${outputFolder}/${filename}`;
    this.type = type || 'regression';
    this.fileType = fileType || 'markdown';
    this.extension = '.md';
    this.css = undefined;
}

reports.prototype.markdown = function markdown() {
    let output = [];
    output.push('# Visual regression report');
    output.push('## Tests with differences');
    output.push('');
    output.push(' Thumbnail | Status | Filename | Differences | Width | Height | Percentage ' );
    output.push(':---------:|:------:|:--------:|------------:|------:|-------:|-----------:');
    this.data.forEach(e => {
        let line = [];
        const percentage = (e.differences / e.dimension) * 100;
        line.push(`[![Open](${e.filename}_thumbnail.png)](${e.filename}.png)`);
        line.push(e.hasPassed);
        line.push(e.filename);
        line.push(`${e.differences}px`);
        line.push(`${e.width}px`);
        line.push(`${e.height}px`);
        line.push(`${percentage.toFixed(2)}%`);
        output.push(line.join(' | '));
    });
    output.push('');
    return output;
};

reports.prototype.MDToHTML = function MDToHTML(input) {
    this.readCSSFile();
    return markdown.toHTML(input, 'Maruku');
};

reports.prototype.readCSSFile = function readCSSFile() {
    this.css = fs.readFileSync(`${paths.reports}/styles.css`).toString();
};

reports.prototype.saveFile = function saveFile() {
    let output = this.markdown().join('\n');
    this.savePath = `${this.savePath}${this.extension}`;

    if (this.fileType === 'HTML') {
        output = this.MDToHTML(output);
        output += `<style>${this.css}</style>`;
        this.savePath = this.savePath.replace(this.extension, '.html');
    }

    return fs.writeFileSync(this.savePath, output.toString());
};

reports.prototype.open = function open() {
    opn(this.savePath);
};

module.exports = reports;
