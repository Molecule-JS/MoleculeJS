const puppeteer = require('puppeteer');
require('./server.js');

let browser, page, failure;

puppeteer.launch({args: ['--no-sandbox']})
    .then(b => {
        browser = b;
        return browser.newPage();
    })
    .then(p => {
        page = p;
        return page.goto('http://localhost:3000');
    })
    .then(() => page.waitFor(() => window.mochaResults !== undefined))
    .then(() => page.evaluateHandle(() => window.mochaResults))
    .then(res => res.jsonValue())
    .then(res => {
        const passes = res.passes;
        const failed = res.failures;
        console.log('');
        console.log(`${passes} tests passed and ${failed} tests failed.`);
        console.log('');
        failure = failed != 0;
    })
    .then(() => browser.close())
    .then(() => {
        if(failure) {
            throw 'Tests failed'
            return process.exit(1);
        }
        return process.exit(0);
    });
