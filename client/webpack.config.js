const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@Services': path.resolve(__dirname, 'src/Services'),
            '@supplements': path.resolve(__dirname, 'src/supplements'),
            '@decorators': path.resolve(__dirname, 'src/decorators.ts'),
            '@types': path.resolve(__dirname, 'src/types/index.d.ts')
        }
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.ts$/, 
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: 'file-loader',
            }
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                pathRewrite: { '^/api': '' },
                changeOrigin: true,
            },
        },
        historyApiFallback: true,
        compress: true,
        port: 3000
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'LinguaRPG'
        }),
        new CleanWebpackPlugin()
    ]
}
