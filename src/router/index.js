// common, demo, uniqm.com, uniqm.net
let webVersion = 'common'

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let commonRoute = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/index')
  },
  {
    path: '/allProducts.html',
    name: 'allProducts',
    component: () => import('@/pages/allProducts')
  },
  {
    path: '/category.html',
    name: 'category',
    component: () => import('@/pages/category')
  },
  {
    path: '/rich.html',
    name: 'rich',
    component: () => import('@/pages/rich')
  },
  {
    path: '/contact.html',
    name: 'contact',
    component: () => import('@/pages/contact')
  },
  {
    path: '/search.html',
    name: 'search',
    component: () => import('@/pages/search')
  },
  {
    path: '/order.html',
    name: 'order',
    component: () => import('@/pages/order')
  },
  {
    path: '/user.html',
    name: 'user',
    component: () => import('@/pages/user')
  },
  {
    path: '/user_info.html',
    name: 'user_info',
    component: () => import('@/pages/user_info')
  },
  {
    path: '/error.html',
    name: 'error',
    component: () => import('@/pages/error')
  },
]

let uniqmRoute = [
  {
    path: '/shopping.html',
    name: 'shopping',
    component: () => import('@/pages/shopping')
  },
  {
    path: '/shoppingUser.html',
    name: 'shoppingUser',
    component: () => import('@/pages/shoppingUser')
  },
  {
    path: '/shoppingInfo.html',
    name: 'shoppingInfo',
    component: () => import('@/pages/shoppingInfo')
  },
  {
    path: '/shoppingOrder.html',
    name: 'shoppingOrder',
    component: () => import('@/pages/shoppingOrder')
  },
]

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: webVersion.indexOf('uniqm') > -1 ? uniqmRoute : commonRoute
  })
}