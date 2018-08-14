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
