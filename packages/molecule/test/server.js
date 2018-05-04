const app = require('express')();
const path = require('path');

(() => {
    app.get('/favicon.ico', (req, res) => res.sendStatus(200))

    app.get('/node_modules*', (req, res) => {
        res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + req.url))
    });

    app.get('/lit-element.js', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/lit-element.js')));
    app.get('/lit-lite.js', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/lit-lite.js')));

    app.get('/lib*', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + req.url)));

    app.get('/lit-html/*', (req, res) => res.sendFile(path.join(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/node_modules' + req.url)));

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, req.url)));

    app.listen(3000);

})();