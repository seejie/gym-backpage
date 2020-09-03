'use strict';

const path = require('path');
process.env.VUE_APP_TITLE = require('./configsetting.js').title;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',
  outputDir: './xqnback',
  assetsDir: './static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/xqn': {
        target: 'http://saas.njlime.com/xqn/', // 目标接口域名
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/xqn': '/xqn', // 重写接口
        },
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src'),
        utils: resolve('src/utils'),
        components: resolve('src/components'),
        views: resolve('src/views'),
        api: resolve('src/api'),
        store: resolve('src/store'),
      },
    },
  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
  css: {
    loaderOptions: {
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `data` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: '@import "./src/styles/index.scss";',
      },
    },
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: `${process.env.VUE_APP_TITLE}`,
    },
  },
};
