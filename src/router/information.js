import Layout from '@/layout';
export default [
  {
    path: '/information',
    name: 'information',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '资讯管理',
      icon: 'zixun',
    },
    children: [
      {
        path: 'issue',
        component: () => import('@/views/information/issue'),
        name: 'information/issue',
        meta: { title: '发布管理' },
      },
      {
        path: 'issueAdd/:id',
        component: () => import('@/views/information/issueAdd'),
        name: 'information/issueAdd',
        meta: { title: '发布文章' },
        hidden: true,
      },
      {
        path: 'comment/:type/:id', //type 1:发布管理,2:专题管理
        component: () => import('@/views/information/comment'),
        name: 'information/comment',
        meta: { title: '评论详情' },
        hidden: true,
      },
      {
        path: 'subject',
        component: () => import('@/views/information/subject'),
        name: 'information/subject',
        meta: { title: '专题管理' },
      },
      {
        path: 'subjectAdd/:id',
        component: () => import('@/views/information/subjectAdd'),
        name: 'information/subjectAdd',
        meta: { title: '发布专题' },
        hidden: true,
      },
      {
        path: 'column',
        component: () => import('@/views/information/column'),
        name: 'information/column',
        meta: { title: '栏目管理' },
      },
      {
        path: 'pagesetting',
        component: () => import('@/views/information/channel'),
        name: 'information/channel',
        meta: { title: '页面配置' },
      },
    ],
  },
];
