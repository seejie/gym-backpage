import Http from '@/utils/request'
import { httpInterceptors } from '@/utils/decorators'

export default class MemberIntegralAPI {
  // 删除积分规则(单个/批量)
  @httpInterceptors
  deleteJifenRule(params) {
    return Http.get('/sys/member/TMemberJifenRuleLimit/deletes', {
      params
    })
  }

  // 查询积分规则列表
  @httpInterceptors
  findJifenRuleList(params) {
    return Http.get('/sys/member/TMemberJifenRuleLimit/findAll', {
      params
    })
  }

  // 查询会员积分查询列表
  @httpInterceptors
  getMemberJifenlist(params) {
    return Http.get('/sys/member/TMemberJifen/findList', {
      params
    })
  }

  // 导出会员积分
  @httpInterceptors
  exportMemberJifen(params) {
    return Http.get('/sys/member/exportMemberJifen', {
      params
    })
  }

  // 创建积分规则
  @httpInterceptors
  createJifenRule(params) {
    return Http.post('/sys/member/TMemberJifenRuleLimit/create', params)
  }

  // 编辑积分规则
  @httpInterceptors
  updateJifenRule(params) {
    return Http.post('/sys/member/TMemberJifenRuleLimit/update', params)
  }
}
