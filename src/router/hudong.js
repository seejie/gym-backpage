/**
 *
 * @authors Your Name (you@example.org)
 * @date    2019-08-11 08:05:41
 * @version $Id$
 */

//攻略服务
import Layout from '@/layout'
export default [{
  path: "/hudong",
  name: "hudong",
  component: Layout,
  redirect: '/hudong/activityList',
  alwaysShow: true,
  meta: {
    title: "互动活动",
    icon: "zixun"
  },
  children: [{
      path: "/hudong/activityList",
      component: () => import("@/views/hudong/activityList/index.vue"),
      name: "activityList",
      meta: {
        title: "活动列表"
      }
    },
    {
      path: "/hudong/template",
      name: "activityTemplate",
      component: () => import("@/views/hudong/activityTemplate/index.vue"),
      redirect: '/hudong/template/chooseAcrive',
      alwaysShow: true,
      meta: {
        title: "活动模板"
      },
      children: [{
        path: "/hudong/template/chooseAcrive",
        name: "chooseAcrive",
        component: () => import("@/views/hudong/activityTemplate/chooseAcrive.vue"),
      }, {
        path: "/hudong/template/basicregistration",
        name: "basicregistration",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/basicregistration.vue"),
        meta: {
          title: "创建报名"
        }
      }, {
        path: "/hudong/template/advancedregistration",
        name: "advancedregistration",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/advancedregistration.vue"),
        meta: {
          title: "创建高级报名"
        }
      }, {
        path: "/hudong/template/vote",
        name: "vote",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/vote.vue"),
        meta: {
          title: "创建投票"
        }
      }, {
        path: "/hudong/template/answequestions",
        name: "answequestions",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/answequestions.vue"),
        meta: {
          title: "创建答题"
        }
      }, {
        path: "/hudong/template/answequestionstest",
        name: "answequestionstest",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/answequestionstest.vue"),
        meta: {
          title: "创建测试"
        }
      }
      , {
        path: "/hudong/template/basicquestionnaire",
        name: "basicquestionnaire",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/basicquestionnaire.vue"),
        meta: {
          title: "创建基础问卷"
        }
      }, {
        path: "/hudong/template/sharingregistration",
        name: "sharingregistration",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/sharingregistration.vue"),
        meta: {
          title: "创建共享报名"
        }
      }, {
        path: "/hudong/template/crowdfunding",
        name: "crowdfunding",
        component: () => import("@/views/hudong/activityTemplate/templateComponent/crowdfunding.vue"),
        meta: {
          title: "创建众筹"
        }
      }],
    },

    {
      path: "/hudong/pageSetting",
      component: () => import("@/views/hudong/pageSetting/index.vue"),
      name: "pageSetting",
      meta: {
        title: "页面配置"
      },
    },
  ]
}];
