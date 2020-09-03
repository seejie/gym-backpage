import Layout from '@/layout'
export default [{
  path: "/zuopinmanager",
  name: "zuopinmanager",
  component: Layout,
  redirect: '/zuopinmanager',
  alwaysShow: true,
  meta: {
    title: "作品管理",
    icon: "zixun"
  },
  children: [{
      path: "zuopinlist",
      component: () => import("@/views/zuopin/index.vue"),
      name: "zuopinlist",
      meta: {
        title: "作品列表",
      },
    },
    {
      path: "category",
      component: () => import("@/views/zuopin/category/index.vue"),
      name: "category",
      meta: {
        title: "品类设置",
      },
    }, {
      path: "addzuopin",
      component: () => import("@/views/zuopin/add/index.vue"),
      name: "addzuopin",
      meta: {
        title: "创建作品",
      },
    },
  ]
}];
