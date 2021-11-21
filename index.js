const Koa = require('koa')

const fs = require('fs')
const path = require('path/posix')

const app = new Koa()

app.use(async (ctx) => {
  const { url } = ctx.request

  console.info('url:' + url)

  // '/' => "index.html"
  if (url === '/') {
    ctx.type = 'text/html'
    const content = fs.readFileSync('index.html', 'utf-8')

    ctx.body = content
  }

  // '/src/main.js' => 'src/main.js'
  else if (url.endsWith('.js')) {
    ctx.type = 'application/javascript'

    const p = path.resolve(__dirname, url.slice(1))

    const content = fs.readFileSync(p, 'utf-8')

    ctx.body = content
  }
})

app.listen(3000, () => {
  console.info('vite start at:3000')
})
