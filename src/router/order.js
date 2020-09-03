import Layout from '@/layout';
export default [
  {
    path: '/orderManage',
    name: 'orderManage',
    component: Layout,
    redirect: '/orderManage/ticketorder',
    alwaysShow: true,
    meta: {
      title: '惠购订单管理',
      icon: 'zixun',
    },
    children: [
      {
        path: "/orderManage/payactiveorder",
        component: () => import("@/views/huigou/activeOrder/index.vue"),
        name: "activeOrder",
        meta: { title: "活动订单", },
      },
      {
        path: "/orderManage/ticketorder",
        component: () => import("@/views/huigou/ticketOrder/index.vue"),
        name: "ticketorder",
        meta: { title: "门票订单", },
      },
      {
        path: "/orderManage/hoelorder",
        component: () => import("@/views/huigou/hotelOrder/index.vue"),
        name: "hotelOrder",
        meta: { title: "酒店订单", },
      },
      // {
      //   path: "/orderManage/shoporder",
      //   component: () => import("@/views/huigou/hotelOrder/index.vue"),
      //   name: "hotelOrder",
      //   meta: { title: "文旅订单", },
      // },

    ],
  },
];
