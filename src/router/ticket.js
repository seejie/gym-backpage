import Layout from '@/layout';
export default [
  {
    path: '/ticketmanager',
    name: 'ticketmanager',
    component: Layout,
    redirect: '/ticketmanager/ticket',
    alwaysShow: true,
    meta: {
      title: '门票专区',
      icon: 'zixun',
    },
    children: [
      {
        path: "/ticketmanager/ticket",
        component: () => import('@/views/huigou/ticketManage/ticketIndex.vue'),
        name: "ticketModule",
        meta: { title: "景点门票", },
      },
      //订单
      {
        path: "/ticketmanager/ticketorder",
        component: () => import("@/views/huigou/ticketOrder/index.vue"),
        name: "ticketorder",
        meta: { title: "门票订单", },
      },
    ],
  },
];
