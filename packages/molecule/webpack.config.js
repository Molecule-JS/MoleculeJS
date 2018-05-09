const path = require('path');
const uglifyJS = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        molecule: './src/molecule.ts',
        ['molecule-lit']: './src/molecule-lit.ts',
        ['molecule-lit-extended']: './src/molecule-lit-extended.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
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
    },
    plugins: [
        new uglifyJS()
    ]
}