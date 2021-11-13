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
    const content = fs.readFileSync('./index.html', 'utf-8')
    ctx.body = content
  } else if (url.endsWith('.js')) {
    ctx.type = 'application/javascript'
    const p = path.resolve(__dirname, url.slice(1))
    const content = fs.readFileSync(p, 'utf-8')
    ctx.body = content
  }
})

// 监听3000端口
app.listen(3000, () => {
  console.info('vite start at 3000')
})
