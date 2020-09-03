const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.head_url,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    userLevel: state => state.user.userLevel,
    shareTitle: state => state.user.share_title,
    indexLogo: state => state.user.index_logo,
    sysLogo: state => state.user.sys_logo,
    shareIcon: state => state.user.share_icon,
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs,
    menuList: state => state.permission.menuList,
    addGoodsStyle: state => state.storeSet.addGoodsStyle || 1,
    storeSeting: state => state.storeSet.storeSeting
}
export default getters