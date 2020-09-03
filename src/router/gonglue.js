/**
 *
 * @authors Your Name (you@example.org)
 * @date    2019-08-11 08:05:41
 * @version $Id$
 */

//攻略服务
import Layout from '@/layout'
export default [{
  path: "/gonglue",
  name: "gonglue",
  component: Layout,
  redirect: '/gonglue/publish',
  alwaysShow: true,
  meta: {
    title: "攻略服务",
    icon: "zixun"
  },
  children: [{
      path: "/gonglue/publish",
      component: () => import("@/views/gonglue/publish/index.vue"),
      name: "publish",
      meta: {
        title: "攻略发布"
      }
    },
    {
      path: "/gonglue/luxian",
      name: "luxian",
      component: () => import("@/views/gonglue/luxian/index.vue"),
      meta: {
        title: "路线管理"
      }
    },
    {
      path: "/gonglue/luxian/chuangjian/:id",
      component: () => import("@/views/gonglue/luxian/chuangjian/index.vue"),
      name: "chuangjian",
      meta: {
        title: "添加路线"
      },
    },
    {
      path: "/gonglue/luxian/pinglun/:id",
      component: () => import("@/views/gonglue/luxian/pinglun/index.vue"),
      name: "pinglun",
      meta: {
        title: "路线评论"
      },
    },{
      path: "/gonglue/pagesetting",
      component: () => import("@/views/gonglue/pagesetting/index.vue"),
      name: "pagesetting",
      meta: {
        title: "页面配置"
      },
    }
  ]
}];
