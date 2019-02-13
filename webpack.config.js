// webpack v4
const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")

const modeDev = 'development';

var configFn = (env, argv) => {


    const mode = argv ? argv.mode : modeDev;
    const development = mode ===  modeDev;

    console.log('Build mode: [' + mode + ']');

    var config = {
        mode: mode,
        devServer: {
            contentBase: [path.join(__dirname, 'resources'), path.join(__dirname, 'dist')],
            compress: false,
            port: 8090
        },
        devtool: development ? 'eval-source-map' : undefined,
        entry: {
            // To output only TypeScript as module see https://github.com/webpack/webpack/issues/4002
            lib: './src/scripts/lib.js',
            app: './src/scripts/app.js',
            typescript: './src/typescript/typescript.ts'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: env.cdn,
            filename: '[name].js',
            chunkFilename: '[name]-[chunkhash].js',
            library: ["TypeScript", "[name]"],
            libraryTarget: "umd",
//            devtoolModuleFilenameTemplate: '../[resource-path]',
        },
        module: {
            rules: [
                {
                    test: [/\.exec\.js$/],
                    exclude: /node_modules/,
                    use: ['script-loader']
                },
                {
                    test: /\.(sc|c)ss$/,
                    exclude: /node_modules/,
                    use: [ // loader: 'style-loader', // Adds CSS to the DOM by injecting a <style> tag
                        {
                            loader: MiniCssExtractPlugin.loader // Extract css
                        },
                        {
                            loader: 'css-loader', // Convert CSS to CommonJS
                            options: {importLoaders: 2}
                        },
                        {
                            loader: 'postcss-loader' // see postcss.config.js
                        },
                        {
                            loader: 'sass-loader'  // Compile to sass
                        }]
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: ['ts-loader']
                }]
        },
        resolve: {
            extensions: ['.js', '.json', '.ts']
        },
        externals: {
            moment: 'moment',
            jquery: 'jQuery',
            $: '$'
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                //test: /postcss-loader$/, // only for this module
                options: {
                    mode: mode
                }
            }),
            new WebpackMd5Hash(),
            new MiniCssExtractPlugin({
                filename: '[name]-[chunkhash].css',
            })
        ]
    };

    if (!development) {
        config.plugins.push(
            new CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 100,
                minRatio: 0.9
            })
        );
    }
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    // Don't destroy dist folder with webpack-dev-server
    if (!env || !env.WEBPACK_DEV_SERVER) {
        config.plugins.unshift(new CleanWebpackPlugin('dist', {}));
    }

    console.log('Config: [' + JSON.stringify(config) + ']');

    return config;
};

module.exports = (env, argv) => {
    return configFn(env, argv);
};