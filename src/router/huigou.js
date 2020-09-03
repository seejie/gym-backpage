import Layout from '@/layout';
export default [
  {
    path: '/activeManage',
    name: 'activeManage',
    component: Layout,
    redirect: '/activeManage',
    alwaysShow: true,
    meta: {
      title: '惠购管理',
      icon: 'zixun',
    },
    children: [
      {
        path: "/huigou/pagesetting",
        component: () => import("@/views/huigou/pageSet.vue"),
        name: "pageSet",
        meta: { title: "页面配置", },
      },
      {
        path: '/huigouComment',
        component: () => import('@/views/huigou/comment.vue'),
        name: 'huigouComment',
        meta: { title: '评论管理' },
      },
      {
        path: "/huigou/payactive",
        component: () => import("@/views/huigou/active/index.vue"),
        name: "activeManage",
        meta: { title: "付费活动", },
      },
      {
        path: "/addActive",
        component: () => import("@/views/huigou/active/addActivePage.vue"),
        name: "addActive",
        meta: { title: "添加活动" },
        hidden: true
      },
      {
        path: "/huigou/ticket",
        // component: () => import("@/views/mall/ticketManage/ticketIndex.vue"),
        component: () => import('@/views/huigou/ticketManage/ticketIndex.vue'),
        name: 'ticketIndex',
        meta: { title: '景点门票' },
      },
      {
        path: "/addTicket",
        component: () => import("@/views/huigou/ticketManage/addTickets.vue"),
        name: "addTicket",
        meta: { title: "添加门票" },
        hidden: true
      },
      {
        path: "/huigou/hotel",
        component: () => import("@/views/huigou/hotelManage/hotelIndex.vue"),
        name: "hotelIndex",
        meta: { title: "客栈管理" }
      }, {
        path: "/addHotel/:type?/:id?",
        component: () => import("@/views/huigou/hotelManage/addHotel.vue"),
        name: "addHotel",
        meta: { title: "新增酒店" },
        hidden: true
      },
      {
        path: "/huigou/goodsmanager",
        component: () => import('@/views/standshop/goodsManage/goodsIndex.vue'),
        name: "huigou/goodsmanager",
        meta: { title: "文旅商铺" }
      },
      {
        path: "/huigou/payactiveorder",
        component: () => import("@/views/huigou/activeOrder/index.vue"),
        name: "activeOrder",
        meta: { title: "活动订单", },
      },
      {
        path: "/huigou/ticketorder",
        component: () => import("@/views/huigou/ticketOrder/index.vue"),
        name: "ticketorder",
        meta: { title: "门票订单", },
      },
      {
        path: "/huigou/hotelorder",
        component: () => import("@/views/huigou/hotelOrder/index.vue"),
        name: "hotelOrder",
        meta: { title: "酒店订单", },
      },

      //   //订单

      //   {
      //     path: "/goodsOrder",
      //     component: () => import("@/views/huigou/goodsOrder/ticketIndex.vue"),
      //     name: "goodsOrder",
      //     meta: { title: "商品订单", },
      //   }
    ],
  },
];
