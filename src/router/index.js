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
    component: () => import('@/views/login/index'),
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
      component: () => import('@/views/dashboard/index')
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
        component: () => import('@/views/map/cesium/index'),
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
    redirect: '/view/table',
    name: 'DataManagement',
    meta: {
      title: '数据目录',
      icon: 'list'
    },
    children: [{
        path: 'spatialData',
        name: 'spatialData',
        component: () => import('@/views/table/simpletest/index'),
        meta: {
          title: '空间数据',
          icon: 'table'
        }
      },
      {
        "path": "AtrributeData",
        name: 'AtrributeData',
        component: () => import('@/views/blank/index'),
        meta: {
          title: '属性数据',
          icon: '3dmap'
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
    path: '/UserManagement',
    component: Layout,
    redirect: '/view/blank',
    name: 'UserManagement',
    meta: {
      title: '用户管理',
      icon: 'peoples'
    },
    children: [{
      path: 'UserManagement',
      name: 'UserManagement',
      component: () => import('@/views/blank/index'),
      meta: {
        title: '用户管理',
        icon: 'peoples'
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
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [{
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: {
          title: 'Table',
          icon: 'table'
        }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: {
          title: 'Tree',
          icon: 'tree'
        }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Form',
      component: () => import('@/views/form/index'),
      meta: {
        title: 'Form',
        icon: 'form'
      }
    }]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [{
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: {
          title: 'Menu1'
        },
        children: [{
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: {
              title: 'Menu1-1'
            }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: {
              title: 'Menu1-2'
            },
            children: [{
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: {
                  title: 'Menu1-2-1'
                }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: {
                  title: 'Menu1-2-2'
                }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: {
              title: 'Menu1-3'
            }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: {
          title: 'menu2'
        }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
      meta: {
        title: 'External Link',
        icon: 'link'
      }
    }]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})