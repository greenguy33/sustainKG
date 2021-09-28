import home from '@/components/home'
import login from '@/components/Login'
import dashboard from '@/components/Dashboard'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);
import axios from 'axios'
Vue.prototype.axios = axios;
const routers = [
    {
        path: '/',
        name: 'home',
        component: home,


    },
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard,
    }


    // {
  //     path: '/',
  //     component: Home,
  //
  // },
]

export default routers