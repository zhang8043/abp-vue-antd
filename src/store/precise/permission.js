import Vue from 'vue'
import {
  getAllPermissions
} from '@/api/precise/permission'
import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

function isGrantedAny (...permissions) {
  if (!permissions) {
    return true
  }
  for (const permission of permissions) {
    if (abp.auth.isGranted(permission)) {
      return true
    }
  }
  return false
}

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param route
 * @returns {boolean}
 */
function hasPermission (route) {
  if (route.meta && route.meta.permission) {
    return isGrantedAny(route.meta.permission)
  }
  return true
}

function filterAsyncRouter (routerMap) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },

  actions: {
    // 获得所有权限
    GetAllPermissions ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getAllPermissions(payload).then(response => {
          const result = response.result
          console.log(result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 生成路由
    GenerateRoutes ({ commit }) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
