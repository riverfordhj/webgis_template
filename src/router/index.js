import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
    path: '/login',
    // component: () => import('@/views/login/index'),
    component: () => import('@/views/login/login_video'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/testDashboard/index')
    }]
  },
  {
    path: '/view/map',
    component: Layout,
    redirect: '/view/map/esri',
    name: 'map',
    meta: {
      title: '地图',
      icon: 'map'
    },
    children: [{
        path: 'esri',
        name: 'esri',
        component: () => import('@/views/map/esri/index'),
        meta: {
          title: '二维',
          icon: '2dmap'
        }
      },
      {
        "path": "cesium",
        name: 'cesium',
        component: () => import('@/views/map/cesium1/index'),
        meta: {
          title: '三维',
          icon: '3dmap'
        }
      }
    ]
  },
  {
    path: '/DataManagement',
    component: Layout,
    redirect: '/DataManagement/spatialData',
    name: 'DataManagement',
    meta: {
      title: '数据目录',
      icon: 'list'
    },
    children: [{
        path: 'spatialData',
        name: 'spatialData',
        component: () => import('@/views/table/spatialData/index'),
        meta: {
          title: '空间数据',
          icon: 'table'
        }
      },
      {
        "path": "AtrributeData",
        name: 'AtrributeData',
        component: () => import('@/views/table/attributeData/index'),
        meta: {
          title: '属性数据',
          icon: '3dmap'
        }
      },
      {
        "path": "managerDataByDistrict",
        name: 'managerDataByDistrict',
        component: () => import('@/views/table/managerDataByDistrict/index1'),
        meta: {
          title: '按行政区划',
          icon: 'yunnan'
        }
      }
    ]
  },
  {
    path: '/DataAnalysis',
    component: Layout,
    redirect: '/view/blank',
    name: 'DataAnalysis',
    meta: {
      title: '统计分析',
      icon: 'chart'
    },
    children: [{
      path: 'DataAnalysis',
      name: 'DataAnalysis',
      component: () => import('@/views/blank/index'),
      meta: {
        title: '统计分析',
        icon: 'chart'
      }
    }, ]
  },
  {
    path: '/MetaManagement',
    component: Layout,
    redirect: '/view/blank',
    name: 'MetaManagement',
    meta: {
      title: '元数据管理',
      icon: 'example'
    },
    children: [{
      path: 'MetaManagement',
      name: 'MetaManagement',
      component: () => import('@/views/blank/index'),
      meta: {
        title: '元数据管理',
        icon: 'example'
      }
    }, ]
  },
  {
    path: '/SystemManagement',
    component: Layout,
    redirect: '/view/blank',
    name: 'SystemManagement',
    meta: {
      title: '系统管理',
      icon: 'gear'
    },
    children: [{
      path: 'SystemManagement',
      name: 'SystemManagement',
      component: () => import('@/views/blank/index'),
      meta: {
        title: '系统管理',
        icon: 'gear'
      }
    }, ]
  },
  
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [{
    path: '/UserManagement',
    component: Layout,
    redirect: '/UserManagement/modifyPassword',
    name: 'UserManagement',
    alwaysShow: true,
    meta: {
      title: '用户管理',
      icon: 'peoples',
      // roles: ['admin'] 
    },
    children: [
      {
        path: 'createUser',
        name: 'createUser',
        component: () => import('@/views/user/createUser'),
        meta: { 
          title: '创建用户', 
          icon: 'create' ,
          roles: ['admin'] 
        }
      },
      {
        path: 'modifyPassword',
        name: 'modifyPassword',
        component: () => import('@/views/user/changePwd'),
        meta: { 
          title: '修改密码', 
          icon: 'modifyPsd',
          // roles: [] 
        }
      },
      // {
      //   path: 'findPassword',
      //   name: 'findPassword',
      //   component: () => import('@/views/user/findPwd'),
      //   meta: { 
      //     title: '找回密码', 
      //     icon: 'modifyPsd',
      //     // roles: [] 
      //   }
      // }
    ]
  },{
    path: '*',
    redirect: '/404',
    hidden: true
  }]
  
