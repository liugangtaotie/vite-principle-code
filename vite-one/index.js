const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const app = new Koa()

// 处理逻辑中间件
app.use(async (ctx) => {
  const { url } = ctx.request
  console.info('url:' + url)
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

app.listen(3000, () => {
  console.info('vite start at 3000')
})
