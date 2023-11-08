import Vue from 'vue';
import { createRouter } from './router'
import App from './App.vue';

Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false

export default function createApp() {
  const router = createRouter()

  const app = new Vue({
      router,
      render: h => h(App),
  })
  return { app, router }
}
