import Layout from '@/layout';
export default [
  {
    path: '/hotelmanager',
    name: 'hotelmanager',
    component: Layout,
    redirect: '/hotelmanager/hotel',
    alwaysShow: true,
    meta: {
      title: '客栈专区',
      icon: 'zixun',
    },
    children: [
      {
        path: "/hotelmanager/hotel",
        component: () => import('@/views/huigou/hotelManage/hotelIndex.vue'),
        name: "hotelModule",
        meta: { title: "客栈管理", },
      },
      //订单
      {
        path: "/hotelmanager/hotelorder",
        component: () => import("@/views/huigou/hotelOrder/index.vue"),
        name: "hotelorder",
        meta: { title: "客栈订单", },
      },
    ],
  },
];
