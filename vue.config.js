const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    baseUrl: './',
    chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude
            .add(resolve('src/icons'))
            .end()
            .use('file-loader')
            .loader('file-loader')
            .options({
                name: 'img/[name].[hash:8].[ext]'
            })

        config.module
            .rule('svg-icon')
            .include
            .add(resolve('src/icons/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },
    lintOnSave: undefined,

    configureWebpack: {
        output: {
            sourcePrefix: ' '
        },
        amd: {
            toUrlUndefined: true
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                'cesium': path.resolve(__dirname, cesiumSource)
                // 'cesium': path.resolve(cesiumSource)
            }
        },
        plugins: [
            new CopyWebpackPlugin([{
                from: path.join(cesiumSource, cesiumWorkers),
                to: 'Workers'
            }]),
            new CopyWebpackPlugin([{
                from: path.join(cesiumSource, 'Assets'),
                to: 'Assets'
            }]),
            new CopyWebpackPlugin([{
                from: path.join(cesiumSource, 'Widgets'),
                to: 'Widgets'
            }]),
            new CopyWebpackPlugin([{
                from: path.join(cesiumSource, 'ThirdParty/Workers'),
                to: 'ThirdParty/Workers'
            }]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./')
            })
        ],
        module: {
            unknownContextCritical: /^.\/.*$/,
            unknownContextCritical: false

        }
    }
}