import Layout from '@/layout';
export default [{
    path: '/standshop',
    name: 'goodsIndex',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
        title: '标准电商管理',
        icon: 'zixun',
    },
    children: [{
            path: 'goodsmanager',
            component: () =>
                import ('@/views/standshop/goodsManage/goodsIndex.vue'),
            name: 'goodsIndex',
            meta: { title: '商品管理' },
        },
        {
            path: '/standshop/addGoods/:type?/:id?',
            component: () =>
                import ('@/views/standshop/goodsManage/addGood/index.vue'),
            name: 'addGood',
            meta: { title: '新增商品' },
            hidden: true,
        },
        {
            path: 'channel',
            component: () =>
                import ('@/views/standshop/channel'),
            name: 'channel',
            meta: { title: '电商频道' },
        },
        {
            path: 'shoporder',
            component: () =>
                import ('@/views/standshop/orderList/index.vue'),
            name: 'standshopOrder',
            meta: { title: '标准化电商订单' },
        },
    ],
}, ];