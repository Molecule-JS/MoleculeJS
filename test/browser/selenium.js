const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');
require('./server.js');

(() => {
    let driver = new Builder().forBrowser('chrome').build();
    let failure;
    driver.get('http://localhost:3000')
        //.then(() => driver.wait(() => driver.executeScript(() => typeof window.mochaResults !== undefined), 200)
        .then(() => driver.sleep(2000))
        .then(() => driver.executeScript(() => window.mochaResults))
        .then(res => {
            const passes = res.passes;
            const failed = res.failures;
            console.log('');
            console.log(`${passes} tests passed and ${failed} tests failed.`);
            console.log('');
            failure = failed != 0;
        }).then(f => driver.quit())
        .then(() => {
            if(failure) {
                throw 'Tests failed'
                return process.exit(1);
            }
            return process.exit(0);
        });
})();