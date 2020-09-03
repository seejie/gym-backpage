import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/role'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * 将菜单接口返回结果转换成路由
 * @param res 菜单接口返回结果
 *
 */
function makeRoute(res, parents = []) {
  let routes = [];
  res.forEach(obj => {
    let route;
    if ( obj.childs && obj.childs.length ) {
      parents.push(obj.url);
      route = {
        path: '/'+obj.url,
        component: Layout,
        redirect: '/'+obj.url+'/index',
        alwaysShow: true,
        hidden: !obj.is_show,
        meta: {
          title: obj.name,
          icon: obj.icon
        },
        children: makeRoute(obj.childs)
      }
    } else {
      let isAbsolute = obj.url.slice(0) === '/';
      let component = ""
      if (isAbsolute)  {
        component  = "@/views"+obj.url
      } else {
        component = "@/views/"+parents.join('/')+'/'+obj.url
      }
      let name = component.replace('@/views/', '');
      route = {
        path: obj.url,
        component: '',//() => import(component),
        name: name,
        meta: {
          title: obj.name,
          icon: obj.icon
        }
      }
    }
    routes.push(route);
  });
  return routes;
}

const state = {
  routes: [],
  addRoutes: [],
  menuList: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENULIST: (state, menuList) => {
    state.menuList = menuList;
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // let accessedRoutes;
      // getRoutes()
      // .then(res => {
      //   accessedRoutes = asyncRoutes || []
      //   commit('SET_ROUTES', accessedRoutes);
      //   commit('SET_MENULIST', res.resObject);
      //   resolve(accessedRoutes)
      // })

      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
