const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    externals: [nodeExternals()],
    entry: './src',
    mode: 'development',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './src/index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            },
            // {
            //     test: /\.txt$/i,
            //     use: [
            //         {
            //             loader: 'raw-loader',
            //             options: {
            //                 esModule: false,
            //             },
            //         },
            //     ],
            // },
        ],
    },
};