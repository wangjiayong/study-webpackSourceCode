1. 执npx webpack的时候，会自动去node_modules下查找webpack.cmd文件进行执行
2. webpack可以把commonjs语法打包成es5给浏览器使用
3. webpack是node写的，所以配置的时候需要写node语法
4. webpack打包出来的文件是一个对象，key是路径，value是函数（函数执行就是我们模块导出的结果）
5. npm run build -- --config (npm 规定，传参需要加-- 而webapck指定配置文件传参也是需要加--，所以是两个--)
6. webpack开发的时候需要启动开发服务使用的是webpack-dev-server工具，配置文件里面需要配置devServer对象，对象下面可以配置自动打开浏览器，以及静态服务指向那个文件夹，启用压缩，端口号，http/https，进度条等
7. htmlwebpackplugin打包的时候可以配置压缩生成的html文件
8. webapck默认支持打包js模块，像css需要配置loader
9. loader就是把文件转化成模块，比如css-loader就是把css文件转化成模块
10. loader的特点是单一，一个loader只做一件事情
11. style-loader在插入style标签的时候可以指定插入顺序，比如a.css 中引入了b.css首先css-loader会把两个文件处理成两个模块，style-loader把这两个模块插入到html中，插入顺序 ``<style>```a ```</style>```,```<style>```b ```</style>``a模块在b模块前面，style-loader可以配置插入顺序：{loader:'style-loader',insertAt:'top'}//插入到最顶部
12. webpack中插件的引用是没有顺序规定的，随便写位置
13. 通过MiniCssExtractPlugin替代style-loader可以把所有处理好的css模块抽离到main.css文件中再以link的形式引入，可以使用postcss-loader和autoprefixer给css加浏览器的兼容前缀类似于--webkit，使用了MiniCssExtractPlugin时要压缩main.css文件还需要配置,mode:'production'的时候本身js是默认压缩的，但是使用了MiniCssExtractPlugin以后，js就不会被压缩了，需要使用插件UglifyJsPlugin才能压缩js

optimization:{ // 优化项只有mode:'production'才会走，development不会走

minimizer:[

newUglifyJsPlugin({

cache:true,

parallel:true,

sourceMap:true

    }),

newOptimizeCss()

    ]

  }

plugins: [

newHtmlWebpackPlugin({

newMiniCssExtractPlugin({

filename:'css/main.css' // 表示把打包出来的所有css文件都放入css目录下面

    }),

  ],


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

14. babel是做js转化的，babel插件名字都是@babel/plugin-开头
15. babel需要配置exclude排除掉node_modules，因为我们只需要转化src下自己写好的代码，include就代表只打包src下的代码

include:path.resolve(__dirname,'src'),

exclude:/node_modules/

16. babel中需要使用@babel/plugin-transform-runtime去兼容一些代码比如function*d(){yield1} console.log(d.next())以及async await,而@babel/plugin-transform-runtime使用又依赖@babel/runtime，@babel/runtime会往打包好的js中注入支持，以及引入@babel/polyfill去支持特别的语法，去支持旧版本的浏览器，而babel/runtime会把polyfill以模块化的方式引入到最终打包的文件中，如果不使用babel/runtime那么polyfill会被引入到每个打包好的模块中，会增加代码体积，以及老的方式直接使用polyfill会把支持的相关函数挂在全局上会污染全局变量，比如'aa'.includes这是es7语法，它会帮我们自己去实现
17. 匹配js的规则可以写多个，比如上述描述的语法转化的规则，eslint校验的规则,但是比如说都是操作js的loader，因为loader的执行顺序是从右往左，从下往上，我们应该先校验eslint，先让eslint-loader执行，当我们的js符合规范以后，再去执行babel-loader,所以eslint-loader对应的规则要写在babel-loader下面，但是配置loader的时候提供了一个配置项目enforce:'pre'可以把当前loader的执行顺序提到最高，那么这个loader在那个地方配置都是优先执行

 {

test:/\.js$/,

use:{

loader:'eslint-loader',

options:{

enforce:'pre'

    }

    }

    },

18. 使用第三方模块的时候比如import $ from 'jquery'.  配置一个规则{
19. test:require.resolve('jquery')),
20. use:'expose-loader?$'
21. } 如果我只是使用import $ from 'jquery'的话window挂载
22. $，但是配置了expose-loader就可以从window上取$$
23. 上述描述的方式会把jquery打包到我们的代码中，所以需要通过cdn方式引入jquery
24. 但是需要配置externals:{jquery:'$'}排除jquery不打包到我们的最终文件中，这样我们在react页面中就可以直接通过$$来使用jquery了并且可以写import $ from 'jquery'也可以不写引入的import $ from 'jquery'语句都行

25.当我们使用图片的时候在js中必须使用require或者import来引入图片，在css中就不需要直接引入就行background: url("./logo.png");

26.如果是在html中使用图片<imgsrc="./logo.png"alt="">也需要配置loader，叫html-withimg-loader

{

test:/\.html$/,

use:'html-withimg-loader'

    }

27.但是我们处理图片的时候一般不会使用file-loader,都是使用url-loader，url-loader包括file-loader的功能，file-loader主要是把图片编译成一个带有hash的文件，通过网络资源来请求，但是url-loader可以配置参数，比如如果图片大于100kb那么url-loader可以把图片编译成base64否则就调用file-loader的功能，URL-loader的还能配置参数，把所有的图片都打包放入一个指定的文件夹，就是可以对静态资源进行分类

{

test:/\.(png|jpg|gif)$/,

// 做一个限制 当我们的图片 小于多少k的时候 用base64 来转化

// 否则用file-loader产生真实的图片

use:{

loader:'url-loader',

options:{

limit:1,

outputPath:'/img/',

publicPath:'http://www.wangjiayong.cn' // 这个是把图片放入静态资源服务器上，由于在output中配置publicPath会把所有打包出来的js，css,img,等静态资源都放入到cdn，但是我只想把图片放入cdn那么就可以单独配置

    }

    }

    },

28.多入口和多出口，入口配置要使用对象的配置entry:{a:'./a.js',b:'./b.js'}
出口需要这样配置

output: {

filename:'[bundle].js', //单入口的时候直接写bundle.js 多入口需要写[bundle].js ,因为要产生两个出口a.js和b.js

path:path.resolve(__dirname, 'build'),

// publicPath:'http://www.wangjiayong.cn'

  }

而且多出口也需要多个newHtmlWebpackPlugin

newHtmlWebpackPlugin({

template:'./src/index.html',

filename:'index.html',

chunks:['a'] // chunks代表的是html文件中要插入打包好的那个js

    }),

newHtmlWebpackPlugin({

template:'./src/index.html',

filename:'index.html',

chunks:['b','a'] //也可以插入多个打包出来的js

    }),

29.源码映射配置devtool:'source-map' // source-map会在打包后的文件中产生一个单独的.map文件，evel-source-map不会产生单独的文件，源码映射可以帮助我们在浏览器中执行代码的时候定位到报错的位置

30.webpack可以配置watch实时监控打包

31. webpack插件可以配置打包之前清空的插件，可以使用拷贝文件的插件
32. 可以配置devserver来解决跨域问题，proxy:{'/api':{target:'服务端路径'},pathRewrite:{'/api':''}}代表把api重写为空，因为API是前端自己加上的，服务端接口上没有这个API字符，为什么要加这个呢是因为webpack服务只要监控到通过API调用的接口都会走代理来处理跨域
33. resolve解析可以配置external:['.js','.css']表示引入文件的时候如果没有写后缀名，那么先找js找不到再找css,以及一些第三方包默认的是先找package.json中的main字段指定的路径，可以配置resolve:{alias:{antd:'antd/dist/css'}}这样配置以后，我通过import 'antd'这样引入的就直接是antd的css文件，可以配置resolve下面的modules:['node_modules']表示从当前目录下的node_modules中直接查找，而不是按照commonjs的规范逐级向上查找
34. 可以使用webpack插件来定义环境变量来区分开发和线上环境webpack.definePlugin({DEV:'"dev"'/JSON.stringify('dev'))})
35. 区分开发环境和上线环境，写三个配置文件一个base一个dev一个prod,可以使用let {smart}=require(webpack-merge)来进行合并module.exports=smart(base,{})
36. noparse:/jquery/ 表示不解析jquery里面的依赖关系，如果说一个包是独立的不依赖其他第三方模块比如jquery，那么webpack打包的时候就不需要去解析其中的依赖关系直接对其进行打包就行，优化打包速度
37. 由于moment的语言包local很大，new webpack.ignorePlugin(\\\\.\/local/,/moment/),表示打包moment的时候如果moment内部引入了local文件就忽略打包这个local文件，此时如果需要语言就需要手动引入import 'moment/local/zh-cn'
38. 动态链接库dllplugin，可以提前把react和react-dom打包出来，然后启动项目的时候配置dllplugin插件，如果有minfast.json文件的话就是有动态链接库，没有的会才会去打包react和react-dom，这样可以加快打包速度也可以防止重复打包这些没有变化的第三方包
39. 如果项目很大打包很慢的话可以使用happypack开启多线程打包，对应的js和css都使用多个线程打包，webpack本身是单线程打包的，按照配置的规则处理完js再处理css，如果项目小的话是没必要开启多线程打包的因为分配线程会消耗内存导致打包变慢
40. webpack自带的两个优化一个书tree-sharking一个是作用域提升，什么叫作用域提升，就是类似声明了十个变量，我们让这十个变量相加，最后输出相加后的结果，webpack会做好这个事情，在浏览器中我们运行代码直接就能拿到这个结果，而不会去声明这么多变量
41. 抽离公共代码optimization中的splitChunks配置一个common和vender，common是用来抽离自己写的模块的，比如我写了一个模块a,模块a在多个文件中被使用，那么我就需要抽离，防止重复打包和浏览器中运行的时候重复引用，vender是代表的第三方模块比如react需要进行抽离，由于一般是先配置的common中的，如下：

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

chunks:'initial',

minSize:0,

minChunks:2

    }

    }

    }

  },

42. 懒加载，在代码里比如点击按钮使用import('./a.js').then((data)=>{}}) //就会去加载这个文件，其实内部是一个jsonp，这是草案中的语法所以还需要配置一个Babel的插件
43. 热跟新，devserver中配置hot：true,使用两个插件，都是webpack自带的，可以达到只有某个模块跟新的时候才跟新，而不是整个项目都更新webpack.NamedModulesPlugin和webpack.hotModulesReplaceMentPlugin
44. webpack中可以使用import和require来引入资源，但是import只能写在页面顶端，如果在方法中引入资源可以使用require
45. 实现loader的时候，需要导出一个loader函数，该函数的this上挂着很多属性和方法，loader函数接收的参数就是webpack处理好的源码字符串source，比如this.cacheable()表示该loader执行的时候需要开启缓存，this.addDependecy(文件路径)，这个方法表示当webpack配置监听实时打包的时候，该路径指向的文件发生变化就进行打包，如果不写addDependecy那么自己实现的loader就无法做到被实时监控打包
46. 自己实现loader的时候需要配置resolveLoaders:{modules:[node_modules,'自己loader的路径']}，表示先去node_modules下找loader找不到再去自己的路径下面找
47. less-loader是使用less包的render方法把webapck传递进来的source转化成css并导出给css-loader,css-loader,进行字符串拼接，拼接是为了把background:url(./a.jpg)这种处理成background:url(require(./a.jpg))那么webpack才能把这个路径解析出来，css-loader把拼接好的css字符串用module.exports导出，style-loader通过require来引入这个结果并且创建style标签把结果插入到页面head中
48. webpack插件书写，constructor构造函数接收配置好的参数，module.exports=(compiler)=>{compiler.hooks.done/emit} // emit发射触发在done之前
49. 编写webpack插件的时候有两个对象很重要一个是complier用来绑定事件的，webpack会在特定的时机触发事件还有触发事件的时候会得到参数compilation，该参数compilation上有webpack处理好的字符串资源比如在htmlwebpackplugin中事件触发的时候可以通过compilation.assets[url].source()来获取到要插入某个节点的js或者css字符串代码
50. webpack插件中的apply方法上的complier上有hooks钩子上有各种事件，比如说webpack打包完成以后触发叫afterEmit事件能接受到所有的打包好的静态资源compilation.assets，然后可以把这些静态资源都上传到静态资源服务器上，以及开始打包的时候触发brforeEmit,根据需求自己定制
