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
};
