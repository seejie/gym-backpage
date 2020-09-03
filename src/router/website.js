import Layout from '@/layout';
export default [
  {
    path: '/website',
    name: 'website',
    component: Layout,
    redirect: '/website/channel',
    alwaysShow: true,
    meta: {
      title: 'PC建站管理',
      icon: 'website',
    },
    children: [
      {
        path: 'channel',
        component: () => import('@/views/website/setting.vue'),
        name: 'website',
        meta: { title: '官网频道' },
      },
      {
        path: 'news',
        component: () => import('@/views/website/news.vue'),
        name: 'websiteNews',
        meta: { title: '新闻管理' },
      },
      {
        path: 'news/:id',
        component: () => import('@/views/website/newsAdd.vue'),
        name: 'websiteNewsAdd',
        meta: { title: '新建新闻' },
        hidden: true,
      },
      {
        path: 'service',
        component: () => import('@/views/website/service.vue'),
        name: 'websiteService',
        meta: { title: '服务介绍管理' },
      },
      {
        path: 'service/:id',
        component: () => import('@/views/website/serviceAdd.vue'),
        name: 'websiteServiceAdd',
        meta: { title: '新建服务介绍' },
        hidden: true,
      },
      {
        path: 'case',
        component: () => import('@/views/website/case.vue'),
        name: 'websiteCase',
        meta: { title: '经典案例管理' },
      },
      {
        path: 'case/:id',
        component: () => import('@/views/website/caseAdd.vue'),
        name: 'websiteCaseAdd',
        meta: { title: '新建经典案例' },
      },
    ],
  },
];
