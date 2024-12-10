const HtmlWebpackPlugin = require('html-webpack-plugin')
const _ = require('lodash');
class HtmlInjectEnvPlugin {

  /**
   * apply is called by the webpack main compiler during the start phase
   * @param {WebpackCompiler} compiler
   */
  apply (compiler) {
    compiler.hooks.beforeRun.tap('HtmlInjectEnvPlugin',
      /**
       * Hook into the webpack emit phase
       * @param {WebpackCompilation} compilation
       * @param {(err?: Error) => void} callback
      */
      (compiler) => {
        console.log(process.env.NODE_ENV);
        process.env.Project_Version = '1.1'
        compiler.options.plugins.forEach((plugin) => {
          if (!(plugin instanceof HtmlWebpackPlugin)) {
            return;
          }
          plugin.options = {
            ...plugin.options,
            env: {
              ...plugin.options.env,
              ...process.env,
              PACKGE_VERSION: [process.env.npm_package_name, process.env.npm_package_version].join('@')
            },
          }
        })
      })
      compiler.hooks.compilation.tap('HtmlInjectEnvPlugin', (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'HtmlInjectEnvPlugin',
          (data, cb) => {
            const htmlWebpackPlugin = data.plugin;
            if (typeof htmlWebpackPlugin.options.templateContent === 'function') {
              // 使用 lodash 渲染模板内容
              const template = _.template(data.html, { interpolate: /<%=([\s\S]+?)%>/g });
              const renderedHtml = template({
                htmlWebpackPlugin: {
                  options: {
                    env: {
                      ...htmlWebpackPlugin.options.env,
                      // mode: process.env.NODE_ENV,
                      // PACKGE_VERSION: [process.env.npm_package_name, process.env.npm_package_version].join('@')
                    }
                  }
                }
              });
  
              // 更新 HTML 内容
              data.html = renderedHtml;
            }
  
            // 调用回调函数，传递修改后的 HTML
            cb(null, data);
          }
        );
      });
  }
}

module.exports = HtmlInjectEnvPlugin;