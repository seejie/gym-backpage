import Layout from '@/layout'
export default [{
  path: "/czpzmanage",
  name: "czpzmanage",
  component: Layout,
  redirect: '/czpzmanage/photolist',
  alwaysShow: true,
  meta: {
    title: "测足拍照管理",
    icon: "zixun"
  },
  children: [{
      path: "/czpzmanage/photolist",
      component: () => import("@/views/photo/photoManage/index.vue"),
      name: "photoManage",
      meta: {
        title: "拍照管理"
      }
    },
    {
      path: "/czpzmanage/photolist/edit",
      component: () => import("@/views/photo/photoManage/photoEdit.vue"),
      name: "photoEdit",
      meta: {
        title: "拍照详情"
      },
      hidden: true
    },
    {
      path: "/czpzmanage/photolist/verfiy",
      component: () => import("@/views/photo/photoManage/photoVerify.vue"),
      name: "photoVerify",
      meta: {
        title: "拍照详情"
      },
      hidden: true
    },
    {
      path: "/czpzmanage/pagesetting",
      component: () => import("@/views/photo/pagesetting/index.vue"),
      name: "pagesetting",
      meta: {
        title: "页面配置"
      },
      hidden: true
    },
    {
      path: "/czpzmanage/photoDataManage",
      component: () => import("@/views/photo/photoDataManage/index.vue"),
      name: "photoDataManage",
      meta: {
        title: "拍照数据统计"
      },
    }
  ]
}];
