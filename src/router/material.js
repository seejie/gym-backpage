import Layout from '@/layout';
export default [
  {
    path: '/material',
    name: 'material',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '素材管理',
      icon: 'zixun',
    },
    children: [
      {
        path: 'imagetext',
        component: () => import('@/views/material/imagetext'),
        name: 'material/imagetext',
        meta: { title: '图文素材' },
      },
      {
        path: 'imagetextAdd/:id',
        component: () => import('@/views/material/imagetextAdd'),
        name: 'material/imagetextAdd',
        meta: { title: '图文素材' },
        hidden: true,
      },
      {
        path: 'image',
        component: () => import('@/views/material/image'),
        name: 'material/image',
        meta: { title: '图片素材' },
      },
      {
        path: 'voice',
        component: () => import('@/views/material/voice'),
        name: 'material/voice',
        meta: { title: '音频素材' },
      },
      {
        path: 'video',
        component: () => import('@/views/material/video'),
        name: 'material/video',
        meta: { title: '视频素材' },
      },
      {
        path: 'document',
        component: () => import('@/views/material/document'),
        name:'/material/document',
        meta: {title: '文档素材'}
      },
      {
        path: 'pagesetting',
        component: () => import('@/views/material/pagesetting'),
        name:'/material/pagesetting',
        meta: {title: '页面配置'}
      }
    ],
  },
];
