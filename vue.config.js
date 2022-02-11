module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  pages:{
    index : {
      entry: 'src/pages/index/main.js', // page 的入口
      template: 'src/pages/index/index.html', // 模板来源
      filename: 'index.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    allProducts : {
      entry: 'src/pages/allProducts/main.js',
      template: 'src/pages/allProducts/index.html',
      filename: 'allProducts.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'allProducts']
    },
    category : {
      entry: 'src/pages/category/main.js',
      template: 'src/pages/category/index.html',
      filename: 'category.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'category']
    },
    rich : {
      entry: 'src/pages/rich/main.js',
      template: 'src/pages/rich/index.html',
      filename: 'rich.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'rich']
    },
    contact : {
      entry: 'src/pages/contact/main.js',
      template: 'src/pages/contact/index.html',
      filename: 'contact.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'contact']
    },
    search : {
      entry: 'src/pages/search/main.js',
      template: 'src/pages/search/index.html',
      filename: 'search.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'search']
    },
    error : {
      entry: 'src/pages/error/main.js',
      template: 'src/pages/error/index.html',
      filename: 'error.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'error']
    },
  }, 
}