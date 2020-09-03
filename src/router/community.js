/**
 *
 * @authors Your Name (you@example.org)
 * @date    2019-08-11 08:05:41
 * @version $Id$
 */

//攻略服务
import Layout from '@/layout'
export default [{
  path: "/community",
  name: "community",
  component: Layout,
  redirect: '/community/Publish',
  alwaysShow: true,
  meta: {
    title: "社群管理",
    icon: "shequn"
  },
  children: [{
      path: "/community/Publish",
      component: () => import("@/views/community/Publish/index.vue"),
      name: "Publish",
      meta: {
        title: "发布审核"
      }
    },
    {
      path: "/community/column",
      name: "column",
      component: () => import("@/views/community/column/index.vue"),
      meta: {
        title: "栏目管理"
      },
    },
    {
      path: "/community/pageSetting",
      component: () => import("@/views/community/pagesetting/index.vue"),
      name: "pageSetting",
      meta: {
        title: "页面配置"
      },
    },
  ]
}];
