export const str = 'hello world'

import { createApp, h } from 'vue'

const App = {
  render() {
    return h('div', 'hello world')
  },
}

createApp(App).mount('#app')
