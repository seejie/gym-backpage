import Layout from '@/layout';
export default [
  {
    path: '/payactivegmanager',
    name: 'payactivegmanager',
    component: Layout,
    redirect: '/payactivegmanager/payactive',
    alwaysShow: true,
    meta: {
      title: '付费活动',
      icon: 'zixun',
    },
    children: [
      {
        path: "/payactivegmanager/payactive",
        component: () => import("@/views/huigou/active/index.vue"),
        name: "activeModule",
        meta: { title: "付费活动", },
      },
      //订单
      {
        path: "/ticketmanager/payactiveorder",
        component: () => import("@/views/huigou/activeOrder/index.vue"),
        name: "activeOrders",
        meta: { title: "活动订单", },
      },
    ],
  },
];
