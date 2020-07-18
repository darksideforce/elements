module.exports = {
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      //使用externals节点添加另一种方式去寻找外部资源。
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      //添加一个自定义属性，方便index.html区分不同的模式
      config.plugin('html').tap(args=>{
        args[0].isprod = true
        return args
      })
    })


    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
        config.plugin('html').tap(args=>{
          args[0].isprod = false
          return args
        })  
    })
  }
}