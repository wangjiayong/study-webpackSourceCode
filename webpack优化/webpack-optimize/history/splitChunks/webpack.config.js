let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let webpack = require('webpack');
module.exports = {
  optimization:{ // commonChunkPlugins
    splitChunks:{ // 分割代码块
      cacheGroups:{ // 缓存组
        common:{ // 公共的模块
          chunks:'initial',//从入口出就开始执行抽离逻辑
          minSize:0, // 大于0kb就抽离
          minChunks:2, // 引用超过两次就抽离
        },
        vendor:{
          priority:1, // 由于代码从上往下先执行的common中的抽离，如果有一个文件a.js属于common的抽离方式，a.js里也
          // 使用了react，那么最终只会抽离出一个common.hash.js出来，并不会生成vendor.js文件，所以配置priority:1代表
          // 提高抽离的层级，先把test:/node_modules/匹配到的node_modules中的模块被多次应用的抽离出来，再执行common的抽离
          // 此时就会生成common.js（里面就是自己封装的被多次使用的组件）和vendor.js（里面有react等相关第三方模块)
          test:/node_modules/, // 代表只有从node_modules中引入的模块才会抽离，自己写的模块不会抽离
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    }
  },
  mode: 'production',
  entry: {
    index:'./src/index.js',
    other:'./src/other.js'
  },
  devServer: {
    port: 3000,
    open: true,
    contentBase: './dist'
  },
  module: {
    noParse: /jquery/, // 不去解析jquery中的依赖库
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    // }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}