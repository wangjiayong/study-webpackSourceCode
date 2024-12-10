let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
module.exports = {
  optimization:{ // 优化项
    minimizer:[
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true 
      }),
      new OptimizeCss()
    ]
  },
  mode: 'development', 
  entry: './src/index.js',
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'build'),
    // publicPath:'http://www.wangjiayong.cn'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename:'css/main.css'
    }),
   
  ],
  externals: {
      jquery: "$"
  },
  module: { 
    rules: [
      {
        test:/\.html$/,
        use:'html-withimg-loader'
      },
      {
        test:/\.(png|jpg|gif)$/,
        // 做一个限制 当我们的图片 小于多少k的时候 用base64 来转化
        // 否则用file-loader产生真实的图片
        use:{
          loader: 'url-loader',
          options:{
            limit:1,
            outputPath:'/img/',
            publicPath:'http://www.wangjiayong.cn'
          }
        }
      },
      {
        test:/\.js$/, // normal 普通的loader
        use:{
          loader:'babel-loader',
          options:{ // 用babel-loader 需要把es6-es5
            cacheDirectory: true, // 开启缓存避免重复打包相同的代码，提高构建速度
            presets:[//预设是提前封装好的一套插件集合，主要是为了简化配置，例如把es6编译成es5
              // ['@babel/preset-env', { modules: false }]，modules: false开启树摇，减少冗余代码
              '@babel/preset-env'
            ],
            plugins:[// 插件是按照不同的项目进行精准的配置，比如装饰器语法的转化，类语法的转化，每个插件的功能单一
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose": true }],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include:path.resolve(__dirname,'src'),
        exclude:/node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'postcss-loader',
          'less-loader'
          
        ]
      }
    ]
  }
}