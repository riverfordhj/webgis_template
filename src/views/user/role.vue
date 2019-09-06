<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">创建新角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色Key" width="220">
        <template slot-scope="scope">{{ scope.row.key }}</template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'创建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名">
          <el-input v-model="role.name" placeholder="角色名" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="权限菜单">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-button type="primary" @click="handleAddRole">New Role</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template slot-scope="scope">{{ scope.row.key }}</template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [
        {
          key: 'admin',
          name: 'admin',
          description: '系统管理员，拥有除去数据操作外的全部权限',
          routes: []
        },
        {
          key: 'dataManager',
          name: 'dataManager',
          description: '数据管理员，拥有数据管理的权限，可编辑和下载数据'
        },
        {
          key: 'visitor',
          name: 'visitor',
          description: '游客，拥有基本查看权限，无法修改和下载数据'
        },
      ],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      routesSample: [
        [
          {
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
            // component: Layout,
            redirect: '/dashboard',
            name: 'Dashboard',
            hidden: true,
            children: [
              {
                path: 'dashboard',
                component: () => import('@/views/dashboard/testDashboard/index')
              }
            ]
          },
          {
            path: '/view/map',
            // component: Layout,
            redirect: '/view/map/esri',
            name: 'map',
            meta: {
              title: '地图',
              icon: 'map'
            },
            children: [
              {
                path: 'esri',
                name: 'esri',
                component: () => import('@/views/map/esri/index'),
                meta: {
                  title: '二维',
                  icon: '2dmap'
                }
              },
              {
                path: 'cesium',
                name: 'cesium',
                component: () => import('@/views/map/cesium2/index'),
                meta: {
                  title: '三维',
                  icon: '3dmap'
                }
              }
            ]
          },
          {
            path: '/DataManagement',
            // component: Layout,
            redirect: '/DataManagement/spatialData',
            name: 'DataManagement',
            meta: {
              title: '数据目录',
              icon: 'list'
            },
            children: [
              {
                path: 'baseData',
                name: 'baseData',
                component: () => import('@/views/table/baseData/index'),
                meta: {
                  title: '基础数据',
                  icon: 'table'
                }
              },
              // {
              //   "path": "AtrributeData",
              //   name: 'AtrributeData',
              //   component: () => import('@/views/table/attributeData/index'),
              //   meta: {
              //     title: '属性数据',
              //     icon: '3dmap'
              //   }
              // },
              {
                path: 'managerDataByDistrict',
                name: 'managerDataByDistrict',
                component: () => import('@/views/table/managerDataByDistrict/index1'),
                meta: {
                  title: '工程数据',
                  icon: 'yunnan'
                }
              },
              {
                path: 'uploadProject',
                name: 'uploadProject',
                component: () => import('@/views/table/uploaderExcel/index'),
                meta: {
                  title: '项目上传',
                  icon: 'upload'
                }
              }
            ]
          },
          {
            path: '/DataAnalysis',
            // component: Layout,
            redirect: '/view/blank',
            name: 'DataAnalysis',
            meta: {
              title: '统计分析',
              icon: 'chart'
            },
            children: [
              {
                path: 'DataAnalysis',
                name: 'DataAnalysis',
                component: () => import('@/views/statistics/index'),
                meta: {
                  title: '统计分析',
                  icon: 'chart'
                }
              }
            ]
          },
          {
            path: '/MetaManagement',
            // component: Layout,
            redirect: '/view/blank',
            name: 'MetaManagement',
            meta: {
              title: '元数据管理',
              icon: 'example'
            },
            children: [
              {
                path: 'MetaManagement',
                name: 'MetaManagement',
                component: () => import('@/views/blank/index'),
                meta: {
                  title: '元数据管理',
                  icon: 'example'
                }
              }
            ]
          },
          {
            path: '/SystemManagement',
            // component: Layout,
            redirect: '/view/blank',
            name: 'SystemManagement',
            meta: {
              title: '系统管理',
              icon: 'gear'
            },
            children: [
              {
                path: 'SystemManagement',
                name: 'SystemManagement',
                component: () => import('@/views/blank/index'),
                meta: {
                  title: '系统管理',
                  icon: 'gear'
                }
              }
            ]
          },
          {
            path: '/UserManagement',
            // component: Layout,
            redirect: '/UserManagement/modifyPassword',
            name: 'UserManagement',
            alwaysShow: true,
            meta: {
              title: '用户管理',
              icon: 'peoples'
              // roles: ['admin']
            },
            children: [
              {
                path: 'createUser',
                name: 'createUser',
                component: () => import('@/views/user/createUser'),
                meta: {
                  title: '创建用户',
                  icon: 'create',
                  roles: ['admin']
                }
              },
              {
                path: 'modifyPassword',
                name: 'modifyPassword',
                component: () => import('@/views/user/changePwd'),
                meta: {
                  title: '修改密码',
                  icon: 'modifyPsd'
                  // roles: []
                }
              },
              {
                path: 'role',
                component: () => import('@/views/user/role'),
                name: 'RolePermission',
                meta: {
                  title: '权限分配',
                  icon: 'RolePermission',
                  roles: ['admin']
                }
              }
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
          },
          {
            path: '*',
            redirect: '/404',
            hidden: true
          }
        ]
      ]
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    // this.getRoles()
    this.routes = this.generateRoutes(this.routesSample[0])

  },
  methods: {
    handleAddRole() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.routesSample[0])
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete() {

    },
    confirmRole() {

    },
    // async getRoutes() {
    //   const res = await getRoutes()
    //   this.serviceRoutes = res.data
    //   this.routes = this.generateRoutes(res.data)
    // },
    // async getRoles() {
    //   const res = await getRoles()
    //   this.rolesList = res.data
    // },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      debugger
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    // handleAddRole() {
    //   this.role = Object.assign({}, defaultRole)
    //   if (this.$refs.tree) {
    //     this.$refs.tree.setCheckedNodes([])
    //   }
    //   this.dialogType = 'new'
    //   this.dialogVisible = true
    // },
    // handleEdit(scope) {
    //   this.dialogType = 'edit'
    //   this.dialogVisible = true
    //   this.checkStrictly = true
    //   this.role = deepClone(scope.row)
    //   this.$nextTick(() => {
    //     const routes = this.generateRoutes(this.role.routes)
    //     this.$refs.tree.setCheckedNodes(this.generateArr(routes))
    //     // set checked state of a node not affects its father and child nodes
    //     this.checkStrictly = false
    //   })
    // },
    // handleDelete({ $index, row }) {
    //   this.$confirm('Confirm to remove the role?', 'Warning', {
    //     confirmButtonText: 'Confirm',
    //     cancelButtonText: 'Cancel',
    //     type: 'warning'
    //   })
    //     .then(async () => {
    //       await deleteRole(row.key)
    //       this.rolesList.splice($index, 1)
    //       this.$message({
    //         type: 'success',
    //         message: 'Delete succed!'
    //       })
    //     })
    //     .catch(err => { console.error(err) })
    // },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    // async confirmRole() {
    //   const isEdit = this.dialogType === 'edit'

    //   const checkedKeys = this.$refs.tree.getCheckedKeys()
    //   this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

    //   if (isEdit) {
    //     await updateRole(this.role.key, this.role)
    //     for (let index = 0; index < this.rolesList.length; index++) {
    //       if (this.rolesList[index].key === this.role.key) {
    //         this.rolesList.splice(index, 1, Object.assign({}, this.role))
    //         break
    //       }
    //     }
    //   } else {
    //     const { data } = await addRole(this.role)
    //     this.role.key = data.key
    //     this.rolesList.push(this.role)
    //   }

    //   const { description, key, name } = this.role
    //   this.dialogVisible = false
    //   this.$notify({
    //     title: 'Success',
    //     dangerouslyUseHTMLString: true,
    //     message: `
    //         <div>Role Key: ${key}</div>
    //         <div>Role Nmae: ${name}</div>
    //         <div>Description: ${description}</div>
    //       `,
    //     type: 'success'
    //   })
    // },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
