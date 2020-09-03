/**
 *
 * @authors Your Name (you@example.org)
 * @date    2019-08-18 18:21:11
 * @version $Id$
 */

/*圈子互动*/

import Layout from '@/layout'
export default [
  {
    path: "/circle",
    name: "circle",
    component: Layout,
    redirect: '/circle/groupPublish',
    alwaysShow: true,
    meta: {
      title: "圈子互动",
      icon: "quanzi"
    },
    children: [
      {
        path: "/circle/groupPublish",
        component: () => import("@/views/circle/groupPublish/index.vue"),
        name: "groupPublish",
        meta: {title: "发布审核"}
      },
     
      {
        path: "/circle/pagesetting",
        component: () => import("@/views/circle/pagesetting/index.vue"),
        name: "pagesetting",
        meta: {title: "页面设置"}
      },
  
    ]
  }
];
