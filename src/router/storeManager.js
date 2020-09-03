import Layout from '@/layout'
export default [{
    path: "/storemanage",
    name: "storemanage",
    component: Layout,
    redirect: '/storemanage',
    alwaysShow: true,
    meta: {
        title: "商城管理",
        icon: "zixun"
    },
    children: [{
            path: "pagesetting",
            component: () =>
                import ("@/views/storeManage/pageSetting/index.vue"),
            name: "pagesetting",
            meta: {
                title: "页面设置",
            },
        },
       
        {
            path: "mastersettled",
            component: () =>
                import ("@/views/storeManage/masterSettled/index.vue"),
            name: "mastersettled",
            meta: {
                title: "大师入驻",
            }
        },
        {
            path: "masteradd",
            component: () =>
                import ("@/views/storeManage/masterSettled/masterAdd/index.vue"),
            name: "masteradd",
            meta: {
                title: "创建大师",
            }
        }, {
            path: "storerolemanagement",
            component: () =>
                import ("@/views/storeManage/storeRoleManagement/index.vue"),
            name: "storerolemanagement",
            meta: {
                title: "店铺角色管理",
            },
        },
        {
            path: "storestaff",
            component: () =>
                import ("@/views/storeManage/storeStaff/index.vue"),
            name: "storestaff",
            meta: {
                title: "店铺管理员",
            },
        },
        {
            path: "storesettled",
            component: () =>
                import ("@/views/storeManage/storeSettled/index.vue"),
            name: "storesettled",
            meta: {
                title: "门店入驻",
            },
        },
        {
            path: "storeadd",
            component: () =>
                import ("@/views/storeManage/storeSettled/storeAdd/index.vue"),
            name: "storeadd",
            meta: {
                title: "创建店铺",
            },
            hidden: true
        },
        {
            path: "storestatics",
            component: () =>
                import ("@/views/storeManage/storestatics/index.vue"),
            name: "storestatics",
            meta: {
                title: "店铺统计",
            },
            hidden: true
        },
        {
            path: "masterstatics",
            component: () =>
                import ("@/views/storeManage/masterstatics/index.vue"),
            name: "masterstatics",
            meta: {
                title: "大师统计",
            },
            hidden: true
        }
    ]
}];