const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const app = new Koa()

// 处理逻辑中间件 ctx 执行上下文
app.use(async (ctx) => {
  const { url } = ctx.request
  console.info('url:' + url)

  // '/' => 'index.html'
  if (url === '/') {
    ctx.type = 'text/html'
    let content = fs.readFileSync('./index.html', 'utf-8')

    content = content.replace(
      '<script',
      `
    <script>
    window.process = {
      env: {
        ENV_NODE: 'dev'
      }
    }
  </script>
  <script`
    )

    ctx.body = content
  }

  // '.js' =>  'src/main.js'
  else if (url.endsWith('.js')) {
    ctx.type = 'application/javascript'
    const p = path.resolve(__dirname, url.slice(1))
    const content = fs.readFileSync(p, 'utf-8')
    ctx.body = rewriteImport(content)
  }

  // '/@module/vue' => node_modules/vue
  else if (url.startsWith('/@module')) {
    const prefix = path.resolve(
      __dirname,
      'node_modules',
      url.replace('/@modules/', '')
    )
    const module = require(prefix + '/package.json').module
    const p = path.resolve(prefix, module)
    const content = fs.readFileSync(p, 'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(content)
  }

  // 重写路径
  function rewriteImport(content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, (s0, s1) => {
      if (s1[0] !== '.' && s1[0] !== '/') {
        return ` from '/@modules/${s1}'`
      } else {
        return s0
      }
    })
  }
})

// 监听3000端口
app.listen(3000, () => {
  console.info('vite start at 3000')
})
