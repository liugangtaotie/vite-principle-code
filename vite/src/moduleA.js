export const str = 'vite 6666'

import { createApp, h } from 'vue'

const App = {
  render() {
    return h('div', null, [h('div', null, String('hello vite'))])
  },
}

createApp(App).mount('#app')
