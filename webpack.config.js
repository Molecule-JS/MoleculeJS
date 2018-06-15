const path = require('path');

const srcs = [
    'molecule',
    'molecule-lit',
    'molecule-lit-extended',
    'molecule-functional',
    'molecule-functional-lit',
    'molecule-functional-lit-extended',
    'molecule-decorators',
    'molecule-lit-directive-set-element',
];

module.exports = srcs.map(src => ({
    entry: `./packages/${src}/src/${src}.ts`,
    output: {
        filename: `${src}.js`,
        path: path.resolve(__dirname, `packages/${src}/dist`),
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
}))