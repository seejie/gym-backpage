import Layout from '@/layout';

export default [{
  path: '/coursesubjectmanager',
  name: 'coursesubjectmanager',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: "课程管理",
    icon: "kechen"
  },
  children: [
    {
      path: "sbuject",
      component: () => import("@/views/coursesubjectmanager/sbuject/index"),
      name: "coursesubjectmanager/sbuject",
      meta: {title: "课程专题"}
    },
    {
      path: "add-sbuject/:id",
      component: () => import("@/views/coursesubjectmanager/sbuject/add"),
      name: "coursesubjectmanager/add-sbuject",
      meta: {title: "新建课程专题"}
    },
    {
      path: "add-sbuject",
      component: () => import("@/views/coursesubjectmanager/sbuject/add"),
      name: "coursesubjectmanager/add-sbuject",
      meta: {title: "编辑课程专题"}
    },
    // 课程管理
    {
      path: "course",
      component: () => import("@/views/coursesubjectmanager/course/index"),
      name: "coursesubjectmanager/course",
      meta: {title: "课程资源"}
    },
    {
      path: "add-course",
      component: () => import("@/views/coursesubjectmanager/course/add"),
      name: "coursesubjectmanager/add-course",
      meta: {title: "创建课程"}
    },
    {
      path: "add-course/:id",
      component: () => import("@/views/coursesubjectmanager/course/add"),
      name: "coursesubjectmanager/add-course",
      meta: {title: "编辑课程"}
    },
    {
      path: "live",
      component: () => import("@/views/coursesubjectmanager/live/index"),
      name: "coursesubjectmanager/live",
      meta: {title: "直播管理"}
    },
    {
      path: "add-live",
      component: () => import("@/views/coursesubjectmanager/live/add"),
      name: "coursesubjectmanager/add-live",
      meta: {title: "新建直播"}
    },
    {
      path: "add-live/:id",
      component: () => import("@/views/coursesubjectmanager/live/add"),
      name: "coursesubjectmanager/add-live",
      meta: {title: "编辑直播"}
    },
    // {
    //   path: "live-comment-detail/:id",
    //   component: () => import("@/views/coursesubjectmanager/live/detail"),
    //   name: "coursesubjectmanager/live-comment-detail",
    //   meta: {title: "评论详情"}
    // },
    {
      path: "comment-details/:id",
      component: () => import("@/views/coursesubjectmanager/comment-details"),
      name: "coursesubjectmanager/comment-details",
      meta: {title: "评论详情"}
    },
    {
      path: "questionsanswer",
      component: () => import("@/views/coursesubjectmanager/questionsanswer/index"),
      name: "coursesubjectmanager/questionsanswer",
      meta: {title: "问答管理"}
    },
    {
      path: "add-questionsanswer",
      component: () => import("@/views/coursesubjectmanager/questionsanswer/add"),
      name: "coursesubjectmanager/questionsanswer",
      meta: {title: "新建问答"}
    },
    {
      path: "add-questionsanswer/:id",
      component: () => import("@/views/coursesubjectmanager/questionsanswer/add"),
      name: "coursesubjectmanager/questionsanswer",
      meta: {title: "编辑问答"}
    },
    {
      path: "orderlist",
      component: () => import("@/views/coursesubjectmanager/order/index"),
      name: "coursesubjectmanager/order-count",
      meta: {title: "课程订单"}
    },
    {
      path: "ordercount",
      component: () => import("@/views/coursesubjectmanager/order/count"),
      name: "coursesubjectmanager/order-count",
      meta: {title: "课程订单统计"}
    },
    {
      path: "column",
      component: () => import("@/views/coursesubjectmanager/column"),
      name: "coursesubjectmanager/column-management",
      meta: {title: "栏目管理"}
    },
    {
      path: "pagesetting",
      component: () => import("@/views/coursesubjectmanager/pagesetting"),
      name: "coursesubjectmanager/pagesetting",
      meta: {title: "页面配置"}
    },
  ]
}];
