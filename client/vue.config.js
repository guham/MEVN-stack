module.exports = {
  lintOnSave: false,
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'development') {
      // Vue.js debugging in Chrome and VS Code
      // https://github.com/Microsoft/vscode-recipes/tree/master/vuejs-cli
      return {
        devtool: 'source-map',
      };
    }
    if (process.env.COMPRESSION_ALGORITHM === 'gzip') {
      /* eslint-disable-next-line global-require, import/no-extraneous-dependencies */
      const CompressionPlugin = require('compression-webpack-plugin');
      return {
        plugins: [
          new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
          }),
        ],
      };
    }
    return {};
  },
  chainWebpack: (config) => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end();
  },
};
