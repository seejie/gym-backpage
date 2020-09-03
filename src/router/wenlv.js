import Layout from '@/layout';
export default [
  {
    path: '/wenlv',
    name: 'wenlv',
    component: Layout,
    redirect: '/wenlv/goodsmanager',
    alwaysShow: true,
    meta: {
      title: '文旅商城',
      icon: 'zixun',
    },
    children: [
      {
        path: 'goodsmanager',
        component: () => import('@/views/standshop/goodsManage/goodsIndex.vue'),
        name: 'goodsIndex',
        meta: { title: '文旅管理' },
      },
      {
        path: 'shoporder',
        component: () => import('@/views/standshop/orderList/index.vue'),
        name: 'standshopOrder',
        meta: { title: '文旅订单' },
      },
    ],
  },
];
