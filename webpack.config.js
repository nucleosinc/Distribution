// webpack.config.js
var Encore = require('@symfony/webpack-encore')

const entries = require('./webpack/entries')
const libraries = require('./webpack/libraries')
const webpack = require('webpack')
const plugins = require('./webpack/plugins')

const BowerResolvePlugin = require("bower-resolve-webpack-plugin");

const collectedEntries = entries.collectEntries()

Encore
    .setOutputPath('web/dist/')
    .setPublicPath('/dist')
    .autoProvidejQuery()
    .enableReactPreset()
    .enableSourceMaps(!Encore.isProduction())
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
  //  .enablePostCssLoader()

//allow url rewriting for '#/'
Encore.addPlugin(plugins.distributionShortcut())
//Encore.addPlugin(new BowerResolvePlugin())
//Encore.addLoader({test: /\.css$/, loader: 'style!css'})
Encore.addLoader({test: /\.html$/, loader: 'html-loader'})

Object.keys(collectedEntries).forEach(key => Encore.addEntry(key, collectedEntries[key]))

let shared = []
Object.keys(libraries).forEach(key => shared = shared.concat(libraries[key]))
Encore.createSharedEntry('dll', shared)

config = Encore.getWebpackConfig()

config.resolve.modules = ['./node_modules', './web/packages']
//in that order it solves some issues... if we start with bower.json, many packages don't work
config.resolve.descriptionFiles = ['package.json', '.bower.json', 'bower.json']
config.resolve.mainFields = ['main', 'browser']
config.resolve.aliasFields = ['browser']

// export the final configuration
module.exports = config
