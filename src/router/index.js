import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  //登录组件
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
//404
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
//地图首页组件
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
//播种信息组件
  {
    path: '/information',
    component: Layout,
    redirect: '/information/management',
    name: 'Information',
    meta: { title: '播种信息', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'management',
        name: 'Management',
        component: () => import('@/views/management/index'),
        meta: { title: '数据管理', icon: 'table' },
      },
      {
        path: 'operation',
        name: 'Operation',
        component: () => import('@/views/operation/index'),
        meta: { title: '数据操作', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
//图表组件
  {
    path: '/chart',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/chart/index'),
        name: 'Chart',
        meta: {
          title: '分布',
          icon: 'nested'
        }
      }
    ]
    
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '统计', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()


export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
