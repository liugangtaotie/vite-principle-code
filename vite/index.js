const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const app = new Koa()

app.use(async (ctx) => {
  const { url } = ctx.request

  console.info('url:  ' + url)

  // / =>index.html

  if (url === '/') {
    ctx.type = 'text/html'

    let content = fs.readFileSync('./index.html', 'utf-8')

    // 入口文件，加入环境变量
    content = content.replace(
      '<script',
      `  <script>
      window.process = {
        env: {
          NODE_ENV: 'dev'
        }
      }
    </script>
    <script`
    )

    ctx.body = content
  }

  // *.js => src/*.js
  else if (url.endsWith('.js')) {
    // /src/main.js  =>  代码文件所在位置 src/main.js
    const p = path.resolve(__dirname, url.slice(1))

    const content = fs.readFileSync(p, 'utf-8')

    ctx.type = 'application/javascript'

    ctx.body = rewriteImport(content)
  }

  // 第三方库的支持
  // /@modules/vue   =>  node_modules
  else if (url.startsWith('/@modules')) {
    //  /@modules/vue   => 代码的位置/node_modules/vue/   的 es 模块入口
    // 读取package.json 的 module属性
    const prefix = path.resolve(
      __dirname,
      'node_modules',
      url.replace('/@modules/', '')
    )

    const module = require(prefix + '/package.json').module

    // dist/vue.runtime.esm-bundler.js

    const p = path.resolve(prefix, module)
    const ret = fs.readFileSync(p, 'utf-8')

    ctx.type = 'application/javascript'

    ctx.body = rewriteImport(ret)
  }
  // 需要改写路径  vue  =>  /@modules  => 别名
  // from "xxx"
  // vue => node_modules

  // 改写函数的规则
  function rewriteImport(content) {
    // 正则表达式的替换
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, (s0, s1) => {
      if (s1[0] !== '.' && s1[0] !== '/') {
        return ` from '/@modules/${s1}'`
      } else {
        return s0
      }
    })
  }
})

app.listen(3000, () => {
  console.info('vite start at 3000')
})
