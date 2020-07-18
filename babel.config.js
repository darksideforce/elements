//存储只在发布阶段使用的组件
const proplugins = []
if(process.env.NODE_ENV === 'production'){
  //将要使用的组件push进这个数组
  proplugins.push('babel-plugin-transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //发布产品时候的插件数组
    ...proplugins
  ]
}