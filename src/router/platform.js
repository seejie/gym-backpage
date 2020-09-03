import Layout from '@/layout'

export default [{
  path: '/platform',
  name: 'platform',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: "平台设置",
    icon: "zixun"
  },
  children: [
    {
      path: "pagesetting",
      component: () => import("@/views/platform/pagesetting"),
      name: "platform/pagesetting",
      meta: {title: "频道管理"}
    },
    {
      path: "myChannel",
      component: () => import("@/views/platform/myChannel"),
      name: "platform/myChannel",
      meta: {title: "我的频道"}
    },
    {
      path: "weixin",
      component: () => import("@/views/platform/weixin"),
      name: "platform/weixin",
      meta: {title: "微信菜单"}
    }, {
      path: "featureConfig",
      component: () => import("@/views/platform/featureConfig"),
      name: "platform/featureConfig",
      meta: {title: "功能配置"}
    },

    {
      path: "staff",
      component: () => import("@/views/platform/staff"),
      name: "platform/staff",
      meta: {title: "员工管理"}
    },
    {
      path: "logistics",
      component: () => import("@/views/platform/logistics"),
      name: "platform/logistics",
      meta: {title: "物流设置"}
    },
    {
      path: "protocol",
      component: () => import("@/views/platform/protocol"),
      name: "platform/protocol",
      meta: {title: "协议管理"}
    }
  ]
}];
