import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './utils/axios';


Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
