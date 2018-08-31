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

    /* eslint-disable global-require, import/no-extraneous-dependencies */
    const glob = require('glob-all');
    const path = require('path');
    const PurgecssPlugin = require('purgecss-webpack-plugin');

    class TailwindExtractor {
      static extract(content) {
        return content.match(/[A-Za-z0-9-_:/]+/g) || [];
      }
    }

    const plugins = [
      new PurgecssPlugin({
        // Specify the locations of any files to scan for class names
        paths: glob.sync([
          path.join(__dirname, './public/index.html'),
          path.join(__dirname, './src/**/*.vue'),
          path.join(__dirname, './src/**/*.js'),
        ]),
        extractors: [
          {
            extractor: TailwindExtractor,
            // Specify the file extensions to include when scanning for class names
            extensions: ['html', 'js', 'vue'],
          },
        ],
      }),
    ];

    if (process.env.COMPRESSION_ALGORITHM === 'gzip') {
      const CompressionPlugin = require('compression-webpack-plugin');
      plugins.push(new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
      }));
    }

    return {
      plugins,
    };
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
