import Http from '@/utils/request'
import { httpInterceptors } from '@/utils/decorators'

export default class MemberGradeAPI {
  // 删除会员等级(单个/批量)
  @httpInterceptors
  deleteLevel(params) {
    return Http.get('/sys/member/TMemberLevel/deletes', {
      params
    })
  }

  // 查询会员等级列表
  @httpInterceptors
  findLevelList(params) {
    return Http.get('/sys/member/TMemberLevel/findAll', {
      params
    })
  }

  // 查询权限名称列表
  // 场景： 页面初始化时调用
  // 用途： 获取权限频道列表的名称、id等数据
  @httpInterceptors
  getAllChannelByUnitId(params) {
    return Http.get('/platformsetting/channel/getAllChannelByUnitId', {
      params
    })
  }

  // 查询会员等级权限列表
  // 场景：会员设置权限弹框出现时调用
  // 用途： 获取会员的频道权限
  @httpInterceptors
  findLevelRuleList(params) {
    return Http.get('/sys/member/TMemberLevel/findLevelRuleList', {
      params
    })
  }

  // 创建会员等级
  @httpInterceptors
  createLevel(params) {
    return Http.post('/sys/member/TMemberLevel/create', params)
  }

  // 编辑会员等级
  @httpInterceptors
  updateLevel(params) {
    return Http.post('/sys/member/TMemberLevel/update', params)
  }

  // 设置等级权限
  @httpInterceptors
  setLevelRule(params) {
    return Http.post('/sys/member/TMemberLevel/setLevelRule', params)
  }
}