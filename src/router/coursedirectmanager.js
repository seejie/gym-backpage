import Layout from '@/layout';
//课程管理直销版
export default [{
  path: '/coursedirectmanager',
  name: 'coursedirectmanager',
  component: Layout,
  redirect: '/coursedirectmanager/directsellcourse',
  alwaysShow: true,
  meta: {
    title: "课程管理",
    icon: "kechen"
  },
  children: [
    {
      path: "directsellcourse",
      component: () => import("@/views/coursedirectmanager/coursePublish/index"),
      name: "directsellcourse",
      meta: {title: "课程发布"}
    },
    {
      path: "course-publish-add",
      component: () => import("@/views/coursedirectmanager/coursePublish/add"),
      name: "course-publish",
      meta: {title: "创建课程"}
    },
    {
      path: "course-publish-add/:id",
      component: () => import("@/views/coursedirectmanager/coursePublish/add"),
      name: "course-publish",
      meta: {title: "编辑课程"}
    },
    {
      path: "live",
      component: () => import("@/views/coursedirectmanager/live/index"),
      name: "coursedirectmanager/live",
      meta: {title: "直播管理"}
    },
    {
      path: "add-live",
      component: () => import("@/views/coursedirectmanager/live/add"),
      name: "coursedirectmanager/add-live",
      meta: {title: "新建直播"}
    },
    {
      path: "add-live/:id",
      component: () => import("@/views/coursedirectmanager/live/add"),
      name: "coursedirectmanager/add-live",
      meta: {title: "编辑直播"}
    },
    {
      path: "comment-details/:id",
      component: () => import("@/views/coursedirectmanager/comment-details"),
      name: "coursedirectmanager/comment-details",
      meta: {title: "评论详情"}
    },
    // {
    //   path: "live-comment-detail/:id",
    //   component: () => import("@/views/coursedirectmanager/live/detail"),
    //   name: "coursedirectmanager/live-comment-detail",
    //   meta: {title: "评论详情"}
    // },
    {
      path: "questionsanswer",
      component: () => import("@/views/coursedirectmanager/questionsanswer/index"),
      name: "coursedirectmanager/questionsanswer",
      meta: {title: "问答管理"}
    },
    {
      path: "add-questionsanswer",
      component: () => import("@/views/coursedirectmanager/questionsanswer/add"),
      name: "coursedirectmanager/questionsanswer",
      meta: {title: "新建问答"}
    },
    {
      path: "add-questionsanswer/:id",
      component: () => import("@/views/coursedirectmanager/questionsanswer/add"),
      name: "coursedirectmanager/questionsanswer",
      meta: {title: "编辑问答"}
    },
    {
      path: "orderlist",
      component: () => import("@/views/coursedirectmanager/order/index"),
      name: "coursedirectmanager/order-count",
      meta: {title: "课程订单"}
    },
    {
      path: "ordercount",
      component: () => import("@/views/coursedirectmanager/order/count"),
      name: "coursedirectmanager/order-count",
      meta: {title: "课程订单统计"}
    },
    {
      path: "column",
      component: () => import("@/views/coursedirectmanager/column"),
      name: "coursedirectmanager/column-management",
      meta: {title: "栏目管理"}
    },
    {
      path: "pagesetting",
      component: () => import("@/views/coursedirectmanager/pagesetting"),
      name: "coursedirectmanager/pagesetting",
      meta: {title: "页面配置"}
    },
  ]
}];
