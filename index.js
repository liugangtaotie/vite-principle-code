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
    let content = fs.readFileSync('index.html', 'utf-8')
    content = content.replace(
      '<script',
      ` <script>
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

  // '/src/main.js' => 'src/main.js'
  else if (url.endsWith('.js')) {
    ctx.type = 'application/javascript'
    const p = path.resolve(__dirname, url.slice(1))
    const content = fs.readFileSync(p, 'utf-8')
    ctx.body = rewriteImport(content)
  }

  //
  else if (url.startsWith('/@modules/')) {
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

  function rewriteImport(content) {
    console.info(content)
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
  console.info('vite start at:3000')
})
