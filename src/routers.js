import home from './components/home'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);
import axios from 'axios'
Vue.prototype.axios = axios;
const routers = [
    {
        path: '/home',
        name: 'home',
        component: home
    },

  // {
  //     path: '/',
  //         component: Home
  // },
]

export default routers