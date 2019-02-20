import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      title: '登录',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/views/Login').default
    },
    {
      path: '/desktop/:id/:wid',
      name: 'desktop',
      component: require('@/views/DesktopSticker').default
    },
    {
      path: '/home',
      name: 'home',
      component: require('@/views/Layout').default,
      children: [
        {
          path: '/calendars',
          name: 'Desktop',
          component: require('@/views/Calendars').default
        },
        {
          path: '/notes',
          name: 'notes',
          component: require('@/views/Notes').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
