const app = require('express')();
const path = require('path');

(() => {
    app.get('/favicon.ico', (req, res) => res.sendStatus(200))

    app.get('/node_modules*', (req, res) => {
        res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + req.url))
    });

    app.get('/molecule-lit.js', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/molecule-lit.js')));
    app.get('/molecule.js', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/molecule.js')));

    app.get('/lib*', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + req.url)));

    app.get('/lit-html/*', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/node_modules' + req.url)));

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, req.url)));

    app.listen(3000);

})();