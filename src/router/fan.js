import Layout from '@/layout';
export default [{
  path: "/fans",
  name: "fans",
  component: Layout,
  alwaysShow: true,
  meta: {
    title: "粉丝管理",
    icon: "zixun"
  },
  children: [{
      path: "search",
      component: () => import("@/views/fans/search/index"),
      name: "fans/imagetext",
      meta: {
        title: "会员查询"
      }
    },
    {
      path: "statistics",
      component: () => import("@/views/fans/statistics/index"),
      name: "fans/statistics",
      meta: {
        title: "会员统计"
      }
    },
    {
      path: "integral",
      component: () => import("@/views/fans/integral/index"),
      name: "fans/integral",
      meta: {
        title: "会员积分"
      }
    },
    {
      path: "grade",
      component: () => import("@/views/fans/grade/index"),
      name: "fans/grade",
      meta: {
        title: "会员等级"
      }
    },
    {
      path: "wechat",
      component: () => import("@/views/fans/wechat/index"),
      name: "fans/wechat",
      meta: {
        title: "微信会员卡"
      }
    },
    {
      path: "info",
      component: () => import("@/views/fans/info/index"),
      name: "fans/info",
      meta: {
        title: "用户必填信息"
      }
    }
  ]
}]
