import Layout from '@/layout'
export default [
  {
    path: "/myStore",
    name: "myStore",
    component: Layout,
    redirect: '/myStore',
    alwaysShow: true,
    meta: {
      title: "我的店铺",
      icon: "myStore"
    },
    children: [
      {
        path: "storesetting",
        component: () => import("@/views/myStore/storeSetting/index.vue"),
        name: "storesetting",
        meta: { title: "店铺设置", },
      },
    ]
  }
];
