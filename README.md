# lime

> 小清柠后台管理系统前端

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

图片压缩比例 是调用的js-sdk 。尺寸就是 宽*高 /1024  (kb)。 比如宽高都是1024 就是1M
backpage\src\utils\qiniuyun.js
   const compressOption = { // 压缩文件
      quality: 0.92,
      noCompressIfLarger: true,
      maxWidth: 550,
      maxHeight: 550
    }
