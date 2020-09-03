import Layout from '@/layout';

export default [{
  path: '/customcourse',
  name: 'customcourse',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: "课程定制管理",
    icon: "kechen"
  },
  children: [
    {
      path: "index",
      component: () => import("@/views/customCourse/customcourse/index"),
      name: "customCourse",
      meta: {title: "定制课程"}
    },
    {
      path: "customCourse/Add/:id",
      component: () => import("@/views/customCourse/customcourse/Add"),
      name: "customCourseAdd",
      meta: {title: "编辑定制课程"}
    },
    {
      path: "customCourse/AddPackage/:id",
      component: () => import("@/views/customCourse/customcourse/AddPakeage"),
      name: "customCourseAddPackage",
      meta: {title: "编辑套餐课程"}
    },
    {
      path: "questionAnswer",
      component: () => import("@/views/customCourse/questionAnswer/index"),
      name: "questionAnswer",
      meta: {title: "日常QA"}
    },
    {
      path: "questionAnswer/Add/:id",
      component: () => import("@/views/customCourse/questionAnswer/Add"),
      name: "questionAnswerAdd",
      meta: {title: "发布帮助"}
    },
    {
      path: "coursequestionaire",
      component: () => import("@/views/customCourse/coursequestionaire/index"),
      name: "coursequestionaire",
      meta: {title: "日常咨询"}
    },
    {
      path: "coursequestionaire/Add/:id",
      component: () => import("@/views/customCourse/coursequestionaire/Add"),
      name: "coursequestionaireAdd",
      meta: {title: "添加问卷"}
    },
    {
      path: "training",
      component: () => import("@/views/customCourse/training/index"),
      name: "training",
      meta: {title: "集训需求"}
    },
    {
      path: "training/Add/:id/:type",
      component: () => import("@/views/customCourse/training/Add"),
      name: "trainingAdd",
      meta: {title: "添加集训"}
    },
    {
      path: "teacher",
      component: () => import("@/views/customCourse/teacher/index"),
      name: "teacher",
      meta: {title: "定制教师"}
    },
    {
      path: "teacher/Add/:id",
      component: () => import("@/views/customCourse/teacher/Add"),
      name: "teacherAdd",
      meta: {title: "添加定制教师"}
    },
    {
      path: "order",
      component: () => import("@/views/customCourse/order/index"),
      name: "order",
      meta: {title: "课程订单"}
    },
    {
      path: "pagesetting",
      component: () => import("@/views/customCourse/pagesetting/index"),
      name: "pagesetting",
      meta: {title: "页面配置"}
    },
    {
      path: "teacherorder",
      component: () => import("@/views/customCourse/teacherorder/index"),
      name: "teacherorder",
      meta: {title: "教师订单"}
    }
  ]
}];
