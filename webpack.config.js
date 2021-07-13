const path = require('path');
const Webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        mainPage: path.resolve(__dirname, './src/js/script.js'),
        blogPage: ['@babel/polyfill', path.resolve(__dirname, './src/js/blog-page.js')],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new Webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new HTMLWebpackPlugin({
            chunks: ['mainPage'],
            template: './src/index.html',
        }),
        new HTMLWebpackPlugin({
            filename: 'blog.html',
            chunks: ['blogPage'],
            template: './src/blog.html',
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, './src/img'), to: path.resolve(__dirname, 'dist/img') },
            ]
        }),
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.(svg|jpg|png|gif)$/,
                use: ['file-loader']
            }, {
                test: /\.s[ac]ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader', 'sass-loader'
                ]
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: {
            //         loader: 'bable-loader',
            //         options: {
            //             presets: [
            //                 'babel/preset-env'
            //             ]
            //         }
            //     }
            // }
        ]
    }
}