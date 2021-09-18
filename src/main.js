import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import VueRouter from 'vue-router'
import axios from 'axios';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import routers from './routers'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(VueRouter)
Vue.use(ElementUI,{locale})
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.$axios = axios;
axios.defaults.baseURL =  "/api";


const router = new VueRouter({
    mode: 'history',
    routes: routers
});

Vue.directive('title', {
    inserted: function (el, binding) {
        document.title = el.dataset.title
    }
})


new Vue({
  router,
  render: h => h(App),


}).$mount('#app')
