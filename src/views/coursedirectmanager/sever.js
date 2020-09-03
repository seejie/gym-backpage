import moment from 'moment';
import request from "@/utils/request";
import assign from 'object-assign'

const headers = {
  "Content-Type": "application/json;charset=UTF-8"
}


const service = {
  get: (url, params) => request({
    url: url,
    method: "GET",
    params: assign(params || {}, {
      channelType: 8
    }),
  }),
  post: (url, data) => request({
    url: url,
    method: "POST",
    data: assign(data || {}, {
      channelType: 8
    }),
  }),
}

// 会员等级
export const memberLevel = () => service.get('/sys/member/TMemberLevel/findAll', {}); //获取会员等级

// 课程管理
export const courseList = (param) => service.get('/course/course/searchCoursePage', param); //根据条件查询课程分页
export const courseDetail = (param) => service.get('/course/course/findCourseById', param); //根据条件查询课程分页
export const editCourse = (param) => service.post(`/course/course/updateCourse/${param.id}`, param); //修改课程
export const checkCourse = (param) => service.post('/course/course/approveCourse', param); //审核课程 courseStatus 1=已上线 0=待审核 2=已下线
export const deleteCourse = (param) => service.post(`/course/course/deleteCourse`, param); //批量删除课程
export const addCourse = (param) => service.post(`/course/course/createCourse`, param); //新增课程
export const addMeterials = (param) => service.post(`/course/course/addMeterialsList`, param); //课程批量添加素材
export const addChapter = (param) => service.post(`/course/course/addChapterList`, param); //课程批量添加章节
export const deleteMeterials = (param) => service.post(`/course/course/removeMeterials`, param); //课程删除素材
export const setColumnSort = (params) => service.post('/course/column/setColumnSort', params) // 栏目排序
// 获取学员接口 /course/course/getCourseStudentsPage

export const studentList = (param) => service.get('/course/course/getCourseStudentsPage', param); //根据条件查询课程分页
export const exportCourseStudents = (param) => service.get('/course/course/exportCourseStudents', param); //导出学员


//问答管理
export const addQuestion = (param) => service.post('/course/questionaire/createQuestionaire', param); //根据条件查询课程分页
export const delQuestion = (param) => service.post('/course/questionaire/deleteQuestionaire', param); //根据条件查询课程分页
export const checkQuestion = (param) => service.post('/course/questionaire/setStatus', param); //根据条件查询课程分页
export const setQuestion = (param) => service.post('/course/questionaire/setTop', param); //根据条件查询课程分页
export const questList = (param) => service.get('/course/questionaire/searchQuestionairePage', param); //根据条件查询课程分页
export const editQuest = (param) => service.post(`/course/questionaire/updateQuestionaire/${param.id}`, param); //根据条件查询课程分页
export const questDetail = (param) => service.get('/course/questionaire/findQuestionaireById', param); //问答数据
export const findAnswerData = (param) => service.get('/course/questionaire/findAnswerData', param); //问答数据
export const searchFeedbackList = (param) => service.get('/course/questionaire/searchFeedbackList', param); //问答数据
export const feedback = (param) => service.post('/course/questionaire/feedback', param); //问答数据
export const deleteFeedback = (param) => service.post('/course/questionaire/deleteFeedback', param); //问答数据




// 课程订单管理
export const deleteOrder = (param) => service.post('/course/order/deleteOrder', param); //批量删除订单
export const refundCourseOrder = (param) => service.post('/course/order/refundCourseOrder', param); //批量删除订单
export const exportOrder = (param) => service.get('/course/order/exportCourseOrder', param); //批量删除订单
export const finishCourseOrder = (param) => service.post('/course/order/finishCourseOrder', param); //批量销核订单
export const createCourseVerifyRecord = (param) => service.post('/course/verifyRecord/createCourseVerifyRecord', param); //批量删除订单
export const orderList = (param) => service.get('/course/order/searchOrderList', param); // 获取所有课程订单列表
export const orderPageList = (params) => service.get('/course/order/searchOrderPage', params); //根据条件查询课程订单分页
export const courseOrderReport = (params) => service.get('/course/order/courseOrderReport', params); //根据条件查询课程订单统计分页
export const orderPageDetail = (param) => service.get('/course/order/findCourseOrderById', param); //根据条件查询课程订单分页
export const orderSearchFeedbackList = (param) => service.get('/course/order/searchFeedbackList', param); //根据条件查询课程订单分页
export const orderFeedback = (param) => service.post('/course/order/feedback', param); //根据条件查询课程订单分页
export const orderDeleteFeedback = (param) => service.post('/course/order/deleteFeedback', param); //根据条件查询课程订单分页


// 课程包管理
export const coursePackageList = (param) => service.get('/course/package/searchPackagePage', param); //根据条件查询课程分页
export const coursePackageDetail = (param) => service.get('/course/package/findCoursePackageById', param); //根据条件查询课程分页
export const editCoursePackage = (param) => service.post(`/course/package/updatePackage/${param.id}`, param); //修改课程包
export const checkCoursePackage = (param) => service.post('/course/package/approveCoursePackage', param); //审核课程
export const deleteCoursePackage = (param) => service.post('/course/package/deletePackage', param); //删除课程包
export const addCoursePackage = (param) => service.post('/course/package/createPackage', param); //添加课程包
export const bindCourseData = (param) => service.post('/course/package/addCourseList', param); //添加课程包

//  直播管理
export const editLiveCourse = (param) => service.post(`/course/live/updateLive/${param.id}`, param); //修改直播kecheng
export const createLive = (param) => service.post('/course/live/createLive', param); //添加直播课程
export const setCommentStatus = (param) => service.post('/course/live/setCommentStatus', param); //评论开关
export const checkLive = (param) => service.post('/course/live/approveLiveCourse', param); //检查直播课程
export const deleteLive = (param) => service.post('/course/live/deleteLive', param); //批量删除直播课程
export const liveList = (param) => service.get('/course/live/searchLivePage', param); //根据条件查询直播分页
export const liveDetail = (param) => service.get('/course/live/findLiveCourseById', param); //根据条件查询直播详情
export const setLiveCourseBanner = (param) => service.post('/course/live/setLiveCourseBanner', param)//设置直播banner图片
export const getLiveCourseBannerList = (param) => service.get('/course/live/getLiveCourseBannerList', param)//获取直播banner图片


// 课程栏目

export const addColumn = (param) => service.post('/course/column/createColumn', param, {
  headers
}); //添加栏目分类
export const deleteColumn = (param) => service.post('/course/column/deleteColumn', param, {
  headers
}); //批量删除栏目分类
export const columnList = (param = {}) => service.get('/course/column/searchColumnPage', assign({}, param, {
  pageSize: 0
})); //获取所有栏目列表
export const updateColumn = (id, param) => service.post(`/course/column/updateColumn/${id}`, param, {
  headers
}); //修改课程分类
export const activeColumn = (param) => service.post('/course/column/setActive', param, {
  headers
}); //修改课程分类


// 课程页面配置
export const getPageConfig = (ajax) => ajax.get('/course/pageSetup/searchPageSetupPage'); //课程页面配置
export const updatePageConfig = (ajax, param) => ajax.post(`/course/pageSetup/updatePageSetup/${param.id}`, param); //添加栏目分类
export const addPageConfig = (ajax, param) => ajax.post('/course/pageSetup/createPageSetup', param); //添加栏目分类


// 专题分类
export const oneCategory = (param) => service.get('/course/category/listFirstCategory', param); //一级分类查询列表
export const twoCategory = (param) => service.get('/course/category/searchListByParentId', param); //二级分类查询列表

// 课程评论 /course/comment/searchCommentTreePage

export const updateComment = (param) => service.post(`/course/comment/updateComment/${param.id}`, param); //修改课程评论
export const dianZan = (param) => service.post('/course/comment/addThumbsNum', param); //评论点赞
export const setCommentTop = (param) => service.post('/course/comment/setCommentTop', param); //评论点赞
export const deleteComment = (param) => service.post('/course/comment/deleteComment', param); //删除课程评论
export const approveComments = (param) => service.post(`/course/comment/approveComments`, param); //审核课程评论
export const addComment = (param) => service.post('/course/comment/createComment', param); //审核课程评论
export const commentList = (param) => service.get('/course/comment/searchCommentTreePage', param); //课程评论列表
export const commentDetail = (param) => service.get('/course/comment/findCourseCommentById', param); //课程评论列表

// 课程专题品类

export const addCategory = (param) => service.post(`/coursePackage/category/createCategory`, param); //修改课程评论
export const deleteCategory = (param) => service.post(`/coursePackage/category/deleteCategory`, param); //修改课程评论
export const searchCategoryList = (param) => service.get(`/coursePackage/category/searchCategoryPage`, param); //获取所有课程专题分类列表
export const filterCategoryList = (param) => service.get(`/coursePackage/category/searchCategoryPage`, param); //根据条件查询课程专题分类分页
export const findCategoryId = (param) => service.get(`/coursePackage/category/searchListByParentId`, param); //根据条件查询课程专题分类分页
export const updateCategory = (param) => service.post(`/coursePackage/category/updateCategory/${param.id}`, param); //修改课程专题分类



// 课程直销分类
export const addCourseCategory = (param) => service.post(`/course/category/createCategory`, param); //修改课程评论
export const deleteCourseCategory = (param) => service.post(`/course/category/deleteCategory`, param); //修改课程评论
export const searchCourseCategoryList = (param) => service.get(`/course/category/searchCategoryPage`, param); //获取所有课程专题分类列表
export const filterCourseCategoryList = (param) => service.get(`/course/category/searchCategoryPage`, param); //根据条件查询课程专题分类分页
export const findCourseCategoryId = (param) => service.get(`/course/category/searchPageByParentId`, param); //根据条件查询课程专题分类分页
export const updateCourseCategory = (param) => service.post(`/course/category/updateCategory/${param.id}`, param); //修改课程专题分类


// 将无限层数组化为一层
const dealRecursion = arr => {
  if (!arr || !arr.length) return [];
  return arr.reduce((pre, cur) => [...pre, cur, ...dealRecursion(cur.childList || [])], [])
};

export const dealCommentList = (arr, obj) => {
  if (!arr || !arr.length) return [];
  const list = dealRecursion(arr);
  return list.map(v => {
    const data = [...list, obj].find(o => o.id === v.commentParentId);
    if (data) return assign(v, {
      name: data.nickName
    });
    return v;
  })
}

export const dealTime = (arr, obj, fArr = []) => {

  const keys = Object.keys(obj)
    .filter(v => v !== 'date' && obj[v])
    .filter(v => !Array.isArray(obj[v]))
    .reduce((p, c) => assign(p, {
      [c]: obj[c]
    }), {});
  let time = {};
  if (obj.date&&obj.date[0] && obj.date[1]) {
    time = {
      [arr[0]]: moment(obj.date[0]).format('YYYY-MM-DD'),
      [arr[1]]: moment(obj.date[1]).format('YYYY-MM-DD')
    }
  }
  return assign(keys, time);
}
