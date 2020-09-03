import Layout from '@/layout';

export default [
  {
    path: '/saas',
    name: 'saas',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: 'SAAS管理',
      icon: 'zixun',
    },
    children: [
      {
        path: 'roleManage',
        component: () => import('@/views/saas/roleManage'),
        name: 'saas/roleManage',
        meta: { title: '角色管理' },
      },
      {
        path: 'functionMenu',
        component: () => import('@/views/saas/functionMenu'),
        name: 'saas/functionMenu',
        meta: { title: '功能菜单' },
      },
      {
        path: 'announcement',
        component: () => import('@/views/saas/announcement/index.vue'),
        name: 'saas/announcement',
        meta: { title: '公告管理' },
      },
      {
        path: 'addAnnouncement',
        component: () => import('@/views/saas/announcement/addAnnouncement.vue'),
        name: 'saas/addAnnouncement',
        meta: { title: '添加公告' },
        hidden: true,
      },
      {
        path: 'helpManage',
        component: () => import('@/views/saas/helpManage/index.vue'),
        name: 'saas/helpManage',
        meta: { title: '帮助管理' },
      },
      {
        path: 'addHelp',
        component: () => import('@/views/saas/helpManage/addHelp.vue'),
        name: 'saas/addHelp',
        meta: { title: '添加帮助' },
        hidden: true,
      },
      {
        path: 'addHelp/:id',
        component: () => import('@/views/saas/helpManage/addHelp.vue'),
        name: 'saas/addHelp',
        meta: { title: '编辑帮助' },
        hidden: true,
      },
      {
        path: 'residentUnit',
        component: () => import('@/views/saas/residentUnit'),
        name: 'saas/residentUnit',
        meta: { title: '入驻单位' },
      },
      {
        path: 'accountManage',
        component: () => import('@/views/saas/accountManage'),
        name: 'saas/accountManage',
        meta: { title: '账号管理' },
      },
      {
        path: 'unitStatistics',
        component: () => import('@/views/saas/unitStatistics'),
        name: 'saas/unitStatistics',
        meta: { title: '单位统计' },
      },
      {
        path: 'platformBinding',
        component: () => import('@/views/saas/platformBinding'),
        name: 'saas/platformBinding',
        meta: { title: '平台绑定' },
      },
      {
        path: 'defaultStyle',
        component: () => import('@/views/saas/defaultStyle'),
        name: 'saas/defaultStyle',
        meta: { title: '默认风格设置' },
      },
    ],
  },
];
