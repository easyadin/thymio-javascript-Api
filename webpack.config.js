const path = require('path');
const webpack = require('webpack');
var babelenv = require('@babel/preset-env');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const browserConfig = {
    entry : [
        'babel-polyfill',
        './src/index.js'
    ],
    node: {
        fs: "empty"
    },
    output: {
        filename: 'thymio.js',
        path: __dirname + "/dist/",
    },
    mode: "development",
    devtool: 'sourcemap',
    devServer: {
        hot : true,
        overlay: true,
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test:  /\.*\.ts$/,
                loader: 'ts-loader'
            },
            {
                test:  /\.*\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules\/babel-polyfill)/,
                options: {
                    presets: [
                        [
                            babelenv , {
                                "targets": {
                                    "browsers": ["> 3%", "ie >= 10"]
                                }
                            }
                        ]
                    ]
                }
            }
        ]
    }
};


const nodeConfig = {
    target: 'node',
    entry : [
        './src/index.js'
    ],
    //externals: [nodeExternals()],
    output: {
        filename: 'thymio-node.js',
        path: __dirname + "/dist/",
    },
    devtool: 'sourcemap',
    module: {
        rules: [
            {
                test:  /\/src\/.*\.js$/,
                loader: 'babel-loader',
                options: {
                    "presets": [
                        [babelenv, { "targets": { "node": "current" } } ]
                    ]
                },
                exclude: /node_modules/
            }
        ]
    },
    node: {
        fs: 'empty'
    },
};

module.exports = [ browserConfig , nodeConfig];

module.exports = {
    module:{
        rules: [
            {
                test:/\.html$/,
                use:[
                    {
                        loader:"html-loader",
                        options:{minimize:true}
                    }
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({
            template:"./src/index.html",
            filename:"./index.html"
        }),
    ]
}